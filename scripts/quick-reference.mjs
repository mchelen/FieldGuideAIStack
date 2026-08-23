#!/usr/bin/env node
/**
 * The shareable quick reference.
 *
 * The charter asks for "single-page quick references and diagrams that can be
 * shared and reused". This emits one: an SVG of the stack as a request travels
 * through it, plus a PNG, because social platforms and chat clients will not
 * render an SVG in a link card.
 *
 * The captions here are written for a diagram -- much shorter than the page
 * summaries -- but every concept named must be a real node, and that is checked
 * rather than trusted. A quick reference that drifted from the guide it
 * summarises would be worse than none.
 */
import { writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const OUT = new URL('../public/', import.meta.url).pathname;
const NODES = new URL('../src/content/nodes/', import.meta.url).pathname;

const W = 1600;
const H = 900;

// Palette lifted from the site so the two look like one publication.
const C = {
  bg: '#fbfaf7',
  raised: '#ffffff',
  ink: '#1c1a17',
  soft: '#55504a',
  faint: '#85807a',
  rule: '#ded8ce',
  accent: '#7a4a1e',
  accentSoft: '#f3ebe0',
  mark: '#2f5d3f',
  markSoft: '#e6efe9',
};
const FONT = '"Liberation Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = '"Liberation Mono", "SFMono-Regular", Menlo, monospace';

/**
 * The diagram, as data. `id` is the node it stands for -- checked against
 * src/content/nodes/ below, so a renamed or deleted page breaks the build of
 * this file rather than quietly leaving a stale term in a shared image.
 */
const LAYERS = [
  {
    id: 'surface',
    name: 'SURFACE',
    kicker: 'where you meet it',
    tag: 'one engine, several faces',
    body: 'Terminal, IDE, desktop app, chat window. The front end — not the engine underneath.',
  },
  {
    id: 'harness',
    name: 'HARNESS',
    kicker: 'the program around the model',
    tag: 'where the product lives',
    body: 'Assembles the context, calls the model, executes the tools the model asks for, and decides what happens next.',
    sub: [
      { id: 'prompt-engineering', t: 'Prompt engineering', d: 'Change behaviour by changing what you send. No training involved.' },
      { id: 'context-engineering', t: 'Context engineering', d: 'What goes in the window, what gets dropped, what gets fetched again.' },
      { id: 'retrieval-augmented-generation', t: 'Retrieval (RAG)', d: 'Fetch the document at question time so the answer rests on it.' },
      { id: 'tool-use', t: 'Tool use', d: 'The model asks for a function. Your code decides whether to run it.' },
      { id: 'approval-mode', t: 'Approval mode', d: 'Which actions need a human before they land.' },
    ],
  },
  {
    id: 'inference-api',
    name: 'INFERENCE API',
    kicker: 'the call itself',
    tag: 'stateless',
    body: 'Stateless HTTP. The whole conversation is re-sent every time, and the server keeps nothing between calls.',
  },
  {
    id: 'model',
    name: 'MODEL',
    kicker: 'the trained artifact',
    tag: 'a file, not a service',
    body: 'An architecture plus learned weights, mapping input tokens to output token probabilities. No memory, no tools, cannot act.',
    sub: [
      { id: 'token', t: 'Token', d: 'The unit it reads, emits, and is billed in. A word fragment, not a word.' },
      { id: 'context-window', t: 'Context window', d: 'A per-call ceiling on what it can attend to. Not a memory.' },
    ],
  },
];

const FOOTER = [
  {
    head: 'WHO IS INVOLVED',
    items: [
      { id: 'model-provider', t: 'Model provider', d: 'Trains it, owns the weights, sets the licence.' },
      { id: 'model-host', t: 'Model host', d: 'Runs someone else’s model and sells access.' },
    ],
  },
  {
    head: 'WHAT GOES WRONG',
    items: [
      { id: 'hallucination', t: 'Hallucination', d: 'Confident, plausible, wrong — and indistinguishable from correct output, because truth is not a quantity the model computes.' },
    ],
  },
  {
    head: 'HOW YOU KNOW',
    items: [
      { id: 'evaluation', t: 'Evaluation', d: 'A repeatable test. The only thing that turns “it seems better” into a claim someone else can check.' },
    ],
  },
];

// ---- checks ---------------------------------------------------------------

const nodeIds = new Set(
  (await readdir(NODES)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
);
const named = [
  ...LAYERS.flatMap((l) => [l.id, ...(l.sub ?? []).map((s) => s.id)]),
  ...FOOTER.flatMap((f) => f.items.map((i) => i.id)),
  'agent',
  'agentic-loop',
];
const missing = named.filter((id) => !nodeIds.has(id));
if (missing.length) {
  console.error(`quick reference names concepts that are not nodes: ${missing.join(', ')}`);
  process.exit(1);
}

// ---- tiny layout helpers --------------------------------------------------

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy wrap. Liberation Sans averages ~0.5em per character at these sizes. */
function wrap(text, size, width) {
  const per = size * 0.505;
  const max = Math.max(1, Math.floor(width / per));
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      out.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) out.push(line);
  return out;
}

function text(x, y, s, { size = 14, fill = C.ink, weight = 400, anchor = 'start', family = FONT, spacing = 0 } = {}) {
  const ls = spacing ? ` letter-spacing="${spacing}"` : '';
  return `<text x="${x}" y="${y}" font-family='${family}' font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls}>${esc(s)}</text>`;
}

function block(x, y, s, { size = 14, fill = C.soft, width = 400, lh = 1.45, weight = 400 } = {}) {
  return wrap(s, size, width)
    .map((l, i) => text(x, y + i * size * lh, l, { size, fill, weight }))
    .join('');
}

const rect = (x, y, w, h, { fill = C.raised, stroke = C.rule, r = 8, sw = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

// ---- the drawing ----------------------------------------------------------

const parts = [];
parts.push(`<rect width="${W}" height="${H}" fill="${C.bg}"/>`);

// Header
parts.push(text(56, 52, 'The AI stack, top to bottom', { size: 30, weight: 700 }));
parts.push(
  text(56, 76, 'One request, and every layer it passes through', { size: 15, fill: C.soft }),
);
parts.push(
  text(W - 56, 52, 'FIELD GUIDE TO THE AI STACK', {
    size: 13,
    fill: C.accent,
    weight: 700,
    anchor: 'end',
    spacing: 1.6,
  }),
);
parts.push(
  text(W - 56, 74, 'mchelen.github.io/FieldGuideAIStack', {
    size: 13,
    fill: C.faint,
    anchor: 'end',
    family: MONO,
  }),
);
parts.push(`<line x1="56" y1="94" x2="${W - 56}" y2="94" stroke="${C.rule}" stroke-width="1"/>`);

// Geometry. The right-hand channel is reserved for the loop arrow so it never
// crowds the boxes; the left gutter is the agent bracket.
const RAIL = 172; // right edge of the left gutter
const BX = RAIL + 22;
const CHANNEL = 86; // space kept clear on the right for the loop
const BW = W - 56 - BX - CHANNEL;
const DESC = BX + 250; // where each layer's description starts

const rows = [];
let y = 118;
for (const layer of LAYERS) {
  const h = layer.sub ? (layer.sub.length > 2 ? 178 : 142) : 70;
  rows.push({ layer, y, h });
  y += h + 20;
}
const stackBottom = rows[rows.length - 1].y + rows[rows.length - 1].h;

// The agent bracket spans harness to model. An agent is a model driven in a
// loop by a harness -- the surface is where *you* are, and is deliberately
// outside it.
const agentTop = rows[1].y;
const agentBottom = rows[3].y + rows[3].h;
parts.push(
  `<path d="M${RAIL - 14} ${agentTop} H${RAIL} V${agentBottom} H${RAIL - 14}" fill="none" stroke="${C.accent}" stroke-width="2" stroke-linecap="round"/>`,
);
parts.push(text(56, agentTop + 16, 'AGENT', { size: 16, weight: 700, fill: C.accent, spacing: 1.8 }));
parts.push(block(56, agentTop + 38, 'a model driven in a loop by a harness, with tools', {
  size: 11,
  width: RAIL - 74,
  fill: C.faint,
  lh: 1.45,
}));

// Layers
for (const { layer, y: ry, h } of rows) {
  parts.push(rect(BX, ry, BW, h));
  parts.push(text(BX + 22, ry + 30, layer.name, { size: 16, weight: 700, spacing: 1.4 }));
  parts.push(text(BX + 22, ry + 49, layer.kicker, { size: 11.5, fill: C.faint }));
  parts.push(block(DESC, ry + 27, layer.body, { size: 14, width: BW - (DESC - BX) - 172, fill: C.soft, lh: 1.5 }));
  if (layer.tag) {
    parts.push(
      text(BX + BW - 22, ry + 30, layer.tag.toUpperCase(), {
        size: 10.5,
        weight: 700,
        fill: C.accent,
        anchor: 'end',
        spacing: 1.3,
      }),
    );
  }

  if (layer.sub) {
    const pad = 22;
    const gap = 11;
    const n = layer.sub.length;
    const sw = (BW - pad * 2 - gap * (n - 1)) / n;
    const sh = n > 2 ? 80 : 48;
    const sy = ry + h - sh - 20;
    layer.sub.forEach((sb, i) => {
      const sx = BX + pad + i * (sw + gap);
      parts.push(rect(sx, sy, sw, sh, { fill: C.bg, stroke: C.rule, r: 6 }));
      parts.push(text(sx + 12, sy + 20, sb.t, { size: 12.5, weight: 700 }));
      parts.push(block(sx + 12, sy + 36, sb.d, { size: 11, width: sw - 24, fill: C.faint, lh: 1.4 }));
    });
  }
}

// Down arrows between layers
for (let i = 0; i < rows.length - 1; i += 1) {
  const from = rows[i].y + rows[i].h;
  const to = rows[i + 1].y;
  const ax = BX + 62;
  parts.push(
    `<path d="M${ax} ${from + 3} V${to - 9}" stroke="${C.accent}" stroke-width="1.6"/>` +
      `<path d="M${ax - 5} ${to - 10} L${ax} ${to - 3} L${ax + 5} ${to - 10} Z" fill="${C.accent}"/>`,
  );
}

// The loop: from the model's edge, out into the reserved channel, and back
// into the harness. Drawn as a connection between the two boxes rather than a
// floating curve, because the returning step is the whole point.
const hRow = rows[1];
const mRow = rows[3];
const edge = BX + BW;
const cx = edge + 34;
const fromY = mRow.y + 26;
const toY = hRow.y + hRow.h - 26;
parts.push(
  `<path d="M${edge} ${fromY} H${cx} V${toY} H${edge + 8}" fill="none" stroke="${C.mark}" stroke-width="1.6" stroke-dasharray="5 4" stroke-linejoin="round"/>` +
    `<path d="M${edge + 9} ${toY - 5} L${edge + 1} ${toY} L${edge + 9} ${toY + 5} Z" fill="${C.mark}"/>`,
);
parts.push(
  `<g transform="translate(${cx + 17} ${(fromY + toY) / 2}) rotate(90)">${text(0, 0, 'AGENTIC LOOP', { size: 11, weight: 700, fill: C.mark, anchor: 'middle', spacing: 1.3 })}</g>`,
);
parts.push(
  `<g transform="translate(${cx + 32} ${(fromY + toY) / 2}) rotate(90)">${text(0, 0, 'repeat until done', { size: 10, fill: C.faint, anchor: 'middle' })}</g>`,
);

// Footer columns. Height is measured rather than assumed, so the takeaway band
// below can never land on top of the text -- which is exactly what the first
// draft did.
const fy = stackBottom + 30;
const fw = (W - 112 - 44) / 3;
let footerBottom = fy;
FOOTER.forEach((col, i) => {
  const fx = 56 + i * (fw + 22);
  parts.push(`<line x1="${fx}" y1="${fy}" x2="${fx + fw}" y2="${fy}" stroke="${C.rule}"/>`);
  parts.push(text(fx, fy + 23, col.head, { size: 11, weight: 700, fill: C.accent, spacing: 1.5 }));
  let cy = fy + 45;
  for (const it of col.items) {
    parts.push(text(fx, cy, it.t, { size: 13, weight: 700 }));
    parts.push(block(fx, cy + 17, it.d, { size: 11.5, width: fw - 4, fill: C.soft, lh: 1.42 }));
    cy += 17 + wrap(it.d, 11.5, fw - 4).length * 11.5 * 1.42 + 12;
  }
  footerBottom = Math.max(footerBottom, cy);
});

// Takeaway
const bandH = 50;
const bandY = Math.max(footerBottom + 10, H - 30 - bandH);
if (bandY + bandH > H - 20) {
  console.error(`layout overflow: takeaway band would end at ${bandY + bandH} of ${H}`);
  process.exit(1);
}
parts.push(rect(56, bandY, W - 112, bandH, { fill: C.accentSoft, stroke: C.accentSoft, r: 8 }));
parts.push(
  text(
    W / 2,
    bandY + 31,
    'Almost everything people attribute to “the AI” — that it remembers, searches, runs code, asks permission — belongs to the harness, not the model.',
    { size: 15, fill: C.accent, weight: 600, anchor: 'middle' },
  ),
);

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" ` +
  `aria-label="The AI stack top to bottom: surface, harness, inference API, model, with the agentic loop returning from model to harness.">` +
  parts.join('') +
  `</svg>`;

await writeFile(`${OUT}quick-reference.svg`, svg);
console.log(`wrote public/quick-reference.svg (${W}x${H}, ${named.length} concepts, all resolve)`);

// ---- raster ---------------------------------------------------------------
// Social cards and chat clients will not render an SVG, so a PNG is the actual
// deliverable. Rasterised with whatever Chromium is available; if there is
// none, the SVG is still written and the PNG left as it was.
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
  console.log('no playwright available — SVG written, PNG left unchanged');
  process.exit(0);
}
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
await page.setContent(
  `<body style="margin:0">${svg}</body>`,
  { waitUntil: 'load' },
);
await page.screenshot({ path: `${OUT}quick-reference.png` });
await browser.close();
console.log(`wrote public/quick-reference.png (${W * 2}x${H * 2})`);
