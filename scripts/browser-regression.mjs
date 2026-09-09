import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// An existing Playwright installation can be supplied without adding app dependencies.
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4337';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname)) {
  throw new Error('Run fault injection against a local preview only.');
}
const browser = await chromium.launch({ headless: true });
const results = [];
const output = process.env.QA_OUTPUT_DIR || 'artifacts/browser-regression';
await mkdir(output, { recursive: true });
const filter = process.env.QA_FILTER;

async function scenario(name, options, run) {
  if (filter && !name.includes(filter)) return;
  const context = await browser.newContext({ baseURL, timezoneId: 'UTC', viewport: { width: 1280, height: 900 }, ...options });
  await context.route(/clarity\.ms|google-analytics\.com|googletagmanager\.com|plausible\.io/, route => route.abort());
  // Font delivery is unchanged by these fixes. Isolate the third-party CSS chain
  // so its availability does not gate hydration/storage regression tests.
  await context.route(/cdn\.jsdelivr\.net\/npm\/lxgw-wenkai-gb-web.*\.css/, route => route.fulfill({ contentType: 'text/css', body: '' }));
  // These tests never need paid enrichment.
  await context.route('**/api/worksheet/enrich', route => route.fulfill({ status: 503, json: { error: 'Unavailable in regression test' } }));
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  page.setDefaultNavigationTimeout(45_000);
  const errors = [];
  const pending = new Set();
  page.on('request', request => pending.add(request.url()));
  page.on('requestfinished', request => pending.delete(request.url()));
  page.on('requestfailed', request => pending.delete(request.url()));
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && !/net::ERR_FAILED|Failed to load resource/.test(message.text())) errors.push(message.text());
  });
  try {
    await run(page, context);
    assert.deepEqual(errors, [], 'No uncaught or React rendering errors');
    results.push({ name, pass: true });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, pass: false, error: error.message, errors, pending: [...pending] });
    console.error(`FAIL ${name}: ${error.message.slice(0, 350)}`);
    if (pending.size) console.error('Pending requests:', [...pending].join('\n'));
    await page.screenshot({ path: path.join(output, `${name}.png`) }).catch(() => {});
  } finally {
    await context.close();
  }
}

async function visit(page, route) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.waitForLoadState('networkidle', { timeout: 15_000 });
  return response;
}

async function denyStorage(context, storage, operation) {
  await context.addInitScript(({ storage, operation }) => {
    if (operation === 'getter') {
      Object.defineProperty(window, storage, { get() { throw new DOMException('Blocked for regression test', 'SecurityError'); } });
    } else {
      Object.defineProperty(window[storage], operation, { value() { throw new DOMException('Blocked for regression test', 'SecurityError'); } });
    }
  }, { storage, operation });
}

const snapshot = {
  version: 3,
  entries: [{ id: 'qa-row', hanzi: '一', pinyin: 'yī', english: 'one', status: 'complete' }],
  settings: { title: 'Regression worksheet', date: 'Lesson day', strokeOrderMode: 'off', showStrokeOrder: false },
};

async function seed(context, storage, key, value) {
  await context.addInitScript(({ storage, key, value }) => window[storage].setItem(key, value), { storage, key, value });
}

