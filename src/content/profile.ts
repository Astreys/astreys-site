export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  sourceRepo: string;
  resume: { href: string; sizeKb: number };
  availability: string;
}

export const profile: Profile = {
  name: 'Sasha Chernyavsky',
  role: 'Senior front-end developer',
  location: 'Toronto',
  email: 'astreys@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sasha-chernyavsky-831ab738',
  github: 'https://github.com/Astreys',
  sourceRepo: 'https://github.com/Astreys/astreys-site',
  // Versioned filename: a new résumé gets a new URL, so no stale caches.
  resume: { href: '/sasha-chernyavsky-resume-2026-10.pdf', sizeKb: 69 },
  availability: 'Available from November 2026 — Toronto, hybrid or remote.',
};

/**
 * The home page's first-person piece. Kept here rather than in JSX so its
 * length can be checked by a test (SPEC §6.1: 150–250 words).
 */
export const introduction: readonly string[] = [
  'I have been building for the web for fifteen years, most of it inside banks and financial platforms, where an interface has to be accessible, fast and correct before it is allowed to be clever. That shaped how I work more than any framework did.',
  'The work I like best is where the front end and the thing behind it have to be designed together. Plane Spotter Board started with every open browser polling for flight data; it became one small server that polls once and streams to everyone. I would rather change an architecture than tune around a bad one.',
  'I test against real data rather than my assumptions about it, and I care about the unglamorous parts — keyboard focus, contrast, what the screen says when a request fails — because that is where people actually meet the software.',
  'I use AI-assisted, spec-driven development at work and at home. It makes me faster at the parts I already understand; it does not replace understanding them.',
  'Outside work I photograph aircraft at Toronto Pearson, which is why Plane Spotter Board exists.',
];
