---
title: Transformer
kind: concept
aka:
  - transformer architecture
canonical:
  status: de-facto
  term: Transformer
  body: Vaswani et al., "Attention Is All You Need" (2017), where the architecture was named
  url: https://arxiv.org/abs/1706.03762
  title: Attention Is All You Need — Vaswani et al.
  verifiedOn: 2026-08-22
  note: >-
    Named in the paper that introduced it and used unchanged since. Google's
    glossary capitalises it; most vendors do not. Nothing else about the term
    is contested.
tags: [core, structure]
zoom: 2
summary: The neural network architecture nearly every current language model is
  built from — a stack of self-attention layers, with no recurrence and no
  convolution.
fieldMark: If a product says "based on transformer architecture" it has told
  you almost nothing, because the alternative is essentially unused. What
  differs between models is scale, training and tokenizer, not this.
useCase:
  scenario: >-
    You are asked why context is expensive when disk and memory are cheap.
  detail: >-
    The architecture is the answer. Every layer relates each position in the
    input to every other position, so the work grows with the square of the
    sequence length rather than in step with it. Doubling the input roughly
    quadruples the attention cost. That single property is why context windows
    are rationed, why long-context pricing looks the way it does, and why a
    large share of model research is spent on making attention cheaper.
relations:
  - type: part-of
    target: model
    note: The architecture half of "an architecture plus a set of learned weights".
  - type: contains
    target: attention
    note: Self-attention layers are the component the architecture is built from.
examples:
  - name: Hugging Face Transformers
    vendor: Hugging Face
    url: https://huggingface.co/docs/transformers/en/index
    note: The library that made the architecture a commodity; named after it.
    verifiedOn: 2026-08-22
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: A decoder-only transformer scaled to 175 billion parameters.
    verifiedOn: 2026-08-22
sources:
  - id: attention-paper
    url: https://arxiv.org/abs/1706.03762
    title: Attention Is All You Need — Vaswani et al.
    verifiedOn: 2026-08-22
    note: >-
      Submitted 12 June 2017, last revised 2 August 2023. Introduces and names
      the architecture.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
  - id: hf-transformers
    url: https://huggingface.co/docs/transformers/en/index
    title: Transformers — Hugging Face documentation
    verifiedOn: 2026-08-22
---

The transformer is "a neural network architecture developed at Google that
relies on self-attention mechanisms to transform a sequence of input embeddings
into a sequence of output embeddings without relying on convolutions or
recurrent neural networks."[[cite:google-glossary]] Read the negative half of
that sentence first: what the design removed mattered as much as what it added.

The 2017 paper proposed "a new simple network architecture, the Transformer,
based solely on attention mechanisms, dispensing with recurrence and
convolutions entirely," and reported models that were "superior in quality while
being more parallelizable and requiring significantly less time to
train."[[cite:attention-paper]]

## Why removing recurrence was the breakthrough

A recurrent network reads a sequence one position at a time, because position
*n* depends on the state left by position *n−1*. That is inherently serial, and
serial work does not get faster when you add hardware.

Attention has no such dependency: every position can be computed at once. The
architecture did not win by being cleverer per unit of compute — it won by being
able to absorb far more of it. Scale became a purchasing decision, and the model
sizes of the following decade followed.

## Encoders, decoders, or both

Google's glossary describes a transformer as possibly including "an encoder, a
decoder, [or] both an [encoder and decoder](encoder-and-decoder)."[[cite:google-glossary]] The original paper used both, for translation. The [generative
models](generative-ai) this guide is mostly about are decoder-only: they consume
a sequence and extend it, one [token](token) at a time.

## What it costs

Relating every position to every other is quadratic in sequence length. That is
the source of the [context window](context-window)'s price, and the reason a
model's window is a headline spec rather than an implementation detail. A large
part of the field's engineering effort since 2017 has gone into paying that cost
more cheaply without changing what the architecture computes.
