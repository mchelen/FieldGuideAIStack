# AGENTS.md

A field guide to the AI stack. Full brief: `CHARTER.md` — read it before
any new development work.

## Standing instructions live here
- When someone says to *always* or *never* do something, write it into this
  file as part of the same piece of work. An instruction that only exists in a
  chat transcript is not a rule — the next session will not see it.
- This file is for how work gets done: workflow, tooling, conventions.
  `CHARTER.md` is for what the project is and why; it changes only by human
  decision or explicit direction. If a standing instruction changes the goals
  rather than the method, flag it as a charter decision instead of writing it
  here.
- Keep entries imperative and specific enough to act on without asking. If a
  rule needs a caveat, state the caveat rather than softening the rule.
- A rule here is only worth as much as its accuracy. When one turns out to be
  wrong, correct it in its own change and say what the observed behaviour was,
  rather than leaving a plausible-sounding rule in place.

## Workflow
- Develop on a branch, never on `main`, and never commit direct to `main`.
- Name branches `<type>/<short-kebab-description>` — for example
  `feat/graph-explorer-filters`, `content/vector-database-node`,
  `fix/link-checker-head-fallback`. Types: `feat`, `fix`, `content`, `docs`,
  `refactor`, `chore`, `test`. Exception: when a task harness assigns a branch
  name, use the assigned name as-is.
- Always open a pull request. Any new code, content, or configuration reaches
  `main` through one.
- Enable auto-merge on the pull request when you open it, and delete the branch
  on merge. Green checks merge it; nothing waits on a human unless a reviewer
  asks for changes.
  - The required `build` check is what auto-merge waits on. Without a required
    check, GitHub treats every passing pull request as already mergeable and
    refuses to arm auto-merge at all: *"the pull request is already in clean
    status (all checks passed) — you can merge directly."*
  - If auto-merge cannot be armed, confirm the checks are green and merge
    directly rather than leaving the pull request open. Say in the pull request
    that auto-merge was refused and why.
  - Hold auto-merge when a human has asked to read the pull request first, or
    when it touches a code-owned file. Say so in the description when you do.

## Dependency updates
- A bot pull request whose checks are green is safe to merge. Confirm the checks
  actually ran and passed, then merge it.
- A bot pull request whose checks fail is work to do, not a reason to close it.
  Find out what broke, fix it, and land the update. Declining a security update
  because the upgrade needs code changes is not an option.
- When the fix needs code changes, do the upgrade yourself in one pull request
  rather than pushing to the bot's branch. Close the bot's pull requests once
  the version they wanted is on `main`.
- Deprecation notices in CI output are updates waiting to happen. When a run
  warns that an action, runtime, or tool version is deprecated or superseded,
  open a pull request with the recommended version and get it to green. Do not
  leave the warning sitting in the log.
- Check what the current major actually is rather than assuming the next number
  up. This repository's Node 20 deprecation needed `actions/checkout` and
  `actions/setup-node` at **v7**, not v5.
- **Verify by exit code, never by grepping output.** A grep that finds nothing
  looks identical to a grep that found no problems, so an empty result reads as
  success when it may mean the pattern was wrong. #21 shipped two TypeScript
  errors this way: the check was `grep -E "error TS"`, Astro prints
  `error ts(2322)` in lowercase, and CI caught what the local check had
  silently passed. Run the command, read `$?`, and print the tail.
- **Green is only worth what CI covers.** Before trusting a green check on a
  major bump, ask what the build would still pass while quietly breaking. If
  nothing asserts it, add the assertion in the same pull request. Astro 5 -> 7
  is the worked example: `astro build` succeeded with the cross-link rewriting
  plugin disabled, and every prose link on the site would have shipped broken.
  `npm run check:output` exists because of it.

## Repository configuration
- Repository settings are code. `.github/settings.yml` is the source of truth,
  and the repository-settings app applies it. Change a setting by editing that
  file in a pull request — a change made in the GitHub UI holds only until the
  next sync, then reverts.
- **The sync fires only on a push to `main` whose commits add or modify
  `.github/settings.yml`.** Not on install, and not on an unrelated push — the
  app's `push` handler returns early otherwise. A settings change therefore
  applies when its own pull request merges, and nothing you do to another file
  will apply it for you.
- Because `settings.yml` is code-owned, applying repository settings always
  takes a human approval. That is the design, not an obstacle to route around.
