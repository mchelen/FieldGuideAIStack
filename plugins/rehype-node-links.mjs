import { visit } from 'unist-util-visit';

const BARE_ID = /^[a-z0-9][a-z0-9-]*$/;

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
      if (typeof href !== 'string' || !BARE_ID.test(href)) return;
      node.properties.href = `${prefix}${href}/`;
      node.properties['data-node-link'] = href;
    });
  };
}
