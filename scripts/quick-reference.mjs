#!/usr/bin/env node
/**
 * Build the shareable quick reference.
 *
 * The charter asks for "single-page quick references and diagrams that can be
 * shared and reused". This emits one, three ways from a single source:
 *
 *   src/generated/quick-reference.html  the fragment the site page inlines
 *   public/quick-reference.png          the shareable raster (3200x1800)
 *   public/quick-reference.pdf          vector, for slides and print
 *
 * Two things are checked rather than trusted. Every concept the diagram names
 * must be a real node, so a renamed page breaks this build instead of leaving a
 * stale term in an image that is already on someone else's timeline. And the
 * rendered height must actually be 900px: the previous SVG version shipped a
 * footer sitting on top of a band because the layout was arithmetic I did by
 * hand and got wrong. Now the browser lays it out and then reports back.
 */
import { writeFile, readdir, mkdir } from 'node:fs/promises';
import { buildFragment, NAMED_IDS, WIDTH, HEIGHT } from './lib/quick-reference-view.mjs';

const PUBLIC = new URL('../public/', import.meta.url).pathname;
const GEN = new URL('../src/generated/', import.meta.url).pathname;
const NODES = new URL('../src/content/nodes/', import.meta.url).pathname;

// ---- drift check ----------------------------------------------------------

const nodeIds = new Set(
  (await readdir(NODES)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
);
const missing = NAMED_IDS.filter((id) => !nodeIds.has(id));
if (missing.length) {
  console.error(`quick reference names concepts that are not nodes: ${missing.join(', ')}`);
  process.exit(1);
}

// ---- the fragment ---------------------------------------------------------

const fragment = buildFragment();

// ---- raster and vector ----------------------------------------------------
// Social cards and chat clients will not render an SVG or an HTML fragment, so
// the PNG is the actual deliverable. Rasterised with whatever Chromium is to
// hand; with none, the fragment is still written and the images left alone.
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
  await mkdir(GEN, { recursive: true });
  await writeFile(`${GEN}quick-reference.html`, fragment);
  console.log('no playwright available — fragment written unchecked, PNG and PDF left alone');
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});
await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8">` +
    `<style>html,body{margin:0;padding:0}</style></head><body>${fragment}</body></html>`,
  { waitUntil: 'load' },
);

// Does it fit? A box that overflows its 900px frame is clipped in the PNG and
// nowhere else, which is exactly the kind of failure that survives review.
const fit = await page.evaluate(() => {
  const el = document.querySelector('.qr');
  const floor = el.getBoundingClientRect().bottom - parseFloat(getComputedStyle(el).paddingBottom);
  const over = [...el.querySelectorAll('*')]
    .filter((n) => n.getBoundingClientRect().bottom > floor + 0.5)
    .map((n) => `.${String(n.className).split(' ')[0] || n.tagName}`);
  return { content: el.scrollHeight, frame: el.clientHeight, over: [...new Set(over)] };
});
// Both halves matter. scrollHeight catches the frame growing; the per-element
// sweep catches what the first version of this check missed -- a nested grid
// that overflows its flex parent silently, paints over the footer, and leaves
// scrollHeight untouched.
if (fit.content > fit.frame + 1 || fit.over.length) {
  console.error(
    `layout overflow: content is ${fit.content}px in a ${fit.frame}px frame` +
      (fit.over.length ? `; past the bottom edge: ${fit.over.slice(0, 6).join(', ')}` : ''),
  );
  await browser.close();
  process.exit(1);
}

// Everything below only runs once the layout is known good, so a failed render
// never leaves the committed fragment describing a diagram the images do not.
await mkdir(GEN, { recursive: true });
await writeFile(`${GEN}quick-reference.html`, fragment);
console.log(`wrote src/generated/quick-reference.html (${NAMED_IDS.length} concepts, all resolve)`);

await page.screenshot({ path: `${PUBLIC}quick-reference.png`, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
console.log(`wrote public/quick-reference.png (${WIDTH * 2}x${HEIGHT * 2}, ${fit.content}px of ${fit.frame}px used)`);

await page.pdf({
  path: `${PUBLIC}quick-reference.pdf`,
  width: `${WIDTH}px`,
  height: `${HEIGHT}px`,
  printBackground: true,
  pageRanges: '1',
});
console.log(`wrote public/quick-reference.pdf (${WIDTH}x${HEIGHT}, vector)`);

await browser.close();
