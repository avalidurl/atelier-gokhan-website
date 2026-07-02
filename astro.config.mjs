import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://gokhan.vc',
  output: 'static',
  trailingSlash: 'never',
  // Emit /terms.html (not /terms/index.html) so Cloudflare Pages serves slash-free
  // URLs that match our no-trailing-slash canonicals — no 308 redirect hop.
  build: { format: 'file' },
  integrations: [sitemap()],
  markdown: {
    // Append a visible hover "#" permalink to each heading. rehype-slug must run
    // FIRST so heading ids exist when autolink-headings appends: Astro's built-in
    // id assignment runs AFTER user rehypePlugins, so autolink alone sees no id.
    // Build-time only — no runtime JS — so it stays CSP-clean. Styled via .hanchor
    // in global.css.
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
  },
});
