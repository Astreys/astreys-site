import { expect, test } from '@playwright/test';

test('Tab reaches every interactive element on the home page, each with a visible focus indicator', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Tab order differs by engine; Chromium is the reference');
  await page.goto('/');

  const interactive = await page
    .locator('a[href], button, input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])')
    .count();

  const reached: string[] = [];
  for (let i = 0; i < interactive + 5; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        // DOM position, not text: the page has two identical email links.
        key: `${[...document.querySelectorAll('*')].indexOf(el)}:${el.tagName}:${el.textContent?.trim() ?? ''}`,
        outlineVisible: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2,
        onScreen: rect.width > 0 && rect.height > 0,
      };
    });
    if (!focused) break;
    if (reached.includes(focused.key)) break; // wrapped around
    expect(focused.outlineVisible, `no visible focus indicator on ${focused.key}`).toBe(true);
    expect(focused.onScreen, `${focused.key} is focused but not visible`).toBe(true);
    reached.push(focused.key);
  }

  expect(reached[0], 'the skip link should be the first stop').toContain('Skip to main content');
  expect(reached).toHaveLength(interactive);
});

test('the skip link moves focus to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
