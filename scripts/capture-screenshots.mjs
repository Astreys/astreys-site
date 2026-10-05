// Captures screenshots of my own live products into media-src/, ready for
// `npm run media`. Re-run when a product changes visibly.
//
//   node scripts/capture-screenshots.mjs [name...]
//
// Only products listed here may ever be captured: see SPEC §5.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = new URL('../media-src/', import.meta.url);

// The Plane Spotter API runs on a home machine and is sometimes offline. Set
// PSB_URL to a local `npm run dev` of that repo to capture real live data.
const targets = {
  'plane-spotter-board': {
    url: process.env.PSB_URL ?? 'https://plane-spotter-board.netlify.app/',
    settle: 20000,
    // Row thumbnails come from planespotters.net and belong to their
    // photographers, so switch them off before capturing.
    prepare: async (page) => {
      const toggle = page.getByRole('button', { name: /photos on/i });
      if (await toggle.count()) await toggle.click();
    },
  },
  panmilli: { url: 'https://panmilli.com/', settle: 4000 },
  'panmilli-products': { url: 'https://panmilli.com/products', settle: 5000 },
  // The redesign in preview; the live site's dated design undersold the work.
  'eshee-esthetic': { url: 'https://eshee.netlify.app/', settle: 5000 },
};

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(targets);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
  reducedMotion: 'reduce',
});

for (const name of names) {
  const target = targets[name];
  if (!target) throw new Error(`Unknown target "${name}"`);
  const page = await context.newPage();
  // Plane Spotter holds an SSE connection open, so "networkidle" never fires.
  await page.goto(target.url, { waitUntil: 'load' });
  await page.waitForTimeout(target.settle);
  await target.prepare?.(page);
  await page.waitForTimeout(500);
  const file = fileURLToPath(new URL(`${name}.png`, OUT));
  await page.screenshot({ path: file, fullPage: false });
  console.log(`captured ${name}`);
  await page.close();
}

await browser.close();
