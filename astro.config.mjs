// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://jordan-home.github.io',
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  build: {
    assets: 'assets',
  },
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});