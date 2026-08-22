---
title: Model Provider
aka: [model developer, frontier lab, model vendor]
tags: [core, org]
zoom: 1
summary: The organization that trains a model and owns its weights, sets its
  license, and decides what gets released.
fieldMark: Ask who could retrain it. The provider is whoever holds the weights
  and the training pipeline — not necessarily whoever sold you the API call.
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
paid for the compute, ran the post-training, and hold whatever rights exist over
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
