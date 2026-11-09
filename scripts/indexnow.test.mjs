import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { ORIGIN, ENDPOINT, REPOSITORY, KEY_LOCATION, parsePublicUrls, buildBatches, request, prepareSubmission, submitBatches, waitForDeployment } from './indexnow.mjs';

const key = 'a'.repeat(64);
const sha = '1'.repeat(40);
const context = { token: 'test-token', sha, repository: REPOSITORY };
const sitemap = urls => `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;
const json = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
const noWait = async () => {};

test('sitemap URLs are canonicalized, deduplicated and keep legitimate Chinese pages', () => {
  assert.deepEqual(parsePublicUrls(sitemap([`${ORIGIN}/`, `${ORIGIN}/stroke-order/汉`, `${ORIGIN}/stroke-order/%E6%B1%89`, `${ORIGIN}/zh/chinese-basic-strokes`])).urls,
    [`${ORIGIN}/`, `${ORIGIN}/stroke-order/%E6%B1%89`, `${ORIGIN}/zh/chinese-basic-strokes`]);
});

test('private tools, previews, query payloads and fragments are never submitted', () => {
  const result = parsePublicUrls(sitemap([`${ORIGIN}/generator`, `${ORIGIN}/api/feedback`, `${ORIGIN}/zh/worksheet/preview`, `${ORIGIN}/practice`, `${ORIGIN}/generator?words=hello&amp;mode=trace`, `${ORIGIN}/#private`]));
  assert.deepEqual(result.urls, [`${ORIGIN}/generator`]);
  assert.equal(result.excluded.length, 5);
});

test('foreign hosts, HTTP downgrade, XML entities, empty lists and sitemap indexes fail closed', () => {
  for (const xml of [sitemap(['https://other.example/']), sitemap(['http://gridhanzi.org/']), '<!DOCTYPE urlset><urlset/>', '<sitemapindex/>', '<urlset/>']) {
    assert.throws(() => parsePublicUrls(xml));
  }
});

test('protocol batches never exceed 10000 URLs and use the correct ownership scope', () => {
  const batches = buildBatches(Array.from({ length: 10001 }, (_, i) => `${ORIGIN}/page-${i}`), key);
  assert.deepEqual(batches.map(batch => batch.urlList.length), [10000, 1]);
  assert.equal(batches[0].host, 'gridhanzi.org');
  assert.equal(batches[0].keyLocation, KEY_LOCATION);
  assert.throws(() => buildBatches([ORIGIN], 'invalid'));
});

test('ownership must be live and correct before any sitemap or submission call', async () => {
  const calls = [];
  await assert.rejects(prepareSubmission(key, async url => { calls.push(url); return new Response('wrong key'); }), /ownership file/);
  assert.deepEqual(calls, [KEY_LOCATION]);
  await assert.rejects(prepareSubmission(key, async () => new Response('Not found', { status: 404 })), /ownership file/);
});

test('successful preflight reads the production key and sitemap without sending a POST', async () => {
  const calls = [];
  const result = await prepareSubmission(key, async (url, options) => {
    calls.push({ url, options });
    return new Response(url === KEY_LOCATION ? key + '\n' : sitemap([ORIGIN + '/']));
  });
  assert.equal(result.urls.length, 1);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(call => !call.options.method));
  assert.ok(calls.every(call => call.options.redirect === 'error'));
});

test('HTTP 200 and 202 receipts are distinct, and real ownership metadata is sent', async () => {
  for (const status of [200, 202]) {
    const receipts = await submitBatches(buildBatches([ORIGIN + '/'], key), async (url, options) => {
      assert.equal(url, ENDPOINT);
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, undefined);
      assert.deepEqual(JSON.parse(options.body), { host: 'gridhanzi.org', key, keyLocation: KEY_LOCATION, urlList: [ORIGIN + '/'] });
      return new Response(null, { status });
    }, noWait);
    assert.equal(receipts[0].status, status);
    assert.equal(receipts[0].result, status === 200 ? 'received' : 'received-key-validation-pending');
  }
});

test('bad requests and rejected ownership are never counted as accepted', async () => {
  for (const status of [400, 403, 422]) {
    let calls = 0;
    await assert.rejects(submitBatches(buildBatches([ORIGIN + '/'], key), async () => { calls++; return new Response(null, { status }); }, noWait), new RegExp(`HTTP ${status}`));
    assert.equal(calls, 1);
  }
});

test('transient throttling is bounded and Retry-After is respected', async () => {
  const waits = [];
  let calls = 0;
  const response = await request(ENDPOINT, {}, async () => {
    calls++;
    return new Response(null, { status: calls < 3 ? 429 : 200, headers: { 'Retry-After': '2' } });
  }, async ms => waits.push(ms));
  assert.equal(response.status, 200);
  assert.equal(calls, 3);
  assert.deepEqual(waits, [2000, 2000]);
  const long = await request(ENDPOINT, {}, async () => new Response(null, { status: 429, headers: { 'Retry-After': '3600' } }), async () => assert.fail('Must not retry before long throttle window'));
  assert.equal(long.status, 429);
});

test('only the exact successful Cloudflare deployment permits automatic submission', async () => {
  let checks = 0;
  const deployed = await waitForDeployment(context, async url => {
    if (url.endsWith('/commits/main')) return json({ sha });
    checks++;
    return json({ check_runs: [{ name: 'Workers Builds: gridhanzi', status: checks === 1 ? 'in_progress' : 'completed', conclusion: checks === 1 ? null : 'success' }] });
  }, noWait);
  assert.equal(deployed, true);
  assert.equal(checks, 2);
  await assert.rejects(waitForDeployment(context, async url => url.endsWith('/commits/main') ? json({ sha }) : json({ check_runs: [{ name: 'Workers Builds: gridhanzi', status: 'completed', conclusion: 'failure' }] }), noWait), /did not succeed/);
});

test('superseded commits skip and forks/missing authorization cannot trigger production submission', async () => {
  assert.equal(await waitForDeployment(context, async () => json({ sha: '2'.repeat(40) }), noWait), false);
  await assert.rejects(waitForDeployment({ ...context, repository: 'other/repo' }), /context/);
  await assert.rejects(waitForDeployment({ ...context, token: '' }), /context/);
});

test('the committed ownership key is protocol-valid and automation runs only after main deploys', async () => {
  const actualKey = (await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')).trim();
  assert.match(actualKey, /^[a-f0-9]{64}$/);
  const workflow = await readFile(new URL('../.github/workflows/indexnow.yml', import.meta.url), 'utf8');
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /--submit --wait-for-deployment/);
  assert.doesNotMatch(workflow, /pull_request_target|secrets\./);
});