- Verify against the live repository rather than trusting a green merge: a
  declared label should exist, and `main` should report as protected. If they
  do not, check that the app is installed and that the merged commit actually
  touched `settings.yml`. Debug the YAML last.
- Every top-level key under `protection` must be present; set the ones you do
  not want to `null`. Omitting one makes the app skip the entire block without
  reporting an error.
- `.github/CODEOWNERS` covers the files that can change what this automation is
  permitted to do: `settings.yml`, `CODEOWNERS` itself, the workflows, and
  `CHARTER.md`. Never merge a pull request touching those without the code
  owner's approval, even when checks are green.
- **That rule is a convention, not a mechanism. It does not block anything.**
  Tested on #13: a pull request modifying `.github/CODEOWNERS` — matched by an
  exact-path rule, so not a pattern problem — reported `mergeable_state: clean`
  with checks green and could have merged unapproved.
- The cause is identity, not configuration. An agent pushing with the owner's
  credentials authors pull requests *as the owner*, and GitHub never requires
  the author to approve their own pull request, so `require_code_owner_reviews`
  has nobody left to satisfy it. No CODEOWNERS pattern fixes this; any
  two-party control collapses when both parties are one account. Giving the
  agent a separate identity (a GitHub App or bot account) is what would make
  the gate bind.
- So the guard is you honouring it. Treat a code-owned file as needing approval
  because this file says so, not because GitHub will stop you.

## Concept pages
- A concept page carries four things beyond its prose:
  - **The canonical term**, or an explicit statement that there is not one. Use
    `canonical.status`: `standard` when a body or specification defines it,
    `de-facto` when one organisation's term was adopted generally, `contested`
    when vendors disagree, `none` when nothing has settled. A `contested` or
    `none` entry must say why, and must not headline a term of its own — put
    the nearest standard in the note and the link.
  - **Alternate terms with attribution**, in `aka`. A bare string is an informal
    synonym. The object form claims a named vendor uses that word, which is a
    product claim and needs a URL and a `verifiedOn` like any other.
  - **Popular examples** in `examples` — the concrete things a reader will have
    met, not only the vendors.
  - **A use case** in `useCase`: one scenario line, one paragraph of detail.
    Generic for now; these are the natural hook for the fictional organisation
    when it arrives.
- The reader-facing headings are named for what they answer, not for the field
  they come from: `fieldMark` prints as **How to spot it**, `useCase` as
  **Example**, and `aka` as an **Also called** chip row above the summary. The
  earlier labels — "Field mark", "In use", "What it looks like in use" — were
  named after the schema, and "field mark" in particular is birding jargon most
  readers do not have. Rename the heading, keep the field name.
- Missing sections are warnings rather than errors, so the backlog stays visible
  in CI without blocking unrelated work. Malformed ones are errors.
- **That backlog is now empty.** Every page carries all four, so a warning about
  a missing `canonical` or `useCase` is a regression rather than a known gap.
  The fifteen pages written before the rule existed were backfilled together,
  and seven of them turned out to have no canonical term at all — recorded as
  `none` with the reason, which is a finding rather than a blank.

## The applied illustration
- Every concept should carry a `flow` block: one real request traced through
  the pieces it touches, with this concept marked as the station it passes
  through. It is the answer to "show me where this sits", which a definition
  and a relation list both dodge.
- A station is either a `node` -- linked, and checked against the graph -- or a
  bare `actor`, for the parts of a real system this guide has no page for: the
  person typing, the document, the goal. Exactly one station carries
  `self: true`, and it must be this page's own id.
- The path has to be a **walk in the graph**: every node station declares a
  relation to another node station in the same flow. Checking against the
  subject's own neighbours instead was the first attempt and it flagged a
  station that legitimately hung off the step before it. When the walk check
  fires, look for a missing edge before rewriting the flow -- the first time it
  ran it found that no node connected `inference-api` to `model`.
- **Every station carries a `where`** -- whose computer that step happens on.
  Consecutive stations sharing one answer are drawn inside a labelled band, so
  the moment a request leaves the reader's machine is a line you can see rather
  than a fact you have to already know. Either every station in a flow has one
  or none do; a half-banded diagram reads as though the unlabelled steps happen
  nowhere.
- `where` is a **closed list**, in `src/content.config.ts`. The first pass wrote
  whatever fitted each step and produced 187 different answers, which meant 74
  flows where every band held exactly one station -- a boundary drawn between
  two steps on the same machine, with the boundary that matters lost among
  them. A band is only worth drawing if it groups. Adding a place to the list
  should be a deliberate decision that the guide has a machine it cannot name.
