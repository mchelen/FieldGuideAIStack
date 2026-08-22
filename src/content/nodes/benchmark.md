---
title: Benchmark
kind: concept
aka:
  - eval suite
  - test set
canonical:
  status: de-facto
  term: Benchmark
  body: Standard across machine learning; no surveyed glossary carries a separate entry
  url: https://arxiv.org/abs/2009.03300
  title: Measuring Massive Multitask Language Understanding — Hendrycks et al.
  verifiedOn: 2026-08-22
  note: >-
    Ordinary computing vocabulary applied to models. Google's glossary defines
    "test set" and "evaluation" but not "benchmark", which is a fair reflection
    of the term being about the social role of a dataset rather than a
    technical property of one.
tags: [evaluation, core]
zoom: 2
summary: A shared evaluation used to compare models — and, because it is shared,
  a target that models get optimised against.
fieldMark: Ask when the benchmark was published and what the model's training
  cutoff is. If the benchmark is older, assume some of it is in the training
  data and read the score accordingly.
useCase:
  scenario: >-
    Two models report the same score on a well-known benchmark and behave very
    differently on your work.
  detail: >-
    A benchmark measures one distribution of tasks, and yours is a different
    one. It also measures what has been optimised against for years — every
    published model has seen the benchmark discussed, and often the benchmark
    itself. The score is evidence about the benchmark; your own eval set is
    evidence about your product, and only the second one predicts anything.
relations:
  - type: kind-of
    target: evaluation
    note: An evaluation whose distinguishing property is being shared.
  - type: consumed-by
    target: leaderboard
    note: A ranking is a benchmark plus an ordering and an audience.
examples:
  - name: MMLU
    url: https://arxiv.org/abs/2009.03300
    note: >-
      57 tasks "including elementary mathematics, US history, computer science,
      law". The most-quoted single number in the field for several years.
    verifiedOn: 2026-08-22
  - name: HELM
    url: https://arxiv.org/abs/2211.09110
    note: >-
      Deliberately multi-metric, and explicit about what it does not cover.
    verifiedOn: 2026-08-22
sources:
  - id: mmlu-paper
    url: https://arxiv.org/abs/2009.03300
    title: Measuring Massive Multitask Language Understanding — Hendrycks et al.
    verifiedOn: 2026-08-22
    note: Submitted 7 September 2020, last revised 12 January 2021.
  - id: helm-paper
    url: https://arxiv.org/abs/2211.09110
    title: Holistic Evaluation of Language Models — Liang et al.
    verifiedOn: 2026-08-22
---

A benchmark is an [evaluation](evaluation) that many people run on many models,
which is what makes the numbers comparable and what makes them worth gaming.

MMLU is the canonical example: "a new test to measure a text model's multitask
accuracy", covering "57 tasks including elementary mathematics, US history,
computer science, law, and more."[[cite:mmlu-paper]] When it was published,
"most recent models have near random-chance accuracy."[[cite:mmlu-paper]]

## What happens to a good benchmark

It gets saturated. Scores climb toward the ceiling, and once they cluster near
it the benchmark stops discriminating — every model is "about 90%" and the
differences are noise.

Three things drive the climb, and only the first is progress:

1. **Models genuinely improve.**
2. **The benchmark leaks into training data.** Published test sets end up on the
   web, and the web ends up in [pretraining](pretraining) corpora.
3. **Development targets it.** Not necessarily by training on it — by choosing
   what to work on, which is the ordinary way a measure becomes a target.

## The reporting problem

MMLU's own paper flags a failure mode that a score cannot show: models "have
lopsided performance and frequently do not know when they are wrong", with
"near-random accuracy on some socially important subjects such as morality and
law."[[cite:mmlu-paper]]

An average over 57 subjects hides both. This is what HELM's multi-metric
approach was reacting to — measuring several properties across several
scenarios, and "noting what's missing or
underrepresented."[[cite:helm-paper]]

## How to read a benchmark number

- **Against the [training cutoff](knowledge-cutoff).** A benchmark older than
  the model is a benchmark the model may have seen.
- **With the distribution in mind.** Coding benchmarks predict coding; they do
  not predict summarising your documents.
- **Disaggregated if possible.** The average is the least informative statistic
  published.
- **As a floor, not a forecast.** A model that fails a benchmark probably cannot
  do the thing. A model that passes might still fail on yours.