---
title: Model card
kind: concept
aka:
  - model documentation
  - system card
canonical:
  status: de-facto
  term: Model card
  body: Mitchell et al., "Model Cards for Model Reporting" (2018), which proposed the framework and the name
  url: https://arxiv.org/abs/1810.03993
  title: Model Cards for Model Reporting — Mitchell et al.
  verifiedOn: 2026-08-22
tags: [artifact, openness]
zoom: 3
summary: A short document published with a model saying what it is, what it was
  meant for, how it was evaluated and where it should not be used.
fieldMark: Read the intended-use and limitations sections first. A card that
  lists [benchmark](benchmark) scores and says nothing about what the model is unsuited for
  is marketing wearing the form of documentation.
useCase:
  scenario: >-
    You are choosing between two open-weight models and both publish impressive
    benchmark numbers.
  detail: >-
    The card is where the difference usually shows. One states its training
    data, the populations it was evaluated across, its licence and what it is
    not suitable for; the other states a [leaderboard](leaderboard) position. The second is not
    necessarily the worse model, but it is the one you cannot assess without
    running your own evaluation — and knowing that before you commit is the
    point of the document.
relations:
  - type: distinguished-from
    target: checkpoint
    note: The card is documentation about a checkpoint, not the checkpoint itself.
  - type: consumed-by
    target: open-source-ai
    note: >-
      Where a release publishes the data and process information an openness
      definition asks for, if it publishes it anywhere.
examples:
  - name: Hugging Face model cards
    vendor: Hugging Face
    url: https://huggingface.co/docs/hub/model-cards
    note: >-
      The convention that made cards near-universal: a README in the model
      repository, with structured metadata.
    verifiedOn: 2026-08-22
  - name: Mistral 7B model card
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: A published example — architecture, parameter count, intended use, licence.
    verifiedOn: 2026-08-22
sources:
  - id: model-cards-paper
    url: https://arxiv.org/abs/1810.03993
    title: Model Cards for Model Reporting — Mitchell et al.
    verifiedOn: 2026-08-22
    quote: >-
      In this paper, we propose a framework that we call model cards, to encourage such transparent model reporting.
    note: Submitted 5 October 2018, last revised 14 January 2019.
  - id: hf-model-cards
    url: https://huggingface.co/docs/hub/model-cards
    title: Model Cards — Hugging Face Hub documentation
    verifiedOn: 2026-08-22
    quote: >-
      The model card is a Markdown file, with a YAML section at the top that contains metadata about the model.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
---

The 2018 proposal states its motive before its format: "in order to clarify the
intended use cases of machine learning models and minimize their usage in
contexts for which they are not well suited, we recommend that released models
be accompanied by documentation detailing their performance
characteristics."[[cite:model-cards-paper]]

Misuse, not opacity, is the problem being solved. A model used for something it
was never evaluated on fails in ways nobody measured, and the card exists to
make that boundary visible before rather than after.

## What one is supposed to contain

The paper describes short documents accompanying trained models, reporting
performance across the conditions the model will meet rather than an aggregate
number.[[cite:model-cards-paper]] In current practice a card typically carries:

- Intended use, and explicitly out-of-scope use.
- Architecture, [parameter](parameter) count and
  [context window](context-window).
- Training data, in whatever detail the publisher will give.
- [Evaluation](evaluation) results, ideally disaggregated rather than averaged.
- Known limitations and biases.
- Licence and citation.

## Why they became universal

Hugging Face made the card a README in the model repository, with structured
metadata a machine can read.[[cite:hf-model-cards]] Putting the document where
the weights are, in the format the ecosystem already used, did more for adoption
than any recommendation could.

The result is that a card now exists for essentially every published
[checkpoint](checkpoint) — including plenty that carry a licence line and
nothing else.[[cite:hf-mistral]]

## What a card is not

It is not verified, and nothing checks it. The publisher writes it, and
"trained on a diverse corpus of publicly available data" is a sentence that
survives review because there is no review.

This matters for [open weights](open-weights) in particular. A card is the only
place training-data information is usually published at all, which makes it both
the best available evidence about a model's [provenance](provenance) and evidence of a kind
nobody has audited.
