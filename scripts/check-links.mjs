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
/** Below this, a page is navigation rather than content. */
const THIN_CHARS = 4000;
const CONCURRENCY = 4;

/** Characters of text a reader would actually see, or null if it can't be read. */
async function readableChars(url, signal) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    });
    if (!res.ok) return null;
    return (await res.text())
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim().length;
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
      const chars = html ? await readableChars(url, ctl.signal) : null;
      return { status: res.status, finalUrl: res.url, chars };
    } catch (err) {
      if (method === 'GET') return { status: 0, error: String(err.message ?? err) };
    } finally {
      clearTimeout(timer);
    }
  }
  return { status: 0, error: 'unreachable' };
}

const targets = [...new Map(citations(await loadNodes()).map((c) => [c.url, c])).values()];
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
      // A live page can still be unusable as evidence: a landing page for a
      // PDF, or one whose substance arrives by JavaScript. Nothing on it can
      // be quoted, so the citation can never be re-verified automatically and
      // a reader who follows it finds navigation. Cite the document that
      // carries the claim instead.
      if (chars !== null && chars < THIN_CHARS) {
        warnings.push(
          `${c.node}: ${c.url} has only ${chars} characters of readable text — nothing on it can be quoted`,
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
