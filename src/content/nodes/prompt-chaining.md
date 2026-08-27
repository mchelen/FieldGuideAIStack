---
title: Prompt chaining
kind: concept
aka:
  - prompt pipeline
  - task decomposition
canonical:
  status: de-facto
  term: Prompt chaining
  body: The Prompt Engineering Guide, which is the most widely-cited catalogue of the named techniques
  url: https://www.promptingguide.ai/techniques/prompt_chaining
  title: Prompt Chaining — Prompt Engineering Guide
  verifiedOn: 2026-08-22
  note: >-
    Not carried by any vendor glossary. The term is stable in practice and the
    pattern predates the name — it is an ordinary software pipeline whose
    stages happen to be model calls.
tags: [context, technique]
zoom: 2
summary: Splitting a task into subtasks and feeding each prompt's output into
  the next, as a fixed pipeline rather than one large prompt.
fieldMark: A chain is written by you and always runs the same way. If the
  sequence of steps is decided at runtime by the model, that is an agent, not a
  chain.
useCase:
  scenario: >-
    One prompt asked to extract quotes from a document, judge their relevance
    and write a summary does all three adequately and none well.
  detail: >-
    Split into three calls, each stage gets the model's full attention and can
    be inspected, tested and fixed on its own. When the summary is wrong you can
    see whether the extraction was wrong, which a single prompt does not let you
    do. The cost is more calls and more latency; the gain is that the system
    becomes debuggable, which for anything in production usually decides it.
flow:
  scenario: >-
    One request asking for a summary, a translation and a tone change, done
    badly, split into three that are done well.
  path:
    - actor: A composite task
      where: a person, not a system
      does: >-
        three jobs asked for in one prompt
    - node: prompt-chaining
      where: the prompt you send
      does: >-
        split it: each prompt's output feeds the next
      self: true
    - node: prompt-engineering
      where: your machine
      does: >-
        each link simple enough to evaluate on its own
    - node: agent
      where: wherever the product runs
      does: >-
        the difference being that the steps are fixed in advance
  returns: >-
    Each step inspectable, and each step billed
relations:
  - type: kind-of
    target: prompt-engineering
    note: Structure across calls rather than within one.
  - type: distinguished-from
    target: agent
    note: >-
      A chain's sequence is fixed by the developer. An agent decides its own
      next step, which is what makes it harder to predict and to test.
examples:
  - name: Prompt Chaining
    url: https://www.promptingguide.ai/techniques/prompt_chaining
    note: >-
      "A task is split into subtasks with the idea to create a chain of prompt
      operations."
    verifiedOn: 2026-08-22
sources:
  - id: promptguide-chaining
    url: https://www.promptingguide.ai/techniques/prompt_chaining
    title: Prompt Chaining — Prompt Engineering Guide
    verifiedOn: 2026-08-22
---
"To improve the reliability and performance of LLMs, one of the important
[prompt engineering](prompt-engineering) techniques is to break tasks into its
subtasks. Once those subtasks have been identified, the LLM is prompted with a
subtask and then its response is used as input to another prompt. This is what's
referred to as prompt chaining."[[cite:promptguide-chaining]]

It is a pipeline. The novelty is only that the stages are model calls.

## Why splitting beats one long prompt

A single prompt covering several jobs asks the model to hold all of them at once
and divides its attention between them. It is also opaque when it fails — one
output, several possible causes, no way to tell which.

The guide's account of the benefit is about operability rather than accuracy:
chaining "helps to boost the transparency of your LLM application, increases
controllability, and reliability", so "you can debug problems with model
responses much more easily and analyze and improve performance in the different
stages that need improvement."[[cite:promptguide-chaining]]

That is the real argument. Each stage has an input, an output and a test.

## What each stage buys

- **Focus** — a short prompt about one job.
- **Inspectability** — an intermediate output you can look at.
- **Testability** — a stage you can evaluate in isolation.
- **Substitutability** — a cheap model for the easy stages, an expensive one for
  the hard stage.
- **Validation** — ordinary code between stages, checking before proceeding.

## What it costs

More calls, more [latency](latency), and more places for information to be lost
in translation between stages. Errors also compound: a stage that is right 90%
of the time, four times over, is right about two-thirds of the time.

Chains are not free reliability. They convert one opaque failure into several
visible ones, which is usually worth it and is not the same thing as fewer
failures.

## Chain or agent

The line is who decides the order. A chain's sequence is written down in advance
and always runs the same way; an [agent](agent) chooses its next step from what
it just saw.

Chains are predictable, testable and limited to what you anticipated. Agents
handle what you did not anticipate and are correspondingly harder to test. When
a fixed sequence suffices, it is the better engineering.
