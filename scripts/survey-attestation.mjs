#!/usr/bin/env node
/**
 * Re-runs the glossary attestation survey behind `attestedBy` in the concept
 * inventory.
 *
 * `attestedBy` records which public glossaries were found to carry each term.
 * It is the "has the field settled this word" half of the zoom levels, and it
 * is shown to readers on every concept page, so it has to be a measurement
 * rather than a memory of one. This script is that measurement, re-runnable.
 *
 * Two things it is careful about, both learned by getting them wrong:
 *
 * Extraction is per source. One generic "take every heading" rule returned 731
 * terms from one glossary and zero from four others — and a survey run on that
 * would have replaced unreliable data with differently unreliable data that
 * merely looked freshly checked. Each source below names where its defined
 * terms actually live.
 *
 * Matching is exact on a normalised form, never substring. "Model" appears
 * inside half the entries of every glossary; a substring survey would report
 * the whole inventory as universally attested.
 *
 *   --write   rewrite the attestedBy lines in the inventory
 */
import { readFile, writeFile } from 'node:fs/promises';
import { loadNodes } from './lib/nodes.mjs';

const INVENTORY = new URL('../src/data/concept-inventory.yml', import.meta.url).pathname;
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const write = process.argv.includes('--write');

const strip = (h) =>
  h
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&lsquo;|&#x27;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&mdash;|&ndash;/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
const ids = (re) => (h) => [...h.matchAll(re)].map((m) => m[1]);

/** Where each surveyed glossary keeps the terms it defines. */
const SOURCES = {
  'google-ml': {
    url: 'https://developers.google.com/machine-learning/glossary',
    pick: ids(/<h2[^>]*\sid="([a-z0-9][a-z0-9-]*)"/g),
  },
  wikipedia: {
    url: 'https://en.wikipedia.org/wiki/Glossary_of_artificial_intelligence',
    pick: (h) => [...h.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/g)].map((m) => strip(m[1])),
  },
  'claude-code': {
    url: 'https://code.claude.com/docs/en/glossary',
    pick: ids(/<h[23][^>]*\sid="([a-z0-9][a-z0-9-]*)"/g),
  },
  // the id sits on a div nested inside the heading, not on the heading
  anthropic: {
    url: 'https://platform.claude.com/docs/en/about-claude/glossary',
    pick: ids(/<h2[^>]*>\s*<div[^>]*\sid="([a-z0-9][a-z0-9-]*)"/g),
  },
  // the id sits on the anchor inside the heading
  hf: {
    url: 'https://huggingface.co/docs/transformers/glossary',
    pick: ids(/<h[34][^>]*>\s*<a\s+id="([a-z0-9][a-z0-9-]*)"/g),
  },
  // an accordion: each term is the label of a disclosure button
  mistral: {
    url: 'https://docs.mistral.ai/getting-started/glossary',
    pick: (h) =>
      [...h.matchAll(/<h3[^>]*class="flex"[^>]*>([\s\S]*?)<\/h3>/g)].map((m) =>
        strip(m[1]).replace(/\s*(Models|Concepts|Billing|Agents|API)\s*$/, '').trim(),
      ),
  },
  // the term is the link's text; the href slug is an abbreviation ("fewshot")
  // that matches nothing a reader would call the technique. Slugs use
  // underscores as well as hyphens.
  promptguide: {
    url: 'https://www.promptingguide.ai/techniques',
    pick: (h) =>
      [...h.matchAll(/href="\/techniques\/[a-z0-9_-]+"[^>]*>([^<]{2,60})</g)].map((m) => strip(m[1])),
  },
  // a linked outline: its terms are the articles it links to, in the body only
  // — the sidebar otherwise contributes "Visit the main page". Parsoid serves
  // absolute hrefs, so do not require the /wiki/ prefix form.
  outline: {
    url: 'https://en.wikipedia.org/wiki/Outline_of_artificial_intelligence',
    pick: (h) => {
      const from = h.indexOf('mw-parser-output');
      const to = h.indexOf('printfooter');
      const body = from < 0 ? '' : h.slice(from, to > from ? to : undefined);
      return [...body.matchAll(/<a [^>]*\/wiki\/[^"]+"[^>]*title="([^":]{3,60})"/g)].map((m) =>
        strip(m[1]),
      );
    },
  },
};

const NAV = new Set([
  ...'abcdefghijklmnopqrstuvwxyz'.split(''),
  'glossary', 'on-this-page', 'introduction', 'overview', 'contents', 'see-also',
  'references', 'notes', 'navigation',
]);

/** Every spelling a term answers to, normalised to a slug. */
const forms = (raw) => {
  const base = String(raw).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
  const out = new Set();
  const add = (s) => {
    s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (s.length > 1) {
      out.add(s);
      out.add(s.endsWith('s') ? s.slice(0, -1) : `${s}s`);
    }
  };
  add(base);
  // A glossary may define the gerund for what the guide names as a noun:
  // Claude Code defines "sandboxing", this guide has Sandbox. Conservative —
  // only when a real word is left behind.
  if (/ing$/.test(base) && base.length >= 7) add(base.slice(0, -3));
  // Some glossaries suffix the initialism onto the anchor —
  // human-in-the-loop-hitl, retrieval-augmented-generation-rag. Index the form
  // without it when the last segment really is the initials of what precedes.
  const parts = base.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-');
  if (parts.length > 2) {
    const last = parts[parts.length - 1];
    const initials = parts.slice(0, -1).map((w) => w[0]).join('');
    if (last.length <= 5 && initials.endsWith(last)) add(parts.slice(0, -1).join(' '));
  }
  // "retrieval-augmented generation (rag)" also answers to each half
  const paren = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(base);
  if (paren) { add(paren[1]); add(paren[2]); }
  return out;
};

