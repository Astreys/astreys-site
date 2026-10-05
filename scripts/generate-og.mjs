// Renders the Open Graph card (1200×630) and the apple-touch-icon with the
// site's own fonts, so link previews look like the site. Re-run if the name,
// role or palette changes.
//
//   node scripts/generate-og.mjs
import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pub = fileURLToPath(new URL('../public/', import.meta.url));
// Inlined: a page made with setContent() may not read file:// URLs.
const font = async (file) =>
  `data:font/woff2;base64,${(await readFile(`${pub}fonts/${file}`)).toString('base64')}`;

const fontFaces = `
  @font-face { font-family: Archivo; font-weight: 400; src: url(${await font('archivo-latin-400-normal.woff2')}); }
  @font-face { font-family: Archivo; font-weight: 700; src: url(${await font('archivo-latin-700-normal.woff2')}); }
`;

const card = `<!doctype html><html><head><style>
  ${fontFaces}
  html, body { margin: 0; }
  body {
    width: 1200px; height: 630px; box-sizing: border-box;
    padding: 72px 80px; background: #0a1220; color: #e9eff8;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .eyebrow { font: 700 24px Archivo; letter-spacing: 0.12em; text-transform: uppercase; color: #34d6e3; display: flex; align-items: center; gap: 14px; }
  .eyebrow::before { content: ""; width: 36px; height: 3px; background: currentColor; }
  h1 { font: 700 84px/1.04 Archivo; letter-spacing: -0.035em; margin: 36px 0 28px; max-width: 980px; }
  h1 span { color: #34d6e3; }
  p { font: 400 32px/1.35 Archivo; color: #a3b3ca; margin: 0; }
  .foot { display: flex; justify-content: space-between; align-items: baseline;
          font: 700 28px Archivo; border-top: 1px solid #1d2a40; padding-top: 24px; letter-spacing: 0.04em; }
  .foot span:first-child span { color: #34d6e3; }
  .foot span:last-child { color: #a3b3ca; font-weight: 400; letter-spacing: 0; }
</style></head><body>
  <div>
    <div class="eyebrow">Front-end developer · Toronto</div>
    <h1>Turning ideas into <span>engaging</span> web experiences.</h1>
    <p>Sasha Chernyavsky — React, TypeScript, accessibility.</p>
  </div>
  <div class="foot"><span>SASHA<span>.</span>C</span><span>astreys.com</span></div>
</body></html>`;

const icon = `<!doctype html><html><head><style>
  html, body { margin: 0; }
  body { width: 180px; height: 180px; background: #0a1220; display: grid; place-items: center; }
  svg { width: 180px; height: 180px; }
</style></head><body>
  <svg viewBox="0 0 32 32"><path d="M16 6v4m0 4v4m0 4v4" fill="none" stroke="#34d6e3" stroke-width="3" stroke-linecap="square"/></svg>
</body></html>`;

await mkdir(`${pub}og`, { recursive: true });
const browser = await chromium.launch();

const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(card, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${pub}og/astreys-og.png` });

await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(icon);
await page.screenshot({ path: `${pub}apple-touch-icon.png` });

await browser.close();
console.log('wrote public/og/astreys-og.png and public/apple-touch-icon.png');
