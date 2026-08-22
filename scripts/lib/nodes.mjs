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
        return { id: file.replace(/\.md$/, ''), file, data: null, content: '', parseError: String(err.message ?? err).split('\n')[0] };
      }
    }),
  );
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