const index = {};
for (const [key, { url, pick }] of Object.entries(SOURCES)) {
  const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' } });
  if (!res.ok) {
    console.error(`${key}: HTTP ${res.status} — refusing to record a survey with a source missing`);
    process.exit(1);
  }
  const terms = [...new Set(pick(await res.text()).map((t) => t.toLowerCase().trim()))]
    .filter((t) => t && t.length > 1 && !NAV.has(t));
  // A source that suddenly defines nothing means the page changed shape, not
  // that it stopped being a glossary. Fail rather than quietly record zeroes.
  if (terms.length < 5) {
    console.error(`${key}: only ${terms.length} defined terms found — the page's markup has probably changed`);
    process.exit(1);
  }
  index[key] = new Set(terms.flatMap((t) => [...forms(t)]));
  console.log(`  ${key.padEnd(12)} ${String(terms.length).padStart(4)} defined terms`);
}

/**
 * A second kind of evidence, and the better kind where it exists.
 *
 * String matching cannot see that Google's glossary defines "embedding vector"
 * and the guide calls it Embedding, or that the Claude Code glossary defines
 * "agentic harness" and "sandboxing" for what this guide calls Harness and
 * Sandbox. Loosening the matcher to catch those would start inventing hits.
 *
 * But a human already checked: those pages carry a `canonical` block citing
 * that glossary by URL with a date. That is a verified attestation, so count
 * it. Automated matching finds what a human has not got to yet; this finds what
 * a human confirmed and a matcher cannot see.
 */
const BY_URL = Object.fromEntries(
  Object.entries(SOURCES).map(([key, { url }]) => [url.replace(/^https?:\/\//, '').replace(/\/$/, ''), key]),
);
const cited = new Map();
for (const n of await loadNodes()) {
  const urls = [
    n.data?.canonical?.url,
    ...(n.data?.aka ?? []).map((a) => (typeof a === 'string' ? null : a.url)),
  ].filter(Boolean);
  for (const u of urls) {
    const bare = u.replace(/^https?:\/\//, '').replace(/[#?].*$/, '').replace(/\/$/, '');
    const key = BY_URL[bare];
    if (!key) continue;
    if (!cited.has(n.id)) cited.set(n.id, new Set());
    cited.get(n.id).add(key);
  }
}
console.log(`  ${cited.size} page(s) cite a surveyed glossary directly`);

const lines = (await readFile(INVENTORY, 'utf8')).split('\n');
const entries = [];
let cur = null;
for (let i = 0; i < lines.length; i += 1) {
  const t = /^ {2}- term:\s*(.+)$/.exec(lines[i]);
  if (t) { cur = { term: t[1].trim(), aka: [], before: [] }; entries.push(cur); continue; }
  if (!cur) continue;
  const slug = /^ {4}slug:\s*(\S+)/.exec(lines[i]);
  if (slug) cur.slug = slug[1];
  const aka = /^ {4}aka:\s*\[([^\]]*)\]/.exec(lines[i]);
  if (aka) cur.aka = aka[1].split(',').map((x) => x.trim()).filter(Boolean);
  const at = /^ {4}attestedBy:\s*\[([^\]]*)\]/.exec(lines[i]);
  if (at) { cur.line = i; cur.before = at[1].split(',').map((x) => x.trim()).filter(Boolean); }
}

let gains = 0, losses = 0;
for (const e of entries) {
  const candidates = new Set([
    ...forms(e.term),
    ...(e.slug ? forms(e.slug) : []),
    ...e.aka.flatMap((a) => [...forms(a)]),
  ]);
  const matched = Object.keys(index).filter((k) => [...candidates].some((c) => index[k].has(c)));
  e.after = [...new Set([...matched, ...(cited.get(e.slug) ?? [])])].sort(
    (a, b) => Object.keys(SOURCES).indexOf(a) - Object.keys(SOURCES).indexOf(b),
  );
  const changed = e.before.slice().sort().join(',') !== e.after.slice().sort().join(',');
  if (changed) (e.after.length > e.before.length ? gains++ : losses++);
  if (changed && e.after.length < e.before.length) {
    console.log(`  lost   ${e.term} — [${e.before.join(' ')}] -> [${e.after.join(' ')}]`);
  }
}

console.log(
  `\n${entries.length} terms · ${gains} gained a source, ${losses} lost one · ` +
    `${entries.filter((e) => e.after.length).length} attested at all (was ${entries.filter((e) => e.before.length).length})`,
);
for (const k of Object.keys(index)) {
  console.log(`  ${k.padEnd(12)} ${entries.filter((e) => e.after.includes(k)).length} terms`);
}

if (!write) {
  console.log('\n(dry run — pass --write to update the inventory)');
  process.exit(0);
}
for (const e of entries) {
  if (e.line == null) continue;
  lines[e.line] = `    attestedBy: [${e.after.join(', ')}]`;
}
await writeFile(INVENTORY, lines.join('\n'));
console.log('\ninventory updated');
