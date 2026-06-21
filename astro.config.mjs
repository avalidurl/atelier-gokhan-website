import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gokhan.vc',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