- **Start with the person** wherever a request really does start with one. The
  reader's own position on the diagram is what makes the rest of it legible,
  and it is the thing that was missing first time round. Not every concept has
  one -- nobody is present during pretraining, and a licence has parties rather
  than users -- so this is a judgement, not a rule the validator can make.
- `returns` is the payoff, drawn as a dashed arrow back up the diagram with its
  label in HTML underneath. Not inside the SVG: a label wide enough to read
  needed a gutter that pushed the drawing past 500px, and a phone then scaled
  15px type down to 7px.
- **Width is not a taste call.** An SVG scaled by its viewBox renders type at
  `font-size x scale`, and at a 320px viewport this figure gets 280px. The
  constants in `src/lib/flow.ts` are what keeps rendered type above the 11px
  floor `check:layout` enforces; changing them without re-running it is how the
  diagram becomes unreadable on a phone while every check stays green.
- `check:layout` also measures every label's bounding box against the box it
  sits in -- and every band label against its band -- on every page that has a
  flow. SVG text does not affect
  `scrollWidth`, so the ordinary overflow sweep cannot see it -- "Retrieval-
  augmented generation" ran clean out of its box and through the return arrow
  with everything green.
- `check:output` compares the stations drawn on the page with the stations
  declared in frontmatter. A picture of the wrong pipeline is worse than no
  picture, because it looks authoritative.
- Missing illustrations are one aggregated warning listing the first twelve
  ids. The backlog started at nearly every page, and a warning nobody can read
  to the end of is a warning nobody reads.
- **That backlog is now empty.** All 155 concepts carry one, so the warning
  firing again means a new page arrived without an illustration -- a regression
  rather than a known gap.
- Wrapping is by estimated width, not by character count: a character is not a
  width, and "which compares models, and answers" is thirty-four of them and
  far too wide. The advance table in `src/lib/flow.ts` is deliberately
  conservative -- measured against every label in the guide, it never
  under-estimates -- and the label check is what makes it safe to approximate.
  Titles are semibold and render about 1.14x wider than the weight the table
  was measured at; leaving that factor out under-estimated every title by a
  seventh, which stayed invisible until the boxes narrowed to make room for the
  bands and then six titles ran out of their boxes at once.

## Fieldwork
- The fictional organisation lives in `src/content/scenarios/` and
  `src/data/organisation.yml`, in its own collections, and **never** in
  `src/content/nodes/`. Everything under `nodes/` carries a dated source and can
  be checked; everything under `scenarios/` is invented. One collection would
  mean one schema and eventually a reader unable to tell which claims were
  verified, which costs more than the fiction adds.
- The scenario schema is `.strict()` and has no `sources` field, so a `sources:`
  key is a build failure rather than a review catch. `npm run validate` names it
  before the build gets that far.
- **Every page and card showing invented material carries the fiction mark**, and
  `npm run check:output` asserts it in `dist/` — on the scenario pages and on
  every node page that links to one. A reader arriving from a search result sees
  the mark or the guide is lying by omission. It uses `--fiction`, a hue used
  nowhere else on the site, so sourced and invented are distinguishable before
  reading a word.
- A scenario names at least two concepts. One concept in a situation is a
  `useCase` and belongs on the node page; fieldwork is for showing concepts
  interact.
- Cast names are checked against `organisation.yml`. Nothing external will ever
  contradict a fiction, so its consistency has to be mechanical or it drifts.
- Nodes never declare their scenarios. The back-reference is derived by
  inverting each scenario's `concepts` list, so the sourced half of the site
  stays independent of the invented half.

## The quick reference cards
- Three files per card, one source. Content is
  `scripts/lib/quick-reference-cards.mjs` (data only, no layout); layout is
  `scripts/lib/quick-reference-view.mjs`. `npm run quick-ref` writes
  `src/generated/<slug>.html` for the page to inline and renders each through
  Chromium to `public/<slug>.png` and `.pdf`. **All of it is committed**,
  because CI never runs the generator.
