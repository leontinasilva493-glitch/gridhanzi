import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4339';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(baseURL).hostname));
const output = 'artifacts/p1-content';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const paths = ['/templates/hsk-3-0-level-1-writing', '/chinese-basic-strokes', '/chinese-stroke-order-mistakes', '/hsk/3-0-vs-2-0', '/hsk/3-0-handwriting-requirements', '/templates/hsk-3-0-level-2-writing'];
try {
  const context = await browser.newContext({ baseURL, viewport: { width: 1280, height: 900 } });
  await context.route(/clarity\.ms|google-analytics\.com|googletagmanager\.com|lxgw-wenkai-gb-web.*\.css/, route => route.abort());
  await context.route('**/api/worksheet/enrich', route => route.fulfill({ status: 503, json: { error: 'No paid enrichment in QA' } }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.setDefaultTimeout(20000);
  for (const prefix of ['', '/zh']) {
    await page.setViewportSize(prefix ? { width: 375, height: 812 } : { width: 1280, height: 900 });
    for (const path of paths) {
      const response = await page.goto(prefix + path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, prefix + path);
      assert.equal(await page.locator('h1').count(), 1);
      if (!prefix) {
        assert.ok((await page.title()).length <= 60, path + ' search title stays concise');
        assert.ok((await page.locator('meta[name=description]').getAttribute('content')).length <= 160, path + ' search description stays concise');
      }
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://gridhanzi.org${prefix}${path}`);
      assert.equal(await page.locator('link[hreflang=zh]').getAttribute('href'), `https://gridhanzi.org/zh${path}`);
      assert.equal(await page.locator('meta[name=robots][content*=noindex]').count(), 0);
      for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) JSON.parse(json);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), prefix + path + ' overflow');
      if (prefix) assert.match(await page.locator('h1').innerText(), /[\u4e00-\u9fff]/);
      if (path.includes('/templates/')) {
        assert.equal(await page.locator('tbody tr').count(), 10);
        await page.getByRole('button', { name: prefix ? (path.includes('level-1') ? '日期与时间' : '交通与出行') : (path.includes('level-1') ? 'Days and time' : 'Getting around') }).click();
        assert.equal(await page.locator('tbody tr').count(), 10);
        assert.match(await page.locator('tbody').innerText(), path.includes('level-1') ? /今天/ : /车站/);
        const lesson = page.locator('[data-practice-lesson]');
        assert.equal(await lesson.getAttribute('data-practice-lesson'), path.includes('level-1') ? 'recognition' : 'contrast');
        assert.match(await lesson.innerText(), path.includes('level-1') ? /昨天/ : /机场/);
        if (path.includes('level-1')) {
          await lesson.locator('summary').first().click();
          assert.equal(await lesson.locator('details').first().getAttribute('open'), '');
        }
        await page.getByRole('button', { name: prefix ? (path.includes('level-1') ? '食物与饮品' : '描述与活动') : (path.includes('level-1') ? 'Food and drink' : 'Descriptions and activity') }).click();
        assert.match(await lesson.innerText(), path.includes('level-1') ? /fruit|水果/ : /颜色/);
        const lessonLink = await lesson.locator('a').getAttribute('href');
        assert.ok(lessonLink.includes('practiceSet=' + (path.includes('level-1') ? 'food' : 'daily')));
        assert.ok(lessonLink.includes('mode=' + (path.includes('level-1') ? 'trace' : 'quiz')));
      } else {
        assert.equal(await page.locator('[data-contextual-next-step]').count(), 1);
        assert.equal(await page.locator('nav[aria-label="Related guides"], nav[aria-label="相关指南"]').count(), 0);
      }
      results.push({ path: prefix + path, pass: true });
      if (prefix && path.includes('level-2')) await page.screenshot({ path: `${output}/zh-level-2-mobile.png`, fullPage: true });
      if (!prefix && path === '/chinese-basic-strokes') {
        assert.equal(await page.locator('main svg[role=img]').count(), 8);
        await page.screenshot({ path: `${output}/basic-strokes-desktop.png`, fullPage: true });
      }
    }
  }
  const xml = await (await context.request.get('/sitemap.xml')).text();
  for (const prefix of ['', '/zh']) for (const path of paths) assert.ok(xml.includes(`https://gridhanzi.org${prefix}${path}`));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(paths[5], { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Getting around', exact: true }).click();
  await page.getByRole('link', { name: 'Edit this set for recall', exact: true }).click();
  await page.waitForURL('**/generator?**');
  assert.equal(await page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).inputValue(), '车站');
  assert.equal(await page.getByRole('textbox', { name: 'Chinese row 10', exact: true }).inputValue(), '右边');
  assert.equal(await page.getByRole('textbox', { name: 'Chinese row 11', exact: true }).count(), 0);
  assert.ok(await page.getByRole('textbox', { name: 'Pinyin row 1', exact: true }).inputValue());
  await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
  await page.waitForURL('**/worksheet/preview');
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gridhanzi:worksheet:v1')));
  assert.equal(stored.entries.length, 10);
  assert.equal(stored.entries[0].hanzi, '车站');
  assert.equal(stored.settings.mode, 'quiz');
  assert.ok(stored.settings.title.length < 45, 'Print title stays short enough for the worksheet header');
  const pending = page.waitForEvent('download', { timeout: 90000 });
  await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
  const download = await pending;
  assert.equal(await download.failure(), null);
  await download.saveAs(`${output}/hsk-level-2-travel-quiz.pdf`);
  assert.equal((await readFile(`${output}/hsk-level-2-travel-quiz.pdf`)).subarray(0, 5).toString(), '%PDF-');
  await page.getByRole('link', { name: 'Back to editor', exact: true }).click();
  await page.getByText('Back to your worksheet. All rows have been kept.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).inputValue(), '车站');
  results.push({ path: 'Level 2 travel → quiz → PDF → resume', pass: true });
  await page.goto(paths[0], { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Edit this set with stroke guides', exact: true }).click();
  await page.waitForURL('**/generator?**');
  assert.equal(await page.getByRole('textbox', { name: 'Chinese row 1', exact: true }).inputValue(), '爸爸');
  assert.equal(await page.getByRole('textbox', { name: 'Chinese row 10', exact: true }).inputValue(), '学生');
  await page.getByRole('button', { name: 'Preview full page', exact: true }).click();
  await page.waitForURL('**/worksheet/preview');
  const learn = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gridhanzi:worksheet:v1')));
  assert.equal(learn.entries.length, 10);
  assert.equal(learn.settings.mode, 'trace');
  await page.screenshot({ path: `${output}/level-1-stroke-preview.png`, fullPage: true });
  results.push({ path: 'Level 1 people → stroke-guided preview', pass: true });
  const bad = await context.request.get('/generator?template=hsk-3-0-level-1-writing&practiceSet=missing');
  assert.equal(bad.status(), 404);
  assert.deepEqual(errors, []);
  await context.close();
} finally {
  await browser.close();
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
}
console.log(`PASS ${results.length} P1 page and handoff checks`);
