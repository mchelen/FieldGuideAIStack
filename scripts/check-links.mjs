#!/usr/bin/env node
/**
 * Verifies every cited URL still resolves.
 *
 * Publishers routinely block automated clients, so a bot-block status is
 * reported as "blocked" rather than as a broken link. Only genuine 404/410/DNS
 * failures fail the job.
 */
import { citations, loadNodes, report } from './lib/nodes.mjs';

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const TIMEOUT_MS = 20_000;
/** Statuses that mean "a human can read this, a script cannot". */
const BOT_BLOCKED = new Set([400, 401, 403, 429]);
/**
 * Below this many characters of prose, a page has nothing on it to cite.
 *
 * Deliberately tiny. The first version of this check counted all readable
 * text and warned under 4,000, which flagged thirteen pages -- five of which
 * already carried quotes that re-verify on every run. Volume does not separate
 * the two: Stanford's CRFM page is quotable at 1,309 characters of prose and
 * Hugging Face's tokenizers index is not at 2,239. What is unambiguous is a
 * page with no prose at all, which is what a JavaScript shell serves to a
 * fetcher, and that is all this now claims to find.
 */
const NO_PROSE_CHARS = 400;
const CONCURRENCY = 4;

/** Characters inside sentences long enough to be evidence, or null if unreadable. */
async function proseChars(url, signal) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    });
    if (!res.ok) return null;
    const text = (await res.text())
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => sentence.length >= 60 && /[a-z]{3}/.test(sentence))
      .reduce((n, sentence) => n + sentence.length, 0);
  } catch {
    return null;
  }
}

async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctl.signal,
        headers: { 'user-agent': UA, accept: '*/*' },
      });
      // Plenty of servers reject HEAD outright (405, but also 400/403).
      // Always give GET a chance before calling a URL broken.
      if (method === 'HEAD' && res.status >= 400) continue;
      const html = (res.headers.get('content-type') ?? '').includes('html');
      // A HEAD tells us the URL is alive and nothing else. Whether there is
      // anything on the page worth citing needs the body, so an HTML page gets
      // a GET as well. Measuring on the GET branch alone was the first attempt
      // and it never ran: HEAD succeeds on almost everything, so the loop
      // returned before the GET, and the check reported nothing on 112 URLs.
      const chars = html ? await proseChars(url, ctl.signal) : null;
      return { status: res.status, finalUrl: res.url, chars };
    } catch (err) {
      if (method === 'GET') return { status: 0, error: String(err.message ?? err) };
    } finally {
      clearTimeout(timer);
    }
  }
  return { status: 0, error: 'unreachable' };
}

const nodes = await loadNodes();
const targets = [...new Map(citations(nodes).map((c) => [c.url, c])).values()];

/**
 * URLs a page actually cites at a claim, via `[[cite:id]]` in its prose.
 *
 * The no-prose warning applies only to these. A source listed to anchor a
 * product name -- every `examples` entry needs one -- is evidence that the
 * thing exists at that URL, which the URL itself supplies; HELM's leaderboard
 * is a JavaScript app and is still exactly the right place to send someone
 * looking at leaderboards. A source cited at a claim is a different promise:
 * the reader is being told the page says something.
 */
const claimUrls = new Set();
for (const n of nodes.filter((x) => x.data)) {
  const cited = new Set([...(n.content ?? '').matchAll(/\[\[cite:([a-z0-9-]+)\]\]/g)].map((m) => m[1]));
  for (const src of n.data.sources ?? []) if (cited.has(src.id)) claimUrls.add(src.url);
}
const problems = [];
const warnings = [];

let cursor = 0;
async function worker() {
  while (cursor < targets.length) {
    const c = targets[cursor++];
    const { status, error, finalUrl, chars } = await probe(c.url);
    if (status >= 200 && status < 400) {
      if (finalUrl && finalUrl !== c.url) {
        warnings.push(`${c.node}: ${c.url} redirects to ${finalUrl}`);
      }
      // A live page can still be no evidence at all: a JavaScript shell that
      // serves a fetcher an empty frame. Nothing on it can be quoted, the
      // citation can never be re-verified, and a reader who follows it finds
      // nothing to check. Cite the document that carries the claim instead.
      if (chars !== null && chars < NO_PROSE_CHARS && claimUrls.has(c.url)) {
        warnings.push(
          `${c.node}: ${c.url} serves ${chars} characters of prose — a reader following it finds no claim to check`,
        );
      }
    } else if (BOT_BLOCKED.has(status)) {
      // A live page behind an anti-automation gate. Reported so a human can
      // re-verify by hand, but not treated as rot -- failing on these would
      // train everyone to ignore this job.
      warnings.push(`${c.node}: ${c.url} blocked automated access (HTTP ${status})`);
    } else {
      problems.push(`${c.node}: ${c.url} — ${error ?? `HTTP ${status}`}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`Probed ${targets.length} distinct URLs.`);
process.exit(report('link check', problems, warnings) ? 0 : 1);
