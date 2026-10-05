// Fails the build if any page exceeds the performance budget in SPEC §11.
// Run after `npm run build`.
//
//   HTML + CSS + JS per page, gzipped   ≤ 150 KB
//   any single image                    ≤ 250 KB
//   page weight excluding video         ≤ 900 KB  (every image counted, as if
//                                                   all were scrolled into view)
//   each video clip                     ≤ 6 MB
import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const KB = 1024;
const limits = { code: 150 * KB, image: 250 * KB, page: 900 * KB, video: 6 * 1024 * KB };

const failures = [];
const kb = (bytes) => `${(bytes / KB).toFixed(1)} KB`;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return files.flat();
}

const files = await walk(dist);
const sizeOf = async (path) => (await stat(path)).size;

for (const file of files.filter((f) => /\.(avif|jpe?g|png)$/.test(f))) {
  const size = await sizeOf(file);
  if (size > limits.image) failures.push(`${relative(dist, file)} is ${kb(size)} (image limit ${kb(limits.image)})`);
}
for (const file of files.filter((f) => f.endsWith('.mp4'))) {
  const size = await sizeOf(file);
  if (size > limits.video) failures.push(`${relative(dist, file)} is ${kb(size)} (video limit 6 MB)`);
}

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="(\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
  let code = gzipSync(html).length;
  for (const ref of new Set(refs)) code += gzipSync(await readFile(join(dist, ref))).length;

  // For each <picture>/<img>, the browser downloads one file: count the
  // largest AVIF candidate (what a modern browser on a wide screen fetches),
  // plus video posters, fonts and the favicon.
  const imageRefs = new Set();
  for (const [, srcset] of html.matchAll(/<source type="image\/avif" srcSet="([^"]+)"/gi)) {
    const candidates = srcset.split(',').map((c) => c.trim().split(' ')[0]);
    imageRefs.add(candidates.at(-1));
  }
  for (const [, poster] of html.matchAll(/poster="([^"]+)"/g)) imageRefs.add(poster);
  for (const [, font] of html.matchAll(/href="(\/fonts\/[^"]+)"/g)) imageRefs.add(font);

  let page = code;
  for (const ref of imageRefs) page += await sizeOf(join(dist, ref));
  // The non-preloaded font faces the CSS may also pull in.
  for (const font of (await readdir(join(dist, 'fonts'))).filter((f) => f.endsWith('.woff2'))) {
    if (![...imageRefs].some((r) => r.endsWith(font))) page += await sizeOf(join(dist, 'fonts', font));
  }

  const name = relative(dist, file);
  console.log(`${name.padEnd(22)} code ${kb(code).padStart(9)}   page ${kb(page).padStart(9)}`);
  if (code > limits.code) failures.push(`${name}: HTML+CSS+JS ${kb(code)} gzipped (limit ${kb(limits.code)})`);
  if (page > limits.page) failures.push(`${name}: page weight ${kb(page)} (limit ${kb(limits.page)})`);
}

if (failures.length) {
  console.error(`\nOver budget:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('\nWithin budget.');
