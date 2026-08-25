---
title: Turn
kind: concept
aka:
  - exchange
  - round
canonical:
  status: de-facto
  term: Turn
  body: Anthropic, in the Claude Code glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    Borrowed from conversation analysis, where turn-taking is a term of art.
    The agentic sense adds one thing worth knowing: a turn may contain many
    model calls and tool executions, so it is not the same as a request.
tags: [agentic, core]
zoom: 3
summary: One complete response within a session — from your message to the
  agent finishing, with any number of tool calls in between.
fieldMark: A turn is not an API call. One turn can be dozens of calls and
  hundreds of tool executions, which is why "per message" pricing and "per
  turn" limits describe very different quantities.
useCase:
  scenario: >-
    A cost estimate assumes one request per user message and comes in an order
    of magnitude low.
  detail: >-
    Each user message begins a turn, and inside the turn the agent may call the
    model twenty times, each call re-sending the whole conversation plus every
    tool result so far. The unit the user perceives and the unit the bill is
    computed in are different, and mistaking one for the other is the most
    common error in budgeting agentic work.
relations:
  - type: contains
    target: agentic-loop
    note: >-
      The loop is what happens inside one turn — Anthropic's glossary draws the
      containment explicitly.
  - type: consumes
    target: inference-api
    note: Many calls per turn, not one.
examples:
  - name: Claude Code turns
    vendor: Anthropic
    url: https://code.claude.com/docs/en/glossary
    note: >-
      "A turn begins when you send a message and ends when Claude finishes
      responding, with any number of tool calls in between."
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      One complete response from Claude within a session.
---

A turn is "one complete response from Claude within a
[session](session)."[[cite:claude-code-glossary]] It "begins when you send a
message and ends when Claude finishes responding, with any number of tool calls
in between."[[cite:claude-code-glossary]]

The nesting is stated plainly in the same entry: "a session consists of many
turns, and the [agentic loop](agentic-loop) describes what happens inside
one."[[cite:claude-code-glossary]]

## Why the unit matters

A turn is what a person experiences as one interaction — ask, wait, read. It is
also the unit at which most things worth measuring are measured: latency as
felt, cost per exchange, and where lifecycle [hooks](hook) fire.

But it is emphatically not an [inference API](inference-api) call. Inside one
turn the [harness](harness) may call the model repeatedly, each time re-sending
the entire conversation plus every tool result accumulated so far.

That gap between the perceived unit and the billed unit is where agentic cost
estimates usually go wrong, and it is also why
[prompt caching](prompt-caching) changes the economics so much: the repeated
prefix within a single turn is identical by construction.

## Turn as the unit of control

Several controls are naturally per-turn rather than per-call:

- **[Effort level](effort-level)** — how much thinking this turn may spend.
- **Interruption** — a turn is the thing you stop.
- **Stop hooks** — Anthropic notes they "fire at the end of each
  turn."[[cite:claude-code-glossary]]
- **[Checkpoints](checkpoint-and-rollback)** — a restore point created at each
  prompt you send.

That makes the turn the natural granularity for oversight. Not each tool call,
which is too many to review, and not the whole session, which is too late.
