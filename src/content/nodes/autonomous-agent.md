---
title: Autonomous agent
kind: concept
aka:
  - fully autonomous agent
canonical:
  status: de-facto
  term: Autonomous agent
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    "Autonomous" is a spectrum being used as a category. Google's definition
    turns on "without continuous human intervention", which every agent in this
    guide satisfies to some degree — see autonomy level for the dimension the
    word is flattening.
tags: [agentic, core]
zoom: 2
summary: An agent pursuing a goal by planning, acting and adapting without
  step-by-step human direction — which describes a range, not a category.
fieldMark: >-
  Nobody ships full autonomy. What ships is an autonomy level: a
  boundary inside which the agent acts freely and outside which it asks.
useCase:
  scenario: >-
    A team wants to know whether a tool is "autonomous" before allowing it near
    production.
  detail: >-
    The label will not answer the question. What answers it is the boundary:
    which actions run without asking, which require approval, what the agent can
    reach, and what stops the loop. Two products both called autonomous can
    differ by everything that matters. Ask for the permission model, not the
    adjective.
flow:
  scenario: >-
    A goal handed over on Friday evening with nobody available to answer a
    question until Monday.
  path:
    - actor: A goal
      where: a person, not a system
      does: >-
        no steps given, and nobody to ask
    - node: autonomous-agent
      where: wherever the product runs
      does: >-
        plans, acts and adapts without step-by-step direction
      self: true
    - node: autonomy-level
      where: wherever the product runs
      does: >-
        the end of the scale, as a product setting
    - node: non-human-identity
      where: your infrastructure
      does: >-
        acting under a credential that is not a person's
  returns: >-
    Nobody is asked, so the permissions are the policy
relations:
  - type: kind-of
    target: agent
    note: An agent operating at the high end of the autonomy range.
  - type: consumes
    target: approval-mode
    note: >-
      Autonomy in practice is defined by what the approval policy lets through,
      not by an absence of policy.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      "Agents' autonomy makes them ideal for scaling tasks in trusted
      environments", with the costs and compounding errors named alongside.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      An agent that works towards a complex goal by planning, acting, and adapting without continuous human intervention.
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

An autonomous agent is one "that works towards a complex goal by planning,
acting, and adapting without continuous human
intervention."[[cite:google-glossary]] Three verbs and a qualifier, and the
qualifier is where the difficulty is.

*Continuous* intervention is what is absent. Some intervention almost always
remains — an approval on a destructive action, a review of the result, a limit
on what can be reached — and where that line sits is the entire practical
content of the word.

## Why the label is close to useless

Two products described as autonomous agents can differ on every question that
matters: whether they can write files, run commands, reach the network, spend
money, or act while nobody is watching. The adjective distinguishes none of it.

[Autonomy level](autonomy-level) is the dimension being flattened, and the
[permission model](permission-model) is where the answer actually lives.

## What autonomy buys and costs

Anthropic's framing is even-handed. Agents suit "open-ended problems where it's
difficult or impossible to predict the required number of steps, and where you
can't hardcode a fixed path", and "agents' autonomy makes them ideal for scaling
tasks in trusted environments."[[cite:anthropic-agents]]

The costs come in the same paragraph: "the autonomous nature of agents means
higher costs, and the potential for compounding errors", warranting "extensive
testing in sandboxed environments, along with the appropriate
guardrails."[[cite:anthropic-agents]]

Note *trusted environments* and *sandboxed*. Autonomy is not a property of the
agent alone; it is a property of the agent plus the place it is allowed to act.

## Compounding is the specific risk

A single wrong answer is a wrong answer. A wrong step inside an
[agentic loop](agentic-loop) becomes the context for the next step, which is
reasoned from as though it were true.

This is why autonomy and [verification loops](verification-loop) belong
together. An agent that can check its own work recovers from bad steps; one that
cannot, builds on them — and the more autonomously it runs, the more it builds
before anyone looks.

## The honest position

There is no threshold at which an agent becomes autonomous. There is a set of
choices about what it may do unattended, and describing those choices is more
useful than any label. When a product page says autonomous, the next question is
always: autonomous to do what?
