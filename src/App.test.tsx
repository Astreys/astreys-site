import { fireEvent, screen, within } from '@testing-library/react';
import { renderAt } from './test/renderAt';
import { projects } from './content/projects';

describe('routing', () => {
  it.each([
    ['/', 'Turning ideas'],
    ['/work', 'My work'],
    ['/spotting', 'Spotting'],
  ])('renders %s with exactly one h1', (path, heading) => {
    renderAt(path);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(heading);
  });

  it('renders the not-found page for an unknown path', () => {
    renderAt('/this-page-does-not-exist');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(screen.getByRole('link', { name: 'home page' })).toHaveAttribute('href', '/');
  });

  it('never renders query parameters into the page', () => {
    const { container } = renderAt('/?from=okta-campaign');
    expect(container.textContent).not.toContain('okta');
    expect(container.innerHTML).not.toContain('okta');
  });

  it('marks the current page in the main navigation', () => {
    renderAt('/work');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});

describe('landmarks', () => {
  it('has a skip link that targets main', () => {
    renderAt('/');
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('work page', () => {
  it('renders one entry per project, each headed by its live URL', () => {
    renderAt('/work');
    const entries = screen.getAllByRole('article');
    expect(entries).toHaveLength(projects.length);

    projects.forEach((project, index) => {
      const entry = entries[index];
      if (!entry) throw new Error(`missing entry for ${project.id}`);
      expect(within(entry).getByRole('heading', { level: 3 })).toHaveTextContent(project.name);
      expect(within(entry).getByRole('link', { name: new RegExp(project.url.replace(/^https:\/\//, '').replace(/\/$/, '')) })).toHaveAttribute('href', project.url);
    });
  });

  it('gives every image alt text and intrinsic dimensions', () => {
    renderAt('/work');
    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('alt')?.length).toBeGreaterThan(0);
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
    }
  });
});

describe('home page', () => {
  it('links each product to its entry on /work', () => {
    renderAt('/');
    for (const project of projects) {
      expect(screen.getByRole('link', { name: project.name })).toHaveAttribute('href', `/work#${project.id}`);
    }
  });
});

describe('external links', () => {
  it.each(['/', '/work', '/spotting'])('carry rel="noopener" on %s', (path) => {
    const { container } = renderAt(path);
    const external = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')];
    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link.rel.split(' ')).toContain('noopener');
    }
  });
});

describe('spotting page', () => {
  it('loads no video until asked, then plays it with native controls', () => {
    const { container } = renderAt('/spotting');
    expect(container.querySelector('video')).toBeNull();

    const playLinks = screen.getAllByRole('link', { name: /^Play video:/ });
    expect(playLinks.length).toBeGreaterThan(0);
    const [first] = playLinks;
    if (!first) throw new Error('no play link');
    // Without JavaScript the link itself opens the clip.
    expect(first.getAttribute('href')).toMatch(/^\/media\/.+\.mp4$/);
    expect(within(first).getByRole('presentation', { hidden: true })).toHaveAttribute('loading', 'lazy');

    fireEvent.click(first);
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('controls');
    expect(container.querySelectorAll('video')).toHaveLength(1);
  });
});
