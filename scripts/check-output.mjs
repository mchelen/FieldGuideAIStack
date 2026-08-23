#!/usr/bin/env node
/**
 * Asserts on the built site, not just on a successful build.
 *
 * A green `astro build` only proves nothing threw. It says nothing about
 * whether the build-time transforms actually ran. The Astro 5 -> 7 upgrade made
 * that concrete: the rehype plugin that rewrites `[harness](harness)` into a
 * real URL had to be re-enabled explicitly, and had it silently no-opped
 * instead of erroring, every cross-reference on the site would have shipped
 * broken with CI green.
 *
 * So this checks the output for the things a dependency bump could quietly
 * take away.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { buildFragment } from './lib/quick-reference-view.mjs';
import { CARDS } from './lib/quick-reference-cards.mjs';

const DIST = new URL('../dist/', import.meta.url).pathname;
const GEN = new URL('../src/generated/', import.meta.url).pathname;
const NODES_SRC = new URL('../src/content/nodes/', import.meta.url).pathname;

const problems = [];
const checks = [];
const ok = (label) => checks.push(label);

if (!existsSync(DIST)) {
  console.log('FAIL  no dist/ -- run `npm run build` first');
  process.exit(1);
}

const ids = (await readdir(NODES_SRC))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

// 1. Every node has a page.
for (const id of ids) {
  if (!existsSync(join(DIST, 'nodes', id, 'index.html'))) {
    problems.push(`no page built for node "${id}"`);
  }
}
ok(`${ids.length} node pages present`);

// 2. Prose cross-links are rewritten to real URLs. `[harness](harness)` must
//    not survive into the HTML as href="harness" -- that would 404.
let rewritten = 0;
for (const id of ids) {
  const html = await readFile(join(DIST, 'nodes', id, 'index.html'), 'utf8');

  const bare = [...html.matchAll(/href="([a-z][a-z0-9-]*)"/g)].map((m) => m[1]);
  for (const href of bare) {
    problems.push(`${id}: un-rewritten cross-link href="${href}" -- the rehype plugin did not run`);
  }
  rewritten += [...html.matchAll(/data-node-link=/g)].length;

  // 2b. Citations resolved. If the citation plugin stops running, raw
  //     [[cite:id]] markers ship as literal text -- fluent-looking prose with
  //     brackets in it, which is exactly the kind of break a green build hides.
  if (html.includes('[[cite:')) {
    problems.push(`${id}: raw [[cite:…]] marker in output — the citation plugin did not run`);
  }
  for (const m of html.matchAll(/data-cite="([a-z0-9-]+)"/g)) {
    if (!html.includes(`id="src-${m[1]}"`)) {
      problems.push(`${id}: citation to "${m[1]}" has no matching reference anchor`);
    }
  }

  // 3. The neighbourhood diagram is generated, not empty.
  if (!html.includes('<svg')) problems.push(`${id}: no neighbourhood diagram`);
  const boxes = [...html.matchAll(/class="box/g)].length;
  if (boxes < 2) problems.push(`${id}: diagram has ${boxes} node box(es), expected at least 2`);
}
if (rewritten === 0) {
  problems.push('no rewritten cross-links anywhere -- the rehype plugin is not running');
}
ok(`${rewritten} cross-links rewritten, all diagrams non-empty`);

const cited = (await Promise.all(
  ids.map(async (id) =>
    (await readFile(join(DIST, 'nodes', id, 'index.html'), 'utf8')).includes('data-cite='),
  ),
)).filter(Boolean).length;
ok(`${cited} page(s) carry resolved inline citations`);

// 4. The graph explorer still ships its data and its bundle.
const graph = await readFile(join(DIST, 'graph', 'index.html'), 'utf8');
if (!graph.includes('id="graph-data"')) {
  problems.push('graph page is missing its embedded graph data');
} else {
  const json = graph.match(/id="graph-data"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
  try {
    const data = JSON.parse(json);
    if (!data.nodes?.length || !data.edges?.length) {
      problems.push('graph data is present but empty');
    }
    ok(`graph payload: ${data.nodes.length} nodes, ${data.edges.length} edges`);
  } catch {
    problems.push('graph data is not valid JSON');
  }
}
// Fieldwork is invented, and the mark saying so is the only thing separating it
// from the sourced pages for a reader arriving from a search result. A styling
// change that dropped it would leave the site looking identical and claiming
// something it should not, so it is asserted in the output rather than trusted
// to a component.
const SCENARIOS_SRC = new URL('../src/content/scenarios/', import.meta.url).pathname;
const scenarioIds = (await readdir(SCENARIOS_SRC))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

let unmarked = 0;
for (const id of scenarioIds) {
  const file = join(DIST, 'fieldwork', id, 'index.html');
  if (!existsSync(file)) {
    problems.push(`fieldwork page missing for "${id}"`);
    continue;
  }
  const html = await readFile(file, 'utf8');
  if (!html.includes('data-fiction')) {
    problems.push(`fieldwork/${id} is missing the fiction mark`);
    unmarked += 1;
  }
}
if (unmarked === 0 && scenarioIds.length > 0) {
  ok(`${scenarioIds.length} fieldwork pages present, all marked as invented`);
}

// Node pages that link out to fieldwork must carry the mark too -- that is the
// route most readers will take, and an unmarked list of invented episodes
// sitting under a page full of dated citations is the failure worth preventing.
let linked = 0;
let linkedUnmarked = 0;
for (const id of ids) {
  const out = join(DIST, 'nodes', id, 'index.html');
  if (!existsSync(out)) continue;
  const html = await readFile(out, 'utf8');
  // The section heading, not any occurrence of the path -- every page carries a
  // /fieldwork/ link in the site nav, which is not what this is asking about.
  if (!html.includes('id="fieldwork"')) continue;
  linked += 1;
  if (!html.includes('data-fiction')) {
    problems.push(`nodes/${id} links to fieldwork without the fiction mark`);
    linkedUnmarked += 1;
  }
}
if (linkedUnmarked === 0 && linked > 0) {
  ok(`${linked} node pages link to fieldwork, all marked`);
}

// The quick reference cards are the shareable artifacts, so every image has to
// ship and the page has to actually contain each diagram rather than a broken
// import. Driven off CARDS, so adding a card extends the check automatically
// rather than leaving the new one unasserted.
let qrStale = 0;
for (const card of CARDS) {
  for (const ext of ['png', 'pdf']) {
    const p = join(DIST, `${card.slug}.${ext}`);
    if (!existsSync(p)) problems.push(`${card.slug}.${ext} did not ship`);
    else {
      const { size } = await stat(p);
      if (size < 4000) problems.push(`${card.slug}.${ext} shipped but is only ${size} bytes`);
    }
  }
  // The diagrams are generated markup that lives in the repo, so a committed
  // copy and the generator can disagree. CI never runs the generator -- it
  // renders the committed files -- so without this the images and the page
  // could describe two different diagrams and every other check would stay
  // green.
  const p = join(GEN, `${card.slug}.html`);
  if (!existsSync(p)) {
    problems.push(`src/generated/${card.slug}.html missing — run \`npm run quick-ref\``);
    qrStale += 1;
  } else if ((await readFile(p, 'utf8')) !== buildFragment(card)) {
    problems.push(`src/generated/${card.slug}.html is stale — run \`npm run quick-ref\` and commit the result`);
    qrStale += 1;
  }
}
const qr = join(DIST, 'quick-reference', 'index.html');
if (!existsSync(qr)) {
  problems.push('quick reference page missing');
} else {
  const html = await readFile(qr, 'utf8');
  // Every card's own title, so a page that silently dropped one is caught --
  // plus the stylesheet, because the markup can be present and unstyled.
  const absent = CARDS.filter((c) => !html.includes(c.title)).map((c) => c.slug);
  if (absent.length) problems.push(`quick reference page is missing card(s): ${absent.join(', ')}`);
  else if (!html.includes('--qr-l4')) problems.push('quick reference page has the diagrams but not their stylesheet');
  else if (!qrStale) ok(`quick reference: ${CARDS.length} cards in step with the generator, PNG and PDF each`);
}

const bundles = (await readdir(join(DIST, '_astro'))).filter((f) => f.endsWith('.js'));
if (bundles.length === 0) problems.push('no client bundle emitted for the graph explorer');
else ok(`${bundles.length} client bundle(s) emitted`);

for (const c of checks) console.log(`  ok    ${c}`);
for (const p of problems) console.log(`  FAIL  ${p}`);
console.log(
  `${problems.length === 0 ? 'PASS' : 'FAIL'}  built output — ${problems.length} problem(s)`,
);
process.exit(problems.length === 0 ? 0 : 1);
