import { expect, test } from '@playwright/test';
import { notFound, routes } from './site';

for (const route of routes) {
  test(`${route.path} returns 200 with its own title and metadata`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{30,}/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });
}

test('every route answers directly, without a redirect', async ({ request }) => {
  for (const route of routes) {
    const response = await request.get(route.path, { maxRedirects: 0 });
    expect(response.status(), route.path).toBe(200);
  }
});

test('no page logs an error, including Content-Security-Policy violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of routes) {
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');
  }
  expect(errors).toEqual([]);
});

test('an unknown path returns a real 404 page, not a redirect', async ({ page }) => {
  const response = await page.goto(notFound.path);
  expect(response?.status()).toBe(404);
  expect(new URL(page.url()).pathname).toBe(notFound.path);
  await expect(page).toHaveTitle(notFound.title);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('pages are readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main p').first()).toBeVisible();
  }
  await context.close();
});

test('unknown query parameters change nothing and never appear in the page', async ({ page }) => {
  await page.goto('/?from=okta');
  await expect(page).toHaveTitle(routes[0].title);
  expect(await page.content()).not.toContain('okta');
});

test('client-side navigation updates the title and moves focus to the new heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Work' }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page).toHaveTitle('Work — Sasha Chernyavsky');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('a clip loads nothing until played, then plays inline with focus on the player', async ({ page }) => {
  const videoRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.mp4')) videoRequests.push(request.url());
  });
  await page.goto('/spotting');
  await page.waitForLoadState('networkidle');
  expect(videoRequests).toEqual([]);
  await expect(page.locator('video')).toHaveCount(0);

  const play = page.getByRole('link', { name: /^Play video: Lufthansa/ });
  await play.focus();
  await page.keyboard.press('Enter');
  const video = page.locator('video');
  await expect(video).toHaveCount(1);
  await expect(video).toBeFocused();
  await expect(video).toHaveAttribute('controls', '');
});
