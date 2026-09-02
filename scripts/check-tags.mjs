#!/usr/bin/env node
/**
 * Holds the tag vocabulary to what a reader can actually browse with.
 *
 * Tags are the guide's only non-exclusive facet: a page carries several, so
 * `sandbox` can be filed under both `agentic` and `safety` without either
 * having to win. That makes them the right way to answer "show me everything
 * about security" -- but only while the vocabulary stays a set of subjects.
 * It had drifted off that in three ways, all of which this now catches:
 *
 *   - `org` and `orgs`, `interface` and `interfaces`: one subject, spelled two
 *     ways, so browsing either gave you half the answer.
 *   - `protocol` on exactly one page, `standard` on two. A facet that narrows
 *     155 concepts to one is a link, not a facet.
 *   - `core` on 27 pages and `zoom: 1` on 25, agreeing on only 10. Two claims
 *     about what a beginner meets first, disagreeing, with the level control on
 *     the index rendering one of them and the tag chips the other.
 *
 * The last is the general rule and the reason for RESERVED below: a tag that
 * names a rung on a ladder or a sort of thing is restating a field the schema
 * already carries, and the moment the two disagree the page argues with itself.
 *
 * Two further reports are warnings rather than failures, because the fix is a
 * judgement about subject matter that a person has to make: members of a tag
 * that link to nothing else under it, and pages the graph says are missing one.
 */
import { loadNodes } from './lib/nodes.mjs';
import { derivedTags } from './lib/derived-tags.mjs';

/** Below this a tag cannot narrow anything down; it is a link to a page. */
const MIN_MEMBERS = 3;
/**
 * Words that name a position or a kind rather than a subject. `kind` and `zoom`
 * are schema fields, rendered by the kind badge and the level control; a tag
 * repeating either is a second, unchecked copy of it.
 */
const RESERVED = new Map([
  ['core', 'names a level; `zoom: 1` is the field for that, and the two disagreed'],
  ['product', 'names a kind; `kind: product` is the field for that'],
  ['suite', 'names a kind; `kind: suite` is the field for that'],
  ['concept', 'names a kind; `kind: concept` is the field for that'],
]);
/** A page needs this share of its neighbours under a tag before we suggest it. */
const SUGGEST_SHARE = 0.4;
const SUGGEST_NEIGHBOURS = 4;

const nodes = (await loadNodes()).filter((n) => n.data);
const problems = [];
const warnings = [];
const checks = [];

const tagsOf = new Map(nodes.map((n) => [n.id, new Set(n.data.tags ?? [])]));
const vocabulary = new Map();
for (const n of nodes) {
  for (const t of tagsOf.get(n.id)) vocabulary.set(t, [...(vocabulary.get(t) ?? []), n.id]);
}

// The same association graph the rest of the guide reads: declared relations
// plus prose cross-links, undirected. A page linking another in its prose is
// this guide asserting they belong together, which is the claim a tag makes too.
const known = new Set(nodes.map((n) => n.id));
const adj = new Map(nodes.map((n) => [n.id, new Set()]));
for (const n of nodes) {
  const targets = new Set((n.data.relations ?? []).map((r) => r.target));
  for (const m of (n.content ?? '').matchAll(/\]\(([a-z0-9-]+)\)/g)) targets.add(m[1]);
  for (const t of targets) {
    if (!known.has(t) || t === n.id) continue;
    adj.get(n.id).add(t);
    adj.get(t).add(n.id);
  }
}

// 1. Every tag narrows the guide to something browsable.
for (const [tag, members] of [...vocabulary].sort()) {
  if (members.length < MIN_MEMBERS) {
    problems.push(
      `tag "${tag}" has ${members.length} page(s) — under ${MIN_MEMBERS} it is a link, not a facet (${members.join(', ')})`,
    );
  }
}

// 2. One subject, one spelling. Singular/plural is how this went wrong twice;
//    the general form is any two tags a single character apart.
const names = [...vocabulary.keys()].sort();
const distance1 = (a, b) => {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) return [...a].filter((c, i) => c !== b[i]).length === 1;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  let i = 0;
  for (let j = 0; j < long.length; j += 1) if (short[i] === long[j]) i += 1;
  return i === short.length;
};
for (let i = 0; i < names.length; i += 1) {
  for (let j = i + 1; j < names.length; j += 1) {
    if (distance1(names[i], names[j])) {
      problems.push(
        `tags "${names[i]}" and "${names[j]}" differ by one character — browsing either shows half the subject`,
      );
    }
  }
}

