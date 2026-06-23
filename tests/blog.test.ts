import { describe, expect, it } from 'vitest';
import {
  isPublished,
  publishedPosts,
  sortByPubDateDesc,
  postPath,
  formatPostDate,
  isoDate,
  toRssItems,
  type PostLike,
} from '../src/utils/blog';

const mk = (id: string, pubDate: string, draft = false): PostLike => ({
  id,
  data: { title: `Title ${id}`, description: `Desc ${id}`, pubDate: new Date(pubDate), draft },
});

const older = mk('a', '2026-01-01');
const newer = mk('b', '2026-06-01');
const draft = mk('d', '2026-03-01', true);

describe('blog: publish filtering', () => {
  it('treats missing/false draft as published, true as not', () => {
    expect(isPublished(older)).toBe(true);
    expect(isPublished(draft)).toBe(false);
  });

  it('publishedPosts excludes drafts', () => {
    const out = publishedPosts([older, draft, newer]);
    expect(out.map((p) => p.id)).toEqual(['b', 'a']);
    expect(out.find((p) => p.id === 'd')).toBeUndefined();
  });
});

describe('blog: ordering', () => {
  it('sorts newest-first by pubDate', () => {
    expect(sortByPubDateDesc([older, newer]).map((p) => p.id)).toEqual(['b', 'a']);
    expect(sortByPubDateDesc([newer, older]).map((p) => p.id)).toEqual(['b', 'a']);
  });
});

describe('blog: paths and dates', () => {
  it('builds root-relative post paths with no trailing slash', () => {
    expect(postPath(older)).toBe('/blog/a');
  });

  it('formats dates human-readably (not raw ISO)', () => {
    const s = formatPostDate(new Date('2026-06-22T00:00:00Z'));
    expect(s).toBe('June 22, 2026');
    expect(s).not.toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('emits a stable date-only datetime for <time>', () => {
    expect(isoDate(new Date('2026-06-22T13:45:00Z'))).toBe('2026-06-22');
  });
});

describe('blog: RSS item mapping', () => {
  it('maps published posts newest-first to rss items with relative links', () => {
    const items = toRssItems([older, draft, newer]);
    expect(items.map((i) => i.link)).toEqual(['/blog/b', '/blog/a']);
    expect(items.every((i) => i.title && i.description && i.pubDate instanceof Date)).toBe(true);
    // no draft leaks into the feed
    expect(items.find((i) => i.link === '/blog/d')).toBeUndefined();
  });
});