- **To add a card, add an entry to the cards file.** The generator, the page's
  contents list, the concept count in its prose and `check:output` all read that
  array, so nothing else needs editing. Give it a `kind`:
  - `stack` — ordered rows, optional bracket on the left and return arrow on the
    right. Read as depth on the stack card and as time on the loop card; use it
    wherever the order *is* the content.
  - `pairs` — a mapping, two labelled columns with an arrow between. The column
    headings are the card's, so it fits "failure → control" and "the claim →
    what to ask about it" equally.
  - `map` — a node-link diagram. Lanes of chips, and **the edges are the graph**:
    every line is an authored relation between two concepts the card places, so
    a card cannot claim a connection the guide does not make, and deleting a
    relation from a page deletes the line. A card declares lanes, never edges.
  Slugs are filenames, so the first card keeps the bare `quick-reference` name:
  that PNG is the site's Open Graph card and may already be linked elsewhere.
- **Do not hand-compute layout.** This was an SVG assembled by adding
  coordinates together, and the arithmetic was wrong twice — a footer under a
  band, a loop arrow floating clear of the boxes it connected. It is HTML and
  CSS so the browser does the layout. Add a box; do not add a number.
- The captions are written for a diagram — shorter and blunter than the page
  summaries — but **every concept a card names must be a real node**, and the
  generator exits non-zero if one is not. Where a caption is sharper than the
  summary it is usually lifted from that page's field mark; it must still say
  what the page says.
- The generator renders each card, then asks the page whether it fits, and fails
  the build if not. Note how much that check needs, because each layer of it was
  added after the previous one shipped a visible bug:
  - `scrollHeight` — catches the frame growing. On its own it reported *900px of
    900px* while a grid overflowed its flex parent.
  - a per-element sweep of bottom edges — catches that, with the overshoot in px
    so it is clear how much to trim.
  - a sibling sweep — catches a band painted over by the block above it, which
    is *inside* the frame and so invisible to both of the above.
  - a label-fit sweep on `map` chips — SVG text does not wrap and overflows too
    quietly to notice, so each label is measured against the box it sits in.
  Overflow is also a CSS bug worth fixing at the source: `flex: 1 1 auto` with
  `min-height: 0` lets a body collapse silently. Use `flex: 1 0 auto`.
  **Still rasterise and look at every card** — the gate sees overflow, not
  ugliness.
- The `stack` row colours are an **ordinal** ramp, not four categorical hues:
  swapping surface and model would change the meaning, so the order is the data
  and one hue stepped by lightness lets the reader see it. Both ramps were
  validated against this site's own surfaces, not a default pair. `pairs` is two
  labelled categories, so position and heading carry the split and colour only
  reinforces it. Text always wears the ink tokens; colour is carried by rails
  and pills, so nothing depends on reading it.
- **Icons classify; they do not illustrate.** The site's icon rule is that an
  icon repeating the adjacent word buys nothing, so these say what *kind* of
  thing a concept is — component, process, technique, control, failure, measure,
  ceiling, artifact, store, who — which the label does not. The kind is derived
  from each node's own tags by an ordered table in the view, so a retagged page
  reclassifies itself and a card cannot disagree with the guide. Change the
  order and everything reclassifies: that is the design, not a hazard. Only two
  kinds carry colour, both status roles rather than series colours, and both
  ship with a shape and a legend label.
- **A card drawn from one area of the guide gets no icons at all**, and no
  legend. Every concept on the evaluation card classifies as a measure, so the
  glyphs would distinguish nothing — which is the decoration the icon rule
  exists to keep out. The generator counts the kinds a card uses and decides;
  do not force them back on.
- A row whose name is a grouping rather than a concept takes **no `id`**. It
  renders as plain text with no icon and no link, and the concepts sit in the
  boxes beneath it. Giving such a row the id of whichever concept came first —
  "The levers" linking to prompt caching — is a small lie the reader catches.
- Two traps in the view file specifically, each of which shipped a visible bug:
  - **No backticks in the stylesheet's comments.** `CSS` is a template literal,
    so a backtick inside one is a syntax error at import time.
  - **Scope selectors to direct children.** `.qr-map svg` also matched the icon
    SVGs nested inside every chip and stretched each one to the size of the
    whole diagram.
- `scripts/lib/nodes.mjs` mirrors `RELATION_TYPES` from `src/content.config.ts`,
  because the validators deliberately run without booting Astro. `npm run
  validate` compares the two and fails if they diverge — a copy is only safe
  when something checks it.
- `npm run check:output` asserts, per card, that both images shipped and are not
  truncated, and that the committed fragment still matches what the generator
  produces — otherwise the page and the shared images could describe different
  diagrams with CI green. It also asserts every card's title appears on the
  page, so a card silently dropped from the gallery is caught.

