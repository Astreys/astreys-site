// Serves dist/ the way Netlify does, so Playwright and Lighthouse see the real
// behaviour: /work → work/index.html, unknown paths → 404.html with a 404
// status, text compressed, production CSP header.
// No dependencies; not for production.
//
//   node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);

// Send the production Content-Security-Policy, so tests catch a violation
// before Netlify does.
const netlifyToml = await readFile(fileURLToPath(new URL('../netlify.toml', import.meta.url)), 'utf8');
const csp = /Content-Security-Policy = "([^"]+)"/.exec(netlifyToml)?.[1];
if (!csp) throw new Error('No Content-Security-Policy found in netlify.toml');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolve(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const base = join(root, safe);
  if (!base.startsWith(root.replace(/[/\\]$/, ''))) return null;
  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  const file = await resolve(pathname);
  const status = file ? 200 : 404;
  const path = file ?? join(root, '404.html');
  const type = types[extname(path)] ?? 'application/octet-stream';
  let body = await readFile(path);
  const headers = { 'content-type': type, 'content-security-policy': csp, vary: 'accept-encoding' };
  if (/^text\/|xml|json|svg/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['content-encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, () => {
  console.log(`Serving dist/ at http://localhost:${port}`);
});
