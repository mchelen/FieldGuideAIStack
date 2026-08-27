#!/usr/bin/env node
/**
 * Graph integrity checks that the content schema cannot express.
 *
 * Astro's `reference()` already fails the build on a dangling `relations`
 * target. This covers the rest: prose cross-links, orphans, self-edges, and
 * citation coverage for product claims.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadNodes, report, reachOf, RELATION_TYPES } from './lib/nodes.mjs';

const SCENARIOS_DIR = new URL('../src/content/scenarios/', import.meta.url).pathname;
const ORG_FILE = new URL('../src/data/organisation.yml', import.meta.url).pathname;

const BARE_LINK = /\]\((?!\/)([a-z0-9][a-z0-9-]*)\)/g;

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
// The overwhelmingly common cause is a plain scalar containing ": " -- YAML
// reads the colon as a second key. The parser's own message names a line and
// column and not the problem, so name it here: this has broken four pages.
const colonHint = (n) => {
  const fm = (n.raw ?? '').split(/^---$/m)[1] ?? '';
  const lines = fm.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    // A plain (unquoted, non-block) scalar: `key: some text`.
    const m = /^(\s*)([\w-]+):\s+(?![>|"'&*#-])(.+)$/.exec(lines[i]);
    if (!m) continue;
    const [, indent, key] = m;
    let text = m[3];
    // Plus its continuation lines, which are indented further and are where the
    // stray colon usually hides.
    for (let j = i + 1; j < lines.length; j += 1) {
      const cont = /^(\s*)(\S.*)$/.exec(lines[j]);
      if (!cont || cont[1].length <= indent.length) break;
      text += ` ${cont[2]}`;
    }
    if (/\S:\s/.test(text)) {
      return ` — likely \`${key}\`: a plain scalar cannot contain ": " (YAML reads it as a second key). Use a block scalar: \`${key}: >-\``;
    }
  }
  return '';
};
/**
 * Prose does not only live in the body. `fieldMark`, the canonical note, the use
 * case and relation notes are all sentences a reader reads, and until they were
 * checked here a term could be named in one and left unlinked with nothing
 * complaining — model-provider discussed hyperscalers in its canonical note and
 * never linked the page.
 */
const frontmatterProse = (d) =>
  [
    d.fieldMark,
    d.canonical?.note,
    d.canonical?.body,
    d.useCase?.scenario,
    d.useCase?.detail,
    ...(d.relations ?? []).map((r) => r.note),
    ...(d.aka ?? []).map((a) => (typeof a === 'string' ? null : a.note)),
  ]
    .filter(Boolean)
    .join('\n\n');

/**
 * The subset of that prose a cross-link belongs in. `canonical.body` is an
 * attribution line -- "OWASP GenAI Security Project" -- and linking a word out
 * of an organisation's name misreads the name as a claim.
 */
const frontmatterLinkable = (d) =>
  [
    d.fieldMark,
    d.canonical?.note,
    d.useCase?.scenario,
    d.useCase?.detail,
    ...(d.relations ?? []).map((r) => r.note),
    ...(d.aka ?? []).map((a) => (typeof a === 'string' ? null : a.note)),
  ]
    .filter(Boolean)
    .join('\n\n');

const problems = broken.map(
  (n) => `${n.file}: frontmatter does not parse — ${n.parseError}${colonHint(n)}`,
);
const warnings = [];

const degree = new Map();
const bump = (id) => degree.set(id, (degree.get(id) ?? 0) + 1);

