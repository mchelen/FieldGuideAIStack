---
title: Factuality
kind: concept
aka:
  - truthfulness
  - factual accuracy
canonical:
  status: de-facto
  term: Factuality
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google is explicit that it is "a concept rather than a metric", which is
    unusually candid and worth preserving — the word names something people
    want and not something anyone computes directly.
tags: [evaluation, safety]
zoom: 2
summary: Whether output is actually true, as distinct from whether it sounds
  right — a property to aim at rather than a number to report.
fieldMark: Factuality and groundedness are different claims, and Google
  separates them. A model faithfully repeating a document containing an error is
  grounded and wrong.
useCase:
  scenario: >-
    An [evaluation](evaluation) reports 94% and nobody can say 94% of what.
  detail: >-
    Factuality has no formula. What gets measured is always a proxy — agreement
    with a reference answer, whether claims are supported by cited sources,
    whether a judge model thinks it is right — and each proxy is checkable while
    factuality itself is not. Saying which proxy produced the number is the
    difference between a measurement and a reassurance.
flow:
  scenario: >-
    An evaluation reporting 94%, and nobody in the room able to say 94% of
    what.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        see 94% and ask 94% of what
    - actor: An answer
      where: what the reader sees
      does: >-
        fluent, well-formed, and possibly wrong
    - node: factuality
      where: your evaluation harness
      does: >-
        whether it is true, not whether it sounds right
      self: true
    - node: grounding
      where: your infrastructure
      does: >-
        the design that makes it checkable at all
    - node: evaluation
      where: your evaluation harness
      does: >-
        and what has to be measured, not assumed
  returns: >-
    Sounding right and being right are separate properties
relations:
  - type: distinguished-from
    target: grounding
    note: >-
      Google separates them: a grounded model is not always a factual one,
      because the source material can be wrong.
  - type: consumed-by
    target: llm-as-a-judge
    note: >-
      Commonly what a judge is asked to assess, and the thing it is least
      equipped to check.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "A property describing a model whose output is based on reality.
      Factuality is a concept rather than a metric."
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Within the ML world, a property describing a model whose output is based on reality.
  - id: why-hallucinate
    url: https://arxiv.org/abs/2509.04664
    title: Why Language Models Hallucinate — Kalai, Nachum, Vempala and Zhang
    verifiedOn: 2026-08-22
    quote: >-
      We argue that language models hallucinate because the training and evaluation procedures reward guessing over acknowledging uncertainty
---

Factuality is "a property describing a model whose output is based on reality",
and Google adds the sentence that makes the entry worth citing: "factuality is a
concept rather than a metric."[[cite:google-glossary]]

Nothing computes it. Every reported factuality score is a proxy standing in for
it, and naming which proxy is the difference between a measurement and a mood.

## Not always what you want

Google's example is a good one. Asked for the chemical formula of table salt, "a
model optimizing factuality would respond: NaCl". But asked to "tell me a
limerick about an astronaut and a caterpillar", the model "should … optimize
creativity rather than factuality."[[cite:google-glossary]]

So it is a per-task objective rather than a universal good, and a system that
maximises it everywhere is worse at some of its jobs. What matters is knowing
which mode a given request wants — a routing question that usually gets no
thought at all.

## Factuality is not groundedness

Google keeps them separate deliberately. Groundedness is "a property of a model
whose output is based on … specific source material", and the glossary states
the gap outright: "a grounded model is not always a factual model. For example,
the input physics textbook could contain
mistakes."[[cite:google-glossary]]

This matters for anything built on
[retrieval](retrieval-augmented-generation). A pipeline can be perfectly
[grounded](grounding) — every sentence traceable to a retrieved passage — and
confidently wrong, because retrieval inherits whatever it was pointed at.
Grounding is auditable; factuality is not, and conflating them turns a
verifiable property into an unverifiable claim.

## Why it is hard to improve directly

Because the failure is not a malfunction. A model produces likely continuations,
and truth is not among the quantities it computes — which is
[hallucination](hallucination) restated as a property rather than an event.

The 2025 analysis puts the incentive upstream: models "hallucinate because the
training and evaluation procedures reward guessing over acknowledging
uncertainty."[[cite:why-hallucinate]] A [benchmark](benchmark) scoring a wrong answer and "I
don't know" identically makes guessing strictly better, and factuality is what
loses.

## What is actually measurable

- **Agreement with a reference answer**, where one exists.
- **[Citation precision and recall](citation-precision-and-recall)** — whether
  claims are supported by what they cite.
- **Consistency across samples** — [self-consistency](self-consistency) used as
  a signal rather than a technique, since scattered answers indicate a shaky
  one.
- **Executable verification**, where the claim can be run.

Each is narrower than factuality. That is the point: they are the parts of it
somebody can check.
