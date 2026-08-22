---
title: Frontier lab
kind: concept
aka:
  - frontier AI developer
  - foundation model lab
canonical:
  status: contested
  body: The UK government's frontier AI discussion paper, which defines "frontier AI" rather than the organisations
  url: https://www.gov.uk/government/publications/frontier-ai-capabilities-and-risks-discussion-paper/frontier-ai-capabilities-and-risks-discussion-paper
  title: Frontier AI — capabilities and risks discussion paper
  verifiedOn: 2026-08-22
  note: >-
    The adjective has a policy definition; the noun does not. "Frontier AI" is
    defined for regulatory purposes as highly capable general-purpose models
    matching or exceeding today's most advanced — a moving target by
    construction. "Frontier lab" is the informal term for organisations that
    build them.
tags: [orgs]
zoom: 2
summary: An organisation training models at the leading edge of scale — a small
  set, defined by a capability threshold that moves every year.
fieldMark: The definition is relative to the current frontier, so membership
  changes without anyone doing anything differently. It describes position, not
  a kind of organisation.
useCase:
  scenario: >-
    A policy or procurement document applies obligations to "frontier" model
    developers.
  detail: >-
    The scope is genuinely unstable, which is a drafting problem rather than a
    quibble. The UK's definition — models that "match or exceed the capabilities
    present in today's most advanced models" — is explicitly relative to the
    state of the art, so an organisation can enter or leave scope while doing
    exactly what it did last year. Regulations that need a stable boundary
    usually reach for training compute instead, which is measurable and only
    loosely related to capability.
relations:
  - type: kind-of
    target: model-provider
    note: A provider distinguished by training its own models at the leading edge.
  - type: consumes
    target: pretraining
    note: >-
      The distinguishing activity. Very few organisations run a pretraining
      budget at this scale, and everyone else adapts what they publish.
examples:
  - name: Frontier AI — capabilities and risks
    vendor: UK Department for Science, Innovation and Technology
    url: https://www.gov.uk/government/publications/frontier-ai-capabilities-and-risks-discussion-paper/frontier-ai-capabilities-and-risks-discussion-paper
    note: >-
      Published 25 October 2023, last updated 28 April 2025. Defines frontier AI
      for the AI Safety Summit.
    verifiedOn: 2026-08-22
sources:
  - id: uk-frontier
    url: https://www.gov.uk/government/publications/frontier-ai-capabilities-and-risks-discussion-paper/frontier-ai-capabilities-and-risks-discussion-paper
    title: Frontier AI — capabilities and risks discussion paper
    verifiedOn: 2026-08-22
  - id: chinchilla
    url: https://arxiv.org/abs/2203.15556
    title: Training Compute-Optimal Large Language Models — Hoffmann et al.
    verifiedOn: 2026-08-22
---

The adjective has an official definition and the noun does not. The UK
government's paper, written for the AI Safety Summit, defines "'frontier AI' as
highly capable general-purpose AI models that can perform a wide variety of
tasks and match or exceed the capabilities present in today's most advanced
models."[[cite:uk-frontier]]

Read the last clause as a design decision. The boundary is set relative to the
current state of the art, so it moves every time the art advances — which is
deliberate for a safety framing and awkward for anything requiring a stable
scope.

The paper is careful about its own examples too: today frontier AI "primarily
includes large language models", while noting that "both today and in the
future, frontier AI systems may not be underpinned" by
them.[[cite:uk-frontier]]

## What actually distinguishes the organisations

[Pretraining](pretraining) at scale, and almost nothing else. The rest of the
industry — including very large companies — takes published
[foundation models](foundation-model) and adapts them, because the pretraining
run is the part that costs a cluster and months.

That is the real division the term is pointing at: a handful of organisations
produce base models, and everyone else builds on them. It is the same
concentration the Stanford foundation-model report warned about, where "the
defects of the [foundation model](foundation-model) are inherited by all the
adapted models downstream."

## Why "frontier" is a poor category and a useful adjective

As a category it has no members you can enumerate stably, because membership is
defined by comparison. As an adjective it does real work — it names the fact
that the most capable models are qualitatively different in what they can do and
in what they risk, which is what the safety literature needs a word for.

Regulation that needs a fixed line usually reaches for **training compute**
instead, which is measurable, auditable, and only loosely related to capability
— the Chinchilla result is precisely that the same compute can be spent well or
badly.[[cite:chinchilla]] A threshold on compute is a proxy that is easy to
verify and easy to be wrong about.

## Related terms that are not synonyms

A frontier lab is a kind of [model provider](model-provider) — the organisation
that trains and licenses the model — and is distinct from a
[model host](model-host), which serves models it did not necessarily train, and
from a [hyperscaler](hyperscaler), which supplies the infrastructure both run
on. The same company is often two of the three, which is why the roles are worth
separating.
