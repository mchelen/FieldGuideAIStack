---
title: Autonomy level
kind: concept
aka:
  - autonomy tier
  - permission mode
canonical:
  status: none
  note: >-
    No surveyed glossary carries it and no vendor publishes a scale. Every
    product ships its own named tiers, which makes cross-product comparison a
    manual exercise — the gap this page exists to name.
tags: [agentic, safety]
zoom: 2
summary: How much an agent decides and does without asking — the dimension the
  word "autonomous" flattens into a yes or no.
fieldMark: The level is set per action class, not per product. The same agent
  is usually fully autonomous on reads, gated on writes, and forbidden outright
  on a short list.
useCase:
  scenario: >-
    Two vendors both describe their coding agent as autonomous and a security
    review has to compare them.
  detail: >-
    The adjective is not comparable; the levels are. Ask each: what runs with no
    prompt, what prompts, what is refused, and does that change when nobody is
    watching. The answers differ sharply between products that share the
    marketing description, and they are what a review can actually act on. That
    no vendor publishes them in a common form is the reason this comparison is
    still manual.
flow:
  scenario: >-
    Two products described as "autonomous", meaning two quite different
    things about who is asked before an action.
  path:
    - actor: A product claim
      does: >-
        "autonomous", with no scale attached
    - node: autonomy-level
      does: >-
        the label — how much runs without anyone being asked
      self: true
    - node: approval-mode
      does: >-
        the setting underneath that actually decides it
    - node: autonomous-agent
      does: >-
        the end of the scale, where nobody is asked at all
  returns: >-
    A label applied to a setting. Read the setting.
relations:
  - type: implemented-by
    target: approval-mode
    note: The setting where a level becomes a policy the [harness](harness) enforces.
  - type: distinguished-from
    target: autonomous-agent
    note: >-
      One is a dimension, the other is a label applied to a range of it. The
      label hides the answer to every question worth asking.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Frames the trade as trust plus environment: autonomy suits "scaling tasks
      in trusted environments".
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

"Autonomous" is used as though it were a category and behaves as a range. An
[agent](agent) that reads files freely, asks before writing them and refuses to
push is autonomous in one sense and supervised in two others — all at once, on
the same run.

The level is therefore not one setting but a mapping from action classes to
policies.

## The classes that matter

- **Read** — inspect files, search, fetch. Usually ungated, and worth noticing
  that this is where [indirect prompt injection](indirect-prompt-injection)
  enters.
- **Write, locally** — edit files, create branches. Recoverable, commonly gated
  by default and ungated by preference.
- **Execute** — run commands. Where [command execution](command-execution) meets
  everything on the machine, and where a [sandbox](sandbox) changes the
  calculation entirely.
- **Reach outward** — network calls, APIs, sending. Usually irreversible and
  visible to other people.
- **Spend** — money, credits, quota.

A product's real autonomy level is its answer for each class, not a tier name.

## Why levels are per-context too

The same agent should be more autonomous on a scratch branch than on
`main`, more autonomous inside a container than on a developer's laptop, and
less autonomous on a repository it has never seen.

Anthropic's phrasing makes the environment part of the judgment: autonomy is
"ideal for scaling tasks in trusted environments", with testing recommended "in
sandboxed environments."[[cite:anthropic-agents]] Trust is a property of the
pair, not of the agent.

## The unattended question

Level usually changes when nobody is watching. An agent running under
[background execution](background-execution) or a [scheduled task](scheduled-task) cannot fall back to [a human in the loop](human-in-the-loop), so either
its permissions narrow or its gates become notifications after the fact.

Products differ on this and rarely say so on the page that describes their
autonomy.

## Why there is no standard scale

Automotive driving automation has six published levels that everyone cites.
Nothing equivalent exists here: each vendor names its own modes, the modes do
not line up, and a level in one product is a different set of permissions from
the same-sounding level in another.

Until that changes, comparing autonomy means reading each
[permission model](permission-model) directly and building the table yourself.
