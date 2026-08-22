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
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
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
const bundles = (await readdir(join(DIST, '_astro'))).filter((f) => f.endsWith('.js'));
if (bundles.length === 0) problems.push('no client bundle emitted for the graph explorer');
else ok(`${bundles.length} client bundle(s) emitted`);

for (const c of checks) console.log(`  ok    ${c}`);
for (const p of problems) console.log(`  FAIL  ${p}`);
console.log(
  `${problems.length === 0 ? 'PASS' : 'FAIL'}  built output — ${problems.length} problem(s)`,
);
process.exit(problems.length === 0 ? 0 : 1);
