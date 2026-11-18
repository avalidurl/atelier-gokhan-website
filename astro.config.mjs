import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://gokhan.vc',
  output: 'static',
  trailingSlash: 'never',
  // Astro 7 defaults compressHTML to 'jsx', which drops spaces between inline
  // elements. Keep the Astro 6 HTML-aware compression.
  compressHTML: true,
  // Emit /terms.html (not /terms/index.html) so Cloudflare Pages serves slash-free
  // URLs that match our no-trailing-slash canonicals — no 308 redirect hop.
  build: { format: 'file' },
  integrations: [sitemap()],
  markdown: {
    // Astro 7 defaults to Sätteri, which ignores rehype plugins. Stay on unified
    // so the heading permalinks keep working. rehype-slug must run FIRST: Astro's
    // built-in id assignment runs after user rehype plugins.
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { className: ['hanchor'], ariaLabel: 'Link to this section' },
            content: { type: 'text', value: '#' },
          },
        ],
      ],
    }),
  },
});
