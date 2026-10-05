import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { metaForPath, renderHeadTags } from './lib/meta';
import './styles/global.css';

/**
 * Every page written at build time, and the file each one becomes.
 * `work.html`, not `work/index.html`: Netlify serves a directory index by
 * redirecting /work → /work/, but every link and canonical URL is /work.
 */
export const prerenderTargets = [
  { url: '/', file: 'index.html' },
  { url: '/work', file: 'work.html' },
  { url: '/spotting', file: 'spotting.html' },
  // Netlify serves 404.html, with a 404 status, for any unmatched path.
  { url: '/404', file: '404.html' },
] as const;

export function render(url: string): { html: string; head: string } {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: renderHeadTags(metaForPath(url)) };
}
