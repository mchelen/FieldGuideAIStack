---
title: Evaluation
kind: concept
aka:
  - eval
  - evals
canonical:
  status: de-facto
  term: Evaluation
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Standard in machine learning, and Google's entry notes that the generative
    case is broader than the classical one. The clipped plural "evals" is now
    more common in practice than the full word.
tags: [evaluation, core]
zoom: 1
summary: A repeatable test of model or system behaviour — the only thing that
  turns "it seems better" into a claim anyone can check.
fieldMark: An eval is yours; a benchmark is everyone's. If a team cannot say
  what would make them roll back a prompt change, they have opinions rather
  than an eval.
useCase:
  scenario: >-
    Someone rewrites a [system prompt](system-prompt) and asks whether it is an improvement.
  detail: >-
    Without an eval set the answer is whichever examples each person happens to
    remember, and both sides can produce one. Fifty saved cases with expected
    behaviour turn the question into a number, and — more usefully — into a
    list of the specific cases that got worse. This is the single highest-value
    thing to build early and the thing most projects postpone.
flow:
  scenario: >-
    A prompt change looks better on the three cases somebody tried, and now
    has to be shipped or not.
  path:
    - actor: A prompt change
      does: >-
        better on the three cases someone happened to try
    - node: evaluation
      does: >-
        runs both versions over the same fixed set of cases
      self: true
    - node: llm-as-a-judge
      does: >-
        scores which of the two outputs is better, pairwise
    - node: regression-testing
      does: >-
        compares against your own last release, not against other models
    - node: benchmark
      does: >-
        compares models against each other — a different question entirely
  returns: >-
    "Seems better" becomes a number someone can argue with
relations:
  - type: distinguished-from
    target: verification-loop
    note: >-
      An eval measures behaviour across many cases before shipping. A
      verification loop checks one run while it happens.
  - type: consumes
    target: factuality
    note: One of the properties worth measuring, and a hard one.
examples:
  - name: HELM
    url: https://arxiv.org/abs/2211.09110
    note: >-
      Holistic Evaluation of Language Models — measures seven metrics across
      sixteen core scenarios rather than reporting one number.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: helm-paper
    url: https://arxiv.org/abs/2211.09110
    title: Holistic Evaluation of Language Models — Liang et al.
    verifiedOn: 2026-08-22
    note: Submitted 16 November 2022, last revised 1 October 2023.
---

Evaluation is "the process of measuring a model's quality or comparing
different models against each other", and Google's glossary flags that the
generative case is not the classical one: where a supervised model is judged
"against a validation set and a test set", evaluating an LLM "typically involves
broader quality and safety assessments."[[cite:google-glossary]]

Broader, because there is usually no correct answer to compare against. That one
difference is why almost everything on these pages exists.

## Why it is harder than it was

A classifier's output is right or wrong, and accuracy is a number you compute. A
[generative](generative-ai) output is a paragraph, and the question is whether
it is good — which depends on the task, the reader, and what was wanted.

So evaluation splits into approaches that each give up something:

- **Exact match** on tasks that have one answer. Precise, and covers little.
- **Human judgment.** The gold standard, expensive and slow.
- **[LLM-as-a-judge](llm-as-a-judge).** Cheap and fast, with biases of its own.
- **[Autoraters](autorater-evaluation).** A model trained on human labels.
- **Executable checks.** A [verification loop](verification-loop) where the
  domain allows one.

## One number is the failure mode

HELM's argument is that a single score hides more than it reports. It takes "a
multi-metric approach", measuring "7 metrics (accuracy, calibration, robustness,
fairness, bias, toxicity, and efficiency) for each of 16 core scenarios", and
is explicit about "noting what's missing or
underrepresented."[[cite:helm-paper]]

Recording the gaps is the part usually skipped. An evaluation that does not say
what it failed to measure invites the reader to assume it measured everything.

## Your eval beats any benchmark

A public [benchmark](benchmark) tells you how a model does on someone else's
distribution. Your eval set — real inputs from your product, with the behaviour
you actually want — tells you about yours, and is the only thing that catches a
regression in the case your users hit twice a day.

Fifty saved cases is usually enough to be decisive, and is a smaller investment
than the argument it replaces.
