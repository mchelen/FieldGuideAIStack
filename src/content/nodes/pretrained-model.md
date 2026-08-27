---
title: Pretrained model
kind: concept
aka:
  - pre-trained model
  - base model
canonical:
  status: de-facto
  term: Pre-trained model
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google notes the term has drifted: it "could refer to any trained model or
    trained embedding vector" but "now typically refers to a trained large
    language model or other form of trained generative AI model", pointing at
    base model and [foundation model](model) as neighbours.
tags: [models, artifact]
zoom: 3
summary: A model released after pretraining and before any task-specific
  adaptation — the thing you start from rather than the thing you use.
fieldMark: A pretrained model continues text and does not answer questions. If
  a downloaded model replies to a question with more questions, you have the
  base variant rather than the instruct one.
useCase:
  scenario: >-
    A team wants to build its own assistant behaviour rather than inherit a
    vendor's.
  detail: >-
    Starting from the instruct variant means inheriting someone else's decisions
    about tone, refusals and formatting, on top of which your own adjustments
    compete. Starting from the base model means doing that work yourself — more
    expensive, and the only way to control it fully. Which variant a project
    should download is decided by whether it intends to do post-training at all.
relations:
  - type: kind-of
    target: model
    note: A model at a particular stage — after pretraining, before adaptation.
  - type: consumed-by
    target: fine-tuning
    note: What fine-tuning starts from, and why fine-tuning is cheap.
examples:
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: >-
      Published as a base model — "a pretrained generative text model with 7
      billion parameters" — with instruct variants released separately.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Although this term could refer to any trained model or trained embedding vector, pre-trained model now typically refers to a trained large language model or other form of trained generative AI model.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
    quote: >-
      Notice Mistral 7B is a pretrained base model and therefore does not have any moderation mechanisms.
---
Google's entry is mostly a note about drift: "although this term could refer to
any trained model or trained [embedding vector](embedding), pre-trained model
now typically refers to a trained [large language model](large-language-model)
or other form of trained [generative AI](generative-ai) model", cross-
referencing base model and [foundation model](foundation-model).[[cite:google-glossary]]

The useful sense here is narrower than any of those: a pretrained model is one at
a specific *stage*. [Pretraining](pretraining) has finished;
[post-training](post-training) has not started.

## What that artifact is like

It continues documents. Given a question it may produce another question,
because that is what text containing questions tends to look like. It does not
refuse anything, has no persona, and follows instructions only incidentally.

All of which sounds like a defect and is not. The general capability is present
and complete; what is missing is the layer that makes it addressable, and that
layer is cheap by comparison.

## Why the base variant is published at all

Because it is the useful starting point for anyone doing their own
adaptation. Mistral 7B is published exactly this way — "a pretrained generative
text model with 7 billion parameters" — with instruction-tuned variants as
separate releases.[[cite:hf-mistral]]

Downloading the base model means inheriting no decisions about tone, refusals or
formatting. Downloading the instruct variant means inheriting all of them, and
then arguing with them through prompts.

## Which to pick

- **Instruct** if you intend to use the model. Almost everyone.
- **Base** if you intend to do [post-training](post-training) — your own
  [instruction tuning](instruction-tuning), your own preference data, your own
  refusal policy.

[Fine-tuning](fine-tuning) an instruct model on top of its existing post-training works and is
common; it just means two sets of behaviour interacting, and the vendor's is the
one you cannot inspect.
