import { visit } from 'unist-util-visit';

const BARE_ID = /^[a-z0-9][a-z0-9-]*$/;
// Root-relative links to site pages that are not nodes -- /compare, /graph.
// Without this they render as absolute paths that ignore the deploy base and
// 404 on GitHub Pages, which is exactly what happened first time.
const SITE_PATH = /^\/[a-z0-9][a-z0-9/-]*$/;

/**
 * Content authors write cross-references as `[harness](harness)` -- a bare node
 * id, with no path and no knowledge of the deploy base. This rewrites those to
 * real URLs at build time so the same markdown works locally, on GitHub Pages
 * under a subpath, and anywhere else.
 *
 * Anything that already looks like a URL, an anchor, or a path is left alone.
 */
export function rehypeNodeLinks({ base = '' } = {}) {
  const prefix = `${base.replace(/\/$/, '')}/nodes/`;
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (BARE_ID.test(href)) {
        node.properties.href = `${prefix}${href}/`;
        node.properties['data-node-link'] = href;
        return;
      }
      if (SITE_PATH.test(href)) {
        node.properties.href = `${base.replace(/\/$/, '')}${href}`;
      }
    });
  };
}
