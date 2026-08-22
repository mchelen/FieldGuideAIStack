import type { APIRoute } from 'astro';
import { loadGraph } from '../lib/graph';

/**
 * A small id → summary index, used for link previews.
 *
 * Emitted as a separate file rather than inlined on every page: it is the same
 * few kilobytes everywhere, so one cacheable request beats repeating it in 30
 * documents, and it is fetched only when someone actually hovers a link.
 */
export const GET: APIRoute = async () => {
  const graph = await loadGraph();
  const index = Object.fromEntries(
    graph.nodes.map((n) => [
      n.id,
      { title: n.title, summary: n.summary, kind: n.kind, vendor: n.vendor ?? null },
    ]),
  );
  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json' },
  });
};
