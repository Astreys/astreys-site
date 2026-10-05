import { expect, test } from '@playwright/test';
import { allowedExternalHosts, notFound, routes } from './site';

const pagesToCheck = [...routes.map((r) => r.path), notFound.path];

for (const path of pagesToCheck) {
  test(`every link on ${path} resolves or points at an expected host`, async ({ page, request, baseURL }) => {
    await page.goto(path);
    const hrefs = await page.locator('a[href]').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href),
    );
    expect(hrefs.length).toBeGreaterThan(0);

    const origin = new URL(baseURL ?? '').origin;
    for (const href of new Set(hrefs)) {
      const url = new URL(href);

      if (url.protocol === 'mailto:') {
        expect(url.pathname, href).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
        continue;
      }

      // In-page fragment (the skip link): the target must exist right here.
      if (url.origin === origin && url.pathname === new URL(page.url()).pathname && url.hash) {
        await expect(page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`), href).toHaveCount(1);
        continue;
      }

      if (url.origin === origin) {
        const response = await request.get(url.pathname);
        expect(response.status(), `${href} (linked from ${path})`).toBe(200);
        // A fragment must name an element on the target page.
        if (url.hash) {
          await page.goto(url.pathname);
          await expect(page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`), href).toHaveCount(1);
          await page.goto(path);
        }
        continue;
      }

      expect(url.protocol, href).toBe('https:');
      expect(allowedExternalHosts.has(url.hostname), `unexpected external host in ${href}`).toBe(true);
    }
  });
}
