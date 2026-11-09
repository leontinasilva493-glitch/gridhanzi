import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const ORIGIN = 'https://gridhanzi.org';
export const ENDPOINT = 'https://www.bing.com/indexnow';
export const REPOSITORY = 'leontinasilva493-glitch/gridhanzi';
export const KEY_LOCATION = `${ORIGIN}/indexnow-key.txt`;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function decodeXml(value) {
  return value.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, entity => {
    const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
    return named[entity] ?? String.fromCodePoint(entity.startsWith('&#x') ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10));
  });
}

export function parsePublicUrls(xml) {
  if (!/<urlset\b/.test(xml) || /<!DOCTYPE|<!ENTITY|<sitemapindex\b/i.test(xml)) {
    throw new Error('Expected the production URL-set sitemap; sitemap indexes and entities are unsupported.');
  }
  const urls = new Set();
  const excluded = [];
  for (const match of xml.matchAll(/<loc\s*>\s*([^<]+?)\s*<\/loc>/g)) {
    const url = new URL(decodeXml(match[1]));
    if (url.origin !== ORIGIN || url.username || url.password) throw new Error('Sitemap contains a URL outside the production origin.');
    const path = decodeURIComponent(url.pathname).replace(/^\/zh(?=\/|$)/, '');
    if (url.search || url.hash || /^\/(api|worksheet|practice)(\/|$)/.test(path)) {
      excluded.push(url.href);
      continue;
    }
    urls.add(url.href);
  }
  if (!urls.size || urls.size > 50000) throw new Error('Unexpected sitemap URL count.');
  return { urls: [...urls], excluded };
}

export function buildBatches(urls, key) {
  if (!/^[a-f0-9]{64}$/.test(key)) throw new Error('Invalid IndexNow ownership key.');
  return Array.from({ length: Math.ceil(urls.length / 10000) }, (_, index) => ({
    host: new URL(ORIGIN).hostname,
    key,
    keyLocation: KEY_LOCATION,
    urlList: urls.slice(index * 10000, (index + 1) * 10000),
  }));
}

export async function request(url, init = {}, fetcher = fetch, pause = sleep) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetcher(url, { ...init, redirect: 'error', signal: AbortSignal.timeout(20000) });
    } catch (error) {
      if (attempt === 2) throw error;
      await pause(5000 * (attempt + 1));
      continue;
    }
    if (attempt < 2 && (response.status === 429 || response.status >= 500)) {
      const header = response.headers.get('retry-after');
      const seconds = header && /^\d+$/.test(header) ? Number(header) : 5 * (attempt + 1);
      // Long throttling windows should fail visibly, rather than retrying too early.
      if (seconds > 60) return response;
      await pause(seconds * 1000);
      continue;
    }
    return response;
  }
  throw new Error('Request retries exhausted.');
}

export async function prepareSubmission(key, fetcher = fetch) {
  const headers = { 'User-Agent': 'GridHanzi-IndexNow/1.0', 'Cache-Control': 'no-cache' };
  const keyResponse = await request(KEY_LOCATION, { headers }, fetcher);
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== key) {
    throw new Error('The production ownership file is unavailable or does not match. Nothing submitted.');
  }
  const sitemapResponse = await request(`${ORIGIN}/sitemap.xml`, { headers }, fetcher);
  if (sitemapResponse.status !== 200) throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}. Nothing submitted.`);
  const { urls, excluded } = parsePublicUrls(await sitemapResponse.text());
  return { urls, excluded, batches: buildBatches(urls, key) };
}

export async function submitBatches(batches, fetcher = fetch, pause = sleep) {
  const receipts = [];
  for (const batch of batches) {
    const response = await request(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'GridHanzi-IndexNow/1.0' },
      body: JSON.stringify(batch),
    }, fetcher, pause);
    if (![200, 202].includes(response.status)) {
      throw new Error(`IndexNow rejected batch ${receipts.length + 1}: HTTP ${response.status}.`);
    }
    receipts.push({ count: batch.urlList.length, status: response.status, result: response.status === 200 ? 'received' : 'received-key-validation-pending' });
  }
  return receipts;
}

export async function waitForDeployment({ token, sha, repository }, fetcher = fetch, pause = sleep) {
  if (repository !== REPOSITORY || !token || !/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Missing or invalid deployment-check context.');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  for (let attempt = 0; attempt < 50; attempt++) {
    const head = await request(`https://api.github.com/repos/${REPOSITORY}/commits/main`, { headers }, fetcher, pause);
    if (!head.ok) throw new Error(`Cannot verify main: HTTP ${head.status}.`);
    if ((await head.json()).sha !== sha) return false;
    const response = await request(`https://api.github.com/repos/${REPOSITORY}/commits/${sha}/check-runs?per_page=100`, { headers }, fetcher, pause);
    if (!response.ok) throw new Error(`Cannot verify Cloudflare deployment: HTTP ${response.status}.`);
    const checks = (await response.json()).check_runs.filter(check => check.name === 'Workers Builds: gridhanzi');
    // GitHub returns the newest matching check first; respect re-runs of a deployment.
    const check = checks[0];
    if (check?.status === 'completed') {
      if (check.conclusion !== 'success') throw new Error(`Cloudflare deployment did not succeed: ${check.conclusion}.`);
      return true;
    }
    if (attempt < 49) await pause(10000);
  }
  throw new Error('Timed out waiting for this commit to deploy successfully to Cloudflare.');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !['--submit', '--wait-for-deployment'].includes(arg))) throw new Error('Unknown argument.');
  const report = { origin: ORIGIN, endpoint: ENDPOINT, commit: process.env.GITHUB_SHA ?? null, mode: args.includes('--submit') ? 'submit' : 'dry-run', startedAt: new Date().toISOString() };
  try {
    if (args.includes('--wait-for-deployment')) {
      const deployed = await waitForDeployment({ token: process.env.GITHUB_TOKEN, sha: process.env.GITHUB_SHA, repository: process.env.GITHUB_REPOSITORY });
      if (!deployed) {
        Object.assign(report, { result: 'skipped-superseded-commit' });
        console.log('A newer main commit exists; its workflow will submit after deployment.');
        return;
      }
    }
    const key = (await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')).trim();
    const { urls, excluded, batches } = await prepareSubmission(key);
    Object.assign(report, { urls, excluded, urlCount: urls.length });
    console.log(`Verified production ownership file; ${urls.length} unique public sitemap URLs, ${excluded.length} excluded.`);
    if (args.includes('--submit')) {
      const receipts = await submitBatches(batches);
      Object.assign(report, { receipts, result: 'received' });
      for (const receipt of receipts) console.log(`IndexNow HTTP ${receipt.status}: ${receipt.count} URLs ${receipt.result}.`);
    } else {
      Object.assign(report, { result: 'dry-run-no-submission' });
      console.log('Dry run only. Use --submit to notify IndexNow.');
    }
  } catch (error) {
    Object.assign(report, { result: 'failed', error: error.message });
    process.exitCode = 1;
    console.error(error.message);
  } finally {
    await mkdir('artifacts', { recursive: true });
    await writeFile('artifacts/indexnow-report.json', JSON.stringify(report, null, 2) + '\n');
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,
      `## IndexNow\n\nResult: ${report.result}\n\nPublic URLs: ${report.urlCount ?? 0}\n\n${(report.receipts ?? []).map(r => `- HTTP ${r.status}: ${r.count} URLs, ${r.result}`).join('\n')}\n\nReceipt is not an indexing guarantee.\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
