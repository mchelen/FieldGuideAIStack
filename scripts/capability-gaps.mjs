#!/usr/bin/env node
/**
 * Finds capabilities a product page describes but does not declare.
 *
 * Two capabilities have gone missing this way. Command execution was written
 * into the prose of four product pages while no `bundles` edge existed, so the
 * comparison table could not show it. Memory was named by OWASP as one of three
 * core agentic capabilities and had no node at all. Both were found by a person
 * noticing, which does not scale.
 *
 * The lexicon is whatever any product declares it bundles -- the same
 * definition the comparison table uses (`comparison()` in src/lib/graph.ts), so
 * the two can never disagree about what counts as a capability, and it grows as
 * the guide does rather than being a hand-kept list that rots.
 *
 * It used to be the `capability` tag instead, which gave one tag two jobs: a
 * subject for readers to browse, and this check's word list. That coupling is
 * what stopped the tag being split when it turned out to name two subjects.
 * Reading the relations instead also drops the concepts no product ships, which
 * were only ever noise here, and picks up a capability someone forgets to tag.
 */
import { loadNodes, report } from './lib/nodes.mjs';

// A denial is not a claim. "cannot access local files" must not be read as a
// product declaring local file access.
const NEGATION =
  /\b(cannot|can't|can not|does not|doesn't|do not|don't|never|no|without|absent|lacks?|unable|nor|neither|not)\b/i;

const nodes = await loadNodes();
const bundled = new Set(
  nodes
    .filter((n) => n.data.kind === 'product')
    .flatMap((n) => (n.data.relations ?? []).filter((r) => r.type === 'bundles'))
    .map((r) => r.target),
);
const capabilities = nodes.filter((n) => bundled.has(n.id));

const terms = (n) =>
  [n.data.title, ...(n.data.aka ?? []).map((a) => (typeof a === 'string' ? a : a.term))]
    .filter((t) => t && t.split(/\s+/).length >= 2);

const problems = [];
const warnings = [];
let scanned = 0;

for (const n of nodes) {
  if (n.data.kind !== 'product') continue;
  scanned += 1;

  const declared = new Set(
    (n.data.relations ?? []).filter((r) => r.type === 'bundles').map((r) => r.target),
  );

  // Prose plus the notes on examples, since capability claims often live there.
  const prose = [
    n.content.replace(/```[\s\S]*?```/g, ''),
    ...(n.data.examples ?? []).map((e) => e.note ?? ''),
  ].join('\n');

  const sentences = prose.split(/(?<=[.!?])\s+|\n{2,}/);

  for (const cap of capabilities) {
    if (declared.has(cap.id)) continue;
    for (const term of terms(cap)) {
      const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const hit = sentences.find((s) => re.test(s));
      if (!hit) continue;
      // A sentence that denies the capability is evidence the absence is
      // deliberate, which is exactly what an empty cell in the table means.
      if (NEGATION.test(hit)) break;
      warnings.push(
        `${n.file}: describes “${term}” but declares no \`bundles\` edge to ${cap.id}\n` +
          `        “${hit.replace(/\s+/g, ' ').trim().slice(0, 150)}”`,
      );
      break;
    }
  }
}

console.log(`Scanned ${scanned} product pages against ${capabilities.length} capabilities.`);
process.exit(report('capability coverage', problems, warnings) ? 0 : 1);
