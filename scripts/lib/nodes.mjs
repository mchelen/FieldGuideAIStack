import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

export const NODES_DIR = new URL('../../src/content/nodes/', import.meta.url)
  .pathname;

/**
 * Reads node files without booting Astro, so the validators can run in CI
 * before (and independently of) a build.
 */
export async function loadNodes() {
  const files = (await readdir(NODES_DIR)).filter((f) => f.endsWith('.md'));
  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(NODES_DIR, file), 'utf8');
      try {
        const { data, content } = matter(raw);
        return { id: file.replace(/\.md$/, ''), file, data, content };
      } catch (err) {
        // Malformed frontmatter should read as a validation failure with a
        // filename, not as a YAML library stack trace.
        // `raw` comes back with the error so a caller can point at the offending
        // line rather than only relaying the parser's line/column.
        return { id: file.replace(/\.md$/, ''), file, data: null, content: '', raw, parseError: String(err.message ?? err).split('\n')[0] };
      }
    }),
  );
}

/**
 * The relation verbs, mirrored from src/content.config.ts. Duplicated rather
 * than imported because the validators deliberately run without booting Astro
 * or TypeScript; `npm run validate` fails if the two ever disagree.
 */
export const RELATION_TYPES = {
  'part-of': { label: 'is part of', inverse: 'contains' },
  contains: { label: 'contains', inverse: 'part-of' },
  'distinguished-from': { label: 'is often confused with', inverse: 'distinguished-from' },
  consumes: { label: 'consumes', inverse: 'consumed-by' },
  'consumed-by': { label: 'is consumed by', inverse: 'consumes' },
  implements: { label: 'implements', inverse: 'implemented-by' },
  'implemented-by': { label: 'is implemented by', inverse: 'implements' },
  'kind-of': { label: 'is a kind of', inverse: 'has-kind' },
  'has-kind': { label: 'has kind', inverse: 'kind-of' },
  'runs-on': { label: 'runs on', inverse: 'hosts' },
  hosts: { label: 'hosts', inverse: 'runs-on' },
  bundles: { label: 'bundles', inverse: 'bundled-by' },
  'bundled-by': { label: 'is bundled by', inverse: 'bundles' },
  'variant-of': { label: 'is a variant of', inverse: 'has-variant' },
  'has-variant': { label: 'has variant', inverse: 'variant-of' },
};

/**
 * Every edge in the graph, authored and derived. An author declares an edge
 * once, from whichever side reads more naturally; the inverse is generated
 * here so the two can never disagree. Mirrors src/lib/graph.ts, for the same
 * reason RELATION_TYPES is mirrored above.
 */
export function buildEdges(nodes) {
  const edges = new Map();
  for (const n of nodes) {
    for (const rel of n.data?.relations ?? []) {
      const fwd = { from: n.id, to: rel.target, type: rel.type, label: RELATION_TYPES[rel.type].label, derived: false };
      edges.set(`${fwd.from}|${fwd.type}|${fwd.to}`, fwd);
      const inv = RELATION_TYPES[rel.type].inverse;
      const rev = { from: rel.target, to: n.id, type: inv, label: RELATION_TYPES[inv].label, derived: true };
      const key = `${rev.from}|${rev.type}|${rev.to}`;
      if (!edges.has(key)) edges.set(key, rev);
    }
  }
  return [...edges.values()];
}

/**
 * How many other pages are written in terms of each concept — counted once per
 * page, because a page saying "harness" nine times is one page that depends on
 * the word.
 *
 * This is the popularity half of the zoom levels: the terms the rest of the
 * guide explains itself with are the ones a reader meets first. Shared with
 * src/lib/levels.ts rather than reimplemented there, so the number on the page
 * and the number the validator checks against cannot drift apart.
 *
 * `docs` is [{ id, body }] — raw markdown, from either loader.
 */
export function reachOf(docs) {
  const ids = new Set(docs.map((d) => d.id));
  const reach = new Map(docs.map((d) => [d.id, 0]));
  for (const d of docs) {
    const seen = new Set();
    for (const m of (d.body ?? '').matchAll(/\]\(([a-z0-9-]+)\)/g)) {
      if (ids.has(m[1]) && m[1] !== d.id) seen.add(m[1]);
    }
    for (const t of seen) reach.set(t, (reach.get(t) ?? 0) + 1);
  }
  return reach;
}

/** Every source and example URL in the graph, tagged with where it came from. */
export function citations(nodes) {
  const out = [];
  for (const n of nodes) {
    for (const s of n.data.sources ?? []) {
      out.push({ node: n.id, kind: 'source', url: s.url, title: s.title, verifiedOn: s.verifiedOn });
    }
    for (const e of n.data.examples ?? []) {
      out.push({ node: n.id, kind: 'example', url: e.url, title: e.name, verifiedOn: e.verifiedOn });
    }
  }
  return out;
}

export const asDate = (v) => (v instanceof Date ? v : new Date(v));

export function report(name, problems, warnings = []) {
  for (const w of warnings) console.log(`  warn  ${w}`);
  for (const p of problems) console.log(`  FAIL  ${p}`);
  const ok = problems.length === 0;
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name} — ${problems.length} error(s), ${warnings.length} warning(s)`,
  );
  return ok;
}
