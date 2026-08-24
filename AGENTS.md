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
- Missing sections are warnings rather than errors, so the backlog stays visible
  in CI without blocking unrelated work. Malformed ones are errors.
- **That backlog is now empty.** Every page carries all four, so a warning about
  a missing `canonical` or `useCase` is a regression rather than a known gap.
  The fifteen pages written before the rule existed were backfilled together,
  and seven of them turned out to have no canonical term at all — recorded as
  `none` with the reason, which is a finding rather than a blank.

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

## Cross-linking
- Link the first mention of any term that has its own page, and only the first.
  An unlinked mention is a dead end for a reader who does not already know the
  word; linking every occurrence is what makes wiki prose unreadable.
- If prose leans on a term that has no page and the sentence would be worse
  without it, that is the signal to write the page. A term worth explaining in
  passing is usually worth explaining properly.
- The validator warns about unlinked mentions, but only for terms of two or
  more words. Single common words — model, agent, surface, Claude — appear as
  ordinary prose constantly, and flagging them would bury the signal.
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
