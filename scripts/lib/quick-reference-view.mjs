/**
 * The quick reference cards, as markup.
 *
 * This used to be an SVG built by adding numbers together, and the numbers were
 * wrong twice: a footer that landed on top of a band, and a loop arrow that
 * floated clear of the boxes it connected. Both were layout bugs in code that
 * had no layout engine. So the diagram is now real HTML with real CSS, and the
 * browser does the arithmetic -- which also buys gradients, shadows, live links
 * and text that a reader can select.
 *
 * One source, two outputs per card: the same fragment is inlined into the page
 * and screenshotted for the shareable PNG. `scripts/check-output.mjs` rebuilds
 * them and compares, so the committed copies cannot drift from this file.
 *
 * The chrome -- masthead, footer columns, takeaway band -- is shared by every
 * card, so the set reads as one publication. Only the body differs, and there
 * are two body kinds: `stack` for ordered rows (the layers of the stack, the
 * passes of the loop, what fills the window), and `pairs` for a mapping from
 * one column to another. A card's content lives in quick-reference-cards.mjs;
 * nothing here knows what any of it means.
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
 * Icons that classify, because the site's icon rule is "nothing decorative: an
 * icon that repeats what the adjacent word already says costs scanning effort
 * and buys nothing." So these do not illustrate each concept -- they say what
 * *kind* of thing it is, which the label does not, and which the reader acts
 * on: a component you can point at behaves differently from a technique you
 * apply, a failure, or a control.
 *
 * The kind is derived from the node's own tags rather than assigned here, so a
 * retagged page reclassifies itself and a card cannot quietly disagree with the
 * guide. Stroke-only and currentColor, like the rest of the site's set.
 */
export const ICON_KINDS = {
  component: { label: 'Component', d: 'M3.5 7.5h17v10h-17zM9 7.5v10' },
  process: { label: 'Process', d: 'M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4' },
  technique: { label: 'Technique', d: 'M4 7h16M4 12h16M4 17h16M9 4.5v5M16 9.5v5M7 14.5v5' },
  control: { label: 'Control', d: 'M12 3.2 4.5 6v6.2c0 4.3 3.1 7.4 7.5 8.6 4.4-1.2 7.5-4.3 7.5-8.6V6L12 3.2Z' },
  failure: { label: 'Failure', d: 'M12 4 2.8 20h18.4L12 4Zm0 5.5v5m0 3h.01' },
  measure: { label: 'Measure', d: 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm0-4.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-3.4h.01' },
  ceiling: { label: 'Ceiling', d: 'M3.5 5h17M12 20V9m0-1.5L8 12m4-4.5 4 4.5' },
  artifact: { label: 'Artifact', d: 'M6 3.5h7.5L19 9v11.5H6V3.5Zm7.5 0V9H19' },
  store: { label: 'Store', d: 'M12 7.5c4.1 0 7.5-1 7.5-2.2S16.1 3 12 3 4.5 4 4.5 5.3 7.9 7.5 12 7.5Zm7.5-2.2v13.4c0 1.2-3.4 2.3-7.5 2.3s-7.5-1-7.5-2.3V5.3m15 6.7c0 1.2-3.4 2.2-7.5 2.2s-7.5-1-7.5-2.2' },
  cost: { label: 'Cost', d: 'M11.3 3.5H4.5a1 1 0 0 0-1 1v6.8a1 1 0 0 0 .3.7l8 8a1 1 0 0 0 1.4 0l6.3-6.3a1 1 0 0 0 0-1.4l-8-8a1 1 0 0 0-.7-.3Zm-3.9 3.9h.01' },
  terms: { label: 'Terms', d: 'M6 3.5h12v17H6zM9.5 8h5M9.5 12h5M9.5 16h3' },
  who: { label: 'Who', d: 'M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6' },
  concept: { label: 'Concept', d: 'M12 6.5C10.5 5.2 8.6 4.5 6 4.5H3.5v13H6c2.6 0 4.5.7 6 2 1.5-1.3 3.4-2 6-2h2.5v-13H18c-2.6 0-4.5.7-6 2Zm0 0v14' },
};

/**
 * Tag to kind, first match wins. The order is the whole design: a page tagged
 * both `evaluation` and `safety` is a way of measuring, not a control, and one
 * tagged both `safety` and `risk` is the failure rather than the guard against
 * it. Change the order and every card reclassifies, which is the point.
 */
const KIND_BY_TAG = [
  ['risk', 'failure'],
  ['evaluation', 'measure'],
  ['constraint', 'ceiling'],
  ['artifact', 'artifact'],
  ['structure', 'store'],
  ['technique', 'technique'],
  ['economics', 'cost'],
  ['safety', 'control'],
  // After `safety` on purpose: provenance is tagged both, and on the risks card
  // it is doing a control's job, not a licence's.
  ['openness', 'terms'],
  ['orgs', 'who'],
  ['agentic', 'process'],
  ['runtime', 'component'],
  ['infrastructure', 'component'],
  ['interfaces', 'component'],
  ['capability', 'component'],
  ['product-anatomy', 'component'],
];

export function kindOf(tags = []) {
  for (const [tag, kind] of KIND_BY_TAG) if (tags.includes(tag)) return kind;
  return 'concept';
}

const icon = (kind, size) =>
  `<svg class="qr-i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
  `stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON_KINDS[kind].d}"/></svg>`;