## Small-width layout
- `npm run check:layout` loads every page type at 320, 390, 430 and 768px and
  fails if the document scrolls sideways. **It needs a browser**, which CI does
  not have, so it skips cleanly there — run it yourself after any change to
  layout CSS.
- Horizontal overflow is the failure this site kept shipping: invisible on a
  laptop, invisible in the diff, and every other check green. Three causes were
  live at once when the check was written — a nav that did not wrap, a grid
  track sized `1fr` (whose min-width is `auto`, so one long chip widened the
  whole card), and `white-space: nowrap` on a chip carrying a forty-character
  term.
- So: size flexible grid tracks `minmax(0, 1fr)`, put `min-width: 0` on a nested
  grid or flex child, and do not set `nowrap` on anything holding a concept
  name — the names run to forty characters.
- The signal is the **document's** `scrollWidth`, never an element's width. A
  wide element inside a scrolling wrapper is correct, and reporting it buries
  the real findings; the check skips anything with a scrolling or clipping
  ancestor for exactly this reason.

## The index order
- Concepts first, then product families, then products, then tags. The guide is
  155 concepts and 8 products, and a reader arriving at a vendor catalogue has
  to scroll past it to reach what the guide is for. Products led for a long
  time, which cost a phone reader 3,154px — three and a half screens — before
  the first concept; it is 666px now.
- The concepts section opens on level 1, so the first thing on the page is the
  fourteen terms everything else is defined against. That is the same "high
  level to detailed" journey the zoom control offers, applied to the landing.
- Products are not demoted, they are placed: they read as the concepts above
  assembled and sold, which is the relationship the guide is trying to teach.

## Zoom levels
- Every node declares `zoom` — **the coarsest level at which it should appear**,
  so a level is cumulative: level 2 means "1 and 2". The index and the graph
  explorer must agree on that. They did not for a long time: the graph filtered
  `zoom <= n` while the index rendered the three levels as disjoint groups, so
  the same word named two different sets on two pages and nothing noticed.
  `npm run check:output` now compares each button's count against the cards that
  actually qualify.
- The index's control **hides, it does not omit.** Every card ships in the HTML
  and the page shows all of them; the script narrows to a level once it runs.
  A filter that failed closed would hide most of the guide from anything without
  JavaScript.
- **Setting `hidden` is not hiding.** The attribute's `display: none` comes from
  the UA stylesheet, so any class selector setting a display value beats it.
  The control shipped setting `hidden` on 139 cards and hiding none of them, and
  `check:output` stayed green throughout because it counted the attribute.
  `.cards > .card[hidden] { display: none; }` is what makes it real.
- The lesson generalises past this bug: **count what the page paints, not what
  the script set.** `getClientRects().length` is the reader's experience;
  `element.hidden` is only the mechanism agreeing with itself. `check:layout`
  now walks the three levels in a browser and compares each button's count
  against the cards actually rendered.
- The levels stay **authored** — a human decides what a beginner meets first —
  but they are checked against evidence. `reach` is how many other pages are
  written in terms of a concept; `npm run validate` warns when a level-1 term
  has almost no reach or a level-3 term has a lot. It warns rather than fails,
  because reach is a proxy and a genuinely essential term can be rarely linked.
- **Prerequisite depth was tried and rejected.** Chains of `consumes` edges made
  leaderboard and evaluation the two deepest concepts in the guide, which says
  something about graph shape and nothing about what is hard. Do not revive it
  without checking the ranking it produces first.
- `reachOf` lives in `scripts/lib/nodes.mjs` and is imported by
  `src/lib/levels.ts`, so the number shown on a page and the number the
  validator tests against cannot drift.
- **`attestedBy` is measured, and re-measurable.** `npm run survey:attestation`
  re-runs it; `--write` updates the inventory. Two kinds of evidence count: a
  glossary's own list of defined terms containing the term (exact match on a
  normalised form, **never substring** — "model" appears inside half the entries
  of every glossary), or a node's canonical block citing that glossary by URL,
  which is a human having checked and catches what matching cannot.
- The first survey recorded 56 attested terms where there are 79, because it
  matched each term but not its synonyms and read four of the eight sources as
  defining nothing at all. Two guards exist so that cannot recur quietly: the
  script exits non-zero if a source 404s, and if a source yields fewer than five
  defined terms — a glossary that suddenly defines nothing has changed its
  markup, and recording that as zeroes is worse than not running.
- **Extraction is per source.** One generic "take every heading" rule returned
  731 terms from one glossary and zero from four others. Each source's entry
  says where its defined terms actually live; if you add a source, look at its
  markup rather than assuming.
