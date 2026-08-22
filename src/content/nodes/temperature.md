---
title: Temperature
kind: concept
aka:
  - sampling temperature
canonical:
  status: de-facto
  term: Temperature
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    The name is borrowed from statistical physics and has been stable for
    decades. Vendors differ on the numeric range they accept, not on what the
    knob does.
tags: [runtime, core]
zoom: 2
summary: The dial that controls how random a model's output is — applied after
  the model has produced its probabilities, not inside it.
fieldMark: Temperature 0 is not "accurate mode". It is "always take the most
  likely token", which produces the model's most confident answer whether or
  not that answer is right.
useCase:
  scenario: >-
    A classifier built on a model returns a different label for the same input
    on two consecutive runs, and the bug report says the model is unreliable.
  detail: >-
    The model was equally sure both times. Sampling picked differently, because
    temperature was left at its default rather than set to zero. For work with
    one correct answer — extraction, classification, routing — the randomness
    is pure cost, and turning it down is a one-line change. For drafting,
    naming and brainstorming it is the point.
relations:
  - type: part-of
    target: inference-api
    note: A per-request parameter, not a property of the weights.
examples:
  - name: Hugging Face generation config
    vendor: Hugging Face
    url: https://huggingface.co/docs/transformers/en/main_classes/text_generation
    note: >-
      Documents temperature as "the value used to module the next token
      probabilities", defaulting to 1.0 when a model does not set it.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: hf-generation
    url: https://huggingface.co/docs/transformers/en/main_classes/text_generation
    title: Generation — Hugging Face Transformers documentation
    verifiedOn: 2026-08-22
---

Temperature is "a hyperparameter that controls the degree of randomness of a
model's output. Higher temperatures result in more random output, while lower
temperatures result in less random output."[[cite:google-glossary]]

## Where it acts

A [model](model) does not emit a [token](token). It emits a probability for
every token in its vocabulary, and something outside the model chooses one.
Temperature reshapes that distribution before the choice: Hugging Face's
documentation describes it as "the value used to module the next token
probabilities", defaulting to 1.0 if unset.[[cite:hf-generation]]

Low temperature sharpens the distribution towards whatever was already most
likely. High temperature flattens it, giving unlikely tokens a real chance.

This is why temperature is not a [parameter](parameter) in the technical sense
and never appears in a weight file. It is applied after the model has finished
its work.

## What the settings actually buy

- **0** — always the top token. Nearly deterministic, and the right default for
  extraction, classification and [structured output](structured-output). Not
  more truthful; just more consistent, including consistently wrong.
- **Around 1** — the model's own distribution, unmodified. The usual default for
  conversation.
- **Above 1** — increasingly untethered. Occasionally useful for idea
  generation, and the region where output degrades into noise.

## Why "creative" is a misleading label for it

Turning temperature up does not make a model imaginative. It makes it more
willing to pick continuations it judged less likely, which reads as variety in a
brainstorm and as error in a summary. The knob controls dispersion, and the
question to ask before touching it is whether the task has one right answer or
many acceptable ones.

Note that raising it does not reduce [hallucination](hallucination) risk and
lowering it does not remove it. Confident and wrong is a shape the distribution
can take at any temperature.
