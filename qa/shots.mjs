/* QA only: renders the static homepage at several viewports and captures
   screenshots + console errors. Run locally with: node qa/shots.mjs */
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'qa', 'shots');
fs.mkdirSync(outDir, { recursive: true });

const url = pathToFileURL(path.join(root, 'index.html')).href;
const viewports = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 800 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1440', width: 1440, height: 900 }
];

const browser = await chromium.launch();
const log = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') log.push(`[${vp.name}] console error: ${msg.text()}`);
  });
  page.on('pageerror', (err) => log.push(`[${vp.name}] page error: ${err.message}`));
  page.on('requestfailed', (req) => log.push(`[${vp.name}] failed request: ${req.url()} (${req.failure()?.errorText})`));

  await page.goto(url, { waitUntil: 'networkidle' });
  // scroll through once so lazy images decode before the full-page capture
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });
  await page.waitForTimeout(1200);

  // horizontal overflow check
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const wide = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1)) {
        wide.push(`${el.tagName.toLowerCase()}.${(el.className && typeof el.className === 'string') ? el.className.split(' ').join('.') : ''} [${Math.round(r.left)}..${Math.round(r.right)}]`);
      }
    });
    return { scrollW: de.scrollWidth, clientW: de.clientWidth, wide: wide.slice(0, 25) };
  });
  log.push(`[${vp.name}] scrollWidth=${overflow.scrollW} clientWidth=${overflow.clientW}`);
  if (overflow.wide.length) log.push(`[${vp.name}] overflowing elements: ${overflow.wide.join(' | ')}`);

  await page.screenshot({ path: path.join(outDir, `${vp.name}-viewport.png`) });
  await page.screenshot({ path: path.join(outDir, `${vp.name}-full.png`), fullPage: true });

  // section close-ups (real scroll positions, so sticky elements behave normally)
  for (const id of ['standard', 'services', 'difference', 'reviews', 'faq', 'contact']) {
    const el = await page.$('#' + id);
    if (!el) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-${id}.png`) });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // mobile menu open state
  if (vp.width < 1200) {
    await page.click('#menuToggle');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-menu.png`) });
    await page.click('#menuToggle');
    await page.waitForTimeout(400);
  }

  await context.close();
}

fs.writeFileSync(path.join(outDir, 'report.txt'), log.join('\n'));
console.log(log.join('\n'));
await browser.close();
