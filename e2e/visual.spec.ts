import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { routes } from './site';

const widths = [390, 768, 1440] as const;

/**
 * Baselines are committed per platform. In CI, a platform with no baseline
 * is skipped rather than failed: run the "Update visual baselines" workflow
 * to generate the Linux set, and commit it. Locally, a missing baseline is
 * written on first run as usual.
 */
const hasBaseline = (name: string) =>
  existsSync(`e2e/visual.spec.ts-snapshots/${name.replace(/\.png$/, '')}-chromium-${process.platform}.png`);

for (const width of widths) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of routes) {
      test(`${route.path} looks right`, async ({ page }) => {
        const name = `${route.path === '/' ? 'home' : route.path.slice(1)}-${width}.png`;
        test.skip(
          Boolean(process.env.CI) && !process.env.UPDATE_BASELINES && !hasBaseline(name),
          `no ${process.platform} baseline for ${name}`,
        );
        await page.goto(route.path);
        // Lazy images only load when scrolled to; load them all first.
        await page.evaluate(() => {
          for (const img of document.querySelectorAll('img')) img.loading = 'eager';
        });
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => document.fonts.ready);
        // Long full-page captures can exceed the 5s default under parallel load.
        await expect(page).toHaveScreenshot(name, { fullPage: true, timeout: 20_000 });
      });
    }
  });
}
