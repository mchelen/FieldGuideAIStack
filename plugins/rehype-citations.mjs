import { visit } from 'unist-util-visit';

const CITE = /\[\[cite:([a-z0-9][a-z0-9-]*)\]\]/g;

/**
 * Turns `[[cite:owasp-agentic-ai]]` in prose into a numbered superscript
 * linking to that entry in the page's reference list.
 *
 * Numbering follows the order of the `sources` array, so the marks read [1],
 * [2], [3] down the page's own reference list rather than by first appearance.
 * Frontmatter stays the single source of truth: nothing here duplicates a URL,
 * which is what keeps the link checker and the freshness job working on the
 * same data the citations point at.
 *
 * An unresolvable id is left as raw text rather than silently dropped, so it is
 * visible in a preview. The validator fails the build on it separately.
 */
export function rehypeCitations() {
  return (tree, file) => {
    const sources = file?.data?.astro?.frontmatter?.sources ?? [];
    if (!sources.length) return;
    const number = new Map(sources.map((s, i) => [s.id, i + 1]));

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null || !CITE.test(node.value)) return;
      CITE.lastIndex = 0;

      const out = [];
      let last = 0;
      for (const m of node.value.matchAll(CITE)) {
        const n = number.get(m[1]);
        if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) });
        last = m.index + m[0].length;
        if (!n) {
          out.push({ type: 'text', value: m[0] });
          continue;
        }
        out.push({
          type: 'element',
          tagName: 'sup',
          properties: { className: ['cite'] },
          children: [
            {
              type: 'element',
              tagName: 'a',
              properties: {
                href: `#src-${m[1]}`,
                'data-cite': m[1],
                'aria-label': `Reference ${n}`,
              },
              children: [{ type: 'text', value: String(n) }],
            },
          ],
        });
      }
      if (last < node.value.length) out.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...out);
      return index + out.length;
    });
  };
}
