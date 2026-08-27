---
title: Compaction
kind: concept
aka:
  - context compaction
  - conversation summarisation
canonical:
  status: de-facto
  term: Compaction
  body: Anthropic, in the Claude Platform documentation, where it is a server-side API feature
  url: https://platform.claude.com/docs/en/build-with-claude/compaction
  title: Compaction — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Not in any surveyed glossary. The technique — summarising earlier turns to
    keep a long run inside the window — was implemented in harnesses before it
    was offered as a service, and vendors are only now naming it.
tags: [context, technique]
zoom: 2
summary: Replacing older parts of a conversation with a summary so a long run
  keeps fitting the context window — and stays coherent, which is the less
  obvious half.
fieldMark: Compaction is lossy on purpose. What survives is what the summariser
  judged worth keeping, and anything that mattered only in the original wording
  is gone for good.
useCase:
  scenario: >-
    An agent has been working a task for two hours and the conversation no
    longer fits in one call.
  detail: >-
    Without compaction the run simply ends, or the harness truncates from the
    front and silently loses the original instructions. With it, older content
    is replaced by a summary that keeps the task, the decisions and the current
    state, and the run continues. Anthropic's framing adds the second reason:
    keeping the active context small is worth doing before the window is full,
    because quality falls as it grows.
flow:
  scenario: >-
    A long agent run approaching the context ceiling, with most of the
    history no longer needed in full.
  path:
    - actor: Sixty turns
      does: >-
        most of them finished work nobody needs verbatim
    - node: compaction
      does: >-
        replaces the older parts with a summary of them
      self: true
    - node: context-window
      does: >-
        so what remains still fits under the ceiling
    - node: context-engineering
      does: >-
        the wider job this is one tactic of
  returns: >-
    Detail is lost on purpose. Choosing which is the skill.
relations:
  - type: kind-of
    target: context-engineering
    note: One policy within it — the one that trades detail for continuity.
  - type: consumes
    target: context-window
    note: Exists to keep a conversation inside it as the run outlives the ceiling.
examples:
  - name: Server-side compaction
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/compaction
    note: >-
      Beta at the date read. "Automatically summarizing older context when
      approaching the context window limit", without client-side code.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-compaction
    url: https://platform.claude.com/docs/en/build-with-claude/compaction
    title: Compaction — Claude Platform documentation
    verifiedOn: 2026-08-22
    note: >-
      Marked beta on the date read, behind the `compact-2026-01-12` header.
      Availability and behaviour are vendor policy and may move.
---

Compaction "extends the effective context length for long-running conversations
and tasks by automatically summarizing older context when approaching the
[context window](context-window) limit."[[cite:anthropic-compaction]]

The mechanism is simple and the consequence is not: what was said becomes what
was summarised, and the difference is permanent.

## Two reasons, and the second is the interesting one

The obvious motive is capacity — a run that outlives the window has to shed
something.

The other is quality. Anthropic's documentation: compaction "also keeps the
active context small: as a conversation grows, response quality degrades, so
compaction replaces older content with a concise
summary."[[cite:anthropic-compaction]]

That is an argument for compacting *before* the ceiling forces it. A window that
is technically fitting but full of resolved detail is worse than a shorter one
carrying only what still matters.

## Where it is implemented

Anthropic offers it server-side, which "handles context management
automatically, without client-side summarization code", and describes it as "the
recommended strategy for managing context in long-running conversations and
agentic workflows."[[cite:anthropic-compaction]] It is marked beta at the date
read.

Harnesses have long done the same thing themselves. Moving it into the API means
the [harness](harness) writes less code and gives up some control over what is
kept — a trade worth making deliberately rather than by default.

## What it costs you

**Detail.** A summary keeps conclusions and loses the reasoning that produced
them, which matters when a later step needs to revisit an earlier decision.

**Exact wording.** Anything that depended on how something was phrased — a user's
precise instruction, an error message, a quoted passage — survives only if the
summariser thought to keep it verbatim.

**Determinism.** The summary is generated, so two runs of the same conversation
can compact differently and diverge afterwards.

The mitigation is not to summarise better. It is to keep the durable things
outside the conversation entirely — in a file, a task list, a note the agent
re-reads — so that compaction only ever discards material that was disposable.
That is [context engineering](context-engineering) doing the work compaction
cannot.
