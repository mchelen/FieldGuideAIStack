import { getCollection, type CollectionEntry } from 'astro:content';
import { RELATION_TYPES, type RelationType } from '../content.config';

export type NodeEntry = CollectionEntry<'nodes'>;

export interface Edge {
  from: string;
  to: string;
  type: RelationType;
  label: string;
  note?: string;
  /** True when this edge was derived from the inverse declared on the other node. */
  derived: boolean;
}

export interface GraphNode {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  zoom: 1 | 2 | 3;
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
    degree: degree.get(e.id) ?? 0,
  }));

  return {
    nodes,
    edges: allEdges,
    byId,
    neighborsOf: (id) => allEdges.filter((e) => e.from === id),
  };
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
