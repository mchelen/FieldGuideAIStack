import { getCollection, type CollectionEntry } from 'astro:content';
import { RELATION_TYPES, type RelationType } from '../content.config';

export type NodeEntry = CollectionEntry<'nodes'>;

export interface Edge {
  from: string;
  to: string;
  type: RelationType;
  label: string;
  note?: string;
  /** 'partial' means the claim holds only under a stated limit; see `note`. */
  support: 'full' | 'partial';
  /** True when this edge was derived from the inverse declared on the other node. */
  derived: boolean;
}

export interface GraphNode {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  zoom: 1 | 2 | 3;
  kind: 'concept' | 'product';
  vendor?: string;
  degree: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: Edge[];
  byId: Map<string, NodeEntry>;
  /** All edges touching a node, authored and derived, deduped. */
  neighborsOf: (id: string) => Edge[];
}

const edgeKey = (e: Edge) => `${e.from}|${e.type}|${e.to}`;

/**
 * Loads every published node and materializes the graph, including reverse
 * edges. Authors declare an edge once, from whichever side reads more
 * naturally; the inverse is generated here so the two can never disagree.
 */
export async function loadGraph(): Promise<Graph> {
  const entries = (await getCollection('nodes')).filter(
    (e) => !e.data.draft || import.meta.env.DEV,
  );
  const byId = new Map(entries.map((e) => [e.id, e]));

  const edges = new Map<string, Edge>();
  for (const entry of entries) {
    for (const rel of entry.data.relations) {
      const target = rel.target.id;
      if (!byId.has(target)) continue; // reference() already failed the build

      const forward: Edge = {
        from: entry.id,
        to: target,
        type: rel.type,
        label: RELATION_TYPES[rel.type].label,
        note: rel.note,
        support: rel.support,
        derived: false,
      };
      edges.set(edgeKey(forward), forward);

      const inverseType = RELATION_TYPES[rel.type].inverse as RelationType;
      const reverse: Edge = {
        from: target,
        to: entry.id,
        type: inverseType,
        label: RELATION_TYPES[inverseType].label,
        note: rel.note,
        support: rel.support,
        derived: true,
      };
      // An authored edge always wins over a derived one with the same key.
      if (!edges.has(edgeKey(reverse))) edges.set(edgeKey(reverse), reverse);
    }
  }

  const allEdges = [...edges.values()];
  const degree = new Map<string, number>();
  for (const e of allEdges) {
    if (!e.derived) {
      degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
      degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
    }
  }

  const nodes: GraphNode[] = entries.map((e) => ({
    id: e.id,
    title: e.data.title,
    summary: e.data.summary,
    tags: e.data.tags,
    zoom: e.data.zoom,
    kind: e.data.kind,
    vendor: e.data.vendor,
    degree: degree.get(e.id) ?? 0,
  }));

  return {
    nodes,
    edges: allEdges,
    byId,
    neighborsOf: (id) => allEdges.filter((e) => e.from === id),
  };
}

/**
 * The comparison matrix: every product, and which capabilities each bundles.
 *
 * Columns are derived from what the products actually declare rather than from
 * a hand-kept list, so adding a `bundles` edge to any product widens the table
 * automatically and a capability nobody ships simply never appears.
 */
export function comparison(graph: Graph) {
  const products = graph.nodes
    .filter((n) => n.kind === 'product')
    .sort(
      (a, b) =>
        (a.vendor ?? '').localeCompare(b.vendor ?? '') || a.title.localeCompare(b.title),
    );

  const bundles = graph.edges.filter((e) => e.type === 'bundles' && !e.derived);

  const capabilityIds = [...new Set(bundles.map((e) => e.to))];
  const capabilities = capabilityIds
    .map((id) => graph.nodes.find((n) => n.id === id)!)
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title));

  const cell = (productId: string, capId: string) =>
    bundles.find((e) => e.from === productId && e.to === capId);

  return { products, capabilities, cell };
}

/** Distinct tags across the graph, most used first. */
export function tagIndex(graph: Graph): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const n of graph.nodes) {
    for (const t of n.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
