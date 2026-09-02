/**
 * Groups of concepts the guide's own link structure holds together, derived
 * rather than asserted.
 *
 * This does not produce tags for the site. It exists so `check:tags` can ask
 * one question the tag vocabulary cannot ask of itself: are there subjects the
 * guide clearly groups and nobody has named? A cluster of a dozen concepts that
 * all link to each other and share no tag is a subject a reader cannot browse
 * for, because you cannot search for a word nobody wrote.
 *
 * The method is link communities (Ahn, Bagrow & Lehmann 2010). Cluster the
 * *edges* of the association graph and let each concept inherit every group its
 * edges landed in. Clustering nodes would force a partition -- one home each --
 * and the whole point is that `sandbox` belongs with the runtime that executes
 * things and with the attacks on it, and should not have to choose. That is
 * also why this is a check and not a taxonomy: the `area` field in the concept
 * inventory is a partition, assigned once when the guide had twenty written
 * pages and never sourced since, and it is not what browsing should run on.
 *
 * ## Where the edges come from
 *
 * Declared `relations` plus prose cross-links. Relations alone are far too
 * sparse -- 286 edges over 155 concepts, which fragments into 49 groups, mostly
 * pairs. Adding the prose links gives 788 edges and something meaningful. A
 * page linking another in its prose *is* this guide asserting an association,
 * which is the same reading `reachOf` already takes.
 *
 * The consequence, and it is a real one: these groups follow how the prose is
 * written, so editing a page can move a concept between them. Nothing is
 * rendered from them and nothing fails on them -- they only raise a warning
 * count -- so drift costs a line in a log rather than a broken page.
 *
 * ## Determinism
 *
 * Every sort is by id and every tie is broken by id, so the same content always
 * produces the same groups and a diff stays reviewable.
 */

/** Minimum concepts for a tag to be worth offering. */
const MIN_MEMBERS = 3;
/** Above this, a tag stops being a way to narrow anything down. */
const MAX_MEMBERS = 20;
/** Two groups sharing this much of the smaller one are the same tag twice. */
const MERGE_OVERLAP = 0.6;

/**
 * @param {{id: string, data: any, content: string}[]} nodes  concept pages
 * @returns {{tag: string, hub: string, members: string[]}[]}
 */
