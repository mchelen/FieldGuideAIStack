import type { APIRoute } from 'astro';
import { loadGraph } from '../lib/graph';

/**
 * A small id → summary index, used for link previews and for search.
 *
 * Emitted as a separate file rather than inlined on every page: it is the same
 * few kilobytes everywhere, so one cacheable request beats repeating it in 30
 * documents, and it is fetched only when someone hovers a link or types.
 *
 * `aka` is here because of what the charter asks the guide to be. You saw a
 * word in the wild -- "scaffolding", "agent framework" -- and want the page for
 * it; searching titles alone would answer "no such thing" to the exact question
 * the guide exists to answer. The vendor-attributed forms carry their own
 * sourcing on the page, so only the term itself is indexed.
 */
export const GET: APIRoute = async () => {
  const graph = await loadGraph();
  const index = Object.fromEntries(
    graph.nodes.map((n) => {
      const entry = graph.byId.get(n.id)!;
      const aka = (entry.data.aka ?? []).map((a) => (typeof a === 'string' ? a : a.term));
      return [
        n.id,
        {
          title: n.title,
          summary: n.summary,
          kind: n.kind,
          vendor: n.vendor ?? null,
          aka,
          tags: n.tags,
        },
      ];
    }),
  );
  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json' },
  });
};