export const WIDTH = 1600;
export const HEIGHT = 900;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * A concept, wearing its kind, linking to the page behind it. The href is
 * relative because this fragment is written by a node script that has no idea
 * what Astro's base path is, and /quick-reference/ and /nodes/<id>/ are
 * siblings under it either way.
 *
 * `data-node` is the hook the generator's checks measure against -- it is how a
 * chip's label is found and tested against the box it has to fit in.
 */
const nodeLink = (id, label, { size = 15, kinds } = {}) => {
  const kind = kinds.get(id);
  const anchor = `<a href="../nodes/${esc(id)}/">${esc(label)}</a>`;
  // A card whose concepts are all one kind gets no icons at all -- see
  // NO_ICONS below. Classifying everything identically is exactly the
  // decoration this project's icon rule exists to keep out.
  if (kind === null) return `<span class="qr-n" data-node="${esc(id)}">${anchor}</span>`;
  const k = kind ?? 'concept';
  return `<span class="qr-n qr-k-${k}" data-node="${esc(id)}">${icon(k, size)}${anchor}</span>`;
};

/** Stands in for the kind index on a single-kind card. */
const NO_ICONS = { get: () => null };

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
  --qr-rule-strong: #4c4952;
  --qr-sunken: #121115;
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
  --qr-rule-strong: #c8c1b5;
  --qr-sunken: #f2efe9;
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

/* ---- concepts wear their kind ---- */
.qr-n { display: inline-flex; align-items: center; gap: 6px; }
/* The uppercase tracking on these two would otherwise pull the label back into
   the glyph, since letter-spacing lands before the first character too. */
.qr-agent .qr-n { gap: 8px; }
.qr-legend span { letter-spacing: 0.09em; }
.qr-n .qr-i { flex: none; color: var(--qr-kind); }
/* One hue per kind would be ten categorical colours on one page, which no
   palette survives. The icon shape carries the kind; colour marks only the two
   the reader sorts by first, and both are status roles rather than series
   colours -- so they ship with a shape and a legend label, never hue alone.
   The red is the reserved status step, fixed in both themes by design.
   (No backticks in this block -- the whole stylesheet is a template literal.) */
