---
title: Mixture of experts
kind: concept
aka:
  - MoE
  - sparse model
  - conditional computation
canonical:
  status: de-facto
  term: Mixture of experts
  body: Google, in the Machine Learning Glossary; the sparsely-gated form introduced by Shazeer et al. (2017)
  url: https://arxiv.org/abs/1701.06538
  title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer — Shazeer et al."
  verifiedOn: 2026-08-22
tags: [structure]
zoom: 3
summary: An architecture that routes each token to a small subset of its
  parameters, so a model can hold far more of them than it uses on any one
  input.
fieldMark: When a release quotes two parameter counts — "total" and "active" —
  it is a mixture of experts. Total tells you what it costs to hold in memory;
  active tells you what it costs to run.
useCase:
  scenario: >-
    A vendor announces a model with hundreds of billions of parameters that
    serves responses faster than its own smaller dense model.
  detail: >-
    Nothing is contradictory. Only a fraction of those parameters participate in
    any given token, so the compute per token tracks the active count rather
    than the total. The catch is memory: every expert has to be resident even
    though most are idle, which is why these models are cheap to run at scale
    on a large cluster and awkward to run at all on one machine.
relations:
  - type: part-of
    target: transformer
    note: Replaces the dense feed-forward block with a routed set of experts.
  - type: consumes
    target: parameter
    note: Holds many, activates few — which is what breaks the usual link between count and cost.
examples:
  - name: The Sparsely-Gated Mixture-of-Experts Layer
    url: https://arxiv.org/abs/1701.06538
    note: >-
      Reports "greater than 1000x improvements in model capacity with only
      minor losses in computational efficiency".
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A scheme to increase neural network efficiency by using only a subset of its parameters (known as an expert ) to process a given input token or example.
  - id: moe-paper
    url: https://arxiv.org/abs/1701.06538
    title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer — Shazeer et al."
    verifiedOn: 2026-08-22
    note: Submitted 23 January 2017.
---

A mixture of experts is "a scheme to increase neural network efficiency by using
only a subset of its parameters (known as an *expert*) to process a given input
token or example. A gating network routes each input token or example to the
proper expert(s)."[[cite:google-glossary]]

Two pieces: many sets of weights, and a small learned router that decides which
of them see this [token](token).

## The constraint it was built to escape

The 2017 paper states the problem in its first line: "the capacity of a neural
network to absorb information is limited by its number of
[parameters](parameter)."[[cite:moe-paper]] More capacity means more parameters,
and in a dense model more parameters means proportionally more compute on every
single token.

Conditional computation breaks that proportionality — "parts of the network are
active on a per-example basis" — and the paper reports realising it at scale:
"greater than 1000x improvements in model capacity with only minor losses in
computational efficiency."[[cite:moe-paper]]

## Why parameter counts stopped being comparable

A dense model's parameter count tells you both how much it knows and what it
costs per token. For a mixture of experts those come apart, which is why such
releases quote both a total and an active count.

The consequence for anyone reading specs: a sparse model and a dense model with
the same headline number are not the same size in any sense that matters, and
comparing them on that number alone is meaningless.

## Where the cost moved to

It moved from compute to memory. Every expert must be loaded even though most sit
idle for any given token, so a mixture of experts is well suited to a
[model host](model-host) with many accelerators and poorly suited to a single
machine. [Quantization](quantization) helps and does not close the gap.

Routing brings its own problems — experts that attract too much traffic, experts
that receive none, and a load balance that has to be trained for rather than
assumed.
