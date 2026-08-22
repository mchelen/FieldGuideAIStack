// @ts-check
import { defineConfig } from 'astro/config';
import { rehypeNodeLinks } from './plugins/rehype-node-links.mjs';
import { rehypeCitations } from './plugins/rehype-citations.mjs';

// GitHub Pages project site: https://mchelen.github.io/FieldGuideAIStack/
const base = '/FieldGuideAIStack';

export default defineConfig({
  site: 'https://mchelen.github.io',
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    rehypePlugins: [[rehypeNodeLinks, { base }], rehypeCitations],
  },
});
