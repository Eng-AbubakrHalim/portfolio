// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Repo is not <user>.github.io, so the site lives under /portfolio.
export default defineConfig({
  site: 'https://eng-abubakrhalim.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/styleguide') }),
  ],
  fonts: [
    // Display/body candidates (styleguide compares both; one is dropped after review)
    {
      name: 'Familjen Grotesk',
      cssVariable: '--font-familjen',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Instrument Sans',
      cssVariable: '--font-instrument',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    // Mono candidates
    {
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      provider: fontProviders.fontsource(),
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
});
