// Pure helpers for the blog pipeline — deliberately free of any `astro:content`
// import so they are unit-testable in vitest without the Astro runtime. The
// Astro pages/feed pass real collection entries (which structurally satisfy
// these shapes) into these functions.

export interface PostLike {
  readonly id: string;
  readonly data: {
    readonly title: string;
    readonly description: string;
    readonly pubDate: Date;
    readonly updatedDate?: Date;
    readonly draft?: boolean;
  };
}

/** Published = not a draft. Drafts are excluded from index, post routes, and feed. */
export function isPublished(post: PostLike): boolean {
  return post.data.draft !== true;
}

/** Newest-first by pubDate. */
export function sortByPubDateDesc<T extends PostLike>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Published posts, newest-first — the canonical listing order. */
export function publishedPosts<T extends PostLike>(posts: readonly T[]): T[] {
  return sortByPubDateDesc(posts.filter(isPublished));
}

/** Root-relative post path. trailingSlash:'never' → no trailing slash. */
export function postPath(post: PostLike): string {
  return `/blog/${post.id}`;
}

/** Human-readable date, e.g. "June 22, 2026" (never a raw ISO string). */
export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Machine date for <time datetime="…"> (date-only, stable). */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface RssItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
}

/** Map published posts (newest-first) to @astrojs/rss item objects. */
export function toRssItems(posts: readonly PostLike[]): RssItem[] {
  return publishedPosts(posts).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    link: postPath(post),
  }));
}
