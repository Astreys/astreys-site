import type { MediaId } from './media.generated';

export interface Photo {
  id: MediaId;
  alt: string;
  aircraft: string;
  airline?: string;
  registration?: string;
  airport: string;
  /** "YYYY-MM-DD" */
  date: string;
  note?: string;
  /**
   * Grid placement from 48rem up: 'wide' spans both columns (landscape or
   * panoramic), 'tall' spans two rows (portrait). Default is one cell.
   */
  layout?: 'wide' | 'tall';
}

export interface Clip {
  /** Matches public/media/{id}.mp4 and {id}-poster.jpg. */
  id: string;
  title: string;
  description: string;
  airport: string;
  date: string;
  durationSeconds: number;
  width: number;
  height: number;
  /** Clips are silent (audio stripped), so no caption track is needed. */
  hasAudio: false;
}

export const photos: readonly Photo[] = [
  {
    id: 'an225-yyz',
    alt: 'The six-engined Antonov An-225 Mriya on a Pearson taxiway, white with a blue and yellow cheatline, as rows of parked cars and onlookers line the fence in the foreground.',
    aircraft: 'Antonov An-225 Mriya',
    registration: 'UR-82060',
    airport: 'Toronto Pearson (YYZ)',
    date: '2020-05-31',
    note: 'The only one ever completed, here delivering medical supplies. It was destroyed at Hostomel in 2022.',
    layout: 'wide',
  },
  {
    id: 'ac-787-c-fksv',
    alt: 'An Air Canada Boeing 787-9 seen from below, gear down and wings flexed upward, low over an empty road beside the airfield fence under a bright blue sky.',
    aircraft: 'Boeing 787-9',
    airline: 'Air Canada',
    registration: 'C-FKSV',
    airport: 'Toronto Pearson (YYZ)',
    date: '2020-03-08',
    layout: 'tall',
  },
  {
    id: 'klm-747-approach',
    alt: 'A KLM Boeing 747-400 in light blue, with the airline’s centenary “100” titles, on approach with its landing gear down against a clear sky.',
    aircraft: 'Boeing 747-400',
    airline: 'KLM',
    airport: 'Toronto Pearson (YYZ)',
    date: '2020-03-08',
    note: 'Wearing the airline’s centenary titles.',
  },
  {
    id: 'klm-747-overhead',
    alt: 'The same KLM 747-400 from behind and below as it passes overhead, sunlight glinting off the fuselage, a light pole in the corner of the frame.',
    aircraft: 'Boeing 747-400',
    airline: 'KLM',
    airport: 'Toronto Pearson (YYZ)',
    date: '2020-03-08',
  },
  {
    id: 'klm-747-touchdown',
    alt: 'The KLM 747-400 seconds from touchdown, seen head-on through the perimeter fence across the runway.',
    aircraft: 'Boeing 747-400',
    airline: 'KLM',
    airport: 'Toronto Pearson (YYZ)',
    date: '2020-03-08',
    layout: 'wide',
  },
];

export const clips: readonly Clip[] = [
  {
    id: 'lh-747-landing',
    title: 'Lufthansa 747-400 on short final',
    description: 'From overhead to the runway, filmed at 120 frames per second and slowed to half speed.',
    airport: 'Toronto Pearson (YYZ)',
    date: '2020-03-08',
    durationSeconds: 24,
    width: 1280,
    height: 720,
    hasAudio: false,
  },
  {
    id: 'widebody-overhead',
    title: 'Air Canada widebody overhead',
    description: 'Passing low over the approach path east of the airfield.',
    airport: 'Toronto Pearson (YYZ)',
    date: '2021-08-14',
    durationSeconds: 12,
    width: 1280,
    height: 720,
    hasAudio: false,
  },
];

/** The panoramic photograph used as the Spotting page's banner. */
export const bannerPhotoId = 'klm-747-touchdown' satisfies Photo['id'];
