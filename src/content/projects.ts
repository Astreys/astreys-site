import type { MediaId } from './media.generated';

export interface ProjectImage {
  id: MediaId;
  alt: string;
  caption?: string;
}

export interface ProjectFact {
  value: string;
  label: string;
}

export interface Project {
  /** Used as the fragment on /work, so keep it stable once published. */
  id: string;
  name: string;
  /** Live product URL, shown as visible text beside the name. */
  url: string;
  /** One line for the home page. */
  summary: string;
  body: readonly string[];
  stack: readonly string[];
  facts?: readonly ProjectFact[];
  images: readonly ProjectImage[];
  links?: readonly { label: string; url: string }[];
  note?: string;
}

export const projects: readonly Project[] = [
  {
    id: 'plane-spotter-board',
    name: 'Plane Spotter Board',
    url: 'https://plane-spotter-board.netlify.app/',
    summary: 'A live board of aircraft on approach to Toronto Pearson: one server, any number of browsers, no database.',
    body: [
      'Plane Spotter Board answers one question: is anything worth driving to the airport fence for in the next half hour? It lists aircraft on approach to an airport, filterable by airframe — quads, double-deckers, widebodies, freighters — alongside the runway direction in use, the field’s weather and where each flight came from.',
      'The first version had every open browser poll the ADS-B aggregators itself. That does not survive more than a handful of users: the community APIs are rate-limited, and upstream load grew with every tab. Now one server polls each airport every fifteen seconds and fans the result out to every browser over Server-Sent Events. Upstream cost is a function of how many airports are watched, not how many people are watching, and nothing on a request path ever calls upstream.',
      'There is no database, because the data has a useful life of seconds — an aircraft on final is on the ground two minutes later. The server keeps the last good snapshot in memory; when every upstream host fails, it keeps serving that snapshot, marked stale with its age, while it backs off.',
      'The tests run against captured real API responses rather than hand-written mocks. A mock only tests my assumption about a payload; a recording of what the aggregator actually returned over Pearson tests the payload. Looking at real traffic is also how the board learned that a flight number’s stored route is often not the route being flown — so it shows the route as scheduled instead of asserting it.',
    ],
    stack: ['TypeScript', 'Fastify', 'Server-Sent Events', 'Vue 3', 'Vite', 'Vitest'],
    facts: [
      { value: '5', label: 'upstream sources' },
      { value: '360', label: 'tests' },
      { value: '1', label: 'server poll serving every browser' },
      { value: '0', label: 'databases' },
    ],
    images: [
      {
        id: 'plane-spotter-board',
        alt: 'Plane Spotter Board for Toronto Pearson at dusk: ten inbound flights, the nearest an Air Canada A220 from Los Angeles two minutes out, under the landing direction, airframe filter chips, a weather card and a list of airlines inbound.',
      },
    ],
    links: [{ label: 'Source on GitHub', url: 'https://github.com/Astreys/plane-spotter-board' }],
    note: 'The API runs on my own hardware, so the live board is occasionally in its error state. The source and the screenshot above show what it does when it is up.',
  },
  {
    id: 'panmilli',
    name: 'PanMilli',
    url: 'https://panmilli.com/',
    summary: 'An online store for my handcrafted accessories brand, with its catalogue synced from Etsy.',
    body: [
      'PanMilli is the shop for my handcrafted hats, crowns and accessories. I designed and built it end to end: the storefront, checkout, order emails and the admin dashboard behind them.',
      'Etsy stays the single source of truth for inventory. Firebase Cloud Functions sync listings — prices, images, variations and personalisation options — through the Etsy Open API, so a product is edited in one place and the storefront never waits on Etsy to render.',
      'Payments go through Stripe’s Payment Element, and an order is only recorded and emailed once Stripe’s webhook confirms the payment. Pages are pre-rendered for search engines, and every pull request runs lint, unit tests and Playwright end-to-end tests before it can merge. I also built the brand’s companion Shopify store.',
    ],
    stack: ['React 19', 'Vite', 'React Router', 'Zustand', 'Firebase Cloud Functions', 'Firestore', 'Stripe', 'Etsy Open API', 'Playwright'],
    images: [
      {
        id: 'panmilli-products',
        alt: 'The PanMilli catalogue: category filters with product counts above a grid of halo crowns, knot pillows and hats, each with a price, review rating and Add to Cart button.',
      },
    ],
  },
  {
    id: 'eshee-esthetic',
    name: 'eshee esthetic',
    url: 'https://esheeesthetic.com/',
    summary: 'A skincare business’s website, designed, built and maintained by me as an ongoing client engagement.',
    body: [
      'The website for E’shee Clinical Esthetic, a skincare business. I designed it, built it, and have maintained it ever since — an ongoing engagement rather than a launch-and-leave project.',
      'The live site carries the product catalogue, articles and a glossary, and separate sections for professionals and distributors. It is the other half of client work: keeping a site running and current for years after launch.',
      'Its replacement is in preview: a React rebuild with a cleaner storefront — serums, creams, peels and complete systems — shown above. Checkout and accounts are switched off in the preview until it goes live.',
    ],
    stack: ['AngularJS', 'jQuery', 'Bootstrap', 'PHP', 'React (redesign)'],
    images: [
      {
        id: 'eshee-esthetic',
        alt: 'The E’shee Clinical Esthetic redesign in preview: a plum navigation bar with product categories over a large purple DNA-helix hero image and the tagline “Let your youth stay with you”.',
      },
    ],
    links: [{ label: 'Redesign preview', url: 'https://eshee.netlify.app/' }],
  },
];
