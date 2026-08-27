import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import clerk from '@clerk/astro';
import cloudflare from '@astrojs/cloudflare';
import { loadEnv } from 'vite';

// Astro does not expose import.meta.env while evaluating this config. Load
// the public Clerk key explicitly so local development and local production
// previews use the ignored `.env`/`.env.local` value. Cloudflare builds can
// still provide an environment value, and otherwise use the public live-key
// fallback because the ignored local env file is not present in CI.
const configMode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const loadedEnv = loadEnv(configMode, process.cwd(), '');
const productionFallback = 'pk_live_Y2xlcmsucGhpbG9zb3BoeXNwcmVhZC5saXZlJA';
const publishableKey = process.env.PUBLIC_CLERK_PUBLISHABLE_KEY
  ?? loadedEnv.PUBLIC_CLERK_PUBLISHABLE_KEY
  ?? productionFallback;

export default defineConfig({
  site: 'https://philosophyspread.live',
  trailingSlash: 'always',
  integrations: [mdx(), clerk({ publishableKey })],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  adapter: cloudflare(),
  output: 'server',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      optimizeDeps: {
        exclude: ['@clerk/astro', '@clerk/astro/components'],
      },
    },
  },
});
