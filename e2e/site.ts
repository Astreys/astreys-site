/** Shared expectations for the end-to-end suite. */

export const routes = [
  { path: '/', title: 'Sasha Chernyavsky — senior front-end developer, Toronto' },
  { path: '/work', title: 'Work — Sasha Chernyavsky' },
  { path: '/spotting', title: 'Spotting — Sasha Chernyavsky' },
] as const;

export const notFound = { path: '/no-such-page', title: 'Page not found — Sasha Chernyavsky' } as const;

/**
 * Every host the site may link to. A link anywhere else is a typo until
 * proven otherwise: add the host here deliberately when adding a link.
 */
export const allowedExternalHosts = new Set([
  'plane-spotter-board.netlify.app',
  'panmilli.com',
  'esheeesthetic.com',
  'eshee.netlify.app',
  'github.com',
  'www.linkedin.com',
]);
