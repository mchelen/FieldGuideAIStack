---
title: Reinforcement learning from human feedback
kind: concept
aka:
  - RLHF
  - learning from preferences
canonical:
  status: de-facto
  term: Reinforcement Learning from Human Feedback (RLHF)
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Named identically everywhere and almost always abbreviated. Later variants
    — RLAIF, direct preference optimisation — are alternatives to the method,
    not other names for it.
tags: [training]
zoom: 3
summary: Training a model against what people preferred rather than against a
  written correct answer — the step that tunes judgment and tone, where there
  is no single right output to imitate.
fieldMark: RLHF is why models have a house style, and why they can be sycophantic.
  Optimising for what raters approved of is not the same as optimising for what
  is true, and the gap shows.
useCase:
  scenario: >-
    You want a model to answer a difficult question well, and nobody can write
    down what "well" means.
  detail: >-
    Tone, hedging, how much detail to give, when to refuse — these have no
    reference answer to imitate, which is what supervised training needs. People
    can nevertheless say reliably which of two responses is better. RLHF turns
    that comparative judgment into a trainable signal: rank outputs, fit a
    reward model to the rankings, and optimise the model against it. It is the
    method for teaching things that are easier to recognise than to specify.
relations:
  - type: consumed-by
    target: model
    note: >-
      Shapes the finished model's behaviour, which is why two models on the same
      base weights can feel entirely different.
examples:
  - name: InstructGPT
    vendor: OpenAI
    url: https://arxiv.org/abs/2203.02155
    note: >-
      Rankings of model outputs collected, then used to further fine-tune the
      supervised model with reinforcement learning.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: instructgpt
    url: https://arxiv.org/abs/2203.02155
    title: Training language models to follow instructions with human feedback — Ouyang et al.
    verifiedOn: 2026-08-22
---

Google's glossary keeps it short: "using feedback from human raters to improve
the quality of a model's responses", with the thumbs-up and thumbs-down buttons
in a chat interface as the everyday example.[[cite:google-glossary]]

The InstructGPT paper describes the machinery: "we then collect a dataset of
rankings of model outputs, which we use to further fine-tune this supervised
model using reinforcement learning from human feedback."[[cite:instructgpt]]
Note the word *rankings*. Raters are not writing answers; they are ordering
answers the model already produced.

## Why rankings rather than answers

[Instruction tuning](instruction-tuning) needs a target to imitate, which
presumes someone can write the ideal response. For most of what makes a response
good — is it the right length, does it hedge appropriately, should it have
refused — nobody can write that down, and everyone can recognise it.

RLHF is the technique for optimising against recognition. The rankings train a
separate reward model, and the [language model](large-language-model) is then
optimised to score well
against *that*. The human preference is compressed into a model of human
preference, which is what makes it cheap enough to apply at scale.

## What the compression costs

Optimising against a model of preference is not optimising against preference.
Every known failure of RLHF follows from that gap:

- **Sycophancy.** Agreeing with the user scores well. Being right sometimes does
  not.
- **Length bias.** Longer answers look more thorough to a rater skimming two
  options.
- **Confident wrongness.** A hedged correct answer can lose to a decisive
  incorrect one, which is one of the routes into
  [hallucination](hallucination).

The paper is candid that the result is not finished: InstructGPT "still makes
simple mistakes."[[cite:instructgpt]]

## Whose preferences

RLHF makes a model's values an artifact of a rating process — who was hired,
what guidelines they followed, which behaviours the guidelines called good. That
is a legitimate design choice, and it is not a neutral one. When two vendors'
models on comparable base weights disagree about what to refuse, this is
usually where the disagreement was introduced.
