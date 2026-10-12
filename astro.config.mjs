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
  // Cloudflare tunnel (trycloudflare.com) se access allow karo
  // trycloudflare URLs random hote hain, isliye host check poori tarah off
  server: {
    allowedHosts: true,
  },
  // Dev: PHP backend (php -S 127.0.0.1:8000) ko same-origin se proxy karo
  vite: {
    server: {
      proxy: {
        '/backend': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  },
});