- Render it only positively. A zero means "not found", and stating it as "no
  glossary defines this" can contradict the page's own canonical block.
- A concept page's altitude band is **derived from the relation graph** — the
  neighbours coarser than it are the frame it sits in, the finer ones are the
  detail underneath. It is not a curated "see also", so deleting a relation
  removes it from the band too. 153 of 166 pages carry one; the rest have no
  neighbour at a different level, and correctly show nothing.
- `npm run quick-ref` rewrites the PDFs every run because they carry a creation
  timestamp. If a change did not touch the cards, `git checkout -- public/*.pdf`
  before committing rather than shipping the churn.

## Source freshness
- **Never bump `verifiedOn` without reopening the page.** That rule is why the
  weekly job cannot simply refresh dates: a URL returning 200 is not evidence
  the claim survived.
- A source may carry a **`quote`** — the sentence on the page the claim rests
  on, copied verbatim. It is the only thing that makes a citation
  machine-re-verifiable, and it is rendered under the source so a reader can
  judge the claim without leaving the page. Copy it; never paraphrase, and never
  tidy it, or it will stop matching a page that did not change. Sentences
  containing `": "` need a block scalar like any other.
- `npm run draft:freshness` re-fetches every aged-out citation and, with
  `--write`, bumps only those whose quote is still on the page. Everything else
  is reported with the reason: no quote, unreachable, or the sentence is gone.
- The drafter is deliberately narrow: **it only ever moves a date, and it proves
  it did.** After writing it re-reads the file and every differing line must be
  a `verifiedOn` it meant to change; anything else and the file is restored and
  the run fails. Keep that guard if you extend the script.
- Adding a quote to a source is worth more than bumping its date, because it
  makes that source re-verifiable for good. Prefer it when re-reading a page.
- Two things the fetcher has to do, both learned the hard way:
  - **Send `accept-language`.** Google's ML glossary served Persian on one fetch
    and English on the next, from the same URL. Without the header a stored
    English quote reads as "the claim changed" when nothing had.
  - **Normalise a space before punctuation away.** Stripping an inline tag
    leaves `"automatic evaluation ."`, so a quote copied as a human reads it
    would never match. Store the sentence as it reads; let the comparison
    absorb the artifact.
- **A `quote` belongs only under `sources:`.** `canonical:` and each `examples:`
  entry carry a `url` and a `verifiedOn` too, so anything editing frontmatter by
  pattern will land in the wrong block. Both are now `.strict()`, so a stray key
  is a build failure — before that Zod dropped it and 15 of 17 quotes were
  written into canonical blocks with every check green.
- A glossary cited by many pages is the cheapest coverage there is: each citing
  page quotes that glossary's definition of its own term, so one fetch backfills
  dozens. Read what you extract — of 36 candidates pulled this way, four were a
  truncated list item, an unrelated first sense, or a follow-on sentence rather
  than a definition, and were dropped rather than stored.
- Check the anchor actually defines the citing page's subject. Several
  candidates pointed at a neighbouring entry — time to first token at the
  latency definition, citation precision at the classification-metric one — and
  a plausible-looking quote for the wrong concept is worse than none.
- Split sentences on punctuation followed by whitespace and a capital, never on
  punctuation alone: `CLAUDE.md` and `SKILL.md` tore in half and produced quotes
  beginning "md file containing...".
- Strip the topic chips a glossary prefixes to each entry (`#fundamentals`,
  `#generativeAI`); they flatten into the text and get stored as part of the
  sentence.
- The weekly workflow opens a pull request for what it confirmed and an issue
  for what it could not. It lives in `.github/workflows/`, which is code-owned:
  a change to it needs the owner's approval and must not auto-merge.

## Quoting a source
- A source with a stored `quote` can be re-verified by machine: the weekly job
  re-fetches the page and confirms the sentence is still on it. A source
  without one needs a human to reopen the page, forever. That is the whole
  reason to add them, and why coverage is worth pushing.
- **Quote the claim, not the concept.** The earlier passes searched each source
  for a sentence mentioning the concept and stalled at 31%, because a source is
  cited *at a claim* and the sentence that supports it frequently never names
  the concept. Read the prose around `[[cite:id]]` first, then look for the
  sentence that bears it.
- Extract candidates through the **same** flattening `draft:freshness` uses, so
  anything picked is re-verifiable by construction rather than by hope. A
  substring of a matching sentence still matches, so trimming a heading or a
  stray fragment off the front is safe.
