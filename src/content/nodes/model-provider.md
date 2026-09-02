---
title: Model Provider
aka: [model developer, frontier lab, model vendor]
canonical:
  status: none
  note: >-
    No glossary defines the role. "Model developer" and "AI lab" are used for
    the same thing, and policy writing prefers "[frontier AI developer](frontier-lab)" for the
    subset operating at the leading edge. This guide separates provider, host
    and [hyperscaler](hyperscaler) because the same company is frequently two of the three.
tags: [orgs]
zoom: 1
summary: The organization that trains a model and owns its weights, sets its
  license, and decides what gets released.
fieldMark: Ask who could retrain it. The provider is whoever holds the weights
  and the training pipeline — not necessarily whoever sold you the API call.
useCase:
  scenario: >-
    A contract question asks who is responsible for a model's behaviour.
  detail: >-
    The answer depends on which role each party holds. The provider trained the
    weights, sets the licence and the [acceptable use policy](acceptable-use-policy); a model host may
    only be serving them; a hyperscaler may only own the hardware. Working out
    who could retrain the model — rather than who sold you the API call — is
    what identifies the provider, and it is often not the company on the
    invoice.
flow:
  scenario: >-
    A model is deprecated with sixty days notice, and somebody has to work
    out whose decision that was.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        need to work out who to call
    - node: model-provider
      where: the host's own hardware
      does: >-
        trained the weights, set the licence, chose the deprecation date
      self: true
    - node: model
      where: the weights file
      does: >-
        the artifact they own and can retrain
    - node: model-host
      where: the host's own hardware
      does: >-
        runs that artifact on its own hardware, under its own terms
    - node: inference-api
      where: the provider's servers
      does: >-
        the endpoint you actually called, which belongs to the host
  returns: >-
    The company you pay is frequently not the one that trained it
relations:
  - type: distinguished-from
    target: model-host
    note: The provider makes the model; the host runs it for you.
  - type: implements
    target: inference-api
    note: Most providers also serve their own models directly ("first-party API").
examples:
  - name: Anthropic
    url: https://platform.claude.com/docs/en/api/overview
    note: >-
      Trains the Claude models and serves them directly from the Claude API at
      api.anthropic.com, alongside availability on third-party cloud platforms.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-claude-api
    url: https://platform.claude.com/docs/en/api/overview
    title: Claude API overview — Anthropic
    verifiedOn: 2026-08-22
---

The provider is the party with the weights. They chose the training data,
paid for the compute, ran the [post-training](post-training), and hold whatever rights exist over
the resulting artifact. They set the license, the acceptable-use policy, and the
deprecation schedule.

## Provider is not the same as the company you pay

This is the distinction that trips people up. You can consume the same
[model](model) through:

- the provider's own API,
- a [model host](model-host) that serves the provider's model under its own
  billing and IAM,
- a [harness](harness) whose vendor is a third party entirely.

Anthropic's documentation makes the split explicit, listing Claude as available
both through its direct API and through cloud platforms, and further separating
*Anthropic-operated* platforms from *partner-operated* ones. Feature
availability differs between those routes — a reason the distinction is
operational, not academic.

## Why it matters when reading the news

"Provider X released model Y" is a claim about weights and training.
"Host Z now offers model Y" is a claim about distribution. The two are announced
in similar language and mean completely different things for availability,
pricing, and data handling.
