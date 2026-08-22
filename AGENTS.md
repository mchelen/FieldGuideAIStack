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
  - Three repository settings make this work. "Allow auto-merge" and
    "Automatically delete head branches" under Settings → General → Pull
    Requests, plus branch protection on `main` requiring the `build` check.
  - The required check is not optional hardening — it is what auto-merge waits
    on. Without it GitHub treats every passing PR as already mergeable and
    refuses to arm auto-merge at all: *"the pull request is already in clean
    status (all checks passed) — you can merge directly."*
  - If auto-merge cannot be armed, confirm the checks are green and merge
    directly rather than leaving the PR open. Say in the PR that auto-merge was
    refused and why.
  - Hold auto-merge only when a human has asked to read the PR first. Say so in
    the PR description when you do.

## Processing
- Push significant processing into tools and CI jobs, not tokens. Link checking,
  content validation, and graph integrity are scripts, not agent tasks.
- Reserve the model for judgment: wording, taxonomy calls, whether a
  distinction earns its own node.

## Content rules
- Every product or license claim needs a source URL and a `verifiedOn` date.
  Fetch it; never write one from memory.
- Content lives in the graph. Adding a concept is one new node file, never
  a new hand-written page.
