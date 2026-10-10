// @ts-check
import { defineConfig } from 'astro/config';

// Alte Hugo-URLs zeigen auf die passenden Kapitel des One-Pagers.
const legacy = {
  '/about': '/#about',
  '/testlabor': '/#labor',
  '/workshops': '/#workshops',
  '/kontakt': '/#kontakt',
  '/apps': '/#apps',
};

export default defineConfig({
  site: 'https://tsojka.com',
  trailingSlash: 'ignore',
  redirects: legacy,
  build: {
    inlineStylesheets: 'auto',
  },
});
