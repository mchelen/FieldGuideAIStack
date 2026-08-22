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
  - The required `build` check is what auto-merge waits on. Without a required
    check, GitHub treats every passing pull request as already mergeable and
    refuses to arm auto-merge at all: *"the pull request is already in clean
    status (all checks passed) — you can merge directly."*
  - If auto-merge cannot be armed, confirm the checks are green and merge
    directly rather than leaving the pull request open. Say in the pull request
    that auto-merge was refused and why.
  - Hold auto-merge when a human has asked to read the pull request first, or
    when it touches a code-owned file. Say so in the description when you do.

## Repository configuration
- Repository settings are code. `.github/settings.yml` is the source of truth,
  and the repository-settings app applies it. Change a setting by editing that
  file in a pull request — a change made in the GitHub UI holds only until the
  next sync, then reverts.
- **The sync runs on a push to `main`, and only then.** Installing the app
  applies nothing by itself. Neither does merging the pull request that adds
  `settings.yml`, if the app was installed after that merge landed. The next
  push to `main` is what applies the file.
- That failure is silent — nothing errors, the settings simply stay unapplied.
  So verify against the live repository rather than trusting a green merge: a
  declared label should exist, and `main` should report as protected. If they
  do not, check the app is installed, then push again. Debug the YAML last.
- Every top-level key under `protection` must be present; set the ones you do
  not want to `null`. Omitting one makes the app skip the entire block without
  reporting an error.
- `.github/CODEOWNERS` covers the files that can change what this automation is
  permitted to do: `settings.yml`, `CODEOWNERS` itself, the workflows, and
  `CHARTER.md`. Never merge a pull request touching those without the code
  owner's approval — even when checks are green, and even though
  `enforce_admins` is false and the merge would technically succeed. The gate
  is a convention this file binds you to, not a mechanism that stops you.

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
