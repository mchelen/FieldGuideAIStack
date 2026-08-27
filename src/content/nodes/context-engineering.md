---
title: Context engineering
kind: concept
aka:
  - context management
  - prompt assembly
canonical:
  status: none
  note: >-
    Coined around 2025 and not carried by any surveyed glossary. It names work
    that was previously scattered across [prompt engineering](prompt-engineering), retrieval and
    memory, and is used because the older terms describe the parts rather than
    the discipline.
tags: [context, technique]
zoom: 1
summary: Deciding what occupies the context window on each call — what to
  include, what to drop, what to summarise and what to fetch again later.
fieldMark: Prompt engineering asks what to say. Context engineering asks what
  to bring. In an agent that runs for hours, the second question is the one that
  decides whether it stays coherent.
useCase:
  scenario: >-
    An agent is sharp for the first twenty steps of a task and vague by the
    hundredth.
  detail: >-
    Nothing degraded except what it can see. Tool results accumulated, early
    decisions scrolled past usefulness, and the material that mattered is now
    buried among material that does not. No model change fixes this and a bigger
    window only postpones it. What fixes it is a policy: keep the task
    statement, summarise finished work, drop stale tool output, re-fetch on
    demand.
flow:
  scenario: >-
    An agent forty turns into a task starts losing track of what it was
    doing, and the context window is nearly full.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        keep working; the history keeps growing
    - actor: Forty turns of history
      where: wherever the product runs
      does: >-
        tool output, file contents, half-finished plans
    - node: context-engineering
      where: wherever the product runs
      does: >-
        decides what stays, what is dropped, what is summarised
      self: true
    - node: compaction
      where: wherever the product runs
      does: >-
        replaces finished work with a summary of it
    - node: context-window
      where: the prompt you send
      does: >-
        what survives has to fit here, on every single call
  returns: >-
    Cost and latency fall with it — you pay for what you send
relations:
  - type: consumes
    target: context-window
    note: The whole discipline is the allocation of one scarce resource.
  - type: distinguished-from
    target: prompt-engineering
    note: >-
      Prompting is about wording one request. Context engineering is about what
      is present across many of them.
examples:
  - name: Context Engineering for AI Agents
    url: https://www.promptingguide.ai/agents/context-engineering
    note: The community reference's treatment, framed around agents specifically.
    verifiedOn: 2026-08-22
  - name: Compaction
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/compaction
    note: >-
      A vendor implementation of one context-engineering policy: summarise
      older content automatically as the window fills.
    verifiedOn: 2026-08-22
sources:
  - id: promptguide-ctxeng
    url: https://www.promptingguide.ai/agents/context-engineering
    title: Context Engineering for AI Agents — Prompt Engineering Guide
    verifiedOn: 2026-08-22
  - id: anthropic-compaction
    url: https://platform.claude.com/docs/en/build-with-claude/compaction
    title: Compaction — Claude Platform documentation
    verifiedOn: 2026-08-22
---

The [context window](context-window) is a per-call ceiling, and the
[inference API](inference-api) is stateless, so every request is assembled from
scratch. Context engineering is the discipline of deciding what goes into that
assembly.

The term is recent and the work is not. What changed is that
[agents](agent) run long enough for the decision to matter more than the wording
of any single prompt.[[cite:promptguide-ctxeng]]

## Why a bigger window did not solve it

Two reasons, and only the first is about capacity.

**Cost and [latency](latency) scale with what you send.** Every [token](token) in the
prompt is paid for on every call and adds to
[time to first token](time-to-first-token). Filling a large window because it is
there is expensive by the hour.

**Quality degrades before capacity does.** Anthropic's compaction documentation
states it plainly: "as a conversation grows, response quality
degrades."[[cite:anthropic-compaction]] Relevant material buried among
irrelevant material is harder to use than relevant material alone — which is why
[reranking](reranking) improves answers by passing *fewer* passages.

The window is not a bucket to fill. It is a working set to curate.

## The moves available

- **Include** — the task, the current state, the material actually needed now.
- **Summarise** — [compaction](compaction), replacing finished work with a
  precis.
- **Drop** — stale tool output, superseded plans, resolved errors.
- **Externalise** — write findings to a file or a note and re-read on demand
  rather than carrying them.
- **Retrieve** — fetch on need via
  [RAG](retrieval-augmented-generation) instead of pre-loading.
- **Delegate** — hand a subtask to a [sub-agent](sub-agent) with its own window,
  and take back only the result.

## Why it is a [harness](harness) responsibility

None of this is something a [model](model) can do for itself. The model sees
whatever it was sent and has no view of what was left out.

So context engineering is where a harness earns its keep, and it is a large part
of why two products on the same model behave so differently on long tasks. The
model supplies judgment; the harness decides what the judgment gets to see.
