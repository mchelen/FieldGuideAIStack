#!/usr/bin/env node
/**
 * Coverage report against the concept inventory.
 *
 * The inventory is the list of terms this guide means to cover. Without it,
 * coverage is whatever anyone happened to think of — which is how command
 * execution and memory both went missing while being described in prose on
 * pages that already existed.
 */
import { readFile, readdir } from 'node:fs/promises';

const INVENTORY = new URL('../src/data/concept-inventory.yml', import.meta.url).pathname;
const NODES = new URL('../src/content/nodes/', import.meta.url).pathname;

const raw = await readFile(INVENTORY, 'utf8');

// Deliberately a small hand parser rather than a YAML dependency: the file has
// one fixed shape, and the check should not be able to fail for reasons of its
// own.
const entries = [];
let cur = null;
for (const line of raw.split('\n')) {
  const term = line.match(/^ {2}- term:\s*(.+)$/);
  if (term) {
    cur = { term: term[1].trim() };
    entries.push(cur);
    continue;
  }
  if (!cur) continue;
  const kv = line.match(/^ {4}(slug|area|status|attestedBy):\s*(.*)$/);
  if (kv) cur[kv[1]] = kv[2].trim();
}

// Products are not concepts and do not belong in a concept inventory, so they
// are excluded rather than reported as untracked forever.
const files = (await readdir(NODES)).filter((f) => f.endsWith('.md'));
const kinds = new Map();
for (const f of files) {
  const body = await readFile(NODES + f, 'utf8');
  kinds.set(f.replace(/\.md$/, ''), /^kind:\s*product/m.test(body) ? 'product' : 'concept');
}
const existing = new Set([...kinds].filter(([, k]) => k === 'concept').map(([id]) => id));

const written = entries.filter((e) => existing.has(e.slug));
const pending = entries.filter((e) => !existing.has(e.slug));

const byArea = new Map();
for (const e of entries) {
  const a = byArea.get(e.area) ?? { total: 0, done: 0 };
  a.total++;
  if (existing.has(e.slug)) a.done++;
  byArea.set(e.area, a);
}

const attested = entries.filter((e) => e.attestedBy && e.attestedBy !== '[]').length;
const pct = Math.round((written.length / entries.length) * 100);

console.log(`Concept inventory: ${written.length}/${entries.length} written (${pct}%)`);
console.log(
  `  ${attested} of ${entries.length} appear in a public glossary; the rest are specific to the applied stack.`,
);
for (const [area, a] of [...byArea].sort((x, y) => y[1].total - x[1].total)) {
  const bar = '█'.repeat(Math.round((a.done / a.total) * 12)).padEnd(12, '·');
  console.log(`  ${bar}  ${String(a.done).padStart(2)}/${String(a.total).padEnd(2)}  ${area}`);
}

// Nodes that exist but are not in the inventory. Not a fault — products and
// some concepts arrived before the list did — but worth seeing, since it is
// how the inventory drifts out of date.
const slugs = new Set(entries.map((e) => e.slug));
const unlisted = [...existing].filter((s) => !slugs.has(s)).sort();
if (unlisted.length) {
  console.log(`\n  ${unlisted.length} concept page(s) not in the inventory: ${unlisted.join(', ')}`);
}
console.log(`\n  next up: ${pending.slice(0, 8).map((e) => e.term).join(', ')}`);