try {
  await scenario('schema-objects', {}, async page => {
    for (const route of ['/', '/generator', '/templates/family', '/chinese-character-components']) {
      await visit(page, route);
      const values = await page.locator('script[type="application/ld+json"]').allTextContents();
      assert.ok(values.length >= 2, route);
      for (const value of values) {
        const data = JSON.parse(value);
        assert.equal(Array.isArray(data), false, route);
        assert.equal(data['@context'], 'https://schema.org');
        assert.ok(data['@type']);
      }
    }
  });
  for (const [timezoneId, expected] of [['UTC', 'Sep 9, 2026'], ['Asia/Shanghai', 'Sep 9, 2026'], ['Pacific/Honolulu', 'Sep 8, 2026']]) {
    await scenario(`date-${timezoneId.replace('/', '-')}`, { timezoneId }, async page => {
      await page.clock.setFixedTime(new Date('2026-09-09T00:30:00Z'));
      await visit(page, '/generator');
      assert.equal(await page.getByLabel('Date', { exact: true }).inputValue(), expected);
      await page.getByLabel('Date', { exact: true }).fill('Lesson date');
      await page.getByRole('button', { name: 'Add row', exact: true }).click();
      assert.equal(await page.getByLabel('Date', { exact: true }).inputValue(), 'Lesson date');
    });
  }
  for (const operation of ['getter', 'getItem', 'setItem', 'removeItem']) {
    await scenario(`localStorage-${operation}`, {}, async (page, context) => {
      await denyStorage(context, 'localStorage', operation);
      await visit(page, '/generator');
      assert.equal(await page.getByRole('heading', { name: 'Chinese Worksheet Generator', exact: true }).count(), 1);
      await page.getByRole('button', { name: 'Add row', exact: true }).click();
      await visit(page, '/practice');
      assert.equal(await page.getByRole('heading', { name: 'Practice Chinese Characters', exact: true }).count(), 1);
    });
  }
  await scenario('sessionStorage-write-blocked', {}, async (page, context) => {
    await denyStorage(context, 'sessionStorage', 'setItem');
    await visit(page, '/generator');
    await page.getByRole('button', { name: 'Print / Save PDF', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, '/generator');
    assert.match(await page.locator('body').innerText(), /could not open.*preview/i);
  });
  await scenario('preview-storage-getter', {}, async (page, context) => {
    await denyStorage(context, 'sessionStorage', 'getter');
    await visit(page, '/worksheet/preview');
    assert.match(await page.locator('body').innerText(), /could not load.*worksheet/i);
    assert.equal(await page.locator('.hs-paper').count(), 0, 'Never print a fallback worksheet as the user draft');
  });
  await scenario('conversion-lazy', {}, async page => {
    const scripts = [];
    page.on('request', request => { if (request.resourceType() === 'script') scripts.push(request.url()); });
    await visit(page, '/generator');
    assert.equal(scripts.some(url => /\/traditional-[^/]+\.js/.test(url)), false, 'Conversion dictionaries are not a first-load dependency');
    const chinese = page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).first();
    await chinese.fill('软件');
    await page.getByRole('button', { name: 'Traditional (Taiwan)', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('input[aria-label="Chinese row 1"]')?.value === '軟體');
    await page.getByRole('button', { name: 'Simplified', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('input[aria-label="Chinese row 1"]')?.value === '软件');
    assert.ok(scripts.some(url => /\/traditional-[^/]+\.js/.test(url)));
  });
  await scenario('saved-hsk-restoration', {}, async (page, context) => {
    await seed(context, 'localStorage', 'gridhanzi:hsk-picker:v1', JSON.stringify({ system: '3.0', level: '6', query: 'home', theme: '', selectedIds: [] }));
    await visit(page, '/generator');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('gridhanzi:hsk-picker:v1')).level), '6');
    await page.getByRole('button', { name: 'Open HSK picker', exact: true }).click();
    await page.getByLabel(/^Level/).waitFor();
    assert.equal(await page.getByLabel(/^Level/).inputValue(), '6');
    assert.equal(await page.getByLabel('Search Hanzi, Pinyin, or meaning').inputValue(), 'home');
    await page.getByLabel(/^Level/).selectOption('3');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('gridhanzi:hsk-picker:v1')).level === '3');
  });
  await scenario('draft-date-restoration', { timezoneId: 'Pacific/Honolulu' }, async (page, context) => {
    await context.addInitScript(snapshot => localStorage.setItem('gridhanzi:worksheet:draft:v1', JSON.stringify({ savedAt: Date.now() - 1000, snapshot })), snapshot);
    await visit(page, '/generator');
    await page.getByRole('button', { name: 'Restore worksheet', exact: true }).click();
    assert.equal(await page.getByLabel('Date', { exact: true }).inputValue(), 'Lesson day');
    await page.getByLabel('Date', { exact: true }).fill('');
    await page.getByRole('button', { name: 'Add row', exact: true }).click();
    assert.equal(await page.getByLabel('Date', { exact: true }).inputValue(), '');
  });
  await scenario('unchanged-draft-reload', {}, async page => {
    await visit(page, '/generator');
    await page.waitForFunction(() => localStorage.getItem('gridhanzi:worksheet:draft:v1') !== null);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('button', { name: 'Restore worksheet', exact: true }).count(), 0, 'An unchanged worksheet does not prompt to restore itself');
  });
  await scenario('draft-removal-denied', {}, async (page, context) => {
    await context.addInitScript(snapshot => localStorage.setItem('gridhanzi:worksheet:draft:v1', JSON.stringify({ savedAt: Date.now() - 1000, snapshot })), snapshot);
    await denyStorage(context, 'localStorage', 'removeItem');
    await visit(page, '/generator');
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    assert.match(await page.getByRole('status').innerText(), /could not remove/i);
    assert.ok(await page.evaluate(() => localStorage.getItem('gridhanzi:worksheet:draft:v1')));
  });
  await scenario('malformed-storage', {}, async (page, context) => {
    await context.addInitScript(() => {
      for (const key of ['gridhanzi:hsk-picker:v1', 'gridhanzi:practice-recent:v1', 'gridhanzi:worksheet:draft:v1']) localStorage.setItem(key, '{');
      sessionStorage.setItem('gridhanzi:worksheet:v1', '{');
    });
    await visit(page, '/generator');
    assert.equal(await page.getByRole('heading', { name: 'Chinese Worksheet Generator', exact: true }).count(), 1);
    await visit(page, '/worksheet/preview');
    assert.equal(await page.getByRole('alert').count(), 1);
    assert.equal(await page.locator('.hs-paper').count(), 0);
  });
  for (const operation of ['setItem', 'removeItem']) {
    await scenario(`preview-${operation}-denied`, {}, async (page, context) => {
      await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
      await denyStorage(context, 'sessionStorage', operation);
      await visit(page, '/worksheet/preview');
      assert.ok(await page.locator('.hs-paper').count());
      assert.match(await page.getByRole('status').innerText(), /could not be saved/i);
      await page.getByRole('button', { name: 'Repeat to fill page' }).click();
      assert.match(await page.locator('.hs-paper').first().innerText(), /Regression worksheet/);
    });
  }
  await scenario('legacy-preview-migration', {}, async (page, context) => {
    await seed(context, 'sessionStorage', 'hanzisheets:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    assert.match(await page.locator('.hs-paper').first().innerText(), /Regression worksheet/);
    assert.equal(await page.evaluate(() => sessionStorage.getItem('hanzisheets:worksheet:v1')), null);
    assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem('gridhanzi:worksheet:v1')).settings.date), 'Lesson day');
  });
  await scenario('chinese-generator-mobile', { viewport: { width: 390, height: 844 }, timezoneId: 'Pacific/Honolulu' }, async page => {
    await page.clock.setFixedTime(new Date('2026-09-09T00:30:00Z'));
    await visit(page, '/zh/generator?template=family');
    assert.equal(await page.getByLabel('日期', { exact: true }).inputValue(), 'Sep 8, 2026');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await page.screenshot({ path: path.join(output, 'generator-mobile.png'), fullPage: true });
  });
  await scenario('preview-pdf-download', {}, async (page, context) => {
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    assert.match(download.suggestedFilename(), /\.pdf$/);
    await download.saveAs(path.join(output, 'worksheet.pdf'));
  });
  await scenario('practice-completion-storage-denied', {}, async (page, context) => {
    await denyStorage(context, 'localStorage', 'setItem');
    // A one-stroke network fixture isolates completion/persistence from CDN uptime.
    // It is not used to validate the correctness of Hanzi artwork.
    await context.route(/hanzi-writer-data.*\.json/, route => route.fulfill({ json: {
      strokes: ['M 100 400 L 900 400 L 900 420 L 100 420 Z'],
      medians: [[[100, 410], [900, 410]]], radStrokes: [],
    } }));
    await visit(page, '/practice?character=一');
    const surface = page.getByLabel('Trace 一 stroke by stroke', { exact: true });
    await surface.scrollIntoViewIfNeeded();
    await page.getByText('Start near the red dot and follow stroke 1.', { exact: true }).waitFor();
    const box = await surface.boundingBox();
    const x1 = box.x + (18 + 100 * 264 / 1024) * box.width / 300;
    const x2 = box.x + (18 + 900 * 264 / 1024) * box.width / 300;
    const y = box.y + (18 + (900 - 410) * 264 / 1024) * box.height / 300;
    await page.mouse.move(x1, y);
    await page.mouse.down();
    await page.mouse.move(x2, y, { steps: 40 });
    await page.mouse.up();
    await page.waitForFunction(() => !document.querySelector('[aria-label="Trace 一 stroke by stroke"]'));
    assert.ok(await page.locator('[data-testid="stroke-practice-surface"]').count(), 'Automatically advances despite storage failure');
  });
  await scenario('date-before-midnight-template', { timezoneId: 'Asia/Shanghai' }, async page => {
    await page.clock.setFixedTime(new Date('2026-09-08T23:30:00Z'));
    await visit(page, '/generator?template=family');
    assert.equal(await page.getByLabel('Date', { exact: true }).inputValue(), 'Sep 9, 2026');
  });
  await scenario('conversion-load-failure', {}, async (page, context) => {
    await context.route(/\/traditional-[^/]+\.js/, route => route.abort());
    await visit(page, '/generator');
    const chinese = page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).first();
    await chinese.fill('软件');
    await page.getByRole('button', { name: 'Traditional (Taiwan)', exact: true }).click();
    await page.getByRole('status').filter({ hasText: /could not load character conversion/i }).waitFor();
    assert.equal(await chinese.inputValue(), '软件');
    assert.equal(await page.getByRole('button', { name: 'Add row', exact: true }).isEnabled(), true);
  });
} finally {
  await browser.close();
  await writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
}
console.log(`${results.filter(result => result.pass).length}/${results.length} browser scenarios passed`);
if (results.some(result => !result.pass)) process.exitCode = 1;