- Entities have to survive that flattening. `&lt;` and `&gt;` were not decoded,
  so a page documenting a `<FILL_ME>` token could only be quoted by storing
  `&lt;FILL_ME>` -- which is not what the page says and not what anyone would
  copy. Decode anything that would otherwise force a quote to carry markup.
- Some cited pages cannot be quoted at all, because a fetcher gets an empty
  JavaScript frame. `check:links` warns when a page cited **at a claim** serves
  under 400 characters of prose. The fix is to cite the document that carries
  the claim.
- That threshold is deliberately tiny, and the scope is deliberately narrow,
  because the first version of the check was wrong in both. It counted all
  readable text, warned under 4,000 characters, and flagged thirteen pages —
  five of which already carried quotes that re-verify on every run. Volume does
  not separate the two: Stanford's CRFM page is quotable at 1,309 characters of
  prose and Hugging Face's tokenizers index is not at 2,239.
- A source listed only to back an `examples` entry is exempt. That source is
  evidence the thing exists at that URL, which the URL itself supplies — HELM's
  leaderboard is a JavaScript app and is still exactly where to send someone
  who wants to look at leaderboards. A source cited at a claim makes a
  different promise: that the page says something.
- Verify a batch by running `draft:freshness --max-age 0`, which re-fetches
  every page and reports how many quotes are still on them. Zero "no longer on
  the page" is the pass condition.

## Search
- The charter's framing is lookup — *"you may see a bird in the wild and want to
  check the field guide"* — so search indexes **`aka`, not just titles**. The
  words readers meet are often not the titles here: someone who read
  "scaffolding" must land on Harness. A title-only search answers "no such
  thing" to the exact question the guide exists to answer.
- When a hit comes from an alternate name the result says which one. Without
  that the reader cannot tell why an unrelated-looking title appeared.
- The box is `hidden` in the markup and revealed by its own script, because the
  site is static and a search box that does nothing is worse than none. Note the
  explicit `.site-search[hidden] { display: none }` — see the zoom-control note
  above for why the attribute alone is not enough.
- `nodes-index.json` is the one shared index: link previews and search both read
  it, and it is fetched on first hover or first keystroke rather than inlined.
- `npm run check:layout` types real queries into a real page and asserts what
  comes back, including two alias lookups. **Type, do not `fill`.** A test that
  set the value programmatically reported Enter-to-navigate as broken when it
  works; testing the way a reader interacts is what made the behaviour legible.

## Cross-linking
- Link the first mention of any term that has its own page, and only the first.
  An unlinked mention is a dead end for a reader who does not already know the
  word; linking every occurrence is what makes wiki prose unreadable.
- If prose leans on a term that has no page and the sentence would be worse
  without it, that is the signal to write the page. A term worth explaining in
  passing is usually worth explaining properly.
- The validator warns about unlinked mentions. Single-word terms are checked
  too, minus an explicit list of words — model, agent, surface, Claude, token,
  run — that this guide also uses in their ordinary English sense several times
  a page. Skipping every one-word term was the earlier rule, and it let
  `hyperscaler` sit unlinked in a paragraph about hyperscalers.
- A term two nodes both answer to is nobody's to claim. `function calling` is
  this guide's own node and OpenAI's name for tool use, so reporting it could
  only ever produce a coin flip; ambiguous terms are skipped.
- Frontmatter prose is prose. `fieldMark`, `canonical.note`, `useCase.scenario`
  and `.detail`, and every relation and alias `note` render on the page, so
  they carry links and the checker reads them. They render through
  `Prose.astro`, not the markdown pipeline — bare `[label](node-id)` and
  nothing else. `canonical.body` is an attribution line and is deliberately
  outside the link check: pulling a word out of "OWASP GenAI Security Project"
  reads the organisation's name as a claim. `sources[].note` and
  `examples[].note` are not rendered at all; a batch edit put six links there,
  two inside quoted source titles, and every check stayed green.
