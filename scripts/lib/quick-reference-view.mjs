/**
 * The quick reference, as markup.
 *
 * This used to be an SVG built by adding numbers together, and the numbers were
 * wrong twice: a footer that landed on top of a band, and a loop arrow that
 * floated clear of the boxes it connected. Both were layout bugs in code that
 * had no layout engine. So the diagram is now real HTML with real CSS, and the
 * browser does the arithmetic -- which also buys gradients, shadows, live links
 * and text that a reader can select.
 *
 * One source, two outputs: the same fragment is inlined into the page and
 * screenshotted for the shareable PNG. `scripts/check-output.mjs` rebuilds it
 * and compares, so the committed copy cannot drift from this file.
 */

/**
 * The layer palette is an ORDINAL ramp, not four categorical hues: swapping
 * surface and model would change the meaning, so the order is the data, and a
 * single hue stepped by lightness lets the reader see the order in the colour.
 * Hue 60deg is the site accent. Both ramps pass the ordinal checks -- monotone
 * lightness, adjacent dL >= 0.06, light end clear of the surface -- against
 * this site's own surfaces rather than a default pair: 2.27:1 at the light end
 * on #fbfaf7, 2.89:1 on #17161a. Re-check with the dataviz skill's validator
 * before changing a step:
 *   node validate_palette.js "<the four hexes>" --ordinal \
 *     --mode light --surface "#fbfaf7"
 */
export const RAMP = {
  light: ['#e29858', '#c47c3b', '#a7611b', '#874900'],
  dark: ['#925000', '#b06a26', '#ce8545', '#eca161'],
};
/** Box fills: the same hue far below the chroma floor, so they read as paper. */
export const TINT = {
  light: ['#fdf4ec', '#fbeee1', '#f8e7d6', '#f4e0cb'],
  dark: ['#241a12', '#2a1f15', '#302519', '#362a1d'],
};

/**
 * The diagram, as data. `id` is the node each box stands for; the generator
 * checks every one against src/content/nodes/, so a renamed or deleted page
 * breaks the build rather than quietly leaving a stale term in a shared image.
 */
export const LAYERS = [
  {
    id: 'surface',
    name: 'Surface',
    kicker: 'where you meet it',
    tag: 'one engine, several faces',
    body: 'Terminal, IDE, desktop app, chat window. The front end — not the engine underneath.',
  },
  {
    id: 'harness',
    name: 'Harness',
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
    name: 'Inference API',
    kicker: 'the call itself',
    tag: 'stateless',
    body: 'Stateless HTTP. The whole conversation is re-sent every time, and the server keeps nothing between calls.',
  },
  {
    id: 'model',
    name: 'Model',
    kicker: 'the trained artifact',
    tag: 'a file, not a service',
    body: 'An architecture plus learned weights, mapping input tokens to output token probabilities. No memory, no tools, cannot act.',
    sub: [
      { id: 'token', t: 'Token', d: 'The unit it reads, emits, and is billed in. A word fragment, not a word.' },
      { id: 'context-window', t: 'Context window', d: 'A per-call ceiling on what it can attend to. Not a memory.' },
    ],
  },
];

export const FOOTER = [
  {
    head: 'Who is involved',
    items: [
      { id: 'model-provider', t: 'Model provider', d: 'Trains it, owns the weights, sets the licence.' },
      { id: 'model-host', t: 'Model host', d: 'Runs someone else’s model and sells access.' },
    ],
  },
  {
    head: 'What goes wrong',
    items: [
      { id: 'hallucination', t: 'Hallucination', d: 'Confident, plausible, wrong — and indistinguishable from correct output, because truth is not a quantity the model computes.' },
    ],
  },
  {
    head: 'How you know',
    items: [
      { id: 'evaluation', t: 'Evaluation', d: 'A repeatable test. The only thing that turns “it seems better” into a claim someone else can check.' },
    ],
  },
];

/** Every node id the diagram names, in one list, for the drift check. */
export const NAMED_IDS = [
  ...LAYERS.flatMap((l) => [l.id, ...(l.sub ?? []).map((s) => s.id)]),
  ...FOOTER.flatMap((f) => f.items.map((i) => i.id)),
  'agent',
  'agentic-loop',
];

export const WIDTH = 1600;
export const HEIGHT = 900;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Boxes link to the page behind them. Relative, because this fragment is
 * written by a node script that has no idea what Astro's base path is, and
 * /quick-reference/ and /nodes/<id>/ are siblings under it either way.
 */
const link = (id, label, cls) =>
  `<a class="${cls}" href="../nodes/${esc(id)}/">${esc(label)}</a>`;

const rampVars = (mode) =>
  RAMP[mode]
    .map((hex, i) => `    --qr-l${i + 1}: ${hex};\n    --qr-t${i + 1}: ${TINT[mode][i]};`)
    .join('\n');

/**
 * Dark values are declared twice on purpose: the media query covers the OS
 * setting, the [data-theme] scope covers a toggle. The site only ships the
 * former today, but a fragment that only answered one of them would be a trap
 * for whoever adds the other.
 */
