#!/usr/bin/env node
/**
 * Graph integrity checks that the content schema cannot express.
 *
 * Astro's `reference()` already fails the build on a dangling `relations`
 * target. This covers the rest: prose cross-links, orphans, self-edges, and
 * citation coverage for product claims.
 */
import { loadNodes, report } from './lib/nodes.mjs';

const BARE_LINK = /\]\(([a-z0-9][a-z0-9-]*)\)/g;

/**
 * Relation types that are their own inverse. Declaring one on both nodes is
 * redundant -- the build derives the other direction -- and it draws the edge
 * twice in the explorer, so it is an error rather than a style note.
 */
const SYMMETRIC = new Set(['distinguished-from']);

const allNodes = await loadNodes();

// Unparseable frontmatter is reported and then excluded, so one bad file does
// not cascade into dozens of misleading downstream errors.
const broken = allNodes.filter((n) => n.parseError);
const nodes = allNodes.filter((n) => !n.parseError);
const ids = new Set(nodes.map((n) => n.id));
const problems = broken.map((n) => `${n.file}: frontmatter does not parse — ${n.parseError}`);
const warnings = [];

const degree = new Map();
const bump = (id) => degree.set(id, (degree.get(id) ?? 0) + 1);

for (const n of nodes) {
  // 1. Prose cross-links must resolve. These bypass reference() entirely.
  for (const [, target] of n.content.matchAll(BARE_LINK)) {
    if (!ids.has(target)) {
      problems.push(`${n.file}: prose links to "${target}", which is not a node`);
    }
  }

  // 2. Relations: no self-edges, no duplicates, targets exist.
  const seen = new Set();
  for (const rel of n.data.relations ?? []) {
    if (rel.target === n.id) {
      problems.push(`${n.file}: relation "${rel.type}" points at itself`);
    }
    if (!ids.has(rel.target)) {
      problems.push(`${n.file}: relation target "${rel.target}" is not a node`);
    }
    const key = `${rel.type}:${rel.target}`;
    if (seen.has(key)) {
      problems.push(`${n.file}: duplicate relation ${key}`);
    }
    seen.add(key);
    bump(n.id);
    bump(rel.target);
  }

  // 3. Every named product must be citable. AGENTS.md: no claim without a URL.
  const sourceUrls = new Set((n.data.sources ?? []).map((s) => s.url));
  for (const ex of n.data.examples ?? []) {
    if (!sourceUrls.has(ex.url)) {
      warnings.push(
        `${n.file}: example "${ex.name}" cites ${ex.url}, which is not also listed under sources`,
      );
    }
  }
  if ((n.data.examples ?? []).length > 0 && (n.data.sources ?? []).length === 0) {
    problems.push(`${n.file}: names real products but lists no sources`);
  }
}

// 3b. Product-specific rules. A product page makes claims about something you
//     can buy, so it carries a higher evidentiary bar than a concept page.
for (const n of nodes) {
  const isProduct = n.data.kind === 'product';
  if (isProduct) {
    if (!n.data.vendor) problems.push(`${n.file}: product has no vendor`);
    if ((n.data.sources ?? []).length === 0) {
      problems.push(`${n.file}: product with no sources`);
    }
    const bundles = (n.data.relations ?? []).filter((r) => r.type === 'bundles');
    if (bundles.length === 0) {
      warnings.push(`${n.file}: product bundles no capabilities, so it cannot be compared`);
    }
  } else if (n.data.vendor) {
    problems.push(`${n.file}: vendor is set on a concept`);
  }

  // A partial claim without a note is worse than no claim -- the comparison
  // table shows a qualified mark with nothing to qualify it.
  for (const rel of n.data.relations ?? []) {
    if (rel.support === 'partial' && !rel.note) {
      problems.push(
        `${n.file}: relation "${rel.type} ${rel.target}" is partial but says nothing about the limit`,
      );
    }
  }
}

// 4. Symmetric relations declared from both ends.
for (const n of nodes) {
  for (const rel of n.data.relations ?? []) {
    if (!SYMMETRIC.has(rel.type)) continue;
    const other = nodes.find((m) => m.id === rel.target);
    const back = (other?.data.relations ?? []).some(
      (r) => r.type === rel.type && r.target === n.id,
    );
    if (back && n.id < rel.target) {
      problems.push(
        `${n.file} and ${other.file}: both declare "${rel.type}" against each other — declare it once, the inverse is derived`,
      );
    }
  }
}

// 5. Orphans. A node nothing connects to is invisible in the graph, which
//    defeats the point of storing content as a graph at all.
for (const n of nodes) {
  if ((degree.get(n.id) ?? 0) === 0) {
    problems.push(`${n.file}: orphan — no relations in either direction`);
  }
}

console.log(`Checked ${nodes.length} nodes.`);
process.exit(report('graph integrity', problems, warnings) ? 0 : 1);
