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
 * The lexicon is the capability concepts themselves, so it grows as the guide
 * does rather than being a hand-kept list that rots.
 */
import { loadNodes, report } from './lib/nodes.mjs';

// A denial is not a claim. "cannot access local files" must not be read as a
// product declaring local file access.
const NEGATION =
  /\b(cannot|can't|can not|does not|doesn't|do not|don't|never|no|without|absent|lacks?|unable|nor|neither|not)\b/i;

const nodes = await loadNodes();
const capabilities = nodes.filter(
  (n) =>
    n.data.kind !== 'product' &&
    n.data.kind !== 'suite' &&
    // `capability` specifically, not the looser `product-anatomy`. Surface and
    // product suite carry that tag but are structure rather than something a
    // product bundles, and including them produced only false positives.
    (n.data.tags ?? []).includes('capability'),
);

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
