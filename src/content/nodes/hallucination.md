---
title: Hallucination
kind: concept
aka:
  - confabulation
  - fabrication
canonical:
  status: contested
  body: Google's Machine Learning Glossary, as the most widely-followed working definition
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    The definition is settled; the word is not. "Hallucination" is criticised
    for implying perception the system does not have, and "confabulation" is
    the usual proposed replacement. Neither has displaced the other, so this
    guide uses the term the field uses and records the objection.
tags: [safety, risk]
zoom: 1
summary: Plausible-seeming but factually incorrect output, produced with the
  same confidence as correct output because the model has no way to tell the
  difference.
fieldMark: The tell is specificity without a source — a precise citation, case
  number, API method or statistic that does not exist. Vagueness is a model
  hedging; confident precision about a checkable fact is where to look.
useCase:
  scenario: >-
    A model cites a library function with exactly the right naming convention
    for that library, and the function has never existed.
  detail: >-
    The name is right in every respect the model can evaluate: it matches the
    shape of the API, reads like its siblings, and fits the surrounding code.
    The one property it lacks — existing — is not something the model has
    access to. This is why hallucination is caught by running things rather
    than by reading them, and why a harness with tool use fails at a different
    rate from a chat window, even on the same model.
relations:
  - type: part-of
    target: model
    note: >-
      A property of how models generate, not a defect in a particular one. No
      harness setting removes it.
  - type: distinguished-from
    target: prompt-injection
    note: >-
      Injection is wrong text the model was fed. Hallucination is wrong text
      the model produced with nothing behind it at all.
examples:
  - name: Fabricated legal citations
    url: https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)
    note: >-
      The canonical public example: court filings containing case citations in
      correct format for cases that do not exist.
    verifiedOn: 2026-08-22
  - name: Why Language Models Hallucinate
    vendor: OpenAI
    url: https://arxiv.org/abs/2509.04664
    note: >-
      Argues the cause is in training and evaluation incentives rather than in
      any particular model.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: why-hallucinate
    url: https://arxiv.org/abs/2509.04664
    title: Why Language Models Hallucinate — Kalai, Nachum, Vempala and Zhang
    verifiedOn: 2026-08-22
    note: Submitted 4 September 2025.
  - id: wikipedia-hallucination
    url: https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)
    title: Hallucination (artificial intelligence) — Wikipedia
    verifiedOn: 2026-08-22
---

Hallucination is "the production of plausible-seeming but factually incorrect
output by a [generative AI](generative-ai) model that purports to be making an
assertion about
the real world."[[cite:google-glossary]] The load-bearing word is
*plausible-seeming*: the failure is invisible from inside the output.

## Why it is not a bug

A [model](model) is trained to produce likely continuations. Truth is not one of
the quantities it computes, so a fluent falsehood and a fluent fact are, to the
mechanism producing them, the same kind of object. There is no internal signal
that fires on one and not the other.

The 2025 analysis puts the cause further upstream still, in how models are
trained and graded: models "hallucinate because the training and evaluation
procedures reward guessing over acknowledging
uncertainty."[[cite:why-hallucinate]] A benchmark that scores a wrong answer the
same as "I don't know" — zero — makes guessing strictly better than abstaining.
The paper's analogy is a student facing a hard exam question.

That reframing matters for what to expect. If the incentive is in the
evaluation, then scaling alone does not fix it; changing what gets rewarded
might.

## Where it shows up hardest

- **Citations and references** — the format is highly learnable and the content
  is not.
- **APIs and library functions** — plausible names for functions that do not
  exist.
- **Numbers about the real world** — dates, prices, populations, versions.
- **Anything after the training cutoff** — the model has no representation of
  its own ignorance to consult.

## What actually reduces it

Not [temperature](temperature), which changes dispersion rather than
grounding. Not asking the model to be careful.

What helps is putting the fact in front of the model instead of asking it to
recall one — retrieval, a document in the [context window](context-window), a
[tool](tool-use) call that returns the real answer — and then checking the
output against something external. An [agent](agent) that runs the code it wrote
catches an invented function immediately; a chat window returns it with the same
confidence as working code.[[cite:wikipedia-hallucination]]
