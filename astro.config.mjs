// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Static by default (great SEO, cheap hosting). Individual routes opt into
// on-demand SSR with `export const prerender = false` (contact API, Keystatic).
// The Cloudflare adapter runs those on Workers.
export default defineConfig({
  site: 'https://wayleem.com',
  output: 'static',
  adapter: cloudflare({
    platformProxy: { enabled: true }, // local dev reads .dev.vars as runtime env
    imageService: 'compile',
  }),
  // react() must come before keystatic(); keystatic() injects the admin UI.
  integrations: [react(), mdx(), sitemap(), keystatic()],
});
