import type { Graph } from './graph';
import inventoryRaw from '../data/concept-inventory.yml?raw';
// One implementation, shared with the validator, so the number shown on a page
// and the number a check tests against cannot drift.
import { reachOf } from '../../scripts/lib/nodes.mjs';

/**
 * Two measurements behind the zoom levels, so "start here" is evidence rather
 * than taste.
 *
 * The levels themselves stay authored — a human decides what a beginner meets
 * first, and the numbers here are how that judgement gets checked and how a
 * reader is shown why a term sits where it does.
 *
 * `reach` is how many other pages in this guide link to a concept in prose.
 * It is the popularity lens: the terms everything else is written in terms of
 * are the ones a reader meets first, whether or not they know the word yet.
 *
 * `attestedBy` is how many of eight surveyed public glossaries were found to
 * carry the term. Treat it as a floor: the survey matched the inventory's term,
 * not its synonyms, so Embedding records zero while Google's glossary defines
 * it under "embedding vector". Never render a zero as "no glossary defines
 * this".
 * It is a different question — whether the field has settled the word — and the
 * two disagree in a way that is worth surfacing. A term with high reach and no
 * attestation is this guide's applied vocabulary: real, central, and too new
 * for the reference works. A term with attestation and low reach is established
 * theory a reader can look up anywhere.
 *
 * Neither is a difficulty score, and a prerequisite-depth measure was tried and
 * rejected: chains of `consumes` edges made leaderboard and evaluation the two
 * deepest concepts in the guide, which is a statement about graph shape, not
 * about what is hard.
 */

export interface Level {
  /** Other pages linking here in prose. */
  reach: number;
  /** How many of the eight surveyed glossaries carry the term. */
  attestedBy: number;
}

/**
 * The inventory is YAML but parsed by hand, the same way scripts/backlog.mjs
 * parses it: one fixed shape, and a reader that cannot fail for reasons of its
 * own beats a dependency here.
 */
function attestation(): Map<string, number> {
  const out = new Map<string, number>();
  let slug: string | null = null;
  for (const line of inventoryRaw.split('\n')) {
    const s = /^ {4}slug:\s*(\S+)/.exec(line);
    if (s) slug = s[1];
    const a = /^ {4}attestedBy:\s*\[([^\]]*)\]/.exec(line);
    if (a && slug) {
      out.set(slug, a[1].split(',').map((x) => x.trim()).filter(Boolean).length);
    }
  }
  return out;
}

export function levelsFor(graph: Graph): Map<string, Level> {
  const att = attestation();
  const reach: Map<string, number> = reachOf(
    graph.nodes.map((n) => ({ id: n.id, body: graph.byId.get(n.id)?.body ?? '' })),
  );

  return new Map(
    graph.nodes.map((n) => [n.id, { reach: reach.get(n.id) ?? 0, attestedBy: att.get(n.id) ?? 0 }]),
  );
}
