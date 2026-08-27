---
title: Agentic loop
kind: concept
aka:
  - agent loop
  - observe-reason-act
canonical:
  status: de-facto
  term: Agentic loop
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [agentic, core]
zoom: 1
summary: The cycle an agent repeats until it is done — observe, reason, act,
  take the feedback, go again. The single structural difference between an
  agent and a model call.
fieldMark: Look for the termination condition. Every loop has one, and where
  it is set — a step budget, a goal check, a human saying stop — tells you more
  about a product's safety posture than its marketing does.
useCase:
  scenario: >-
    A tool is asked to fix a failing test, and it edits a file, runs the suite,
    reads the error, edits again, and stops when the suite passes.
  detail: >-
    No single model call did that. Each iteration is one stateless request whose
    prompt contains everything that happened in the previous ones, and the loop
    is ordinary code in the harness — call, execute what came back, append the
    result, call again. The model supplies judgment one step at a time and
    never sees the loop it is inside.
flow:
  scenario: >-
    Step 7 of 30 in a run to make a test suite pass, with the last command's
    output as the only new information.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        ask for the test suite to be made green, and then wait
    - node: agent
      where: wherever the product runs
      does: >-
        holds the goal across the whole run
    - node: agentic-loop
      where: wherever the product runs
      does: >-
        observe the last result, reason about it, act again
      self: true
    - node: inference-api
      where: the provider's servers
      does: >-
        one call per pass — the loop belongs to the harness, not the model
    - node: turn
      where: wherever the product runs
      does: >-
        each pass is one of these, billed and logged separately
    - node: verification-loop
      where: wherever the product runs
      does: >-
        running the test is what lets the loop stop on something real
  returns: >-
    Cost and blast radius both scale with the number of passes
relations:
  - type: part-of
    target: agent
    note: What makes it an agent rather than a single call.
  - type: consumes
    target: inference-api
    note: One request per iteration, each carrying the whole history again.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Describes agents as "typically just LLMs using tools based on
      environmental feedback in a loop".
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A cycle that an agent iterates through until a termination condition is met.
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

An agentic loop is "a cycle that an agent iterates through until a termination
condition is met", and Google's glossary gives the four stages: **observe,
reason, act, feedback**.[[cite:google-glossary]]

Anthropic's description is the same thing in one line: agents "are typically
just LLMs using tools based on environmental feedback in a
loop."[[cite:anthropic-agents]] The word *just* is doing useful work — there is
no additional machinery, and expecting some is the most common misconception
about how these systems are built.

## Where the loop lives

Not in the [model](model). The [inference API](inference-api) is stateless: it
receives a prompt and returns tokens, once, with no memory of the previous call.

The loop is ordinary code in the [harness](harness). Call the model; if the
response asked for a tool, execute it; append the result to the conversation;
call again. Every iteration re-sends the entire history, which is why
[prompt caching](prompt-caching) matters so much to agent economics and why an
uncached loop grows quadratically in cost.

## The model never sees the loop

Each iteration, the model sees a transcript and decides one next step. It has no
view of how many iterations have run, no ability to break out, and no way to
know whether it is on step three or three hundred except by reading the
transcript it was handed.

Everything that looks like persistence — remembering the goal, tracking
progress, giving up — is the harness assembling a prompt that makes it look that
way. This is why [context engineering](context-engineering) is the discipline
that decides whether a long run stays coherent.

## Termination is a design decision

Something has to stop it, and the choices are all imperfect:

- **The model says it is finished.** Trusting exactly the judgment you were
  trying to check.
- **A step or token budget.** Reliable and arbitrary; it stops good runs too.
- **A goal check in code.** Best when the goal is checkable — tests pass, file
  exists — and unavailable when it is not.
- **A human.** What [approval mode](approval-mode) and
  [human in the loop](human-in-the-loop) exist for.

Anthropic's guidance is to expect compounding errors: agents' autonomy "means
higher costs, and the potential for compounding errors", warranting "extensive
testing in sandboxed environments, along with the appropriate
guardrails."[[cite:anthropic-agents]] A loop amplifies whatever it repeats,
including mistakes.
