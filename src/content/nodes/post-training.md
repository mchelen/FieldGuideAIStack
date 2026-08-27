---
title: Post-training
kind: concept
aka:
  - alignment
  - adaptation
canonical:
  status: none
  note: >-
    A recent umbrella term with no authoritative definition. Google's glossary
    names the individual stages — fine-tuning, instruction tuning, RLHF — but
    carries no entry for the collective. Vendors increasingly use
    "post-training" for the whole phase after pretraining, and this guide
    follows that usage while recording that it is not settled.
tags: [training, core]
zoom: 2
summary: Everything done to a model after pretraining to turn a text
  continuation engine into something that answers, follows instructions and
  declines.
fieldMark: The gap between a [base model](foundation-model) and the product built on it is almost
  entirely here. Two products on the same [open weights](open-weights) can behave very
  differently, and post-training is where the difference lives.
useCase:
  scenario: >-
    Two vendors ship products built on the same open-weight [base model](model), and they
    behave nothing alike.
  detail: >-
    The weights they started from are byte-identical and public. What differs is
    what each did afterwards — which demonstrations they trained on, whose
    preferences they optimised against, what they taught the model to refuse.
    Base weights are increasingly a commodity; post-training is where a vendor's
    judgment, and its liability, actually sit.
flow:
  scenario: >-
    A text-continuation engine that answers questions, refuses some
    requests, and follows a format — none of which it learned from the
    internet.
  path:
    - node: pretraining
      does: >-
        leaves a model that continues text, and nothing else
    - node: post-training
      does: >-
        everything done after that to make it useful
      self: true
    - node: instruction-tuning
      does: >-
        teaches following an instruction rather than continuing it
    - node: reinforcement-learning-from-human-feedback
      does: >-
        teaches which of two answers people preferred
  returns: >-
    Where a vendor's judgement about behaviour is applied
relations:
  - type: distinguished-from
    target: pretraining
    note: >-
      Pretraining teaches language from raw text. Post-training teaches
      behaviour from curated examples and human preference.
  - type: contains
    target: fine-tuning
    note: Supervised training on task-specific examples.
  - type: contains
    target: instruction-tuning
    note: Fine-tuning aimed specifically at following instructions.
  - type: contains
    target: reinforcement-learning-from-human-feedback
    note: Optimising against human preference rather than against a fixed answer.
examples:
  - name: InstructGPT
    vendor: OpenAI
    url: https://arxiv.org/abs/2203.02155
    note: >-
      The worked example of the full sequence: demonstrations, then a reward
      model, then reinforcement learning against it.
    verifiedOn: 2026-08-22
sources:
  - id: instructgpt
    url: https://arxiv.org/abs/2203.02155
    title: Training language models to follow instructions with human feedback — Ouyang et al.
    verifiedOn: 2026-08-22
    note: Submitted 4 March 2022. The InstructGPT paper.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

[Pretraining](pretraining) produces a model that continues text. Post-training
produces a model that is useful. The InstructGPT paper states the problem it
solves in one line: "making language models bigger does not inherently make them
better at following a user's intent … these models are not aligned with their
users."[[cite:instructgpt]]

Scale alone does not fix that, because predicting likely text and doing what
someone asked are different objectives. Post-training is where the second
objective gets introduced.

## The usual sequence

1. **Supervised [fine-tuning](fine-tuning)** on demonstrations — humans writing
   the response the model should have given.
2. **A reward model** trained on human rankings of candidate outputs, which turns
   scattered preferences into something optimisable.
3. **[Reinforcement learning](reinforcement-learning-from-human-feedback)**
   against that reward model.

InstructGPT ran exactly this sequence, starting from "a set of labeler-written
prompts and prompts submitted through the OpenAI API" and collecting "a dataset
of labeler demonstrations of the desired model behavior."[[cite:instructgpt]]

Refusals, tone, formatting habits and safety behaviour all arrive here. None of
them are properties of the [architecture](transformer) or of the pretraining
corpus.

## Why the term is unsettled

The stages have names; the phase does not, quite. Google's glossary defines
fine-tuning, [instruction tuning](instruction-tuning) and RLHF individually and
offers nothing
collective.[[cite:google-glossary]] "Alignment" is used for the same span of work
but carries a normative claim — aligned with whom — that not every use of the
phase deserves.

"Post-training" is the term winning by default, on the strength of being merely
chronological.

## What it does not do

It does not add knowledge in any dependable way. Facts come from pretraining;
post-training shapes how the model uses what it already has. A model that does
not know something will not learn it from a thousand well-mannered examples of
answering politely — it will learn to be confidently wrong more agreeably, which
is one route to [hallucination](hallucination).
