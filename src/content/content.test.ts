import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { media } from './media.generated';
import { pages } from './pages';
import { introduction, profile } from './profile';
import { projects } from './projects';
import { employmentIntro, roles } from './employment';
import { clips, photos } from './spotting';

// Types catch shape errors at compile time; these catch the content errors
// a type can't: empty strings, broken references, missing files, a URL typo.

// A path, not a URL: under jsdom the global URL is jsdom's, which fs rejects.
const publicFile = (path: string) => resolve(process.cwd(), `public${path}`);
const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe('profile', () => {
  it('keeps the home introduction within 150–250 words', () => {
    const count = words(introduction.join(' '));
    expect(count).toBeGreaterThanOrEqual(150);
    expect(count).toBeLessThanOrEqual(250);
  });

  it('links a résumé that exists in /public under a versioned name', () => {
    expect(profile.resume.href).toMatch(/-\d{4}-\d{2}\.pdf$/);
    expect(existsSync(publicFile(profile.resume.href))).toBe(true);
  });
});

describe('projects', () => {
  it('has three products with unique, URL-safe ids', () => {
    expect(projects).toHaveLength(3);
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it.each(projects.map((p) => [p.name, p] as const))('%s has a live https URL, prose and a stack', (_, project) => {
    expect(new URL(project.url).protocol).toBe('https:');
    expect(project.body.length).toBeGreaterThanOrEqual(2);
    expect(project.body.length).toBeLessThanOrEqual(5);
    expect(project.stack.length).toBeGreaterThan(0);
    for (const image of project.images) expect(image.alt.trim().length).toBeGreaterThan(20);
  });

  it('gives Plane Spotter Board its facts list', () => {
    const planeSpotter = projects.find((p) => p.id === 'plane-spotter-board');
    expect(planeSpotter?.facts?.map((f) => f.value)).toEqual(['5', '360', '1', '0']);
  });
});

describe('employment', () => {
  it('lists roles newest first with valid month ranges', () => {
    expect(employmentIntro.length).toBeGreaterThan(0);
    const starts = roles.map((r) => r.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    for (const role of roles) {
      expect(role.start).toMatch(/^\d{4}-\d{2}$/);
      if (role.end) expect(role.end >= role.start).toBe(true);
    }
    expect(roles.filter((r) => r.end === null)).toHaveLength(1);
  });
});

describe('spotting', () => {
  it('describes every photograph and names the aircraft and airport', () => {
    for (const photo of photos) {
      expect(photo.alt.trim().length).toBeGreaterThan(20);
      expect(photo.aircraft).not.toBe('');
      expect(photo.airport).not.toBe('');
      expect(photo.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('has at most three clips, each with its video and poster on disk', () => {
    expect(clips.length).toBeLessThanOrEqual(3);
    for (const clip of clips) {
      expect(existsSync(publicFile(`/media/${clip.id}.mp4`))).toBe(true);
      expect(existsSync(publicFile(`/media/${clip.id}-poster.jpg`))).toBe(true);
    }
  });
});

describe('media manifest', () => {
  it('has an AVIF and a JPEG on disk for every listed width', () => {
    for (const [id, entry] of Object.entries(media)) {
      for (const width of entry.widths) {
        expect(existsSync(publicFile(`/media/${id}-${width}.avif`)), `${id}-${width}.avif`).toBe(true);
        expect(existsSync(publicFile(`/media/${id}-${width}.jpg`)), `${id}-${width}.jpg`).toBe(true);
      }
    }
  });
});

describe('page metadata', () => {
  it('gives every page a distinct title and a description of useful length', () => {
    const all = Object.values(pages);
    expect(new Set(all.map((p) => p.title)).size).toBe(all.length);
    for (const page of all) {
      expect(page.description.length).toBeGreaterThan(30);
      expect(page.description.length).toBeLessThanOrEqual(200);
    }
  });
});
