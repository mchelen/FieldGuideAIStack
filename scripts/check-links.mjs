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
const CONCURRENCY = 4;

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
      return { status: res.status, finalUrl: res.url };
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
    const { status, error, finalUrl } = await probe(c.url);
    if (status >= 200 && status < 400) {
      if (finalUrl && finalUrl !== c.url) {
        warnings.push(`${c.node}: ${c.url} redirects to ${finalUrl}`);
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
