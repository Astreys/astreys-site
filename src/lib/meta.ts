import { OG_IMAGE, SITE_ORIGIN, pages, type PageMeta } from '../content/pages';

const byPath = new Map<string, PageMeta>(Object.values(pages).map((page) => [page.path, page]));

/** Query strings never reach this: callers pass a pathname only (SPEC §12). */
export function metaForPath(pathname: string): PageMeta {
  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return byPath.get(normalised) ?? pages.notFound;
}

export function canonicalUrl(meta: PageMeta): string {
  return SITE_ORIGIN + (meta.path === '/' ? '/' : meta.path);
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The per-page <head> tags written into each pre-rendered HTML file. */
export function renderHeadTags(meta: PageMeta): string {
  const isNotFound = meta === pages.notFound;
  const url = canonicalUrl(meta);
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    isNotFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Sasha Chernyavsky">',
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SITE_ORIGIN}${OG_IMAGE.path}">`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}">`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}">`,
    '<meta property="og:image:alt" content="Sasha Chernyavsky, senior front-end developer, Toronto. astreys.com">',
    '<meta property="og:locale" content="en_CA">',
    '<meta name="twitter:card" content="summary_large_image">',
  ];
  return tags.join('\n    ');
}
