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
import { readdir, readFile, stat } from 'node:fs/promises';
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
  '/nodes/retrieval-augmented-generation/', '/nodes/prompt-caching/',
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
// Search, exercised the way a reader uses it: type, and see what comes back.
//
// The case that matters is the alias one. The charter's whole framing is that
// you saw a word in the wild and want its page, and the words people meet are
// often not the titles here -- so a search that indexes titles alone answers
// "no such thing" to the question the guide exists to answer.
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const res = await page.goto(`${origin}/`, { waitUntil: 'load' }).catch(() => null);
  if (!res || res.status() >= 400) {
    problems.push('index did not load — the search check could not run');
  } else if (!(await page.locator('.site-search').isVisible())) {
    problems.push('search box did not appear (its script did not run)');
  } else {
    // term typed -> page it must find. Two aliases, one title, one miss.
    const CASES = [
      ['scaffolding', 'Harness'],
      ['agent framework', 'Harness'],
      ['context window', 'Context Window'],
      ['zzzznotaterm', null],
    ];
    for (const [term, expected] of CASES) {
      await page.fill('#site-q', '');
      await page.type('#site-q', term, { delay: 5 });
      await page.waitForTimeout(250);
      const top = await page.evaluate(
        () => document.querySelector('#site-results li .r-title')?.textContent ?? null,
      );
      if (top !== expected) {
        problems.push(
          `search: "${term}" returned ${top ? `"${top}"` : 'nothing'}, expected ${expected ? `"${expected}"` : 'nothing'}`,
        );
      }
    }
  }
  await page.close();
}

// The applied illustration is SVG scaled by its viewBox, so its type size is a
// property of how wide the page let it be -- not of the font-size in the
// stylesheet, which reads 15px at every width and tells you nothing. Measure
// what a reader actually gets.
const MIN_TYPE_PX = 11;
{
  const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
  const res = await page.goto(`${origin}/nodes/prompt-caching/`, { waitUntil: 'load' }).catch(() => null);
  if (!res || res.status() >= 400) {
    problems.push('prompt-caching did not load — the illustration check could not run');
  } else {
    const seen = await page.evaluate(() => {
      const svg = document.querySelector('.flow svg');
      if (!svg) return null;
      const vb = svg.viewBox.baseVal;
      const scale = svg.getBoundingClientRect().width / vb.width;
      const size = (sel) => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize) * scale;
      return {
        boxes: document.querySelectorAll('.flow-box').length,
        linked: document.querySelectorAll('.flow a').length,
        self: document.querySelectorAll('.flow-box.is-self').length,
        bands: document.querySelectorAll('.flow-band').length,
        title: size('.flow-title'),
        does: size('.flow-does'),
      };
    });
    if (!seen) problems.push('prompt-caching has a flow block but rendered no illustration');
    else {
      if (seen.boxes < 3) problems.push(`illustration drew ${seen.boxes} stations, expected at least 3`);
      if (seen.self !== 1) problems.push(`illustration highlighted ${seen.self} stations as this concept, expected 1`);
      if (seen.linked < 1) problems.push('illustration linked no station to its page');
      if (seen.bands < 2) {
        problems.push(`illustration drew ${seen.bands} machine band(s) — prompt-caching's flow crosses more than one`);
      }
      for (const [what, px] of [['title', seen.title], ['step text', seen.does]]) {
        if (px < MIN_TYPE_PX) {
          problems.push(
            `illustration ${what} renders at ${px.toFixed(1)}px at 320px wide — under the ${MIN_TYPE_PX}px floor`,
          );
        }
      }
    }
  }
  await page.close();
}

// Every label in every illustration, measured against the box it sits in.
// A title that overflows is invisible to the HTML overflow sweep -- SVG text
// does not affect scrollWidth -- and "Retrieval-augmented generation" ran out
// of its box and straight through the return arrow with every check green.
{
  const dir = new URL('../dist/nodes/', import.meta.url).pathname;
  const withFlows = [];
  for (const id of await readdir(dir)) {
    const html = await readFile(join(dir, id, 'index.html'), 'utf8').catch(() => '');
    if (html.includes('<figure class="flow')) withFlows.push(id);
  }
  const page = await browser.newPage({ viewport: { width: 768, height: 900 } });
  for (const id of withFlows) {
    const res = await page.goto(`${origin}/nodes/${id}/`, { waitUntil: 'load' }).catch(() => null);
    if (!res || res.status() >= 400) {
      problems.push(`${id}: illustration page did not load`);
      continue;
    }
    const spills = await page.evaluate(() => {
      const out = [];
      const fits = (text, frame, slack) => {
        const r = text.getBBox();
        return r.x + r.width <= frame.x + frame.width - slack && r.y + r.height <= frame.y + frame.height;
      };
      for (const box of document.querySelectorAll('.flow-box')) {
        const b = box.getBBox();
        for (const t of box.parentElement.querySelectorAll('text')) {
          if (!fits(t, b, 4)) out.push(t.textContent.trim().slice(0, 40));
        }
      }
      // Band labels sit outside any box, so the sweep above never sees them.
      for (const band of document.querySelectorAll('.flow-band')) {
        const rect = band.querySelector('.flow-band-box').getBBox();
        const label = band.querySelector('.flow-band-label');
        if (!fits(label, rect, 8)) out.push(label.textContent.trim().slice(0, 40));
      }
      return out;
    });
    for (const label of spills.slice(0, 3)) {
      problems.push(`${id}: illustration label "${label}" runs outside its box`);
    }
  }
  await page.close();
  if (!withFlows.length) problems.push('no page carries an applied illustration to check');
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
  `${problems.length ? 'FAIL' : 'PASS'}  rendered layout — ${PAGES.length} page(s) at ${WIDTHS.join(', ')}px plus the zoom control and the applied illustration, ${problems.length} problem(s)`,
);
process.exit(problems.length ? 1 : 0);
