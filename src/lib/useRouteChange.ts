import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { metaForPath } from './meta';
import { countPageview } from './analytics';

/**
 * What a full page load does for free, done by hand for client-side
 * navigation: update the title and description, move focus and scroll to the
 * new content, and count the view. Skipped on first render, where the
 * pre-rendered HTML and the browser have already done all of it.
 */
export function useRouteChange(): void {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const meta = metaForPath(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);

    const target = (hash && document.getElementById(decodeURIComponent(hash.slice(1)))) || null;
    if (target) {
      target.scrollIntoView();
      focusWithoutScroll(target);
    } else {
      window.scrollTo(0, 0);
      // Screen reader users hear the new page's heading, not silence.
      const heading = document.querySelector<HTMLElement>('main h1');
      if (heading) focusWithoutScroll(heading);
    }

    countPageview(pathname);
  }, [pathname, hash]);
}

function focusWithoutScroll(element: HTMLElement) {
  if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
  element.focus({ preventScroll: true });
}
