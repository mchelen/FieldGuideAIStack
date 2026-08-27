---
title: Test-time compute
kind: concept
aka:
  - inference-time compute
  - thinking budget
  - reasoning effort
canonical:
  status: none
  note: >-
    No surveyed glossary carries the term. It appears in research writing as
    "test-time" or "inference-time" compute and in product documentation under
    vendor-specific names — thinking budget, reasoning effort. The idea is
    settled; the vocabulary is three years old and still moving.
tags: [runtime, constraint]
zoom: 2
summary: Compute spent while answering rather than while training — the second
  dial for making a model perform better, and the one you pay for per request.
fieldMark: Any control that trades [latency](latency) for quality on a single request is
  this. It is the only performance dial the person calling the model actually
  holds.
useCase:
  scenario: >-
    The same model, on the same prompt, gets a hard question right when allowed
    to think longer and wrong when told to answer immediately.
  detail: >-
    Both answers come from identical weights. What differs is how much
    computation went into producing them, and that is now a per-request
    decision rather than a property of the model you chose. It makes cost,
    latency and accuracy a dial rather than a procurement question — and it
    makes [benchmark](benchmark) comparisons slippery, since two scores for one model may
    reflect very different spending.
flow:
  scenario: >-
    The same model, the same question, and an accuracy that moves because of
    how long it was allowed to spend answering.
  path:
    - actor: A hard question
      where: a person, not a system
      does: >-
        one the first attempt tends to get wrong
    - node: test-time-compute
      where: the provider's servers
      does: >-
        spend more while answering rather than more while training
      self: true
    - node: effort-level
      where: the provider's servers
      does: >-
        the dial a vendor exposes for it
    - node: token
      where: your invoice
      does: >-
        what it is actually spent in, and billed in
    - node: reasoning-model
      where: the provider's servers
      does: >-
        a model trained to spend it without being asked
  returns: >-
    Accuracy becomes a dial, and benchmarks become slippery
relations:
  - type: consumes
    target: token
    note: >-
      The spending is denominated in generated tokens, billed like any other
      even when the intermediate work is discarded.
examples:
  - name: Chain-of-thought prompting
    url: https://arxiv.org/abs/2201.11903
    note: >-
      The earliest widely-known way to buy it: prompt for intermediate steps
      and the model computes more before committing.
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-rlm
    url: https://en.wikipedia.org/wiki/Reasoning_language_model
    title: Reasoning language model — Wikipedia
    verifiedOn: 2026-08-22
  - id: cot-paper
    url: https://arxiv.org/abs/2201.11903
    title: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al.
    verifiedOn: 2026-08-22
  - id: kaplan-scaling
    url: https://arxiv.org/abs/2001.08361
    title: Scaling Laws for Neural Language Models — Kaplan et al.
    verifiedOn: 2026-08-22
---

For most of the field's history there was one way to make a model better: train
a bigger one on more data with more compute. Wikipedia's account of reasoning
models names the change directly — models that "make use of extra computation
while answering as another way to scale performance, alongside the number of
training examples, parameters, and training compute."[[cite:wikipedia-rlm]]

Two dials instead of one, and the second is held by whoever makes the call
rather than by whoever trained the model.

## Why it works at all

A [model](model) commits to each [token](token) as it produces it. Answering
immediately means the first token is emitted before any of the problem has been
worked through, and everything after it is a continuation of that commitment.

Generating intermediate steps first gives the model something to condition on
that it did not have. [Chain-of-thought prompting](chain-of-thought-prompting)
demonstrated the effect and its limits: it "significantly improves the ability
of large language models to perform complex reasoning", and the gains arrive
with scale.[[cite:cot-paper]]

## What it changes about buying models

[Scaling laws](scaling-laws) describe a fixed compute budget spent before the
model ships.[[cite:kaplan-scaling]] Test-time compute is spent afterwards, per
request, by the caller.

The practical consequences:

- **Cost is a dial, not a tier.** The same model can be cheap and quick or slow
  and thorough on a per-call basis.
- **Benchmarks need an asterisk.** A score is meaningless without saying how much
  compute produced it, and comparisons across vendors frequently omit this.
- **Routing becomes a design decision.** Deciding which requests deserve the
  spend is now part of building the system.

## Where it is spent

Serial thinking before the answer, as in a [reasoning model](reasoning-model);
several independent attempts with one selected; or a full
[agent](agent) loop that calls tools, reads results and revises. All three buy
the same thing — more computation between question and answer — and they differ
in what they can spend it on.
