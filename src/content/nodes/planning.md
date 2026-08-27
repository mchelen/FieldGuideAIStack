---
title: Planning
kind: concept
aka:
  - task decomposition
  - plan mode
canonical:
  status: none
  note: >-
    No surveyed glossary defines it for agentic systems, though Google's entry
    for autonomous agent uses it in passing — an agent works toward a goal "by
    planning, acting, and adapting". The word is borrowed from classical AI
    planning, where it means something considerably more formal than what
    agents do.
tags: [agentic, technique]
zoom: 2
summary: An agent working out the steps before taking them — producing a plan
  as text, which is a proposal rather than a commitment.
fieldMark: A plan is generated text, not a data structure the system enforces.
  Unless the harness holds the agent to it, the plan is a paragraph the model
  wrote and may quietly abandon two steps later.
useCase:
  scenario: >-
    Before an agent edits fourteen files, you would like to see what it intends
    to do.
  detail: >-
    Planning makes the intent inspectable while it is still cheap to correct.
    The value is mostly in the review: a wrong plan caught before execution
    costs a sentence, and caught afterwards costs fourteen reverted files. This
    is why plan-then-approve is the most common human-in-the-loop design for
    consequential agent work, and why the approval gate matters more than the
    plan's quality.
flow:
  scenario: >-
    An agent that writes out the steps first, producing a plan a person can
    read and stop before anything runs.
  path:
    - actor: A goal
      where: a person, not a system
      does: >-
        several steps, none of them taken yet
    - node: planning
      where: wherever the product runs
      does: >-
        the agent works out the steps and writes them down
      self: true
    - node: agentic-loop
      where: wherever the product runs
      does: >-
        then executes them, revising as results come back
    - node: test-time-compute
      where: the provider's servers
      does: >-
        and the plan itself is tokens spent before the work
  returns: >-
    A plan is text, so it can be read and refused
relations:
  - type: part-of
    target: agentic-loop
    note: Usually the first pass, and often revisited when an observation breaks it.
  - type: consumes
    target: test-time-compute
    note: >-
      Thinking before acting is compute spent at answer time, in the same way
      reasoning is.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Frames agents as for "open-ended problems where it's difficult or
      impossible to predict the required number of steps" — the case where a
      plan cannot be written in code.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

Google's definition of an [autonomous agent](autonomous-agent) puts planning
first among three verbs: one that "works towards a complex goal by planning,
acting, and adapting without continuous human
intervention."[[cite:google-glossary]]

The word is borrowed from classical AI planning, where a planner searches a
formal space of states and operators and returns a plan that provably reaches
the goal. Nothing of that survives. What an agent produces is a numbered list in
prose, generated the same way any other text is.

## Why it helps anyway

Two reasons, and they are different in kind.

**It is [test-time compute](test-time-compute).** Working out the approach
before executing gives the model something to condition on, in exactly the way
[chain-of-thought prompting](chain-of-thought-prompting) does. The first action
is then chosen with the shape of the whole task in view rather than in
isolation.

**It is inspectable.** A plan is a cheap artifact that says what is about to
happen, at the one moment when changing course costs nothing. That is worth more
than the reasoning benefit for anything with consequences.

## Why a plan is not a commitment

There is no mechanism holding the agent to it. The plan is text in the
[context window](context-window); on the next iteration the model reads it
alongside everything else and decides afresh.

So an agent can produce a good plan and then not follow it — not through
disobedience, but because nothing was ever enforcing the connection. If
adherence matters, the [harness](harness) has to enforce it: a plan converted
into a checklist the harness tracks, or steps gated individually.

## Plan mode

Several products separate planning from execution outright: the agent explores
and proposes but cannot act, and a human approves before anything happens.

That is a [human in the loop](human-in-the-loop) placed at the cheapest possible
point. Anthropic's guidance that agents suit "open-ended problems where it's
difficult or impossible to predict the required number of steps" is exactly the
case where a human wants to see the plan first — the flexibility that makes an
agent the right tool is the same flexibility that makes its next move hard to
predict.[[cite:anthropic-agents]]

## When plans go stale

The characteristic failure is a plan written from assumptions that the first
observation invalidates, followed by an agent working the original plan anyway.
Re-planning after surprising results is a
[context engineering](context-engineering) decision — the stale plan has to be
removed, not merely superseded, or it keeps voting.
