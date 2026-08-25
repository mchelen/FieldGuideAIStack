---
title: Workflow
kind: concept
aka:
  - pipeline
  - predefined code path
canonical:
  status: de-facto
  term: Workflow
  body: Anthropic, in "Building effective agents", which draws the workflow/agent line explicitly
  url: https://www.anthropic.com/engineering/building-effective-agents
  title: Building effective agents — Anthropic
  verifiedOn: 2026-08-22
  note: >-
    An ordinary software word given a specific technical contrast here.
    Anthropic groups workflows and agents together as "agentic systems" and
    separates them on who decides the path — which is the distinction worth
    keeping.
tags: [agentic, core]
zoom: 2
summary: A system where the steps are laid out in code in advance, and the model
  fills them in — as opposed to an agent, which decides its own path.
fieldMark: Ask who decided the order. If it is in the source, it is a workflow;
  if the model chose at runtime, it is an agent. Most products described as
  agents are workflows, and that is usually the right choice.
useCase:
  scenario: >-
    Incoming support tickets must be classified, routed, drafted and checked —
    every time, in that order.
  detail: >-
    Nothing about that sequence needs deciding at runtime. Written as a
    workflow it is predictable, each stage can be tested and evaluated on its
    own, and a failure names the stage that produced it. Written as an agent it
    would sometimes skip the check, sometimes route twice, and cost more to do
    it. Flexibility you do not need is a liability rather than a feature.
relations:
  - type: distinguished-from
    target: agent
    note: >-
      Predefined code paths against model-directed ones. Anthropic calls both
      "agentic systems" and separates them here.
  - type: consumes
    target: orchestration
    note: Its steps are orchestrated by code written ahead of time.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Catalogues the common workflow patterns — prompt chaining, routing,
      parallelization, orchestrator-workers, evaluator-optimizer.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

Anthropic groups everything in this area as "agentic systems" and then draws one
line through it: "**workflows** are systems where LLMs and tools are
orchestrated through predefined code paths. **Agents**, on the other hand, are
systems where LLMs dynamically direct their own processes and tool usage,
maintaining control over how they accomplish tasks."[[cite:anthropic-agents]]

Who decides the path. That is the whole distinction, and it survives every
marketing use of the word "agent".

## Why the answer is usually workflow

The recommendation in the same piece is blunt: "find the simplest solution
possible, and only increase complexity when needed. This might mean not building
agentic systems at all."[[cite:anthropic-agents]]

And the trade is named: "agentic systems often trade latency and cost for better
task performance." Workflows "offer predictability and consistency for
well-defined tasks", where agents are better "when flexibility and model-driven
decision-making are needed at scale."[[cite:anthropic-agents]]

For many applications, "optimizing single LLM calls with retrieval and in-context
examples is usually enough."[[cite:anthropic-agents]] That sentence is worth
reading twice before a system diagram gets drawn.

## The patterns

Anthropic catalogues five, and they compose:

- **[Prompt chaining](prompt-chaining)** — each call's output feeds the next.
- **Routing** — classify the input, send it to a specialised path.
- **Parallelization** — run several calls at once, then combine, either by
  splitting the task or by voting.
- **[Orchestrator-workers](orchestration)** — a central call breaks the task down
  and delegates. Topographically like parallelization, but "subtasks aren't
  pre-defined, but determined by the orchestrator based on the specific
  input."[[cite:anthropic-agents]]
- **Evaluator-optimizer** — one call generates, another critiques, in a loop.
  Fits "when we have clear evaluation criteria, and when iterative refinement
  provides measurable value."[[cite:anthropic-agents]]

## The blurry edge

Orchestrator-workers is where the line gets thin: the code path is fixed, and
what runs inside it is chosen by a model. Anthropic's own framing puts it under
workflows, because the *shape* is predefined even though the contents are not.

That is the useful test. Not "does a model make any decisions" — it always does
— but "could you draw the control flow before running it".