.qr-k-failure { --qr-kind: #d03b3b; }
.qr-k-control, .qr-k-measure { --qr-kind: var(--qr-mark); }
.qr-k-component, .qr-k-process, .qr-k-technique, .qr-k-artifact, .qr-k-store,
.qr-k-ceiling, .qr-k-who, .qr-k-cost, .qr-k-terms,
.qr-k-concept { --qr-kind: var(--qr-faint); }

.qr-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: -7px 0 9px;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--qr-faint);
}
.qr-legend span { display: inline-flex; align-items: center; gap: 4px; }
.qr-legend .qr-i { color: var(--qr-kind); }
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
  /* Grow to fill, but never shrink below content. Flex-shrink with min-height 0
     let the grid collapse and paint straight over the footer -- an overlap no
     height measurement of the card itself could see. */
  flex: 1 0 auto;
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

.qr-top { display: grid; grid-template-columns: 248px minmax(0, 1fr) auto; gap: 20px; align-items: start; }
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
.qr-agent, .qr-loop { position: relative; } /* row span comes from the card */
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

/* ---- pairs: a failure beside the control that addresses it ---- */
/* Two categories, not four, and each column is labelled -- so the split is
   carried by position and heading, and colour only reinforces it. */
.qr-pairs { flex: 1 0 auto; display: grid; grid-template-rows: auto repeat(4, min-content); gap: 12px 18px; align-content: space-between; }
.qr-pairhead { display: grid; grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr); gap: 0 18px; }
.qr-pairhead span {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--qr-faint);
}
.qr-pairhead span:last-child { grid-column: 3; color: var(--qr-accent); }
.qr-pair { display: grid; grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr); gap: 0 18px; align-items: stretch; }
.qr-risk, .qr-fix {
  border: 1px solid var(--qr-rule);
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 1px 0 var(--qr-glow) inset, 0 2px 7px -3px var(--qr-shadow);
}
.qr-risk { background: linear-gradient(163deg, var(--qr-raised) 8%, var(--qr-sunken) 112%); border-left: 4px solid var(--qr-rule-strong); }
.qr-fix {
  background: linear-gradient(163deg, var(--qr-raised) 8%, var(--qr-accent-soft) 112%);
  border-left: 4px solid var(--qr-accent);
}
.qr-pair b { display: block; font-size: 14.5px; font-weight: 700; letter-spacing: -0.01em; }
.qr-fix b { color: var(--qr-accent); }
.qr-pair p { margin-top: 4px; font-size: 12.5px; line-height: 1.42; color: var(--qr-soft); }
.qr-also { margin-top: 7px; display: flex; flex-wrap: wrap; gap: 5px; }
/* The pill wraps the whole thing, icon included -- styling the anchor alone
   left every icon floating outside its own chip. */
.qr-also .qr-n {
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.05em;
  color: var(--qr-faint);
  border: 1px solid var(--qr-rule);
  border-radius: 999px;
  padding: 2px 8px 2px 6px;
  gap: 4px;
  white-space: nowrap;
}
.qr-fix .qr-also .qr-n { color: var(--qr-accent); border-color: color-mix(in oklab, var(--qr-accent) 34%, transparent); }
/* The arrow is the claim: this control addresses that failure. */
.qr-arrow { display: flex; align-items: center; justify-content: center; color: var(--qr-accent); font-size: 19px; font-weight: 700; }


/* ---- map: the same concepts, drawn as the graph they actually form ---- */
.qr-map { flex: 1 0 auto; position: relative; }
/* Direct child only. The chips carry nested <svg> icons, and a descendant
   selector stretched every one of them to the size of the whole diagram. */
.qr-map > svg { display: block; width: 100%; height: auto; overflow: visible; }
.qr-lane-head {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  fill: var(--qr-faint);
}
.qr-chip-box { fill: var(--qr-raised); stroke: var(--qr-rule); stroke-width: 1; }
.qr-chip-rail { stroke-width: 3; stroke-linecap: round; }
.qr-chip-name { font-size: 13.5px; font-weight: 650; fill: var(--qr-ink); }
.qr-chip-note { font-size: 10.5px; fill: var(--qr-faint); }
/* Relation families read by line, not by colour: four styles, one legend, and
   the arrowhead says which way the verb runs. */
