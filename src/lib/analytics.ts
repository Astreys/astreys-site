/**
 * GoatCounter is loaded by public/analytics.js, and only on the production
 * host. Client-side navigations don't reload the page, so they are counted
 * here. If the script is blocked or absent, this does nothing.
 */
export function countPageview(pathname: string): void {
  window.goatcounter?.count?.({ path: pathname });
}
