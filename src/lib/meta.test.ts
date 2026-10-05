import { metaForPath, renderHeadTags } from './meta';
import { pages } from '../content/pages';
import { formatDate, formatMonth } from './format';

describe('metaForPath', () => {
  it('matches known paths, with or without a trailing slash', () => {
    expect(metaForPath('/')).toBe(pages.home);
    expect(metaForPath('/work')).toBe(pages.work);
    expect(metaForPath('/work/')).toBe(pages.work);
  });

  it('falls back to the not-found page', () => {
    expect(metaForPath('/nope')).toBe(pages.notFound);
  });
});

describe('renderHeadTags', () => {
  it('writes a canonical URL and Open Graph tags for indexable pages', () => {
    const head = renderHeadTags(pages.work);
    expect(head).toContain('<title>Work — Sasha Chernyavsky</title>');
    expect(head).toContain('<link rel="canonical" href="https://astreys.com/work">');
    expect(head).toContain('<meta property="og:image" content="https://astreys.com/og/astreys-og.png">');
  });

  it('marks the not-found page noindex, with no canonical', () => {
    const head = renderHeadTags(pages.notFound);
    expect(head).toContain('noindex');
    expect(head).not.toContain('rel="canonical"');
  });

  it('escapes HTML in content', () => {
    const head = renderHeadTags({ path: '/x', title: 'A <b> & "c"', description: 'd'.repeat(40) });
    expect(head).toContain('<title>A &lt;b&gt; &amp; &quot;c&quot;</title>');
  });
});

describe('formatDate', () => {
  it('formats days and months without depending on locale data', () => {
    expect(formatDate('2020-03-08')).toBe('8 March 2020');
    expect(formatDate('2024-11')).toBe('November 2024');
    expect(formatMonth('2024-11')).toBe('Nov 2024');
  });
});
