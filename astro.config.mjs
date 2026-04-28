// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hesedhouse.net',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: '_assets',
  },
});
