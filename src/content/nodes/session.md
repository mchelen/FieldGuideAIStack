---
title: Session
kind: concept
aka:
  - conversation
  - run
canonical:
  status: de-facto
  term: Session
  body: Anthropic, in the [Claude Code](claude-code) glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    Borrowed from ordinary software, where a session is a bounded interaction
    with stored state. What is specific here is that a session owns a context
    window, which makes starting a new one a meaningful act rather than
    housekeeping.
tags: [agentic]
zoom: 2
summary: One continuous run of an agent and the state scoped to it — its
  conversation, its context window, and everything that disappears when it ends.
fieldMark: A new session is a new context window. When a long conversation
  starts making mistakes, starting a fresh one with a short summary is usually
  faster than arguing with the old one.
useCase:
  scenario: >-
    An agent has been redirected four times and is now confusing the current
    task with two abandoned ones.
  detail: >-
    Everything it can see says all three tasks are live, because everything it
    can see is the transcript. Compaction summarises rather than forgets, so
    the abandoned work keeps voting. Starting a fresh session with a paragraph
    of what actually matters is the cheapest fix available, and knowing when to
    reach for it is a real operating skill.
flow:
  scenario: >-
    Closing a terminal on a half-finished task and picking it up an hour
    later with everything still in place.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        start a task, close the terminal, come back later
    - actor: One run
      where: a person, not a system
      does: >-
        started, interrupted, and resumed
    - node: session
      where: wherever the product runs
      does: >-
        the state scoped to it — conversation, context, working files
      self: true
    - node: turn
      where: wherever the product runs
      does: >-
        each exchange inside it, counted separately
    - node: checkpoint-and-rollback
      where: your machine
      does: >-
        and the restore points taken along the way
  returns: >-
    Resumable, forkable, and it ends
relations:
  - type: contains
    target: turn
    note: A session is many turns; a turn is one exchange.
  - type: consumes
    target: context-window
    note: >-
      Each session has its own, which is why starting a new one is how you get
      a clean slate.
examples:
  - name: Claude Code sessions
    vendor: Anthropic
    url: https://code.claude.com/docs/en/glossary
    note: >-
      "A conversation tied to your current directory, with its own independent
      context window" — resumable, forkable, and stored as a transcript.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A conversation tied to your current directory, with its own independent context window.
---

A session is "a conversation tied to your current directory, with its own
independent [context window](context-window)."[[cite:claude-code-glossary]]

The second half is what makes the term load-bearing rather than administrative.
A session is not merely a record of what was said; it is the boundary of what
the [model](model) can see.

## What is scoped to it

- **The conversation** — every message and tool result, re-sent on each call.
- **The context window** — its capacity, and its contents.
- **Working state** — the current task, the plan, what has been tried.
- **[Checkpoints](checkpoint-and-rollback)** — restore points, saved with the
  conversation.

Anthropic's implementation makes the scoping concrete: sessions "can be resumed
with `claude -c`, forked with `--fork-session` to preserve history under a new
session ID, or run in parallel across terminals", and "running `/clear` starts a
new session; the previous one stays stored."[[cite:claude-code-glossary]]

Forking is worth noticing. A session's history is a value that can be copied,
which is what makes exploring two approaches from a shared starting point
possible.

## Why starting a new one is a technique

Context accumulates monotonically within a session. Abandoned approaches,
resolved errors and superseded plans all stay visible, and
[compaction](compaction) summarises them rather than deleting them — so they
keep influencing what comes next, at reduced volume.

A new session is the only clean break. Carrying forward a short written summary
into it is [context engineering](context-engineering) at its bluntest and often
its most effective.

## Sessions and agents are not the same boundary

A [sub-agent](sub-agent) runs in its own context window inside a parent's
session. Several parallel sessions are a different arrangement again — each is a
full independent run with no shared state, which is what distinguishes them from
delegation.

Which matters when reasoning about a [multi-agent system](multi-agent-system):
what is shared is exactly what was written down and passed, and nothing else.