for (const n of nodes) {
  // 1. Prose cross-links must resolve. These bypass reference() entirely.
  for (const [, target] of `${n.content}\n${frontmatterProse(n.data)}`.matchAll(BARE_LINK)) {
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
  const isSuite = n.data.kind === 'suite';

  if (isSuite) {
    if (!n.data.vendor) problems.push(`${n.file}: suite has no vendor`);
    if ((n.data.sources ?? []).length === 0) {
      problems.push(`${n.file}: suite with no sources`);
    }
    // A family of one is a product. The whole point of the node is the
    // relationship between siblings.
    const members = (n.data.relations ?? []).filter((r) => r.type === 'contains');
    if (members.length < 2) {
      problems.push(`${n.file}: suite contains ${members.length} product(s); a suite needs at least two`);
    }
    for (const m of members) {
      const target = nodes.find((x) => x.id === m.target);
      if (target && target.data.kind !== 'product') {
        problems.push(`${n.file}: suite contains "${m.target}", which is not a product`);
      }
    }
  } else if (isProduct) {
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

// 3c. Concept anatomy. Every concept page should say what the canonical term
//     is (or that there isn't one), how each vendor names it, and what it looks
//     like in use. Missing sections are a warning so the backlog stays visible
//     without blocking unrelated work; malformed ones are an error.
const missingCanonical = [];
const missingUseCase = [];
const missingFlow = [];

/** Ids one declared hop away, in either direction. */
const neighbourIndex = new Map(nodes.map((n) => [n.id, new Set()]));
for (const n of nodes) {
  for (const rel of n.data.relations ?? []) {
    neighbourIndex.get(n.id)?.add(rel.target);
    neighbourIndex.get(rel.target)?.add(n.id);
  }
}
const neighbours = (id) => neighbourIndex.get(id) ?? new Set();

for (const n of nodes) {
  if (n.data.kind === 'product' || n.data.kind === 'suite') continue;

  const c = n.data.canonical;
  if (!c) {
    missingCanonical.push(n.id);
  } else if (c.status === 'standard' || c.status === 'de-facto') {
    for (const field of ['term', 'url', 'title', 'verifiedOn']) {
      if (!c[field]) {
        problems.push(`${n.file}: canonical is "${c.status}" but has no ${field}`);
      }
    }
  } else {
    if (!c.note) {
      problems.push(
        `${n.file}: canonical is "${c.status}" but does not say why there is no settled term`,
      );
    }
    // Headlining a term under "no agreed term" reads as a contradiction. Any
    // reference for a contested concept belongs in the note and the link.
    if (c.term) {
      problems.push(
        `${n.file}: canonical is "${c.status}" so it must not headline a term — put the nearest standard in the note`,
      );
    }
  }

  if (!n.data.useCase) missingUseCase.push(n.id);

  // 2c. The applied illustration. It is a claim about how a real request moves
  //     through real pieces, so every station it names has to be a real node
  //     and the concept has to actually be on the path -- an illustration that
  //     does not contain its own subject is a diagram of something else.
  if (n.data.flow) {
    const path = n.data.flow.path ?? [];
    const selves = path.filter((step) => step.self);
    if (selves.length !== 1) {
      problems.push(
        `${n.file}: flow marks ${selves.length} stations \`self\` — exactly one is this concept`,
      );
    } else if (selves[0].node !== n.id) {
      problems.push(
        `${n.file}: flow marks "${selves[0].node ?? selves[0].actor}" as self, but this page is "${n.id}"`,
      );
    }
    for (const step of path) {
      if (step.node && !ids.has(step.node)) {
        problems.push(`${n.file}: flow station "${step.node}" is not a node`);
      }
    }
    // The path should be a walk in the graph, not a list of things that came
    // to mind: each node station connected to another one in the same flow.
    // Checking against the concept's own neighbours instead was the first
    // attempt, and it flagged a station that legitimately hangs off the step
    // before it rather than off the subject.
    const named = path.map((step) => step.node).filter(Boolean);
    for (const id of named) {
      const near = neighbours(id);
      if (!named.some((other) => other !== id && near.has(other))) {
        warnings.push(
          `${n.file}: flow names "${id}", which declares no relation to anything else on the path`,
        );
      }
    }
  } else {
    missingFlow.push(n.id);
  }

  for (const a of n.data.aka ?? []) {
    if (typeof a === 'string') continue;
    // A vendor naming claim is a product claim and needs the same evidence.
    for (const field of ['usedBy', 'url', 'verifiedOn']) {
      if (!a[field]) problems.push(`${n.file}: alias "${a.term}" has no ${field}`);
    }
  }
}

if (missingCanonical.length) {
  warnings.push(`no canonical term recorded yet (${missingCanonical.length}): ${missingCanonical.join(', ')}`);
}
if (missingUseCase.length) {
  warnings.push(`no use case recorded yet (${missingUseCase.length}): ${missingUseCase.join(', ')}`);
}
if (missingFlow.length) {
  // Listed short. This backlog starts at nearly every page, and a warning
  // nobody can read to the end of is a warning nobody reads.
  const head = missingFlow.slice(0, 12).join(', ');
  const rest = missingFlow.length > 12 ? `, and ${missingFlow.length - 12} more` : '';
  warnings.push(`no applied illustration yet (${missingFlow.length}): ${head}${rest}`);
}

// 3c-bis. Inline citations. A citation that points nowhere is worse than no
//     citation, because it looks like evidence.
const citedTotals = { pages: 0, cited: 0 };
for (const n of nodes) {
  const sources = n.data.sources ?? [];
  const ids = sources.map((s) => s.id);

  for (const [i, id] of ids.entries()) {
    if (!id) problems.push(`${n.file}: source ${i + 1} has no id`);
    else if (ids.indexOf(id) !== i) problems.push(`${n.file}: duplicate source id "${id}"`);
  }

  // A link whose target is split by a line break is not a link at all --
  // markdown renders it as literal text, and check-output cannot see the
  // absence of something that was never emitted. Hard wrapping is how it
  // happens, and the cross-link warning misses it whenever the same term is
  // linked correctly somewhere else on the page.
  for (const m of n.content.matchAll(/\]\(([a-z0-9/#.:-]*)\n\s*([a-z0-9/#.:-]*)\)/g)) {
    problems.push(
      `${n.file}: link target split across lines — \`](${m[1]}${m[2]})\` renders as text, not a link`,
    );
  }

  // A marker broken across a line break stops matching and ships as literal
  // text. `npm run check:output` catches it in dist/, but only after a build;
  // catching it here names the file before anything is rendered. Hard wrapping
  // a paragraph is how it happens.
  for (const m of n.content.matchAll(/\[\[cite:[a-z0-9-]*\s+[a-z0-9-]*\]\]/g)) {
    problems.push(
      `${n.file}: citation marker split across lines — \`${m[0].replace(/\s+/g, ' ')}\` will not resolve`,
    );
  }

  const used = new Set(
    [...n.content.matchAll(/\[\[cite:([a-z0-9][a-z0-9-]*)\]\]/g)].map((m) => m[1]),
  );
  for (const id of used) {
    if (!ids.includes(id)) {
      problems.push(`${n.file}: cites "${id}", which is not one of its sources`);
    }
  }

  // A source can legitimately support a structured field rather than prose --
  // the canonical block, a vendor naming claim, an example -- and those already
  // render their own link. Only a source nothing references at all is a
  // problem, so those URLs count as uses.
  const referencedUrls = new Set(
    [
      n.data.canonical?.url,
      ...(n.data.aka ?? []).map((a) => (typeof a === 'string' ? null : a.url)),
      ...(n.data.examples ?? []).map((e) => e.url),
    ].filter(Boolean),
  );

  // Only pages that have adopted citations are held to referencing everything.
  // Otherwise every un-migrated page would warn, and the list would be ignored.
  if (used.size > 0) {
    citedTotals.pages += 1;
    for (const s of sources) {
      if (used.has(s.id) || referencedUrls.has(s.url)) continue;
      warnings.push(`${n.file}: source "${s.id}" is referenced nowhere — cite it or drop it`);
    }
  }
  if (sources.length) citedTotals.cited += used.size > 0 ? 1 : 0;
}

// 3c-bis. A markdown link only works where the page renders prose. `aka` is a
//     list of terms, `title` and `summary` are plain strings, and a link
//     written into one of them ships as literal "[text](id)" on the page.
//     A batch edit put one into an aka list and nothing complained, which is
//     why this exists.
{
  const PROSE_KEYS = new Set(['fieldMark', 'note', 'scenario', 'detail', 'body']);
  for (const n of nodes) {
    if (!n.raw && !n.data) continue;
    const raw = n.raw ?? '';
    const fm = raw.split(/^---$/m)[1] ?? '';
    let key = null;
    fm.split('\n').forEach((line, i) => {
      const k = /^\s*-?\s*([a-zA-Z]+):/.exec(line);
      if (k) key = k[1];
      if (/\]\([a-z0-9-]+\)/.test(line) && !PROSE_KEYS.has(key)) {
        problems.push(
          `${n.file}: line ${i + 2} writes a markdown link in \`${key}\`, which renders as literal text — only ${[...PROSE_KEYS].join(', ')} are prose`,
        );
      }
    });
  }
}

// 3d. Wiki-style cross-linking. A term that has its own page should be linked
//     the first time another page uses it -- an unlinked mention is a dead end
//     for a reader who does not already know the word.
//
//     Vendor-attributed aliases are proper nouns and are matched case
//     sensitively: Google's "Connected Apps" is a product name, while
//     "connected apps" is an ordinary phrase that appears in prose about
//     entirely different products. Titles and informal synonyms match
//     case-insensitively, since "context window" is usually written lowercase.
//
//     Single-word terms are checked too, but only the jargon ones. The rule
//     used to skip every one-word term, which is why "hyperscaler" could sit
//     unlinked in the middle of a paragraph about hyperscalers. The words
//     below are the other half of that set: each is also an ordinary English
//     word this guide uses in its ordinary sense several times a page, so
//     flagging them buries the real signal in noise nobody reads twice.
const AMBIGUOUS_SINGLE_WORDS = new Set([
  'adaptation', 'agent', 'apps', 'attention', 'claude', 'client', 'container',
  'conversation', 'coordination', 'ecosystem', 'exchange', 'integration',
  'memory', 'model', 'parameter', 'permissions', 'piece', 'pipeline', 'plan',
  'planning', 'prompting', 'quota', 'reflection', 'round', 'routine', 'run', 'session',
  'skill', 'span', 'surface', 'token', 'turn', 'weight', 'weights',
]);

//     A term two nodes both answer to cannot be auto-linked, because there is
//     no single right target -- "function calling" is this guide's own node
//     and OpenAI's name for tool use. Reporting it would only ever produce a
//     coin flip, so an ambiguous term is nobody's to claim.
const claims = new Map();
for (const n of nodes) {
  for (const t of [n.data.title, ...(n.data.aka ?? []).map((a) => (typeof a === 'string' ? a : a.term))]) {
    if (!t) continue;
    const key = t.toLowerCase();
    claims.set(key, (claims.get(key) ?? new Set()).add(n.id));
  }
}
const linkable = (term) => {
  const key = term.toLowerCase();
  if (claims.get(key)?.size > 1) return false;
  return term.split(/\s+/).length >= 2 || !AMBIGUOUS_SINGLE_WORDS.has(key);
};

const lexicon = nodes.map((n) => ({
  id: n.id,
  terms: [
    { term: n.data.title, exact: false },
    ...(n.data.aka ?? []).map((a) =>
      typeof a === 'string' ? { term: a, exact: false } : { term: a.term, exact: true },
    ),
  ].filter((t) => t.term && linkable(t.term)),
  own: new Set(
    [n.data.title, ...(n.data.aka ?? []).map((a) => (typeof a === 'string' ? a : a.term))]
      .filter(Boolean)
      .map((t) => t.toLowerCase()),
  ),
}));

for (const n of nodes) {
  const prose = [n.content, frontmatterLinkable(n.data)]
    .join('\n\n')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // Citation markers carry source ids, not prose. "[[cite:aws-prov-throughput]]"
    // reported token-billing for an unlinked "throughput" that no reader sees.
    .replace(/\[\[cite:[^\]]*\]\]/g, '');
  const linked = new Set([...prose.matchAll(/\]\(([a-z0-9-]+)\)/g)].map((m) => m[1]));
  const self = lexicon.find((l) => l.id === n.id);

  // Whole markdown links, target included. "Prompt injection" sits inside
  // "[indirect prompt injection](...)", and flagging that as an unlinked
  // mention sends you to add a link where one is already doing the job. The
  // target counts too: "checkpoint" is a substring of
  // "[Checkpoints](checkpoint-and-rollback)"'s id, and matching there reported
  // a page that links the term as one that does not.
  const linkTextSpans = [...prose.matchAll(/\[[^\]]*\]\([a-z0-9-]+\)/g)].map((m) => [
    m.index,
    m.index + m[0].length,
  ]);
  // Quoted source material. A term inside a quotation is not editable -- you
  // cannot put a link inside someone else's sentence -- so reporting it asks
  // for an edit that must not be made.
  const quoteSpans = [...prose.matchAll(/\u201c[^\u201d]*\u201d|"[^"]*"/g)].map((m) => [
    m.index,
    m.index + m[0].length,
  ]);
  const insideLink = (i) =>
    linkTextSpans.concat(quoteSpans).some(([a, b]) => i >= a && i < b);

  for (const entry of lexicon) {
    if (entry.id === n.id || linked.has(entry.id)) continue;
    for (const { term, exact } of entry.terms) {
      if (self?.own.has(term.toLowerCase())) continue;
      // Spaces in the term match any run of whitespace, because prose is hard
      // wrapped and a term split across two lines is still a mention. Before
      // this, re-wrapping a paragraph could hide an unlinked term or reveal it.
      const escaped = term
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s+');
      const re = new RegExp(`(?<!\\[)\\b${escaped}\\b`, exact ? 'g' : 'gi');
      const hit = [...prose.matchAll(re)].some((m) => !insideLink(m.index));
      if (hit) {
        warnings.push(
          `${n.file}: mentions “${term}” without linking it — write [${term}](${entry.id})`,
        );
        break;
      }
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

// 6. Fieldwork. The scenarios are invented, which makes them *more* in need of
//    mechanical checking than the sourced pages, not less: nothing external
//    will ever contradict them, so drift is silent. The schema covers shape;
//    this covers consistency with the rest of the repository.
const scenarioFiles = (await readdir(SCENARIOS_DIR)).filter((f) => f.endsWith('.md'));
const orgRaw = await readFile(ORG_FILE, 'utf8');
// Hand-read rather than parsed, matching the inventory reader: the file has one
// fixed shape and the check should not be able to fail for reasons of its own.
const castNames = new Set(
  [...orgRaw.matchAll(/^ {4}- name: (.+)$/gm)].map((m) => m[1].trim()),
);
const conceptsSeen = new Set();

for (const file of scenarioFiles) {
  const raw = await readFile(join(SCENARIOS_DIR, file), 'utf8');
  const fm = raw.split(/^---$/m)[1] ?? '';
  const body = raw.split(/^---$/m).slice(2).join('---');

  // A `sources:` key would make invented material look verified. The schema is
  // `.strict()` so this is already a build failure; naming it here says why.
  if (/^sources:/m.test(fm)) {
    problems.push(
      `scenarios/${file}: declares sources — fieldwork is invented and must not cite anything`,
    );
  }

  for (const m of fm.matchAll(/^ {2}- ([a-z0-9][a-z0-9-]*)$/gm)) {
    conceptsSeen.add(m[1]);
    if (!ids.has(m[1])) {
      problems.push(`scenarios/${file}: names concept "${m[1]}", which is not a node`);
    }
  }

  // Cast names must exist in the organisation profile. A scenario introducing
  // somebody who does not work there is the first way a fiction stops cohering.
  for (const m of fm.matchAll(/^ {2}- name: (.+)$/gm)) {
    const name = m[1].trim();
    if (!castNames.has(name)) {
      problems.push(
        `scenarios/${file}: casts "${name}", who is not in src/data/organisation.yml`,
      );
    }
  }

  // Prose cross-links resolve, same rule as node pages.
  for (const m of body.matchAll(BARE_LINK)) {
    if (!ids.has(m[1])) {
      problems.push(`scenarios/${file}: prose links to "${m[1]}", which is not a node`);
    }
  }
  for (const m of body.matchAll(/\]\(([a-z0-9-]+)\n\s*([a-z0-9-]+)\)/g)) {
    problems.push(
      `scenarios/${file}: link target split across lines — \`](${m[1]}${m[2]})\` renders as text`,
    );
  }
}

console.log(
  `Checked ${nodes.length} nodes and ${scenarioFiles.length} scenarios ` +
    `(${conceptsSeen.size} concepts seen in the field).`,
);
// Zoom levels are an editorial judgement — a human decides what a beginner meets
// first — but they are checkable against evidence. A level-1 term the rest of
// the guide almost never uses, or a level-3 term half the guide is written in
// terms of, is probably mislevelled. This warns rather than fails: reach is a
// proxy, and a genuinely essential term can be rarely linked.
{
  const concepts = nodes.filter((n) => n.data && (n.data.kind ?? 'concept') === 'concept');
  const reach = reachOf(concepts.map((n) => ({ id: n.id, body: n.content })));
  for (const n of concepts) {
    const r = reach.get(n.id) ?? 0;
    if (n.data.zoom === 1 && r <= 2) {
      warnings.push(
        `${n.id}: level 1, but only ${r} other page(s) are written in terms of it — is it really a day-one term?`,
      );
    }
    if (n.data.zoom === 3 && r >= 6) {
      warnings.push(
        `${n.id}: level 3, but ${r} other pages are written in terms of it — that is not look-it-up detail`,
      );
    }
  }
}

// The validators run without booting Astro, so scripts/lib/nodes.mjs keeps its
// own copy of the relation table. A copy is only safe if something checks it:
// a verb added to the schema and not here would silently stop being drawn.
{
  const config = await readFile(new URL('../src/content.config.ts', import.meta.url), 'utf8');
  const block = /export const RELATION_TYPES = \{([\s\S]*?)\n\} as const;/.exec(config);
  if (!block) {
    problems.push('could not find RELATION_TYPES in src/content.config.ts — the mirror in scripts/lib/nodes.mjs is now unchecked');
  } else {
    const declared = {};
    for (const m of block[1].matchAll(/^\s*'?([\w-]+)'?: \{ label: '([^']*)', inverse: '([\w-]+)' \},/gm)) {
      declared[m[1]] = { label: m[2], inverse: m[3] };
    }
    const shape = (t) => Object.keys(t).sort().map((k) => `${k}=${t[k].label}>${t[k].inverse}`).join('|');
    if (shape(declared) !== shape(RELATION_TYPES)) {
      const a = new Set(Object.keys(declared));
      const b = new Set(Object.keys(RELATION_TYPES));
      const only = [...[...a].filter((k) => !b.has(k)).map((k) => `${k} only in the schema`),
                    ...[...b].filter((k) => !a.has(k)).map((k) => `${k} only in the mirror`),
                    ...[...a].filter((k) => b.has(k) && shape({ [k]: declared[k] }) !== shape({ [k]: RELATION_TYPES[k] })).map((k) => `${k} differs`)];
      problems.push(`RELATION_TYPES in scripts/lib/nodes.mjs no longer matches src/content.config.ts: ${only.join(', ')}`);
    }
  }
}

process.exit(report('graph integrity', problems, warnings) ? 0 : 1);