- A link is never planted inside a quotation, a citation marker, or another
  link's target. Each of those was a false positive once: `[[cite:aws-prov-
  throughput]]` reported an unlinked `throughput`, and
  `[Checkpoints](checkpoint-and-rollback)` reported an unlinked `checkpoint`.
- YAML plain scalars cannot start with `[`. A link at the very start of a
  frontmatter value turns the value into a flow sequence and the file stops
  parsing — reword so the link is not first.
- Spaces in a term match any run of whitespace, and a mention inside another
  link's text does not count. Both were wrong before: re-wrapping a paragraph
  could hide `Claude Code` by splitting it across lines, and `[indirect prompt
  injection](...)` was reported as an unlinked mention of `prompt injection`.
  Fixing the first surfaced seven real unlinked mentions that hard wrapping had
  been concealing.
- Vendor-attributed terms are matched case sensitively, because the lowercase
  form is often an ordinary phrase. Google's "Connected Apps" is a product
  name; "connected apps" is what you call apps that are connected.

## Products and capabilities
- A product page is only as useful as the capability nodes it can point at. The
  comparison table is built from `bundles` edges, so a capability no product
  declares simply does not exist as a row — the table cannot show an absence it
  was never told about.
- So when adding or revising a product, read its documentation for **verbs**,
  not features: runs, reads, writes, schedules, signs in, installs. Check each
  against the existing capability nodes, and add a node when the product does
  something none of them covers. Command execution was missed on the first pass
  exactly this way: it was described in prose on four product pages while being
  invisible in the comparison.
- `npm run check:gaps` does the checking that used to depend on someone
  noticing. It reads the capability concepts as its lexicon, so it widens as
  the guide does, and flags any product page whose prose describes a capability
  it declares no `bundles` edge to. Removing the command execution edge from
  Claude Code reproduces the original miss and the check catches it.
- It suppresses sentences containing a negation, because a page saying a
  product *cannot* do something is evidence the empty cell is deliberate.
  Without that suppression the Claude page alone raises three false positives,
  since its prose lists precisely what Claude lacks.
- Capabilities are worth splitting when products differ on them independently.
  Reading files and running commands travel together in marketing and apart in
  practice, which is why they are two nodes rather than one.
- Where a capability runs is often the real distinction, and it belongs in the
  relation's `note`. "Runs commands" is true of four products here and means
  something different in each.

## Processing
- Push significant processing into tools and CI jobs, not tokens. Link checking,
  content validation, and graph integrity are scripts, not agent tasks.
- Reserve the model for judgment: wording, taxonomy calls, whether a
  distinction earns its own node.

## Content rules
- Every product or license claim needs a source URL and a `verifiedOn` date.
  Fetch it; never write one from memory.
- **Cite at the claim, not at the page.** A reader should be able to tell which
  sentence rests on which source, the way a Wikipedia article does — a bulk
  list at the foot of the page does not say which reference supports what, and
  a claim that looks sourced but is not is worse than an obviously unsourced
  one. Attach the reference inline to the sentence making the claim.
- A source nobody cites inline is either unused or the prose around it is
  under-cited. Both are worth noticing rather than leaving.
- **Never let a line break fall inside a link target either.**
  `[context management](context-\nengineering)` is not a link — markdown renders
  it as literal text, and `check:output` cannot see the absence of something
  that was never emitted. Eight of these had accumulated before the validator
  learned to catch them; the cross-link warning had missed seven, because it
  goes quiet as soon as the same term is linked correctly elsewhere on the page.
- **Never let a line break fall inside a `[[cite:id]]` marker.** A split marker
  stops matching, ships as literal text, and looks fine in the source. Hard
  wrapping a paragraph is how it happens. `npm run validate` now names the file
  and the broken marker; `npm run check:output` catches it in `dist/` as a
  second line of defence.
- Where a source could not be read directly — a publisher blocking automated
  clients, a paywall — say so on the source itself rather than letting a
  citation imply a confidence the retrieval does not support.
- Content lives in the graph. Adding a concept is one new node file, never
  a new hand-written page.
- **`attestedBy` in the inventory is a hint, not evidence.** It is computed from
  a term-name match across the surveyed glossaries and misses entries whose
  heading is worded differently. Before recording `canonical.status: none` on
  the grounds that nothing carries a term, open the glossaries and look. #31
  shipped two wrong entries this way: the Claude Code glossary — one of the
  eight surveyed — defines both "Verification loop" and "Sandboxing", and the
  pages claimed no surveyed glossary carried either.
- **A YAML plain scalar cannot contain a colon followed by a space.** `fieldMark:
  Ask what it costs: tokens.` does not parse, and the error names a line number
  rather than the problem. Use a block scalar (`fieldMark: >-`) whenever the
  text might contain `: `. This has broken four separate pages; `npm run
  validate` catches it, and now names the offending key rather than relaying
  the parser's line and column.