// 3. No tag restates a field the schema already carries.
for (const [tag, why] of RESERVED) {
  if (vocabulary.has(tag)) {
    problems.push(`tag "${tag}" ${why} (${vocabulary.get(tag).length} page(s))`);
  }
}

if (!problems.length) checks.push(`${vocabulary.size} tags, each a browsable subject`);

// 4. A tag claims its pages belong together. A member that links to no other
//    member is that claim going unsupported by anything else in the guide.
const isolated = [];
for (const [tag, members] of [...vocabulary].sort()) {
  const set = new Set(members);
  for (const id of members) {
    if (![...adj.get(id)].some((x) => set.has(x))) isolated.push(`${id} under "${tag}"`);
  }
}
if (isolated.length) {
  warnings.push(
    `${isolated.length} tagged page(s) link to nothing else under that tag: ${isolated.join('; ')}`,
  );
}

// 5. Tags the graph says are missing. Not a failure: a page is about what it is
//    about, and its neighbours only get a vote.
const suggestions = [];
for (const n of nodes) {
  const nbrs = [...adj.get(n.id)];
  if (nbrs.length < SUGGEST_NEIGHBOURS) continue;
  for (const [tag, members] of vocabulary) {
    if (tagsOf.get(n.id).has(tag)) continue;
    const hits = nbrs.filter((x) => tagsOf.get(x).has(tag)).length;
    const share = hits / nbrs.length;
    // Also has to beat the tag's own prevalence, or a big tag is suggested
    // everywhere purely for being big.
    if (share >= SUGGEST_SHARE && hits >= SUGGEST_NEIGHBOURS && share >= (members.length / nodes.length) * 3) {
      suggestions.push({ id: n.id, tag, share, hits, of: nbrs.length });
    }
  }
}
suggestions.sort((a, b) => b.share - a.share || a.id.localeCompare(b.id));
for (const s of suggestions.slice(0, 12)) {
  warnings.push(
    `${s.id}: consider tag "${s.tag}" — ${s.hits} of its ${s.of} linked pages carry it`,
  );
}
if (suggestions.length > 12) {
  warnings.push(`…and ${suggestions.length - 12} more tag suggestions (all of them: node scripts/check-tags.mjs --all)`);
}

// 6. A group of concepts the guide links tightly together and tags with nothing
//    in common is a subject with no name yet -- the one gap the vocabulary
//    cannot show you, because you cannot browse for a word nobody wrote.
const COVERED = 0.6;
const clusters = [];
for (const group of derivedTags(nodes)) {
  if (group.members.length < 6) continue;
  // A majority, not all of them. Insisting every member share one tag reported
  // eighteen of the thirty-six clusters, which is a threshold saying nothing:
  // any group of twenty has someone at its edge.
  const covered = [...vocabulary.keys()].some(
    (t) => group.members.filter((id) => tagsOf.get(id)?.has(t)).length >= group.members.length * COVERED,
  );
  clusters.push({ ...group, covered });
}
const uncovered = clusters.filter((c) => !c.covered);
if (uncovered.length) {
  warnings.push(
    `${uncovered.length} of ${clusters.length} link-clusters of six or more concepts have no tag on a majority of their members — subjects the guide groups but cannot be browsed for (--all lists them)`,
  );
}

if (process.argv.includes('--all')) {
  for (const s of suggestions) console.log(`  ${(s.share * 100).toFixed(0)}%  ${s.id} + ${s.tag}`);
  for (const c of uncovered) console.log(`  untagged cluster: ${c.tag} — ${c.members.join(', ')}`);
}

for (const c of checks) console.log(`  ok    ${c}`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const p of problems) console.log(`  FAIL  ${p}`);
console.log(
  `${problems.length === 0 ? 'PASS' : 'FAIL'}  tag vocabulary — ${problems.length} problem(s), ${warnings.length} warning(s)`,
);
process.exit(problems.length === 0 ? 0 : 1);
