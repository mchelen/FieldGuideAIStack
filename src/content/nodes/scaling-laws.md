---
title: Scaling laws
kind: concept
aka:
  - neural scaling laws
  - Chinchilla scaling
canonical:
  status: de-facto
  term: Scaling laws
  body: Kaplan et al., "Scaling Laws for Neural Language Models" (2020), where the empirical form was established
  url: https://arxiv.org/abs/2001.08361
  title: Scaling Laws for Neural Language Models — Kaplan et al.
  verifiedOn: 2026-08-22
tags: [training]
zoom: 3
summary: The empirical finding that model loss falls as a predictable power law
  in model size, data and compute — which turned "how big should we build" into
  arithmetic.
fieldMark: Scaling laws predict loss, not capability. A curve that continues
  smoothly says nothing about whether the next model can do a particular thing.
useCase:
  scenario: >-
    A lab has a fixed compute budget and has to decide between a bigger model
    and more training data.
  detail: >-
    Before 2020 this was judgment. Scaling laws made it a calculation, and the
    2022 Chinchilla result changed the answer materially: for compute-optimal
    training, model size and training tokens should scale together, which meant
    the models of the preceding years were substantially undertrained. Every
    published model since sits somewhere on that trade, and the reason a
    7-billion-parameter model today outperforms a much larger one from 2021 is
    largely this.
flow:
  scenario: >-
    A decision about how big to build and how much data to use, made before
    any of it is trained.
  path:
    - actor: A budget
      where: a training cluster
      does: >-
        compute, fixed in advance
    - node: scaling-laws
      where: a training cluster
      does: >-
        loss falls as a predictable power law in size, data and compute
      self: true
    - node: parameter
      where: the weights file
      does: >-
        which is one of the three terms
    - node: pretraining
      where: a training cluster
      does: >-
        and the run the prediction is being made about
  returns: >-
    Predictive enough to plan by, and empirical, not derived
relations:
  - type: consumed-by
    target: pretraining
    note: What a pretraining budget is planned against.
  - type: consumes
    target: parameter
    note: Model size is one of the three quantities the laws relate.
examples:
  - name: Scaling Laws for Neural Language Models
    url: https://arxiv.org/abs/2001.08361
    note: >-
      Power-law trends "spanning more than seven orders of magnitude" in model
      size, dataset size and training compute.
    verifiedOn: 2026-08-22
  - name: Training Compute-Optimal Large Language Models
    vendor: DeepMind
    url: https://arxiv.org/abs/2203.15556
    note: >-
      The Chinchilla paper. Over 400 models trained to establish that size and
      tokens should scale equally.
    verifiedOn: 2026-08-22
sources:
  - id: kaplan-scaling
    url: https://arxiv.org/abs/2001.08361
    title: Scaling Laws for Neural Language Models — Kaplan et al.
    verifiedOn: 2026-08-22
    note: Submitted 23 January 2020.
  - id: chinchilla
    url: https://arxiv.org/abs/2203.15556
    title: Training Compute-Optimal Large Language Models — Hoffmann et al.
    verifiedOn: 2026-08-22
    note: Submitted 29 March 2022. The Chinchilla paper.
---

The 2020 finding was that model quality is predictable. Loss "scales as a
power-law with model size, dataset size, and the amount of compute used for
training, with some trends spanning more than seven orders of magnitude", while
"other architectural details such as network width or depth have minimal
effects within a wide range."[[cite:kaplan-scaling]]

Both halves were consequential. Architecture stopped being the lever, and the
three quantities that were the lever behaved regularly enough to extrapolate.
That is what "these relationships allow us to determine the optimal allocation
of a fixed compute budget" means in practice.[[cite:kaplan-scaling]]

## Chinchilla, and why the answer changed

The 2020 laws were read as favouring size. The 2022 Chinchilla work found that
reading had gone wrong: "current large language models are significantly
undertrained, a consequence of the recent focus on scaling language models
whilst keeping the amount of training data constant."[[cite:chinchilla]]

Trained over 400 models from 70 million to over 16 billion
[parameters](parameter) on 5 to 500 billion [tokens](token), it concluded that
"for compute-optimal training, the model size and the number of training tokens
should be scaled equally: for every doubling of model size the number of
training tokens should also be doubled."[[cite:chinchilla]]

This is the single clearest reason a modern small model outperforms a much
larger model from a few years earlier. The older one was starved of data, not
short of capacity.

## What the laws do not tell you

They predict **loss** — how well the model predicts the next token. They do not
predict whether it can pass a bar exam, write working code, or refuse a harmful
request.

The relationship between falling loss and rising capability is real, unmeasured
and non-obvious, and capabilities have repeatedly appeared over narrow ranges of
scale while the loss curve carried on smoothly. Treating a scaling curve as a
capability forecast reads more into it than it contains.

## And they are about [pretraining](pretraining)

The budget these laws allocate is spent before the model ships.
[Test-time compute](test-time-compute) is a separate axis, spent per request,
and the scaling laws say nothing about it.
