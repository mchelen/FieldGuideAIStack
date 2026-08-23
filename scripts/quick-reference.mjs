#!/usr/bin/env node
/**
 * Build the shareable quick reference cards.
 *
 * The charter asks for "single-page quick references and diagrams that can be
 * shared and reused". This emits a set of them, three files per card from a
 * single source:
 *
 *   src/generated/<slug>.html   the fragment the site page inlines
 *   public/<slug>.png           the shareable raster (3200x1800)
 *   public/<slug>.pdf           vector, for slides and print
 *
 * Content lives in lib/quick-reference-cards.mjs, layout in
 * lib/quick-reference-view.mjs. Two things are checked rather than trusted.
 *
 * Every concept a card names must be a real node, so a renamed page breaks this
 * build instead of leaving a stale term in an image already on someone else's
 * timeline. And each card's rendered height must actually be 900px: an earlier
 * version shipped a footer sitting on top of a band because the layout was
 * arithmetic done by hand and got wrong. Now the browser lays it out and then
 * reports back -- and note what that takes, because scrollHeight alone reported
 * "900px of 900px" while a grid overflowed its flex parent and painted straight
 * over the footer. It needs a per-element sweep of bottom edges.
 */
import { writeFile, readdir, mkdir } from 'node:fs/promises';
import { buildFragment, idsIn, WIDTH, HEIGHT } from './lib/quick-reference-view.mjs';
import { CARDS } from './lib/quick-reference-cards.mjs';

const PUBLIC = new URL('../public/', import.meta.url).pathname;
const GEN = new URL('../src/generated/', import.meta.url).pathname;
const NODES = new URL('../src/content/nodes/', import.meta.url).pathname;

// ---- drift check ----------------------------------------------------------

const nodeIds = new Set(
  (await readdir(NODES)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
);
let broken = 0;
for (const card of CARDS) {
  const missing = idsIn(card).filter((id) => !nodeIds.has(id));
  if (missing.length) {
    console.error(`${card.slug} names concepts that are not nodes: ${missing.join(', ')}`);
    broken += 1;
  }
}
if (broken) process.exit(1);

// Slugs become filenames and URLs, so a duplicate would silently overwrite the
// card before it rather than fail.
const dupes = CARDS.map((c) => c.slug).filter((s, i, a) => a.indexOf(s) !== i);
if (dupes.length) {
  console.error(`duplicate card slugs: ${[...new Set(dupes)].join(', ')}`);
  process.exit(1);
}

const fragments = new Map(CARDS.map((card) => [card.slug, buildFragment(card)]));

// ---- raster and vector ----------------------------------------------------
// Social cards and chat clients will not render an HTML fragment, so the PNG is
// the actual deliverable. Rasterised with whatever Chromium is to hand; with
// none, the fragments are still written and the images left alone.
let chromium;
for (const spec of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) {
  try {
    ({ chromium } = await import(spec));
    break;
  } catch {
    /* try the next */
  }
}
await mkdir(GEN, { recursive: true });

if (!chromium) {
  for (const [slug, html] of fragments) await writeFile(`${GEN}${slug}.html`, html);
  console.log(`no playwright available — ${fragments.size} fragment(s) written unchecked, images left alone`);
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});

const overflowing = [];
for (const card of CARDS) {
  const fragment = fragments.get(card.slug);
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">` +
      `<style>html,body{margin:0;padding:0}</style></head><body>${fragment}</body></html>`,
    { waitUntil: 'load' },
  );

  const fit = await page.evaluate(() => {
    const el = document.querySelector('.qr');
    const cls = (n) => `.${String(n.className).split(' ')[0] || n.tagName}`;
    const floor = el.getBoundingClientRect().bottom - parseFloat(getComputedStyle(el).paddingBottom);
    const over = [...el.querySelectorAll('*')]
      .filter((n) => n.getBoundingClientRect().bottom > floor + 0.5)
      .map((n) => `${cls(n)} by ${Math.ceil(n.getBoundingClientRect().bottom - floor)}px`);
    // Sibling overlap is its own failure. A band can sit entirely inside the
    // frame and still be painted over by the block above it, which neither the
    // height nor the bottom-edge sweep can see.
    const bands = [...el.children];
    const collisions = bands
      .slice(0, -1)
      .map((n, i) => [n, bands[i + 1]])
      .filter(([a, b]) => a.getBoundingClientRect().bottom > b.getBoundingClientRect().top + 0.5)
      .map(([a, b]) => `${cls(a)} over ${cls(b)}`);
    return { content: el.scrollHeight, frame: el.clientHeight, over: [...new Set(over)], collisions };
  });
  if (fit.content > fit.frame + 1 || fit.over.length || fit.collisions.length) {
    overflowing.push(
      `${card.slug}: content is ${fit.content}px in a ${fit.frame}px frame` +
        (fit.over.length ? `; past the bottom edge: ${fit.over.slice(0, 6).join(', ')}` : '') +
        (fit.collisions.length ? `; overlapping: ${fit.collisions.join(', ')}` : ''),
    );
    continue;
  }

  // Written only once the layout is known good, so a failed render never leaves
  // a committed fragment describing a diagram the images do not.
  await writeFile(`${GEN}${card.slug}.html`, fragment);
  await page.screenshot({
    path: `${PUBLIC}${card.slug}.png`,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });
  await page.pdf({
    path: `${PUBLIC}${card.slug}.pdf`,
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
    printBackground: true,
    pageRanges: '1',
  });
  console.log(`${card.slug}: ${idsIn(card).length} concepts, ${fit.content}px of ${fit.frame}px used`);
}
await browser.close();

// Reported together rather than on the first failure, so one long caption does
// not hide the other three cards' problems behind it.
if (overflowing.length) {
  for (const line of overflowing) console.error(`layout overflow — ${line}`);
  process.exit(1);
}
console.log(`wrote ${CARDS.length} card(s): fragment, PNG and PDF each`);
