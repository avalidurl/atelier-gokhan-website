import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gokhan.vc',
  output: 'static',
  trailingSlash: 'never',
  // Emit /terms.html (not /terms/index.html) so Cloudflare Pages serves slash-free
  // URLs that match our no-trailing-slash canonicals — no 308 redirect hop.
  build: { format: 'file' },
  integrations: [sitemap()],
});
