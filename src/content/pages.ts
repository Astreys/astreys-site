export interface PageMeta {
  /** Canonical path, no query string or trailing slash. */
  path: string;
  title: string;
  description: string;
}

export const SITE_ORIGIN = 'https://astreys.com';
export const OG_IMAGE = { path: '/og/astreys-og.png', width: 1200, height: 630 } as const;

export const pages = {
  home: {
    path: '/',
    title: 'Sasha Chernyavsky — senior front-end developer, Toronto',
    description:
      'Senior front-end developer in Toronto. Fifteen years of React and TypeScript, three products built end to end, and an accessibility habit from regulated banking work.',
  },
  work: {
    path: '/work',
    title: 'Work — Sasha Chernyavsky',
    description:
      'Products I built end to end — Plane Spotter Board, PanMilli, eshee esthetic — and fifteen years of front-end work on design systems and accessible interfaces.',
  },
  spotting: {
    path: '/spotting',
    title: 'Spotting — Sasha Chernyavsky',
    description:
      'My plane-spotting photographs and clips from Toronto Pearson, and the reason Plane Spotter Board exists.',
  },
  notFound: {
    path: '/404',
    title: 'Page not found — Sasha Chernyavsky',
    description: 'There is no page at this address.',
  },
} as const satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof pages;
