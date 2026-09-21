import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://monarchpassapts.com',
  output: 'static',
  integrations: [react(), sitemap()],
  build: {
    format: 'directory',
  },
});