export function derivedTags(nodes) {
  const concepts = nodes.filter(
    (n) => n.data && n.data.kind !== 'product' && n.data.kind !== 'suite',
  );
  const ids = concepts.map((n) => n.id).sort();
  const known = new Set(ids);
  const title = new Map(concepts.map((n) => [n.id, n.data.title]));

  const adj = new Map(ids.map((id) => [id, new Set()]));
  for (const n of concepts) {
    const targets = new Set((n.data.relations ?? []).map((r) => r.target));
    for (const m of (n.content ?? '').matchAll(/\]\(([a-z0-9-]+)\)/g)) targets.add(m[1]);
    for (const t of targets) {
      if (!known.has(t) || t === n.id) continue;
      adj.get(n.id).add(t);
      adj.get(t).add(n.id);
    }
  }

  const edges = [];
  for (const a of ids) for (const b of adj.get(a)) if (a < b) edges.push([a, b]);
  edges.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]));
  if (!edges.length) return [];
  const edgeAt = new Map(edges.map((e, i) => [`${e[0]}|${e[1]}`, i]));

  // Inclusive neighbourhoods: a node counts as its own neighbour, so two edges
  // off the same hub are similar when their far ends keep similar company.
  const incl = new Map(ids.map((id) => [id, new Set([id, ...adj.get(id)])]));
  const similarity = (a, b) => {
    const A = incl.get(a);
    const B = incl.get(b);
    let shared = 0;
    for (const x of A) if (B.has(x)) shared += 1;
    return shared / (A.size + B.size - shared);
  };

  const pairs = [];
  for (const hub of ids) {
    const nbrs = [...adj.get(hub)].sort();
    for (let i = 0; i < nbrs.length; i += 1) {
      for (let j = i + 1; j < nbrs.length; j += 1) {
        const [a, b] = [nbrs[i], nbrs[j]];
        const ea = edgeAt.get(hub < a ? `${hub}|${a}` : `${a}|${hub}`);
        const eb = edgeAt.get(hub < b ? `${hub}|${b}` : `${b}|${hub}`);
        pairs.push([similarity(a, b), Math.min(ea, eb), Math.max(ea, eb)]);
      }
    }
  }
  pairs.sort((p, q) => q[0] - p[0] || p[1] - q[1] || p[2] - q[2]);

  const parent = edges.map((_, i) => i);
  const find = (x) => {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    while (parent[x] !== r) [x, parent[x]] = [parent[x], r];
    return r;
  };
  const union = (a, b) => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb);
  };

  /** Ahn et al.'s partition density: how link-dense the edge groups are. */
  const density = () => {
    const groups = new Map();
    for (let i = 0; i < edges.length; i += 1) {
      const r = find(i);
      groups.set(r, (groups.get(r) ?? 0) + 1);
    }
    const members = new Map();
    for (let i = 0; i < edges.length; i += 1) {
      const r = find(i);
      const set = members.get(r) ?? new Set();
      set.add(edges[i][0]);
      set.add(edges[i][1]);
      members.set(r, set);
    }
    let sum = 0;
    for (const [r, mc] of groups) {
      const nc = members.get(r).size;
      if (nc <= 2) continue;
      sum += mc * ((mc - (nc - 1)) / ((nc * (nc - 1)) / 2 - (nc - 1)));
    }
    return (2 / edges.length) * sum;
  };

  // Single linkage, cutting where the partition density peaks.
  let best = { d: -Infinity, roots: null };
  let i = 0;
  while (i < pairs.length) {
    const s = pairs[i][0];
    while (i < pairs.length && pairs[i][0] === s) {
      union(pairs[i][1], pairs[i][2]);
      i += 1;
    }
    const d = density();
    if (d > best.d) best = { d, roots: edges.map((_, k) => find(k)) };
  }

  const byRoot = new Map();
  best.roots.forEach((root, k) => {
    const set = byRoot.get(root) ?? new Set();
    set.add(edges[k][0]);
    set.add(edges[k][1]);
    byRoot.set(root, set);
  });

  const rank = (t) => [...t].sort((a, b) => adj.get(b).size - adj.get(a).size || a.localeCompare(b));
  let groups = [...byRoot.values()]
    .map((s) => rank([...s]))
    .filter((t) => t.length >= MIN_MEMBERS)
    .sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));

  // The density cut is fine-grained by design, so it emits the same group twice
  // under two hubs. Fold those together, comparing against each group as it was
  // first seen -- comparing against the growing result lets merges cascade until
  // one tag swallows a quarter of the guide.
  const overlapOf = (a, b) => {
    const A = new Set(a);
    return b.filter((x) => A.has(x)).length / Math.min(a.length, b.length);
  };
  const seeds = [];
  const kept = [];
  for (const g of groups) {
    const at = seeds.findIndex(
      (seed, k) => overlapOf(g, seed) >= MERGE_OVERLAP && new Set([...kept[k], ...g]).size <= MAX_MEMBERS,
    );
    if (at === -1) {
      kept.push([...g]);
      seeds.push([...g]);
      continue;
    }
    for (const id of g) if (!kept[at].includes(id)) kept[at].push(id);
  }
  groups = kept.map((g) => rank(g)).sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));

  // Name each tag after the concept that characterises it. Degree alone picks
  // whatever is best connected in the guide overall, which named a runtime
  // group "model"; concentration alone overcorrects onto the obscure, which
  // named the reasoning group "tree of thoughts". Take the best-connected
  // member from among those that actually sit inside the group.
  const concentration = (id, t) => {
    const inside = [...adj.get(id)].filter((x) => t.includes(x)).length;
    return adj.get(id).size ? inside / adj.get(id).size : 0;
  };
  const taken = new Set();
  const out = [];
  for (const members of groups) {
    const top = Math.max(...members.map((id) => concentration(id, members)));
    const characteristic = rank(members.filter((id) => concentration(id, members) >= top * 0.6));
    // Falling back to `characteristic[0]` when every characteristic member is
    // already a hub named two different groups `Function calling`, and a tag
    // whose name is not its own is not a tag. Widen to the whole group before
    // giving up.
    const hub =
      characteristic.find((id) => !taken.has(id)) ?? members.find((id) => !taken.has(id));
    if (!hub) continue;
    taken.add(hub);
    out.push({ tag: title.get(hub), hub, members: [...members].sort() });
  }
  return out.sort((a, b) => b.members.length - a.members.length || a.hub.localeCompare(b.hub));
}

/** Tags per concept id, for the pages that render them. */
export function tagsByConcept(nodes) {
  const byConcept = new Map();
  for (const t of derivedTags(nodes)) {
    for (const id of t.members) {
      byConcept.set(id, [...(byConcept.get(id) ?? []), t]);
    }
  }
  for (const list of byConcept.values()) {
    list.sort((a, b) => b.members.length - a.members.length || a.hub.localeCompare(b.hub));
  }
  return byConcept;
}
