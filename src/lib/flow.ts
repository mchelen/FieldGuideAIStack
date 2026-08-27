import type { Graph } from './graph';

export interface FlowStation {
  /** Node id when the station has a page here; undefined for a bare actor. */
  id?: string;
  title: string;
  does: string;
  self: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Title, wrapped to the box width. Long ones exist: "Retrieval-augmented
   *  generation" ran out of its box and through the return arrow. */
  titleLines: string[];
  /** `does`, wrapped to the box width. */
  lines: string[];
}

export interface FlowDiagram {
  width: number;
  height: number;
  scenario: string;
  stations: FlowStation[];
  returns?: { label: string; fromY: number; toY: number; x: number };
}

export interface FlowInput {
  scenario: string;
  path: { node?: { id: string }; actor?: string; does: string; self: boolean }[];
  returns?: string;
}

/**
 * Deliberately narrow, and the width is not a taste call. An SVG scaled by its
 * viewBox renders type at (font-size x scale), and at 320px the page gives this
 * figure 280px -- so the whole drawing has to fit in about that, or a reader on
 * a phone gets 15px type at 7px. `check:layout` measures the rendered size and
 * fails under an 11px floor; these constants are what passes it.
 */
const WIDTH = 286;
const PAD = 10;
const BOX_W = WIDTH - PAD * 2;
const GAP = 30;
const TITLE_H = 21;
const LINE_H = 14;
const BOX_PAD_Y = 9;

/**
 * Wrapping is by estimated width, not by character count. Counting characters
 * put "which compares models, and answers" -- thirty-four of them, but full of
 * m, w and d -- straight out of its box, because a character is not a width.
 * The table is coarse on purpose: it only has to be close enough that the
 * label check in `check:layout` passes, and that check is what makes it safe
 * to be approximate here.
 */
const HAIRLINE = new Set([...'iljI.,;:\'|!']);
const NARROW = new Set([...'ft()[]{}/\\"r-']);
const WIDE = new Set([...'mwMW@—–']);
const advance = (ch: string, size: number) => {
  if (ch === ' ') return 0.28 * size;
  if (HAIRLINE.has(ch)) return 0.31 * size;
  if (NARROW.has(ch)) return 0.43 * size;
  if (WIDE.has(ch)) return 0.99 * size;
  if (/[A-Z0-9]/.test(ch)) return 0.73 * size;
  return 0.64 * size;
};
const textWidth = (s: string, size: number) =>
  [...s].reduce((w, ch) => w + advance(ch, size), 0);

/** Inner width of a station box, after the 14px text inset on each side. */
const TEXT_W = WIDTH - PAD * 2 - 28;
const DOES_SIZE = 13;
const TITLE_SIZE = 15;
/** Width of the gutter the return arrow is drawn in. Its label is HTML below
 *  the drawing, not text inside it: a label wide enough to read needed a
 *  gutter that pushed the whole viewBox past 500px, and a phone then scaled
 *  15px type down to 7px. */
const RETURN_GUTTER = 28;

function wrap(text: string, size: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (!line) line = word;
    else if (textWidth(`${line} ${word}`, size) <= TEXT_W) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Vertical critical path, computed at build time.
 *
 * Vertical rather than horizontal because the reading order of a sequence is
 * the reading order of the page, and because a horizontal one either overflows
 * a phone or scales its labels below legibility. Every measurement here is a
 * constant, so the same frontmatter always produces byte-identical SVG.
 */
export function flowDiagram(graph: Graph, input: FlowInput): FlowDiagram {
  const stations: FlowStation[] = [];
  let y = PAD;

  for (const step of input.path) {
    const id = step.node?.id;
    const title = id ? (graph.byId.get(id)?.data.title ?? id) : step.actor!;
    const lines = wrap(step.does, DOES_SIZE);
    const titleLines = wrap(title, TITLE_SIZE);
    const h = TITLE_H * titleLines.length + lines.length * LINE_H + BOX_PAD_Y * 2;
    stations.push({
      id,
      title,
      does: step.does,
      self: step.self,
      x: PAD,
      y,
      w: BOX_W,
      h,
      titleLines,
      lines,
    });
    y += h + GAP;
  }

  const height = y - GAP + PAD + (input.returns ? 0 : 0);
  const diagram: FlowDiagram = {
    width: WIDTH,
    height,
    scenario: input.scenario,
    stations,
  };

  if (input.returns) {
    const first = stations[0];
    const last = stations[stations.length - 1];
    diagram.returns = {
      label: input.returns,
      fromY: last.y + last.h / 2,
      toY: first.y + first.h / 2,
      x: PAD + BOX_W,
    };
    diagram.width = WIDTH + RETURN_GUTTER;
  }

  return diagram;
}

/** Plain-text equivalent, so the figure is not the only way to read it. */
export function flowSummary(d: FlowDiagram): string {
  const path = d.stations.map((s) => `${s.title} — ${s.does}`).join('; then ');
  return d.returns ? `${path}. ${d.returns.label}` : `${path}.`;
}
