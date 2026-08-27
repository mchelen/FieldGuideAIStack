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
  /** Top edge of the band this station opens, when it opens one. The step
   *  arrow stops there rather than at the box, so the arrowhead reads as the
   *  request crossing onto a different machine -- and does not run through the
   *  band's label on the way. */
  bandTop?: number;
}

/** A run of consecutive stations that happen on the same machine. */
export interface FlowBand {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FlowDiagram {
  width: number;
  height: number;
  scenario: string;
  stations: FlowStation[];
  bands: FlowBand[];
  returns?: { label: string; fromY: number; toY: number; x: number; legX: number };
}

export interface FlowInput {
  scenario: string;
  path: {
    node?: { id: string };
    actor?: string;
    does: string;
    self: boolean;
    where?: string;
  }[];
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
/** Room for a band to sit behind the boxes and still show at their edges. */
const BAND_INSET = 6;
const BOX_W = WIDTH - PAD * 2 - BAND_INSET * 2;
const GAP = 30;
const TITLE_H = 21;
const LINE_H = 14;
const BOX_PAD_Y = 9;
/** Height of a band's label strip, above the first box it holds. */
const BAND_LABEL_H = 18;
const BAND_PAD_Y = 8;

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
/**
 * Semibold and bold both render about 1.14x wider than the weight the table
 * was measured at. Titles are semibold, so leaving this out under-estimated
 * every one of them by a seventh -- invisible until the boxes narrowed to make
 * room for the machine bands, and then six titles ran out at once.
 */
const BOLD = 1.15;
const textWidth = (s: string, size: number, weight = 1) =>
  [...s].reduce((w, ch) => w + advance(ch, size), 0) * weight;

/** Inner width of a station box, after the 14px text inset on each side. */
const TEXT_W = BOX_W - 28;
const DOES_SIZE = 13;
const TITLE_SIZE = 15;
/** Width of the gutter the return arrow is drawn in. Its label is HTML below
 *  the drawing, not text inside it: a label wide enough to read needed a
 *  gutter that pushed the whole viewBox past 500px, and a phone then scaled
 *  15px type down to 7px. */
const RETURN_GUTTER = 28;

function wrap(text: string, size: number, weight = 1): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (!line) line = word;
    else if (textWidth(`${line} ${word}`, size, weight) <= TEXT_W) line += ` ${word}`;
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
  const bands: FlowBand[] = [];
  const boxX = PAD + BAND_INSET;
  let y = PAD;
  let open: { label: string; top: number } | null = null;

  const closeBand = (bottom: number) => {
    if (!open) return;
    bands.push({
      label: open.label,
      x: PAD,
      y: open.top,
      w: WIDTH - PAD * 2,
      h: bottom + BAND_PAD_Y - open.top,
    });
    open = null;
  };

  input.path.forEach((step, i) => {
    // A band opens when `where` changes, so a run of steps on one machine is
    // one labelled region and the boundary between two is a drawn edge.
    if (step.where !== input.path[i - 1]?.where) {
      closeBand(stations[stations.length - 1] ? y - GAP : y);
      if (step.where) {
        y += BAND_PAD_Y;
        open = { label: step.where, top: y };
        y += BAND_LABEL_H;
      }
    }

    const id = step.node?.id;
    const title = id ? (graph.byId.get(id)?.data.title ?? id) : step.actor!;
    const lines = wrap(step.does, DOES_SIZE);
    const titleLines = wrap(title, TITLE_SIZE, BOLD);
    const h = TITLE_H * titleLines.length + lines.length * LINE_H + BOX_PAD_Y * 2;
    stations.push({
      id,
      title,
      does: step.does,
      self: step.self,
      x: boxX,
      y,
      w: BOX_W,
      h,
      titleLines,
      lines,
      bandTop: open?.top === y - BAND_LABEL_H ? open.top : undefined,
    });
    y += h + GAP;
  });
  closeBand(y - GAP);

  const height = y - GAP + PAD + (bands.length ? BAND_PAD_Y : 0);
  const diagram: FlowDiagram = {
    width: WIDTH,
    height,
    scenario: input.scenario,
    stations,
    bands,
  };

  if (input.returns) {
    const first = stations[0];
    const last = stations[stations.length - 1];
    diagram.returns = {
      label: input.returns,
      fromY: last.y + last.h / 2,
      toY: first.y + first.h / 2,
      // Leaves the boxes, but its vertical leg runs clear of the bands -- it
      // is about the whole path, not about any one machine on it.
      x: boxX + BOX_W,
      legX: WIDTH - PAD + 12,
    };
    diagram.width = WIDTH + RETURN_GUTTER;
  }

  return diagram;
}

/**
 * Plain-text equivalent, so the figure is not the only way to read it. The
 * machine each step runs on is named the first time it changes, exactly where
 * the drawing puts a band -- a reader who cannot see the bands still gets the
 * boundary, and gets it in the same place.
 */
export function flowSummary(d: FlowDiagram, path: FlowInput['path'] = []): string {
  const steps = d.stations.map((s, i) => {
    const where = path[i]?.where;
    const opens = where && where !== path[i - 1]?.where;
    // No preposition: several of the places already begin with one, and "On on
    // the wire" is what that produced.
    return `${opens ? `${where}: ` : ''}${s.title} — ${s.does}`;
  });
  const joined = steps.join('; then ');
  return d.returns ? `${joined}. ${d.returns.label}` : `${joined}.`;
}
