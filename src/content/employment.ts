export interface Role {
  company: string;
  title: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null for the current role. */
  end: string | null;
  summary: string;
}

/**
 * Prose only. Employment work is described at the level of the résumé and no
 * further: no employer imagery, no figures that are not already public.
 */
export const employmentIntro: readonly string[] = [
  'Most of my fifteen years have been spent on large, consumer-facing applications in regulated financial environments, where performance, accessibility and cross-browser reliability are requirements rather than nice-to-haves.',
  'A recurring thread is shared components. I contribute to CIBC’s corporate component library today. Before that I delivered reusable UI components at RBC, extended the corporate component set at NielsenIQ, led LoyaltyOne’s migration from AngularJS to React, and built a library of reusable React components at Citco. At Morneau Shepell I designed UI concepts and then built them.',
  'Accessibility has been part of the job since Morneau Shepell, where I brought markup into compliance with WCAG 2.0 and AODA; at CIBC every feature ships to strict accessibility requirements with analytics built in. These days I also work with AI-assisted, spec-driven development, using GitHub Copilot and GitHub Spec Kit.',
];

export const roles: readonly Role[] = [
  {
    company: 'CIBC',
    title: 'Senior Specialty Developer (Front End)',
    start: '2024-11',
    end: null,
    summary: 'Client-facing digital banking in Vue 3 and TypeScript — a new login system, client information, data sharing between applications — and components for the corporate library.',
  },
  {
    company: 'RBC',
    title: 'Senior Front-end Developer',
    start: '2023-01',
    end: '2024-09',
    summary: 'Data-visualisation components and large-dataset export in React and TypeScript, integrated with .NET APIs.',
  },
  {
    company: 'NielsenIQ',
    title: 'Senior Front-end Developer',
    start: '2021-09',
    end: '2022-11',
    summary: 'Replaced native Qlik components with custom ones for faster page loads, and extended the corporate Bootstrap component set.',
  },
  {
    company: 'Citi',
    title: 'Senior Front-end Developer',
    start: '2020-02',
    end: '2021-09',
    summary: 'A React analytics widget turning tables into interactive 2D and 3D models with D3, over an ELK presentation layer.',
  },
  {
    company: 'LoyaltyOne (AIR MILES Reward Program)',
    title: 'Senior Front-end Developer',
    start: '2018-11',
    end: '2020-01',
    summary: 'Led the migration from AngularJS to React over Node.js microservices; D3 visualisation and in-app PDF export.',
  },
  {
    company: 'Citco Group',
    title: 'UI/UX Front End Developer',
    start: '2015-08',
    end: '2018-11',
    summary: 'A reusable React component library for a data-driven financial platform, and the team’s Jest and Selenium testing standards.',
  },
  {
    company: 'Morneau Shepell',
    title: 'UI/UX Developer',
    start: '2013-05',
    end: '2015-08',
    summary: 'UI concepts built in AngularJS, JSON-driven form generation, and WCAG 2.0 and AODA compliance work.',
  },
  {
    company: 'Canadian Tire',
    title: 'Front End Web Developer',
    start: '2011-10',
    end: '2013-05',
    summary: 'New features and a reusable refactor of the presentation layer.',
  },
  {
    company: 'Torstar Digital',
    title: 'Web Developer',
    start: '2010-05',
    end: '2011-09',
    summary: 'Components and widgets; migrated ASP Classic applications to .NET.',
  },
];
