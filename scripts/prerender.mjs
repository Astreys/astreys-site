// Build step 3 of 3. After the client build (dist/) and the SSR build
// (dist-ssr/), render every route to static HTML using the client build's
// index.html as the template, then write the sitemap.
//
// This is the whole pre-rendering "framework": the SSR bundle exports
// render(url) → { html, head }, and this script writes files.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const ssrDir = fileURLToPath(new URL('../dist-ssr/', import.meta.url));
const ORIGIN = 'https://astreys.com';

const { render, prerenderTargets } = await import(pathToFileURL(`${ssrDir}entry-server.js`).href);
// Every page is complete HTML before any script runs; the bundle only adds
// client-side navigation. Fetch it after the fonts, CSS and LCP image, so it
// never competes with them for bandwidth on a slow connection.
const template = (await readFile(`${dist}index.html`, 'utf8')).replace(
  /<script type="module" crossorigin src=/g,
  '<script type="module" crossorigin fetchpriority="low" src=',
);

if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> or <!--app-html--> placeholder');
}

for (const { url, file } of prerenderTargets) {
  const { html, head } = render(url);
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
  const out = `${dist}${file}`;
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page);
  console.log(`prerendered ${url} → dist/${file}`);
}

const indexable = prerenderTargets.filter(({ url }) => url !== '/404');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(({ url }) => `  <url><loc>${ORIGIN}${url}</loc></url>`).join('\n')}
</urlset>
`;
await writeFile(`${dist}sitemap.xml`, sitemap);

await rm(ssrDir, { recursive: true, force: true });
