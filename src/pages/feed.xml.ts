import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { toRssItems } from '../utils/blog';

// RSS 2.0 feed for the blog. Drafts are excluded and items are newest-first
// (handled by toRssItems → publishedPosts). @astrojs/rss resolves each item's
// root-relative `link` against `site`, yielding absolute https://gokhan.vc/blog/<slug>.
export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: `${site.name} — Blog`,
    description: `Writing and notes from ${site.name}.`,
    site: context.site ?? site.url,
    items: toRssItems(posts),
    // Match the site's trailingSlash:'never' so item links equal each post's canonical.
    trailingSlash: false,
    customData: `<language>en</language>`,
  });
}
