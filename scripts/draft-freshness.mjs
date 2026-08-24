#!/usr/bin/env node
/**
 * Drafts the freshness work instead of only reporting it.
 *
 * `check:freshness` says which citations have aged out. That is a list of
 * chores. This re-reads each page and, where a source stored the sentence it
 * was citing, checks whether that sentence is still there — so the weekly job
 * can open a pull request that has already done the verifiable part.
 *
 * The rule it must never break: **a date is bumped only when this script has
 * re-read the page and found the quoted text still on it.** Confirming that a
 * URL returns 200 is not verification; it is the failure this guards against.
 * Sources with no `quote` are therefore never auto-bumped — they are reported
 * as needing a human to read the page and add one, after which they become
 * re-verifiable for good.
 *
 *   --max-age <days>   default 180
 *   --write            edit the files (otherwise report only)
 *   --json             emit the summary as JSON for the workflow
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadNodes, asDate, NODES_DIR } from './lib/nodes.mjs';

const args = process.argv.slice(2);
const maxAge = Number(args[args.indexOf('--max-age') + 1]) || 180;
const write = args.includes('--write');
const asJson = args.includes('--json');

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const TIMEOUT_MS = 25_000;
const CONCURRENCY = 4;

/** Page text, flattened enough that a quote survives markup and re-wrapping. */
const normalise = (s) =>
  s
    .replace(/[\u200b-\u200f\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    // Stripping an inline tag leaves a space before the punctuation that
    // followed it -- "automatic evaluation ." -- so a quote copied from the
    // page as a human reads it would never match the flattened text.
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .trim()
    .toLowerCase();

const textOf = (html) =>
  normalise(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
      .replace(/&mdash;|&ndash;/g, '-'),
  );

async function fetchPage(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctl.signal,
      // accept-language, because at least one cited page (Google's ML glossary)
      // serves a different translation of the same URL from one fetch to the
      // next. A quote stored in English would then read as "the claim changed"
      // when nothing had.
      headers: { 'user-agent': UA, accept: 'text/html,*/*', 'accept-language': 'en-US,en;q=0.9' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const html = await res.text();
    const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.replace(/\s+/g, ' ').trim();
    return { text: textOf(html), title };
  } catch (err) {
    return { error: String(err.message ?? err) };
  } finally {
    clearTimeout(timer);
  }
}

// ---- what needs looking at -------------------------------------------------

const nodes = await loadNodes();
const now = Date.now();
const stale = [];
for (const n of nodes) {
  for (const s of n.data?.sources ?? []) {
    const days = Math.floor((now - asDate(s.verifiedOn).getTime()) / 86_400_000);
    if (days > maxAge) stale.push({ node: n.id, ...s, days });
  }
}

if (stale.length === 0) {
  console.log(`Nothing older than ${maxAge} days. No draft needed.`);
  if (asJson) console.log(JSON.stringify({ confirmed: [], manual: [] }));
  process.exit(0);
}

// One fetch per URL however many citations share it.
const pages = new Map();
const urls = [...new Set(stale.map((s) => s.url))];
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      pages.set(url, await fetchPage(url));
    }
  }),
);

const confirmed = [];
const manual = [];
for (const s of stale) {
  const page = pages.get(s.url);
  if (!s.quote) {
    manual.push({ ...s, why: 'no quote stored — read the page and add one, then it is re-verifiable' });
  } else if (page.error) {
    manual.push({ ...s, why: `could not be fetched (${page.error}) — open it in a browser` });
  } else if (page.text.includes(normalise(s.quote))) {
    confirmed.push({ ...s, pageTitle: page.title });
  } else {
    manual.push({
      ...s,
      why: 'the quoted sentence is no longer on the page — the claim may have changed',
      pageTitle: page.title,
    });
  }
}

// ---- the edit --------------------------------------------------------------
// Narrow on purpose. This only ever moves a date, and proves it did: the file
// is re-read after writing and every differing line must be the verifiedOn of a
// source this run confirmed. Anything else and the file is put back.

const today = new Date(now).toISOString().slice(0, 10);
const touched = [];
if (write && confirmed.length) {
  const byNode = new Map();
  for (const c of confirmed) {
    if (!byNode.has(c.node)) byNode.set(c.node, []);
    byNode.get(c.node).push(c);
  }
  for (const [node, items] of byNode) {
    const file = join(NODES_DIR, `${node}.md`);
    const before = await readFile(file, 'utf8');
    const lines = before.split('\n');
    const wanted = new Set();
    let currentId = null;
    for (let i = 0; i < lines.length; i += 1) {
      const idMatch = /^\s*-\s+id:\s*(\S+)/.exec(lines[i]);
      if (idMatch) currentId = idMatch[1];
      const dateMatch = /^(\s*)verifiedOn:\s*(\S+)/.exec(lines[i]);
      if (dateMatch && items.some((it) => it.id === currentId)) {
        lines[i] = `${dateMatch[1]}verifiedOn: ${today}`;
        wanted.add(i);
      }
    }
    const after = lines.join('\n');
    await writeFile(file, after);

    const check = (await readFile(file, 'utf8')).split('\n');
    const original = before.split('\n');
    const unexpected = check
      .map((line, i) => (line === original[i] || wanted.has(i) ? null : i + 1))
      .filter((i) => i !== null);
    if (unexpected.length || check.length !== original.length) {
      await writeFile(file, before);
      console.error(
        `refusing to draft ${node}.md — the edit would have changed line(s) ${unexpected.join(', ')} beyond a verifiedOn date`,
      );
      process.exit(1);
    }
    touched.push(node);
  }
}

// ---- the report ------------------------------------------------------------

const summary = {
  maxAge,
  today,
  confirmed: confirmed.map((c) => ({ node: c.node, id: c.id, url: c.url, days: c.days })),
  manual: manual.map((m) => ({ node: m.node, id: m.id, url: m.url, days: m.days, why: m.why, pageTitle: m.pageTitle })),
  touched,
};
if (asJson) {
  console.log(JSON.stringify(summary));
  process.exit(0);
}

console.log(`Stale beyond ${maxAge} days: ${stale.length} citation(s) across ${urls.length} URL(s).\n`);
if (confirmed.length) {
  console.log(`Re-verified (quote still on the page) — ${confirmed.length}:`);
  for (const c of confirmed) console.log(`  ${c.node} · ${c.id} (${c.days}d) ${c.url}`);
  console.log(write ? `\nBumped to ${today} in: ${[...new Set(touched)].join(', ')}\n` : '\n(dry run — pass --write to bump)\n');
}
if (manual.length) {
  console.log(`Needs a human — ${manual.length}:`);
  for (const m of manual) console.log(`  ${m.node} · ${m.id} (${m.days}d) — ${m.why}\n    ${m.url}`);
}