.qr-edge { fill: none; stroke: var(--qr-rule-strong); stroke-width: 1.3; }
.qr-edge-contains { stroke: var(--qr-accent); stroke-width: 1.6; }
.qr-edge-consumes { stroke: var(--qr-rule-strong); }
.qr-edge-confused { stroke: var(--qr-mark); stroke-dasharray: 4 4; }
.qr-edge-implements { stroke: var(--qr-faint); stroke-dasharray: 1 4; stroke-linecap: round; }
.qr-key { display: flex; flex-wrap: wrap; gap: 4px 18px; margin-top: 10px; font-size: 10.5px; color: var(--qr-soft); }
.qr-key span { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.qr-key-note { color: var(--qr-faint); }
.qr-key svg { flex: none; }

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

const rowHtml = (kinds) => (l, i) => `
      <section class="qr-layer qr-s${i + 1}">
        <div class="qr-top">
          <div>
            <h4 class="qr-name"><span class="qr-num">${String(i + 1).padStart(2, '0')}</span>${
              // A row with no id is a grouping, not a concept: the boxes under
              // it are the concepts. Labelling it as one and linking it to
              // whichever of them came first would be a small lie.
              l.id ? nodeLink(l.id, l.name, { size: 19, kinds }) : `<span>${esc(l.name)}</span>`
            }</h4>
            <p class="qr-kicker">${esc(l.kicker)}</p>
          </div>
          <p class="qr-desc">${esc(l.body)}</p>
          <span class="qr-tag">${esc(l.tag)}</span>
        </div>${
          l.sub
            ? `
        <div class="qr-sub">${l.sub
          .map((sb) => `
          <div><b>${nodeLink(sb.id, sb.t, { size: 14, kinds })}</b><span>${esc(sb.d)}</span></div>`)
          .join('')}
        </div>`
            : ''
        }
      </section>`;

/** Grid rows are 1-based and `to` is inclusive, which is how the cards read. */
const span = (a, b) => `style="grid-row:${Math.min(a, b)}/${Math.max(a, b) + 1}"`;

const alsoHtml = (also, kinds) =>
  also?.length
    ? `
          <div class="qr-also">${also.map((a) => nodeLink(a.id, a.t, { size: 12, kinds })).join('')}</div>`
    : '';

/**
 * `stack`: ordered rows, optionally wrapped by a bracket on the left and a
 * return arrow on the right. Read as depth on the stack card and as time on the
 * loop card -- the same layout, because in both the order is the content.
 */
const stackBody = (card, kinds) => `
  <div class="qr-body">${
    card.bracket
      ? `
    <aside class="qr-agent" ${span(card.bracket.from, card.bracket.to)}>
      <strong>${nodeLink(card.bracket.id, card.bracket.label, { size: 15, kinds })}</strong>
      <span>${esc(card.bracket.note)}</span>
    </aside>`
      : ''
  }${card.rows.map(rowHtml(kinds)).join('')}${
    card.loop
      ? `
    <aside class="qr-loop" ${span(card.loop.from, card.loop.to)}><b>${esc(card.loop.label)} · <em>${esc(card.loop.note)}</em></b></aside>`
      : ''
  }
  </div>`;

/** `pairs`: a failure on the left, the control that addresses it on the right. */
const pairsBody = (card, kinds) => `
  <div class="qr-pairs">
    <div class="qr-pairhead"><span>${esc(card.columns.left)}</span><span>${esc(card.columns.right)}</span></div>${card.rows
      .map(
        (r) => `
    <div class="qr-pair">
      <div class="qr-risk">
        <b>${nodeLink(r.risk.id, r.risk.t, { size: 16, kinds })}</b>
        <p>${esc(r.risk.d)}</p>${alsoHtml(r.risk.also, kinds)}
      </div>
      <div class="qr-arrow" aria-hidden="true">&#8594;</div>
      <div class="qr-fix">
        <b>${nodeLink(r.control.id, r.control.t, { size: 16, kinds })}</b>
        <p>${esc(r.control.d)}</p>${alsoHtml(r.control.also, kinds)}
      </div>
    </div>`,
      )
      .join('')}
  </div>`;


/**
 * `map`: the same vocabulary as a card like the stack one, drawn as the graph
 * it actually forms. Every line is a relation declared in a node file -- not
 * one drawn here -- so the card cannot claim a connection the guide does not
 * make, and a relation deleted from a page disappears from the diagram.
 *
 * SVG with computed coordinates, which is the one place in this file that is
 * honest arithmetic rather than a layout engine: a lane index and a slot index
 * give a centre, and nothing depends on how text wrapped. What text *can* do is
 * overflow its chip, so the generator measures the rendered labels and fails on
 * one that does not fit.
 */
const MAP = {
  top: 26, // room for the lane headings
  chipW: 286,
  chipH: 56,
  gapY: 18,
  laneGap: 84,
  bus: 22, // where long-range edges run, clear of every chip
};
/** Which line style a verb gets. Grouped by what the relation does, not by name. */
const EDGE_FAMILY = {
  contains: 'contains',
  'part-of': 'contains',
  consumes: 'consumes',
  'consumed-by': 'consumes',
  'distinguished-from': 'confused',
  implements: 'implements',
  'implemented-by': 'implements',
  'kind-of': 'contains',
  'has-kind': 'contains',
  hosts: 'implements',
  'runs-on': 'implements',
};
const EDGE_KEY = [
  ['contains', 'contains / is part of'],
  ['consumes', 'consumes'],
  ['confused', 'is often confused with'],
  ['implements', 'implements / hosts'],
];

const mapBody = (card, kinds, edges) => {
  const lanes = card.lanes;
  const cols = lanes.length;
  const laneW = (WIDTH - 108 - MAP.laneGap * (cols - 1)) / cols;
  const rows = Math.max(...lanes.map((l) => l.items.length));
  const height = MAP.top + rows * MAP.chipH + (rows - 1) * MAP.gapY;

  // Centre of every chip, by lane and slot. Everything else derives from this.
  const at = new Map();
  lanes.forEach((lane, li) => {
    const x = li * (laneW + MAP.laneGap) + laneW / 2;
    const span = lane.items.length * MAP.chipH + (lane.items.length - 1) * MAP.gapY;
    const y0 = MAP.top + (height - MAP.top - span) / 2;
    lane.items.forEach((it, si) => {
      at.set(it.id, { x, y: y0 + si * (MAP.chipH + MAP.gapY) + MAP.chipH / 2, lane: li, item: it });
    });
  });

  // Only edges whose both ends are on the card, and only as authored -- drawing
  // the derived inverse as well would double every line.
  const drawn = edges.filter((e) => !e.derived && at.has(e.from) && at.has(e.to));

  // Three routes, picked by how far the edge reaches. The rule that matters is
  // the third: a curve drawn straight between two lanes two apart passes
  // through whatever chips sit in between, so those are sent under the diagram
  // instead, on a stack of channels wide enough to stay clear of everything.
  let longRange = 0;
  const edge = (e) => {
    const a = at.get(e.from);
    const b = at.get(e.to);
    const half = MAP.chipW / 2;
    const family = EDGE_FAMILY[e.type] ?? 'consumes';
    const path = (d) =>
      `<path class="qr-edge qr-edge-${family}" d="${d}" marker-end="url(#qr-arrow-${family})"/>`;

    if (a.lane === b.lane) {
      // Bow into the lane's own gutter -- to the left for the last lane, which
      // otherwise pushes the curve off the right edge of the card entirely.
      const out = a.lane === cols - 1 ? -1 : 1;
      const edgeX = a.x + out * half;
      const side = edgeX + out * 32;
      return path(`M${edgeX} ${a.y} C${side} ${a.y} ${side} ${b.y} ${b.x + out * half} ${b.y}`);
    }
    if (Math.abs(a.lane - b.lane) === 1) {
      const fwd = a.x < b.x;
      const x1 = fwd ? a.x + half : a.x - half;
      const x2 = fwd ? b.x - half : b.x + half;
      const mid = (x1 + x2) / 2;
      return path(`M${x1} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${x2} ${b.y}`);
    }
    // Out through the side into the gutter, down it, across, and back in the
    // same way. Leaving downward from the chip's own centre would cross every
    // chip below it in its own lane, which is what the first version did.
    const channel = height + MAP.bus + (longRange++ % 5) * 10;
    const dir = Math.sign(b.x - a.x) || 1;
    const gap = half + MAP.laneGap * 0.44;
    const g1 = a.x + dir * gap;
    const g2 = b.x - dir * gap;
    const r = 9;
    return path(
      `M${a.x + dir * half} ${a.y}` +
        ` H${g1 - dir * r} Q${g1} ${a.y} ${g1} ${a.y + r}` +
        ` V${channel - r} Q${g1} ${channel} ${g1 + dir * r} ${channel}` +
        ` H${g2 - dir * r} Q${g2} ${channel} ${g2} ${channel - r}` +
        ` V${b.y + r} Q${g2} ${b.y} ${g2 - dir * r} ${b.y}` +
        ` H${b.x - dir * half}`,
    );
  };

  const chip = (id) => {
    const { x, y, item } = at.get(id);
    const kind = kinds.get(id) || 'concept';
    const left = x - MAP.chipW / 2;
    const top = y - MAP.chipH / 2;
    return (
      `<a href="../nodes/${esc(id)}/" data-node="${esc(id)}">` +
      `<rect class="qr-chip-box" x="${left}" y="${top}" width="${MAP.chipW}" height="${MAP.chipH}" rx="9"/>` +
      `<line class="qr-chip-rail qr-k-${kind}" x1="${left + 1.5}" y1="${top + 9}" x2="${left + 1.5}" y2="${top + MAP.chipH - 9}" stroke="var(--qr-kind)"/>` +
      `<g class="qr-k-${kind}" transform="translate(${left + 14} ${y - 8}) scale(0.68)" style="color:var(--qr-kind)">${icon(kind, 24)}</g>` +
      `<text class="qr-chip-name" x="${left + 40}" y="${item.note ? y - 3 : y + 5}">${esc(item.t)}</text>` +
      (item.note ? `<text class="qr-chip-note" x="${left + 40}" y="${y + 12}">${esc(item.note)}</text>` : '') +
      `</a>`
    );
  };

  const marker = (family) =>
    `<marker id="qr-arrow-${family}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">` +
    `<path d="M0 1.5 9 5 0 8.5Z" class="qr-edge-${family}" stroke="none" fill="context-stroke"/></marker>`;

  // Edges are laid out first so the channel count is known before the viewBox
  // is sized -- otherwise the last channel is drawn outside the picture.
  const edgeHtml = drawn.map(edge).join('');
  const full = height + MAP.bus + Math.min(longRange, 5) * 9 + 10;

  return `
  <div class="qr-map">
    <svg viewBox="0 0 ${WIDTH - 108} ${full}" height="${full}" role="presentation">
      <defs>${EDGE_KEY.map(([f]) => marker(f)).join('')}</defs>
      ${lanes
        .map((lane, li) => `<text class="qr-lane-head" x="${li * (laneW + MAP.laneGap) + laneW / 2 - MAP.chipW / 2}" y="12">${esc(lane.head)}</text>`)
        .join('')}
      <g>${edgeHtml}</g>
      <g>${[...at.keys()].map(chip).join('')}</g>
    </svg>
    <div class="qr-key">${EDGE_KEY.map(
      ([f, label]) =>
        `<span><svg width="34" height="10" aria-hidden="true"><path class="qr-edge qr-edge-${f}" d="M1 5H27" marker-end="url(#qr-arrow-${f})"/></svg>${esc(label)}</span>`,
    ).join('')}<span class="qr-key-note">${drawn.length} relations, every one declared on a node page</span></div>
  </div>`;
};

const BODIES = { stack: stackBody, pairs: pairsBody, map: mapBody };

const footHtml = (kinds) => (col) => `
      <section>
        <h3>${esc(col.head)}</h3>${col.items
          .map((it) => `
        <p><b>${nodeLink(it.id, it.t, { size: 14, kinds })}</b> — ${esc(it.d)}</p>`)
          .join('')}
      </section>`;

/** Every node id a card names, for the generator's drift check. */
/** id -> kind, from the node files. Deterministic, so fragments stay byte-stable. */
export const kindsFor = (nodes) => new Map(nodes.map((n) => [n.id, kindOf(n.data?.tags)]));

export function idsIn(card) {
  if (card.kind === 'map') {
    return [
      ...card.lanes.flatMap((l) => l.items.map((i) => i.id)),
      ...card.footer.flatMap((f) => f.items.map((i) => i.id)),
    ];
  }
  const rows =
    card.kind === 'pairs'
      ? card.rows.flatMap((r) => [r.risk, r.control].flatMap((c) => [c.id, ...(c.also ?? []).map((a) => a.id)]))
      : card.rows.flatMap((r) => [r.id, ...(r.sub ?? []).map((s) => s.id)]).filter(Boolean);
  return [
    ...rows,
    ...card.footer.flatMap((f) => f.items.map((i) => i.id)),
    ...(card.bracket ? [card.bracket.id] : []),
    ...(card.loop ? [card.loop.id] : []),
  ];
}

/**
 * The legend, built from the kinds this card actually uses. Icons that classify
 * are only worth their space if the classification is readable, and a shared
 * image has to explain itself -- nobody who sees it on a timeline can click
 * through to find out what a shield means.
 */
const legendHtml = (used) => {
  const order = Object.keys(ICON_KINDS);
  used = [...used].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return `
  <div class="qr-legend">${used
    .map((k) => `<span class="qr-k-${k}">${icon(k, 13)}${esc(ICON_KINDS[k].label)}</span>`)
    .join('')}</div>`;
};

/** The fragment for one card: one <style> and one .qr root, all scoped under it. */
export function buildFragment(card, kinds, edges = []) {
  const body = BODIES[card.kind];
  if (!body) throw new Error(`card ${card.slug}: unknown kind ${card.kind}`);
  if (!kinds) throw new Error(`card ${card.slug}: no kind index — pass kindsFor(nodes)`);
  if (card.kind === 'map' && !edges.length) throw new Error(`card ${card.slug}: a map needs the graph — pass buildEdges(nodes)`);
  // Icons earn their space by telling concepts apart. On a card drawn from one
  // area of the guide they often cannot -- every concept on the evaluation card
  // classifies as a measure -- so that card carries none, and no legend either.
  const used = new Set(idsIn(card).map((id) => kinds.get(id) ?? 'concept'));
  const show = used.size >= 2;
  const index = show ? kinds : NO_ICONS;
  return `<style>${CSS}</style>
<div class="qr" role="img" aria-label="${esc(card.title)}. ${esc(card.sub)}">
  <header class="qr-head">
    <div>
      <h2>${esc(card.title)}</h2>
      <p>${esc(card.sub)}</p>
    </div>
    <div class="qr-brand">
      <strong>Field guide to the AI stack</strong>
      <span>mchelen.github.io/FieldGuideAIStack</span>
    </div>
  </header>
  <div class="qr-rule"></div>${show ? legendHtml(used) : ''}${body(card, index, edges)}
  <div class="qr-foot">${card.footer.map(footHtml(index)).join('')}
  </div>
  <p class="qr-take">${esc(card.takeaway)}</p>
</div>
`;
}
