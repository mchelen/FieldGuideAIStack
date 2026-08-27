---
title: Multi-agent system
kind: concept
aka:
  - MAS
  - agent swarm
canonical:
  status: standard
  term: Multi-agent system
  body: Established in distributed AI long before language models; recorded in Wikipedia's survey of the field
  url: https://en.wikipedia.org/wiki/Multi-agent_system
  title: Multi-agent system — Wikipedia
  verifiedOn: 2026-08-22
  note: >-
    One of the few terms here with a genuine prior literature. The current
    LLM-based usage is a special case of a decades-old research area, and
    Wikipedia notes it as "a new area of research" within it rather than a new
    idea.
tags: [agentic, structure]
zoom: 2
summary: Several agents coordinating on a problem — with the delegation,
  duplication and communication costs that arrangement has always brought.
fieldMark: Count the context windows. The reason to use several agents is
  usually that one window is not enough, and if that is not the reason, the
  second agent is probably costing more than it adds.
useCase:
  scenario: >-
    A research task needs twenty sources read, and reading all twenty into one
    context leaves no room to think about them.
  detail: >-
    Twenty sub-agents each read one source in a fresh window and return a
    summary, and a parent synthesises. The parallelism is a bonus; the fresh
    windows are the point. Note what was paid for it — the parent never sees
    the sources, only twenty summaries, and anything a summary dropped is gone.
    Multi-agent designs buy capacity with fidelity.
relations:
  - type: contains
    target: agent
    note: Several of them, which is the definition.
  - type: consumes
    target: orchestration
    note: Coordination is what makes it a system rather than a collection.
examples:
  - name: Multi-agent system
    url: https://en.wikipedia.org/wiki/Multi-agent_system
    note: >-
      "A computational system composed of multiple interacting intelligent
      agents", with a literature predating language models by decades.
    verifiedOn: 2026-08-22
  - name: Orchestrator-workers
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: The most common shape in practice — a parent decomposing and delegating.
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-mas
    url: https://en.wikipedia.org/wiki/Multi-agent_system
    title: Multi-agent system — Wikipedia
    verifiedOn: 2026-08-22
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

A multi-agent system "is a computational system composed of multiple interacting
intelligent agents", able to "solve problems that are difficult or impossible for
an individual agent or a monolithic system to solve."[[cite:wikipedia-mas]]

This is one of the few terms in the guide with a real prior literature.
Wikipedia notes that "with advancements in large language models, LLM-based
multi-agent systems have emerged as a new area of research" — a development
within the field, not the invention of it.[[cite:wikipedia-mas]]

## The honest reason to build one

Not that several agents are cleverer than one. The reason is usually capacity:
each [agent](agent) gets its own [context window](context-window), so a task
whose material does not fit in one can be split across several.

Parallelism is the second reason and a lesser one, since the calls that matter
are usually serially dependent anyway.

If neither applies — if the work fits in one window and proceeds in sequence —
a second agent adds coordination cost and removes nothing.

## What coordination costs

Every hand-off is a lossy summary. A [sub-agent](sub-agent) receives a
description of its task rather than the original context, and returns a
description of its findings rather than what it saw. The parent reasons over
summaries of summaries.

The characteristic failures follow:

- **Duplicated work**, because agents cannot see each other.
- **Contradictory results** that the parent has no basis to adjudicate.
- **Confident summaries** that hide the uncertainty underneath them.
- **A synthesis step** that is harder than any of the subtasks and gets the least
  design attention.

## Where it does work

Anthropic's [orchestrator-workers](orchestration) pattern fits tasks "where you can't predict the
subtasks needed", giving the example of a coding change where "the number of
files that need to be changed and the nature of the change in each file likely
depend on the task."[[cite:anthropic-agents]]

That is the shape worth copying: decomposition decided at runtime, subtasks that
are genuinely independent, and a result that combines cleanly. When subtasks are
not independent, the coordination overhead grows faster than the benefit — which
is the finding the distributed-AI literature arrived at long before any of this
involved language models.[[cite:wikipedia-mas]]
