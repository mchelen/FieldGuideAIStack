import type { Edge, Graph } from './graph';

export interface LaidOutNode {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  center: boolean;
  tag: string;
}

export interface LaidOutEdge {
  from: LaidOutNode;
  to: LaidOutNode;
  label: string;
  /** Midpoint of the drawn line, where the relation label sits. */
  lx: number;
  ly: number;
  derived: boolean;
}

export interface Diagram {
  width: number;
  height: number;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
}

const CHAR_W = 7.4;
const PAD_X = 14;
const BOX_H = 34;

const boxWidth = (title: string) =>
  Math.min(210, Math.max(84, Math.round(title.length * CHAR_W + PAD_X * 2)));

/**
 * Radial one-hop layout, computed at build time so a node's neighbourhood
 * diagram is static SVG -- shareable, printable, and readable with JS off.
 *
 * Deterministic by construction: neighbours are sorted before placement, so the
 * same graph always produces byte-identical output and diffs stay reviewable.
 */
export function neighborhood(graph: Graph, centerId: string): Diagram {
  const width = 820;
  const height = 460;
  const cx = width / 2;
  const cy = height / 2;

  const centerEntry = graph.byId.get(centerId)!;
  const center: LaidOutNode = {
    id: centerId,
    title: centerEntry.data.title,
    x: cx,
    y: cy,
    w: boxWidth(centerEntry.data.title),
    h: BOX_H + 6,
    center: true,
    tag: centerEntry.data.tags[0] ?? 'core',
  };

  const seen = new Set<string>();
  const links: Edge[] = [];
  for (const e of graph.neighborsOf(centerId)) {
    if (seen.has(e.to)) continue; // one line per neighbour, first relation wins
    seen.add(e.to);
    links.push(e);
  }
  links.sort((a, b) => a.type.localeCompare(b.type) || a.to.localeCompare(b.to));

  const n = links.length;
  const rx = width / 2 - 132;
  const ry = height / 2 - 66;

  const nodes: LaidOutNode[] = [center];
  const edges: LaidOutEdge[] = [];

  links.forEach((link, i) => {
    // Start at -90deg so the first neighbour sits directly above the centre.
    const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
    const entry = graph.byId.get(link.to)!;
    const node: LaidOutNode = {
      id: link.to,
      title: entry.data.title,
      x: Math.round((cx + Math.cos(angle) * rx) * 100) / 100,
      y: Math.round((cy + Math.sin(angle) * ry) * 100) / 100,
      w: boxWidth(entry.data.title),
      h: BOX_H,
      center: false,
      tag: entry.data.tags[0] ?? 'core',
    };
    nodes.push(node);

    // Label the midpoint of the line as actually drawn, not of the centre-to-
    // centre line -- otherwise a wide neighbour box swallows its own label.
    const start = anchor(node, center);
    const end = anchor(center, node);
    edges.push({
      from: center,
      to: node,
      label: link.label,
      lx: Math.round(((start.x + end.x) / 2) * 100) / 100,
      ly: Math.round(((start.y + end.y) / 2) * 100) / 100,
      derived: link.derived,
    });
  });

  return { width, height, nodes, edges };
}

/**
 * Where a line from `from` to `to` should stop so it meets the edge of the
 * target box rather than disappearing under it.
 */
export function anchor(from: LaidOutNode, to: LaidOutNode) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const hw = to.w / 2 + 4;
  const hh = to.h / 2 + 4;
  if (dx === 0 && dy === 0) return { x: to.x, y: to.y };
  const scale = Math.min(
    dx === 0 ? Infinity : hw / Math.abs(dx),
    dy === 0 ? Infinity : hh / Math.abs(dy),
  );
  return {
    x: Math.round((to.x - dx * scale) * 100) / 100,
    y: Math.round((to.y - dy * scale) * 100) / 100,
  };
}
