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
- Where a source could not be read directly — a publisher blocking automated
  clients, a paywall — say so on the source itself rather than letting a
  citation imply a confidence the retrieval does not support.
- Content lives in the graph. Adding a concept is one new node file, never
  a new hand-written page.
