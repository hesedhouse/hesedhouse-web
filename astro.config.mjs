// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://hesedhouse.net',
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/bricks') && !page.includes('/keystatic'),
    }),
    react(),
    keystatic(),
  ],
  build: {
    assets: '_assets',
  },
});