const darkBlock = `
  color-scheme: dark;
  --qr-paper: #17161a;
  --qr-raised: #201f24;
  --qr-ink: #eceaea;
  --qr-soft: #b3aeae;
  --qr-faint: #837e7e;
  --qr-rule: #35333a;
  --qr-accent: #e0a86a;
  --qr-accent-soft: #2a2118;
  --qr-mark: #8fc9a3;
  --qr-shadow: rgba(0, 0, 0, 0.5);
  --qr-glow: rgba(255, 255, 255, 0.04);
${rampVars('dark')}`;

export const CSS = `
.qr {
  --qr-paper: #fbfaf7;
  --qr-raised: #ffffff;
  --qr-ink: #1c1a17;
  --qr-soft: #55504a;
  --qr-faint: #85807a;
  --qr-rule: #e0dbd2;
  --qr-accent: #7a4a1e;
  --qr-accent-soft: #f6efe6;
  --qr-mark: #2f5d3f;
  --qr-shadow: rgba(60, 40, 18, 0.10);
  --qr-glow: rgba(255, 255, 255, 0.9);
${rampVars('light')}
  color-scheme: light;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  box-sizing: border-box;
  padding: 42px 54px 34px;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(120% 90% at 88% -10%, var(--qr-accent-soft) 0%, transparent 58%),
    var(--qr-paper);
  color: var(--qr-ink);
  font-family: var(--font, ui-sans-serif), "Liberation Sans", Helvetica, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .qr {${darkBlock}
  }
}
:root[data-theme="dark"] .qr {${darkBlock}
}

.qr h2, .qr h3, .qr h4, .qr p { margin: 0; }
.qr a { color: inherit; text-decoration: none; }
.qr a:hover { text-decoration: underline; text-decoration-color: var(--qr-accent); text-underline-offset: 3px; }

/* ---- masthead ---- */
.qr-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; }
.qr-head h2 {
  font-size: 31px;
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.022em;
}
.qr-head p { margin-top: 5px; font-size: 15px; color: var(--qr-soft); }
.qr-brand { text-align: right; flex: none; }
.qr-brand strong {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--qr-accent);
}
.qr-brand span {
  display: block;
  margin-top: 4px;
  font-size: 12.5px;
  color: var(--qr-faint);
  font-family: var(--font-mono, ui-monospace), "Liberation Mono", monospace;
}
.qr-rule {
  height: 2px;
  margin: 14px 0 16px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--qr-l4), var(--qr-l1) 32%, var(--qr-rule) 62%, var(--qr-rule));
}

/* ---- the stack ---- */
.qr-body {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: 158px minmax(0, 1fr) 74px;
  grid-template-rows: repeat(4, min-content);
  column-gap: 16px;
  row-gap: 14px;
  /* The frame is a fixed 900px and the rows are content-sized, so whatever is
     left over is distributed between them rather than pooling as a dead band
     above the footer. */
  align-content: space-between;
}
.qr-layer { grid-column: 2; }

.qr-layer {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--qr-rule);
  border-radius: 11px;
  padding: 19px 22px 19px 28px;
  background:
    linear-gradient(163deg, var(--qr-raised) 8%, var(--qr-tint) 108%),
    var(--qr-raised);
  box-shadow: 0 1px 0 var(--qr-glow) inset, 0 2px 7px -3px var(--qr-shadow);
}
/* The step colour arrives as a rail, not as a fill: text on the box keeps
   wearing the ink tokens, so nothing depends on reading colour. */
.qr-layer::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: linear-gradient(180deg, var(--qr-step), color-mix(in oklab, var(--qr-step) 74%, transparent));
}
/* Named rather than positional: the grid's children are the two brackets as
   well as the four layers, so nth-child counted the wrong things and the last
   layer silently got no step at all. */
.qr-s1 { --qr-step: var(--qr-l1); --qr-tint: var(--qr-t1); }
.qr-s2 { --qr-step: var(--qr-l2); --qr-tint: var(--qr-t2); }
.qr-s3 { --qr-step: var(--qr-l3); --qr-tint: var(--qr-t3); }
.qr-s4 { --qr-step: var(--qr-l4); --qr-tint: var(--qr-t4); }

.qr-top { display: grid; grid-template-columns: 232px minmax(0, 1fr) auto; gap: 20px; align-items: start; }
.qr-name {
  display: flex;
  align-items: baseline;
  gap: 9px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.014em;
}
.qr-kicker { margin-top: 2px; font-size: 11.5px; color: var(--qr-faint); }
.qr-num {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--qr-step);
  font-family: var(--font-mono, ui-monospace), "Liberation Mono", monospace;
}
.qr-desc { font-size: 14px; line-height: 1.42; color: var(--qr-soft); max-width: 62ch; }
.qr-tag {
  flex: none;
  align-self: start;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--qr-step);
  border: 1px solid color-mix(in oklab, var(--qr-step) 40%, transparent);
  background: color-mix(in oklab, var(--qr-step) 12%, var(--qr-raised));
  border-radius: 999px;
  padding: 3px 10px;
  white-space: nowrap;
}

.qr-sub { display: grid; gap: 9px; margin-top: 12px; grid-auto-flow: column; grid-auto-columns: 1fr; }
.qr-sub div {
  border: 1px solid var(--qr-rule);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--qr-raised);
  box-shadow: 0 1px 4px -2px var(--qr-shadow);
}
.qr-sub b { display: block; font-size: 12.5px; font-weight: 650; letter-spacing: -0.005em; }
.qr-sub span { display: block; margin-top: 3px; font-size: 11px; line-height: 1.36; color: var(--qr-faint); }

/* ---- the two brackets ---- */
.qr-agent, .qr-loop { grid-row: 2 / 5; position: relative; }
.qr-agent {
  grid-column: 1;
  border: 2px solid var(--qr-accent);
  border-right: 0;
  border-radius: 10px 0 0 10px;
  background: linear-gradient(90deg, color-mix(in oklab, var(--qr-accent) 7%, transparent), transparent);
  padding: 14px 16px 14px 0;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.qr-agent strong {
  display: block;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--qr-accent);
}
.qr-agent span { display: block; margin-top: 7px; font-size: 11.5px; line-height: 1.42; color: var(--qr-faint); }

.qr-loop {
  grid-column: 3;
  margin: 26px 24px 26px 0;
  border: 1.6px dashed var(--qr-mark);
  border-left: 0;
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* The arrowhead sits on the returning end, at the harness, because the return
   is the whole point of drawing the loop at all. */
.qr-loop::before {
  content: "";
  position: absolute;
  top: -6.5px;
  left: -1px;
  border: 6px solid transparent;
  border-right-color: var(--qr-mark);
  border-left: 0;
}
.qr-loop b {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--qr-mark);
  white-space: nowrap;
}
.qr-loop b em { font-style: normal; font-weight: 400; letter-spacing: 0.04em; color: var(--qr-faint); }

/* ---- footer ---- */
.qr-foot { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 18px; }
.qr-foot section { border-top: 2px solid var(--qr-rule); padding-top: 11px; }
.qr-foot h3 {
  margin: 0 0 8px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--qr-accent);
}
.qr-foot p { margin: 0 0 8px; font-size: 11.5px; line-height: 1.42; color: var(--qr-soft); }
.qr-foot p:last-child { margin-bottom: 0; }
.qr-foot b { font-size: 12.5px; font-weight: 650; color: var(--qr-ink); }

/* ---- takeaway ---- */
.qr-take {
  margin-top: 16px;
  border-radius: 10px;
  border: 1px solid color-mix(in oklab, var(--qr-accent) 22%, transparent);
  border-left: 4px solid var(--qr-accent);
  background: linear-gradient(90deg, var(--qr-accent-soft), transparent 78%);
  padding: 12px 20px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--qr-accent);
  text-align: center;
}
`;

