#!/usr/bin/env node
/**
 * Asserts that no page scrolls sideways on a phone.
 *
 * Horizontal overflow is the failure mode this site kept shipping: it is
 * invisible on a laptop, invisible in the diff, and every other check stays
 * green. Three separate causes were live at once before this existed -- a nav
 * that did not wrap, a grid track sized `1fr` (whose min-width is auto, so one
 * long chip widened the whole card), and `white-space: nowrap` on a chip
 * carrying a forty-character term.
 *
 * The signal is the document's own scrollWidth, not any element's width: a wide
 * element inside a scrolling wrapper is fine, and treating it as a finding
 * buries the real ones. So the culprit search skips anything with a scrolling
 * or clipping ancestor.
 *
 * Needs a browser, which CI does not have. It skips cleanly there rather than
 * failing, and is run wherever Chromium exists -- see AGENTS.md.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = '/FieldGuideAIStack';
const WIDTHS = [320, 390, 430, 768];

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.pdf': 'application/pdf', '.woff2': 'font/woff2',
};

let chromium;
for (const spec of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) {
  try {
    ({ chromium } = await import(spec));
    break;
  } catch {
    /* try the next */
  }
}
if (!chromium) {
  console.log('  skip  layout — no browser available (this check needs Chromium)');
  console.log('PASS  small-width layout — skipped');
  process.exit(0);
}

const server = createServer(async (req, res) => {
  const path = decodeURI(req.url.split('?')[0]).replace(BASE, '') || '/';
  for (const candidate of [join(DIST, path), join(DIST, path, 'index.html')]) {
    try {
      if (!(await stat(candidate)).isFile()) continue;
      res.writeHead(200, { 'content-type': TYPES[extname(candidate)] ?? 'application/octet-stream' });
      res.end(await readFile(candidate));
      return;
    } catch {
      /* try the next candidate */
    }
  }
  res.writeHead(404).end('not found');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}${BASE}`;

// One of every page type. A node page and a scenario page are picked by name
// rather than at random so a failure is reproducible.
const PAGES = [
  '/', '/quick-reference/', '/compare/', '/graph/', '/fieldwork/',
  '/fieldwork/the-overnight-run/', '/nodes/harness/',
  '/nodes/retrieval-augmented-generation/',
];

const browser = await chromium.launch();
const problems = [];

// The zoom control, asserted on what the page actually paints.
//
// check:output already compares each button's count against the cards that
// qualify, and that check passed while the control hid nothing at all: the
// script set the `hidden` attribute on 139 cards and the UA stylesheet's
// `[hidden] { display: none }` lost to a class selector setting `display: flex`.
// Counting the attribute measures the mechanism; counting client rects measures
// the reader's experience, and only the second one caught it.
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const res = await page.goto(`${origin}/`, { waitUntil: 'load' }).catch(() => null);
  if (!res || res.status() >= 400) {
    problems.push('index did not load — the zoom-control check could not run');
  } else {
    const seen = await page.evaluate(async () => {
      const cards = () => [...document.querySelectorAll('#concept-cards > .card')];
      const painted = () => cards().filter((c) => c.getClientRects().length > 0).length;
      const out = [];
      for (const b of document.querySelectorAll('.zoom-control button[data-zoom]')) {
        b.click();
        await new Promise((r) => requestAnimationFrame(r));
        out.push({
          level: Number(b.dataset.zoom),
          claimed: Number(b.querySelector('.zoom-count').textContent),
          painted: painted(),
        });
      }
      return out;
    });
    if (seen.length !== 3) {
      problems.push(`index: expected 3 zoom levels, the page rendered ${seen.length}`);
    }
    for (const s of seen) {
      if (s.painted !== s.claimed) {
        problems.push(
          `index: zoom level ${s.level} says ${s.claimed} concepts but paints ${s.painted}`,
        );
      }
    }
  }
  await page.close();
}
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of PAGES) {
    const res = await page.goto(origin + path, { waitUntil: 'load' }).catch(() => null);
    if (!res || res.status() >= 400) {
      problems.push(`${path} did not load (${res?.status() ?? 'error'}) — the check's own page list is stale`);
      continue;
    }
    const found = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = document.documentElement.scrollWidth - vw;
      if (over <= 0) return null;
      const culprits = [...document.querySelectorAll('body *')]
        .filter((n) => {
          const r = n.getBoundingClientRect();
          if (r.right <= vw + 0.5 && r.left >= -0.5) return false;
          for (let a = n.parentElement; a; a = a.parentElement) {
            const ox = getComputedStyle(a).overflowX;
            if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return false;
          }
          const pr = n.parentElement?.getBoundingClientRect();
          return !pr || (pr.right <= vw + 0.5 && pr.left >= -0.5);
        })
        .slice(0, 3)
        .map((n) => {
          const tag = `${n.tagName.toLowerCase()}${n.className ? `.${String(n.className).split(' ')[0]}` : ''}`;
          return `${tag} "${n.textContent.trim().slice(0, 40)}"`;
        });
      return { over, culprits };
    });
    if (found) {
      problems.push(
        `${path} at ${width}px scrolls sideways by ${found.over}px` +
          (found.culprits.length ? ` — ${found.culprits.join(', ')}` : ''),
      );
    }
  }
  await page.close();
}
await browser.close();
server.close();

for (const p of problems) console.log(`  FAIL  ${p}`);
console.log(
  `${problems.length ? 'FAIL' : 'PASS'}  rendered layout — ${PAGES.length} page(s) at ${WIDTHS.join(', ')}px plus the zoom control, ${problems.length} problem(s)`,
);
process.exit(problems.length ? 1 : 0);
