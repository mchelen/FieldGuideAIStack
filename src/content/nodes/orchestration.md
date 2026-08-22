---
title: Orchestration
kind: concept
aka:
  - orchestrator-workers
  - coordination
canonical:
  status: none
  note: >-
    Borrowed from distributed systems and used loosely. No surveyed glossary
    defines it for agentic systems, and it covers everything from a routing
    switch to a model delegating to sub-agents. Anthropic's
    "orchestrator-workers" names one specific pattern within it.
tags: [agentic, structure]
zoom: 2
summary: How a system decides which step, model or agent runs next — whether
  that decision sits in code or in a model call.
fieldMark: The question that makes the word mean something is where the
  decision lives. "We orchestrate agents" describes a diagram, not a mechanism.
useCase:
  scenario: >-
    A coding task touches an unknown number of files, and which files depends
    on what the code turns out to look like.
  detail: >-
    A fixed pipeline cannot be written, because the number of subtasks is not
    knowable in advance. Anthropic's orchestrator-workers pattern fits exactly
    here: a central call breaks the work down after seeing the input, delegates
    each piece, and synthesises the results. The shape is fixed; the
    decomposition is not.
relations:
  - type: consumed-by
    target: multi-agent-system
    note: What makes several agents a system rather than several agents.
  - type: consumes
    target: sub-agent
    note: The usual mechanism for delegating a decomposed subtask.
examples:
  - name: Orchestrator-workers
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      "A central LLM dynamically breaks down tasks, delegates them to worker
      LLMs, and synthesizes their results."
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

Something has to decide what runs next. Orchestration is the name for that
decision, and the only question that makes the word informative is where the
decision is made.

- **In code.** A [workflow](workflow): the path is written down and always the
  same.
- **In a model call.** An [agent](agent), or the orchestrator-workers pattern,
  where the next step is chosen at runtime from what was just seen.

## The orchestrator-workers pattern

Anthropic's description: "a central LLM dynamically breaks down tasks, delegates
them to worker LLMs, and synthesizes their results." It suits "complex tasks
where you can't predict the subtasks needed (in coding, for example, the number
of files that need to be changed and the nature of the change in each file
likely depend on the task)."[[cite:anthropic-agents]]

The distinction from simple parallelisation is precise: "whereas it's
topographically similar, the key difference from parallelization is its
flexibility — subtasks aren't pre-defined, but determined by the orchestrator
based on the specific input."[[cite:anthropic-agents]]

Same diagram. Different question about where the branching came from.

## What orchestration costs

Every layer of it adds a translation step, and translation loses information.
The orchestrator describes a subtask in a prompt; the worker reads that
description rather than the original context; the result comes back summarised.
Three lossy hops where a single agent doing the work itself had none.

That is the case against reaching for [sub-agents](sub-agent) early. Delegation
buys parallelism and fresh [context windows](context-window), and pays for them
in fidelity.

## Where it actually goes wrong

- **The decomposition is wrong** and every worker does good work on the wrong
  subtask.
- **Workers duplicate effort** because none of them can see the others.
- **Synthesis is the weak step** — combining several partial answers into one
  coherent result is harder than any individual subtask, and gets the least
  attention.
- **Errors compound quietly**, since a worker's confident summary hides the
  uncertainty that produced it.

Orchestration is worth adding when the work genuinely does not fit one context
or one sequence. Adding it because the architecture looks more capable with
boxes in it is how systems get slower and less reliable at the same time.
