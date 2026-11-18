import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Content Layer. NOTE: this file MUST live at src/content.config.ts
// (the legacy src/content/config.ts is not loaded → silently dead).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // Syndication: point rel=canonical + og:url off-site to the original source.
    canonicalUrl: z.string().url().optional(),
    // Per-post social image (root-relative, e.g. '/og-foo.png'). Defaults site-wide.
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog };
