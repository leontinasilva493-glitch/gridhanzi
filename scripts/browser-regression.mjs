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
  await page.waitForLoadState('networkidle', { timeout: 30_000 });
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
  for (const zh of [false, true]) {
    await scenario(`help-template-${zh ? 'zh-mobile' : 'en-desktop'}`, zh ? { viewport: { width: 390, height: 844 } } : {}, async (page, context) => {
      let accepted = false;
      let payload;
      await context.route('**/api/feedback', route => {
        payload = route.request().postDataJSON();
        return route.fulfill({ status: accepted ? 200 : 503, json: accepted ? { ok: true } : { error: 'Test unavailable' } });
      });
      await visit(page, zh ? '/zh/templates' : '/templates');
      const picker = page.locator('[data-template-purpose]');
      assert.equal(await page.locator('[data-feedback-form]').count(), 0);
      await picker.getByRole('button', { name: zh ? '课堂练习' : 'For a class', exact: true }).click();
      const ownWords = picker.getByRole('link', { name: zh ? '输入本课词表' : 'Enter lesson words', exact: true });
      assert.equal(await ownWords.getAttribute('href'), zh ? '/zh#hero-vocabulary' : '/#hero-vocabulary');
      await picker.getByRole('link', { name: zh ? '浏览主题模板' : 'Browse topic templates', exact: true }).click();
      assert.match(page.url(), /#everyday-words$/);
      await picker.getByRole('button', { name: zh ? '孩子练字' : 'For a child', exact: true }).click();
      assert.equal(await picker.getByRole('link', { name: zh ? '数字' : 'Numbers', exact: true }).getAttribute('href'), zh ? '/zh/templates/numbers' : '/templates/numbers');
      await picker.getByRole('button', { name: zh ? 'HSK 练习' : 'HSK practice', exact: true }).click();
      assert.match(await picker.getByRole('link', { name: zh ? '选择版本与级别' : 'Choose version and level', exact: true }).getAttribute('href'), /generator\?hskSystem=2.0&hskLevel=1$/);
      await picker.getByRole('button', { name: zh ? '课堂练习' : 'For a class', exact: true }).click();
      const invite = picker.getByRole('button', { name: zh ? '没找到你要的练习？描述一下你想做的练习纸。' : "Can't find what you need? Describe the worksheet you have in mind.", exact: true });
      await invite.click();
      const form = picker.locator('[data-feedback-form]');
      assert.equal(await form.getAttribute('data-clarity-mask'), 'true');
      assert.equal(await form.locator('textarea').count(), 1);
      assert.equal(await form.locator('input[type=email]').count(), 0);
      assert.equal(await form.locator('select').count(), 1);
      await form.screenshot({ path: path.join(output, `help-form-${zh ? 'zh' : 'en'}.png`) });
      await form.locator('textarea').fill('More blank rows for a lesson.');
      await form.getByRole('checkbox').check();
      await form.locator('input[type=email]').fill('private@example.com');
      await form.getByRole('checkbox').uncheck();
      await form.getByRole('button', { name: zh ? '提交需求' : 'Send request', exact: true }).click();
      await form.getByRole('alert').waitFor();
      assert.equal(payload.contactEmail, '');
      assert.equal(payload.role, '');
      assert.equal(payload.useCase, 'class');
      assert.equal(payload.pagePath, zh ? '/zh/templates' : '/templates');
      assert.equal(payload.ageRange, undefined);
      await form.getByRole('button', { name: zh ? '关闭表单' : 'Close form', exact: true }).click();
      assert.equal(await page.locator('[data-feedback-form]').count(), 0);
      await invite.click();
      assert.equal(await form.locator('textarea').inputValue(), 'More blank rows for a lesson.');
      accepted = true;
      await form.getByRole('button', { name: zh ? '提交需求' : 'Send request', exact: true }).click();
      await form.getByRole('status').waitFor();
      assert.match(await form.getByRole('status').innerText(), zh ? /已提交/ : /Submitted/);
      const cooldown = await page.evaluate(() => Number(localStorage.getItem('gridhanzi-feedback-cooldown')));
      assert.ok(cooldown > Date.now() + 179 * 86400000);
      await form.getByRole('button', { name: zh ? '关闭表单' : 'Close form', exact: true }).click();
      assert.equal(await page.evaluate(() => Number(localStorage.getItem('gridhanzi-feedback-cooldown'))), cooldown);
      await invite.click();
      assert.equal(await form.locator('textarea').inputValue(), '');
      await form.locator('textarea').fill('A different request.');
      await form.getByRole('button', { name: zh ? '提交需求' : 'Send request', exact: true }).click();
      await form.getByRole('status').waitFor();
      await picker.getByRole('button', { name: zh ? '自己练习' : 'For myself', exact: true }).click();
      await invite.click();
      assert.equal(await form.locator('textarea').inputValue(), '');
      await form.getByRole('button', { name: zh ? '关闭表单' : 'Close form', exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await picker.screenshot({ path: path.join(output, `help-template-${zh ? 'zh' : 'en'}.png`) });
    });
  }
  await scenario('help-adjust-resumes-all-rows-and-requires-mode-choice', {}, async (page, context) => {
    const editing = { ...snapshot, entries: [...snapshot.entries, { id: 'pending', hanzi: '', pinyin: '', english: 'unfinished', status: 'needs-review' }], settings: { ...snapshot.settings, mode: 'write', cellSize: 22 } };
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify({ ...snapshot, settings: editing.settings }));
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:editor-session:v1', JSON.stringify(editing));
    await visit(page, '/worksheet/preview');
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    assert.equal(await (await downloading).failure(), null);
    await page.getByRole('button', { name: 'Adjust worksheet', exact: true }).click();
    await page.getByRole('link', { name: 'Add stroke-order guides', exact: true }).click();
    await page.getByRole('button', { name: 'Switch to Learn mode', exact: true }).waitFor();
    assert.equal(await page.getByRole('textbox', { name: 'English row 2', exact: true }).inputValue(), 'unfinished');
    assert.equal(await page.getByRole('button', { name: 'Practice', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'worksheet-strokes');
    await page.getByRole('button', { name: 'Switch to Learn mode', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Learn', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('button', { name: 'Detailed', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('textbox', { name: 'English row 2', exact: true }).inputValue(), 'unfinished');
  });
  await scenario('help-storage-blocked-manual-and-print', { viewport: { width: 390, height: 844 } }, async (page, context) => {
    await denyStorage(context, 'localStorage', 'getter');
    await context.addInitScript(() => { window.print = () => { document.body.dataset.printOpened = 'true'; }; });
    await visit(page, '/zh/worksheet/preview?template=numbers');
    await page.getByRole('button', { name: '遇到问题？', exact: true }).click();
    await page.getByRole('button', { name: 'PDF 下载失败', exact: true }).click();
    await page.getByRole('button', { name: '打开打印窗口', exact: true }).click();
    await page.waitForFunction(() => document.body.dataset.printOpened === 'true');
    assert.equal(await page.locator('[data-feedback-form]').count(), 0);
    await page.getByRole('button', { name: '内容或排版不对', exact: true }).click();
    assert.equal(await page.getByRole('link', { name: '修改汉字、拼音或释义', exact: true }).getAttribute('href'), '/zh/generator?template=numbers#review-words');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('[data-worksheet-help]').screenshot({ path: path.join(output, 'help-preview-zh.png') });
    await page.getByRole('button', { name: '关闭帮助', exact: true }).click();
    assert.equal(await page.locator('[data-worksheet-help]').isVisible(), false);
    await page.getByRole('button', { name: '遇到问题？', exact: true }).click();
    await page.locator('[data-worksheet-help]').waitFor();
  });
  await scenario('flow-auto-fill-timeout', {}, async (page, context) => {
    let release;
    const blocked = new Promise(resolve => { release = resolve; });
    await context.route('**/api/worksheet/enrich', async route => {
      await blocked;
      await route.fulfill({ status: 503, json: {} }).catch(() => {});
    });
    await visit(page, '/generator?words=' + encodeURIComponent('你好'));
    await page.clock.install();
    await page.getByRole('button', { name: 'Auto-fill missing fields', exact: true }).click();
    await page.clock.fastForward(20_001);
    await page.getByText(/Auto-fill took too long/).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Preview full page', exact: true }).isEnabled(), true);
    assert.equal(await page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).inputValue(), '你好');
    release();
  });
  await scenario('flow-pdf-tools-timeout-retry', {}, async (page, context) => {
    let release;
    const blocked = new Promise(resolve => { release = resolve; });
    await context.route(/\/jspdf\.es\.min-[^/]+\.js/, async route => { await blocked; await route.continue().catch(() => {}); });
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    const downloads = [];
    page.on('download', download => downloads.push(download));
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: /PDF tools could not finish loading/ }).waitFor({ timeout: 20_000 });
    assert.equal(await page.getByRole('button', { name: 'Print / Save as PDF instead', exact: true }).isVisible(), true);
    release();
    await page.waitForLoadState('networkidle');
    assert.equal(downloads.length, 0, 'Late modules must not trigger the failed export');
    // Simulate a browser that no longer delivers animation frames to this tab.
    await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    assert.equal(downloads.length, 1);
    await download.saveAs(path.join(output, 'flow-tools-retry-without-raf.pdf'));
  });
  await scenario('flow-template-filter-links', { viewport: { width: 390, height: 844 } }, async page => {
    await visit(page, '/templates');
    const links = page.getByRole('link', { name: 'Use the filters above', exact: true });
    assert.equal(await links.count(), 3);
    await links.first().focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/templates#template-filters');
    const filters = page.getByRole('region', { name: 'Template filters', exact: true });
    const bounds = await filters.boundingBox();
    assert.ok(bounds && bounds.y >= 0 && bounds.y < 400);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'template-filters');
    await page.screenshot({ path: path.join(output, 'flow-template-filters-mobile.png') });
  });
  await scenario('flow-review-focus', { viewport: { width: 390, height: 844 } }, async page => {
    await visit(page, '/generator?words=' + encodeURIComponent('apple\nunmatched-private-term'));
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Review before exporting' });
    await dialog.getByRole('button', { name: 'Back to complete the list' }).click();
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Chinese row 2');
    await page.keyboard.type('人');
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    await page.waitForURL('**/worksheet/preview');
    const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gridhanzi:worksheet:v1')));
    assert.equal(saved.entries.length, 2);
    assert.equal(saved.entries[1].hanzi, '人');
  });
  await scenario('flow-auto-fill-cancel', {}, async (page, context) => {
    let release;
    const blocked = new Promise(resolve => { release = resolve; });
    await context.route('**/api/worksheet/enrich', async route => {
      await blocked;
      await route.fulfill({ json: { entries: [{ hanzi: '错', pinyin: 'cuò', english: 'wrong' }] } }).catch(() => {});
    });
    await visit(page, '/generator?words=' + encodeURIComponent('你好'));
    await page.getByRole('button', { name: 'Auto-fill missing fields', exact: true }).click();
    await page.getByRole('button', { name: 'Stop auto-fill', exact: true }).click();
    await page.getByText(/Auto-fill stopped/).waitFor();
    release();
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    await page.waitForURL('**/worksheet/preview');
    const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gridhanzi:worksheet:v1')));
    assert.equal(saved.entries[0].hanzi, '你好');
  });
  await scenario('flow-pdf-cancel-retry', { viewport: { width: 390, height: 844 } }, async (page, context) => {
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    await page.evaluate(() => {
      const fonts = document.fonts;
      Object.defineProperty(document, 'fonts', { configurable: true, value: { load: () => new Promise(() => {}), ready: Promise.resolve() } });
      window.__restorePdfFonts = () => Object.defineProperty(document, 'fonts', { configurable: true, value: fonts });
    });
    const downloads = [];
    page.on('download', download => downloads.push(download));
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    assert.equal(await page.getByRole('combobox', { name: 'Paper size', exact: true }).isEnabled(), false);
    await page.getByRole('button', { name: 'Cancel PDF', exact: true }).click();
    await page.getByText(/PDF creation cancelled/).waitFor();
    assert.equal(downloads.length, 0);
    assert.equal(await page.locator('[data-gridhanzi-pdf-capture]').count(), 0);
    await page.evaluate(() => window.__restorePdfFonts());
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    await download.saveAs(path.join(output, 'flow-cancel-retry.pdf'));
    assert.equal(downloads.length, 1);
    await page.screenshot({ path: path.join(output, 'flow-pdf-mobile.png') });
  });
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
      await page.getByText('More settings', { exact: true }).click();
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
    await page.getByText('More settings', { exact: true }).click();
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
    await page.getByText('More settings', { exact: true }).click();
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
    assert.match(await page.getByRole('status').filter({ hasText: /could not remove/i }).innerText(), /could not remove/i);
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
      await page.getByRole('status').filter({ hasText: /could not be saved/i }).waitFor();
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
  await scenario('ux-mobile-review-target-and-add-row', { viewport: { width: 390, height: 844 } }, async page => {
    await visit(page, '/generator?mode=quiz&words=' + encodeURIComponent('未知词'));
    await page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).fill('未知词');
    await page.getByRole('textbox', { name: 'English row 1', exact: true }).fill('');
    const reviewLink = page.getByText(/Missing: meaning/i).first();
    await reviewLink.click();
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'English row 1');
    await page.getByRole('button', { name: 'Add row', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Chinese row 2');
  });
  await scenario('ux-auto-fill-no-match-feedback', {}, async page => {
    await page.context().route('**/api/worksheet/enrich', route => route.fulfill({ json: {
      entries: [{ id: 'row-1', hanzi: '', pinyin: '', english: 'unmatched-private-term', status: 'needs-review' }],
    } }));
    await visit(page, '/generator?words=' + encodeURIComponent('unmatched-private-term'));
    await page.getByRole('button', { name: 'Auto-fill missing fields', exact: true }).click();
    await page.getByRole('status').filter({ hasText: /No supported matches were found/i }).waitFor();
    assert.equal(await page.getByRole('textbox', { name: 'English row 1', exact: true }).inputValue(), 'unmatched-private-term');
  });
  await scenario('ux-auto-fill-preserves-in-flight-edit', {}, async page => {
    await page.context().route('**/api/worksheet/enrich', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.fulfill({ json: {
        entries: [{ id: 'row-1', hanzi: '补全', pinyin: 'bǔquán', english: 'generated', status: 'complete' }],
      } });
    });
    await visit(page, '/generator?words=' + encodeURIComponent('unmatched-private-term'));
    await page.getByRole('button', { name: 'Auto-fill missing fields', exact: true }).click();
    await page.getByRole('textbox', { name: 'English row 1', exact: true }).fill('my own meaning');
    await page.getByRole('textbox', { name: 'Pinyin row 1', exact: true }).waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.querySelector('input[aria-label="Pinyin row 1"]')?.value === 'bǔquán');
    assert.equal(await page.getByRole('textbox', { name: 'English row 1', exact: true }).inputValue(), 'my own meaning');
  });
  await scenario('preview-pdf-download', {}, async (page, context) => {
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    await page.locator('[data-worksheet-help]').waitFor();
    assert.match(await page.locator('[data-worksheet-help]').innerText(), /Want to adjust this worksheet/);
    assert.equal(await page.locator('[data-feedback-invite], [data-feedback-dialog], [data-feedback-form]').count(), 0);
    await page.getByRole('button', { name: 'Close help', exact: true }).click();
    assert.equal(await page.locator('[data-worksheet-help]').isVisible(), false);
    assert.ok(await page.evaluate(() => Number(localStorage.getItem('gridhanzi-feedback-cooldown')) > Date.now()));
    assert.match(download.suggestedFilename(), /\.pdf$/);
    await download.saveAs(path.join(output, 'worksheet.pdf'));
  });
  await scenario('preview-pdf-multi-page-first-context', {}, async (page, context) => {
    const entries = ['一','二','三','四','五','六','七','八','九','十','口','木','火','田','上','人','水','山'].map((hanzi, index) => ({
      id: `multi-${index + 1}`, hanzi, pinyin: ['yī','èr','sān','sì','wǔ','liù','qī','bā','jiǔ','shí','kǒu','mù','huǒ','tián','shàng','rén','shuǐ','shān'][index], english: `word ${index + 1}`, status: 'complete',
    }));
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify({
      ...snapshot,
      entries,
      settings: { ...snapshot.settings, mode: 'trace', showStrokeOrder: true, strokeOrderMode: 'detailed' },
    }));
    await visit(page, '/worksheet/preview');
    assert.equal(await page.locator('.hs-paper').count(), 5);
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    await download.saveAs(path.join(output, 'multi-page-worksheet.pdf'));
  });
  await scenario('preview-controls-and-font-fallback', {}, async (page, context) => {
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    const zoom = page.getByRole('combobox', { name: 'Preview zoom', exact: true });
    await zoom.selectOption('105');
    assert.equal(await zoom.inputValue(), '105');
    assert.equal(await page.getByRole('link', { name: 'Edit word list', exact: true }).count(), 1);
    assert.equal(await page.locator('link[data-gridhanzi-font]').count(), 1);
    assert.equal(await page.locator('link[data-gridhanzi-font]').evaluateAll(links => links.every(link => link.getAttribute('rel') === 'stylesheet')), true);
  });
  await scenario('preview-pdf-font-timeout-retry', {}, async (page, context) => {
    await context.addInitScript(() => {
      let blocked = sessionStorage.getItem('qa-font-blocked') !== 'released';
      const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
      window.__releaseGridHanziFonts = () => {
        blocked = false;
        if (originalFonts) Object.defineProperty(document, 'fonts', originalFonts);
        else delete document.fonts;
      };
      Object.defineProperty(document, 'fonts', {
        configurable: true,
        get: () => ({ load: async () => [], ready: blocked ? new Promise(() => {}) : Promise.resolve() }),
      });
    });
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    const downloadButton = page.getByRole('button', { name: 'Download PDF', exact: true });
    await downloadButton.click();
    await page.getByRole('alert').filter({ hasText: /fonts did not finish loading/i }).waitFor({ timeout: 12_000 });
    assert.equal(await downloadButton.isEnabled(), true);
    assert.equal(await page.evaluate(() => sessionStorage.getItem('gridhanzi:worksheet:v1') !== null), true);
    assert.equal(await page.locator('[data-gridhanzi-pdf-capture="true"]').count(), 0);
    assert.equal(await page.locator('iframe.html2canvas-container').count(), 0);
    await page.evaluate(() => sessionStorage.setItem('qa-font-blocked', 'released'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const retryButton = page.getByRole('button', { name: 'Download PDF', exact: true });
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await retryButton.click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    await download.saveAs(path.join(output, 'font-timeout-retry.pdf'));
  });
  await scenario('translation-dom-stability', {}, async page => {
    await visit(page, '/generator?template=family');
    const uiText = page.locator('[data-gridhanzi-ui="true"]').first();
    assert.equal(await uiText.count(), 1);
    await uiText.evaluate((node) => { node.textContent = 'Translated label'; });
    await page.getByRole('button', { name: 'Add row', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label')?.startsWith('Chinese row'));
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
    await page.getByText('More settings', { exact: true }).click();
    await page.getByRole('button', { name: 'Traditional (Taiwan)', exact: true }).click();
    await page.getByRole('status').filter({ hasText: /could not load character conversion/i }).waitFor();
    assert.equal(await chinese.inputValue(), '软件');
    assert.equal(await page.getByRole('button', { name: 'Add row', exact: true }).isEnabled(), true);
  });
  await scenario('ux-export-review-roundtrip', {}, async page => {
    await visit(page, '/generator?words=' + encodeURIComponent('apple\nbank\ncomputer science\nkindness'));
    await page.getByText('More settings', { exact: true }).click();
    await page.getByLabel('Worksheet title', { exact: true }).fill('My reviewed lesson');
    await page.getByRole('button', { name: 'US Letter', exact: true }).click();
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Review before exporting' });
    await dialog.waitFor();
    assert.match(await dialog.innerText(), /computer science/);
    assert.match(await dialog.innerText(), /kindness/);
    await dialog.getByRole('button', { name: 'Back to complete the list' }).click();
    assert.equal(await dialog.isVisible(), false);
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    await dialog.getByRole('button', { name: 'Export only 2 ready rows' }).click();
    await page.waitForURL('**/worksheet/preview');
    assert.equal(await page.getByRole('region', { name: /computer science|kindness/ }).count(), 0);
    assert.equal(await page.locator('[data-feedback-invite]').count(), 0);
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Back to editor', exact: true }).click();
      await page.getByText('Back to your worksheet. All rows have been kept.', { exact: true }).waitFor();
      assert.equal(await page.getByRole('textbox', { name: 'English row 4', exact: true }).first().inputValue(), 'kindness');
      assert.equal(await page.getByRole('button', { name: 'Restore worksheet', exact: true }).count(), 0);
      assert.equal(await page.getByLabel('Worksheet title', { exact: true }).inputValue(), 'My reviewed lesson');
      assert.equal(await page.getByRole('button', { name: 'US Letter', exact: true }).getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
      await page.getByRole('button', { name: 'Export only 2 ready rows' }).click();
      await page.waitForURL('**/worksheet/preview');
    }
    await page.screenshot({ path: path.join(output, 'ux-export-preview.png') });
  });
  await scenario('ux-mobile-review-first', { viewport: { width: 390, height: 844 } }, async page => {
    await visit(page, '/zh/generator?words=' + encodeURIComponent('你好\n妈妈\n学校'));
    const first = page.getByRole('textbox', { name: 'Chinese row 1', exact: true });
    const bounds = await first.boundingBox();
    assert.ok(bounds && bounds.y < 700, `First word must be visible: ${JSON.stringify(bounds)}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    const settings = page.locator('#worksheet-settings');
    assert.equal(await settings.getByText('更多设置', { exact: true }).evaluate(el => el.parentElement.open), false);
    await page.screenshot({ path: path.join(output, 'ux-mobile-first-word.png') });
  });
  await scenario('bounce-hanzi-only-export', {}, async page => {
    await visit(page, '/generator?words=' + encodeURIComponent('你好'));
    await page.getByRole('button', { name: 'Practice', exact: true }).click();
    await page.getByRole('textbox', { name: 'English row 1', exact: true }).fill('');
    await page.getByRole('textbox', { name: 'Pinyin row 1', exact: true }).fill('');
    assert.equal(await page.getByRole('button', { name: 'Mi Zi Ge', exact: true }).isVisible(), true);
    assert.equal(await page.getByRole('button', { name: 'Flashcards', exact: true }).isVisible(), true);
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    await page.waitForURL('**/worksheet/preview');
    const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gridhanzi:worksheet:v1')));
    assert.equal(stored.entries[0].hanzi, '你好');
    assert.equal(stored.entries[0].english, '');
    assert.equal(stored.entries[0].pinyin, '');
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    await download.saveAs(path.join(output, 'hanzi-only.pdf'));
    await page.screenshot({ path: path.join(output, 'hanzi-only-preview.png') });
  });
  await scenario('bounce-flashcard-and-quiz-fields', {}, async page => {
    await visit(page, '/generator?words=' + encodeURIComponent('你好'));
    await page.getByRole('textbox', { name: 'English row 1', exact: true }).fill('');
    await page.getByRole('textbox', { name: 'Pinyin row 1', exact: true }).fill('');
    await page.getByRole('button', { name: 'Test', exact: true }).click();
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Review before exporting' });
    await dialog.waitFor();
    assert.equal(await dialog.getByRole('button', { name: 'Export only 0 ready rows' }).isEnabled(), false);
    await dialog.getByRole('button', { name: 'Back to complete the list' }).click();
    await page.getByRole('button', { name: 'Flashcards', exact: true }).click();
    await page.getByText('Show English', { exact: true }).click();
    assert.equal(await page.getByRole('checkbox', { name: 'Show English', exact: true }).isChecked(), false);
    await page.getByText('Show Pinyin', { exact: true }).click();
    assert.equal(await page.getByRole('checkbox', { name: 'Show Pinyin', exact: true }).isChecked(), false);
    await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
    await page.waitForURL('**/worksheet/preview');
    assert.match(await page.locator('.hs-paper').first().innerText(), /你好/);
    assert.equal(await page.getByRole('button', { name: 'Download PDF', exact: true }).isEnabled(), true);
  });
  await scenario('bounce-stroke-timeout-retry', {}, async (page, context) => {
    let retrySucceeds = false;
    await context.route(/hanzi-writer-data.*\.json/, async route => {
      if (!retrySucceeds) return; // Deliberately leave the initial request unresolved.
      await route.fulfill({ json: { strokes: ['M 0 0 L 100 100'], medians: [[[0, 0], [100, 100]]] } });
    });
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify({
      ...snapshot, settings: { ...snapshot.settings, mode: 'trace', strokeOrderMode: 'detailed', showStrokeOrder: true },
    }));
    // networkidle would never occur: this test intentionally keeps a request pending.
    await page.goto('/worksheet/preview', { waitUntil: 'domcontentloaded' });
    await page.getByText('Some stroke guides could not load.', { exact: false }).waitFor({ timeout: 15_000 });
    assert.equal(await page.getByRole('button', { name: 'Download PDF', exact: true }).isEnabled(), true);
    const downloading = page.waitForEvent('download', { timeout: 45_000 });
    await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
    const download = await downloading;
    assert.equal(await download.failure(), null);
    await download.saveAs(path.join(output, 'stroke-fallback.pdf'));
    await page.screenshot({ path: path.join(output, 'stroke-fallback.png') });
    retrySucceeds = true;
    await page.getByRole('button', { name: 'Retry stroke guides', exact: true }).click();
    await page.getByRole('button', { name: 'Retry stroke guides', exact: true }).waitFor({ state: 'hidden', timeout: 15_000 });
    assert.equal(await page.getByRole('button', { name: 'Download PDF', exact: true }).isEnabled(), true);
  });
  await scenario('bounce-local-analytics-isolation', {}, async page => {
    const requests = [];
    page.on('request', request => { if (/clarity\.ms|google-analytics\.com|googletagmanager\.com|plausible\.io/.test(request.url())) requests.push(request.url()); });
    await visit(page, '/generator');
    assert.deepEqual(requests, []);
    assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined');
    assert.equal(await page.evaluate(() => typeof window.clarity), 'undefined');
  });
  await scenario('help-no-automatic-form', {}, async (page, context) => {
    await seed(context, 'sessionStorage', 'gridhanzi:worksheet:v1', JSON.stringify(snapshot));
    await visit(page, '/worksheet/preview');
    await page.clock.install();
    await page.clock.fastForward(61_000);
    assert.equal(await page.locator('[data-feedback-invite]').count(), 0);
    assert.equal(await page.locator('[data-feedback-form]').count(), 0);
    assert.equal(await page.locator('[data-worksheet-help]').isVisible(), false);
    await page.getByRole('button', { name: 'Having trouble?', exact: true }).click();
    await page.getByRole('button', { name: 'PDF download failed', exact: true }).click();
    await page.getByRole('button', { name: 'Open print dialog', exact: true }).waitFor();
    assert.equal(await page.locator('[data-feedback-form]').count(), 0);
    await page.getByRole('button', { name: 'Still stuck? Describe the problem', exact: true }).click();
    await page.locator('[data-feedback-form]').waitFor();
    await page.getByRole('button', { name: 'Close form', exact: true }).click();
    assert.equal(await page.locator('[data-feedback-form], [data-feedback-invite], [data-feedback-dialog]').count(), 0);
    assert.equal(await page.locator('[data-worksheet-help]').isVisible(), false);
  });
} finally {
  await browser.close();
  await writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
}
console.log(`${results.filter(result => result.pass).length}/${results.length} browser scenarios passed`);
if (results.some(result => !result.pass)) process.exitCode = 1;
