#!/usr/bin/env node
/**
 * Flags claims whose `verifiedOn` has aged out. Products change faster than
 * prose gets revisited; this is the tripwire.
 *
 *   --max-age <days>   default 180
 *   --strict           exit non-zero when anything is stale (used by the
 *                      scheduled job, not by PR CI)
 */
import { citations, loadNodes, asDate, report } from './lib/nodes.mjs';

const args = process.argv.slice(2);
const maxAge = Number(args[args.indexOf('--max-age') + 1]) || 180;
const strict = args.includes('--strict');

const now = Date.now();
const stale = [];

for (const c of citations(await loadNodes())) {
  const days = Math.floor((now - asDate(c.verifiedOn).getTime()) / 86_400_000);
  if (days > maxAge) {
    stale.push(`${c.node} — ${c.title} (${days}d old) ${c.url}`);
  }
}

console.log(`Freshness threshold: ${maxAge} days.`);
process.exit(
  report('freshness', strict ? stale : [], strict ? [] : stale) ? 0 : 1,
);
