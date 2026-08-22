# FieldGuideAIStack

A field guide for the modern AI stack.

You see a term in the wild — "open weights", "model host", "harness" — and want
to know what it actually is, what it is not, and how to tell them apart. Each
concept gets one page, one auto-generated diagram of what it touches, and a
dated source for every claim about a real product.

Read the brief in [`CHARTER.md`](CHARTER.md) before doing development work, and
the working rules in [`AGENTS.md`](AGENTS.md).

## Running it

```bash
npm install
npm run dev      # http://localhost:4321/FieldGuideAIStack
npm run build    # static output in dist/
```

## How the content works

Content is a node graph, not a page tree. Everything under
`src/content/nodes/` is one concept per Markdown file, and the filename is the
node id. Adding a concept means adding one file — never a hand-written page.

```yaml
---
title: Harness
aka: [agent harness, scaffolding]
tags: [core, runtime]
zoom: 1                     # 1 = start here, 2 = working vocabulary, 3 = detail
summary: One sentence, used on cards and in the graph.
fieldMark: How you recognise it in the wild. Plain text, no markdown.
relations:
  - { type: consumes, target: inference-api, note: why }
examples:
  - name: Claude Code
    vendor: Anthropic
    url: https://…
    note: What makes it an example of this concept.
    verifiedOn: 2026-08-22
sources:
  - { url: "https://…", title: "…", verifiedOn: 2026-08-22 }
---

Prose. Cross-reference other nodes with a bare id: [harness](harness).
```

Three things fall out automatically and should never be written by hand:

- **Reverse edges.** Declare a relation once, from whichever side reads better.
  The inverse is derived at build time, so the two can never disagree. Declaring
  a symmetric relation (`distinguished-from`) from both ends is an error.
- **Neighbourhood diagrams.** Each page's SVG is computed from the graph. The
  layout is deterministic, so diffs stay reviewable.
- **Cross-reference URLs.** `[harness](harness)` is rewritten to the real path
  at build time, so content does not need to know the deploy base.

The relation vocabulary lives in `src/content.config.ts` and is deliberately
small. A new relation type should only be added when an existing one would
misdescribe the link.

## What CI enforces

Per `AGENTS.md`, validation is scripts and jobs, not agent judgment.

| Command | Catches |
| --- | --- |
| `npm run validate` | Dangling prose links, orphan nodes, self-edges, duplicate and reciprocal relations, products named without a source |
| `npm run check` | Frontmatter schema violations and relations pointing at nodes that do not exist |
| `npm run check:links` | Cited URLs that have rotted. Bot-blocked responses (400/401/403/429) are reported as *blocked*, not broken — otherwise everyone learns to ignore the job |
| `npm run check:freshness` | Claims whose `verifiedOn` has aged past 180 days |

`ci.yml` runs all of these on every pull request. `verify-sources.yml` runs the
link and freshness checks weekly and opens a single issue listing whatever needs
a human to re-open the page. **Never bump a `verifiedOn` date without actually
re-reading the source.**

`deploy.yml` publishes `dist/` to GitHub Pages on push to `main`.

## Repository configuration

Repository settings are code too. [`.github/settings.yml`](.github/settings.yml)
is the source of truth — merge settings, branch protection, labels, topics —
and the [repository-settings app](https://github.com/repository-settings/app)
applies it. Change a setting by editing that file in a pull request; a change
made in the GitHub UI holds only until the next sync, then reverts.

Two things about that sync are worth knowing before you debug it:

- **It fires only on a push to `main` that changes `settings.yml` itself.** Not
  on install, and not on an unrelated merge — the app's push handler returns
  early unless a commit in the push added or modified the file. So a settings
  change applies when its own pull request merges, and merging something else
  will not apply it for you.
- **Every key under `protection` must be present.** Set the ones you do not
  want to `null`. Omitting one makes the app skip the whole block without
  reporting an error.

[`.github/CODEOWNERS`](.github/CODEOWNERS) covers the files that can change what
the automation is allowed to do — `settings.yml`, `CODEOWNERS` itself, the
workflows, and `CHARTER.md`. Branch protection requires zero approvals in
general but code owner approval on those, so ordinary content pull requests
auto-merge on green while changes to the guardrails wait for a human. Since the
sync only fires on a `settings.yml` change, that also means every repository
settings change passes through a human approval by construction.

Note that `enforce_admins` is `false`, which it has to be: nobody can approve
their own pull request, so enforcing protection on admins would deadlock a solo
owner on any code-owned change. That makes the review requirement binding by
convention rather than by mechanism. `AGENTS.md` is where the convention is
written down.

## Status

Implemented: content schema and graph model, derived reverse edges,
per-node neighbourhood diagrams, the full graph explorer, source verification
tooling, CI, Pages deploy, and repository settings as code — with 11 nodes
covering the model / harness / provider / host distinctions and the openness
vocabulary.

Not yet built, from the charter:

- The fictional organization used to make the concepts concrete.
- Zoom-level *navigation* beyond the current per-node `zoom` field — the data
  supports it, the UI only filters on it.
- Automation that detects real-world changes and proposes content updates.
  Today the tooling detects that a source needs re-reading; it does not draft
  the update.