const layerHtml = (l, i) => `
      <section class="qr-layer qr-s${i + 1}">
        <div class="qr-top">
          <div>
            <h4 class="qr-name"><span class="qr-num">${String(i + 1).padStart(2, '0')}</span>${link(l.id, l.name, 'qr-namelink')}</h4>
            <p class="qr-kicker">${esc(l.kicker)}</p>
          </div>
          <p class="qr-desc">${esc(l.body)}</p>
          <span class="qr-tag">${esc(l.tag)}</span>
        </div>${
          l.sub
            ? `
        <div class="qr-sub">${l.sub
          .map((s) => `
          <div><b>${link(s.id, s.t, 'qr-sublink')}</b><span>${esc(s.d)}</span></div>`)
          .join('')}
        </div>`
            : ''
        }
      </section>`;

const footHtml = (col) => `
      <section>
        <h3>${esc(col.head)}</h3>${col.items
          .map((it) => `
        <p><b>${link(it.id, it.t, 'qr-footlink')}</b> — ${esc(it.d)}</p>`)
          .join('')}
      </section>`;

/** The fragment: one <style> and one .qr root, everything scoped under it. */
export function buildFragment() {
  return `<style>${CSS}</style>
<div class="qr" role="img" aria-label="The AI stack top to bottom: surface, harness, inference API, model, with the agentic loop returning from the model to the harness.">
  <header class="qr-head">
    <div>
      <h2>The AI stack, top to bottom</h2>
      <p>One request, and every layer it passes through.</p>
    </div>
    <div class="qr-brand">
      <strong>Field guide to the AI stack</strong>
      <span>mchelen.github.io/FieldGuideAIStack</span>
    </div>
  </header>
  <div class="qr-rule"></div>
  <div class="qr-body">
    <aside class="qr-agent">
      <strong>${link('agent', 'Agent', 'qr-agentlink')}</strong>
      <span>a model driven in a ${link('agentic-loop', 'loop', 'qr-agentlink')} by a harness, with tools</span>
    </aside>${LAYERS.map(layerHtml).join('')}
    <aside class="qr-loop"><b>Agentic loop · <em>repeat until done</em></b></aside>
  </div>
  <div class="qr-foot">${FOOTER.map(footHtml).join('')}
  </div>
  <p class="qr-take">Almost everything people attribute to “the AI” — that it remembers, searches, runs code, asks permission — belongs to the harness, not the model.</p>
</div>
`;
}
