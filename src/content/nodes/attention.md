---
title: Attention
kind: concept
aka:
  - self-attention
  - attention mechanism
canonical:
  status: de-facto
  term: Attention
  body: Vaswani et al., "Attention Is All You Need" (2017)
  url: https://arxiv.org/abs/1706.03762
  title: Attention Is All You Need — Vaswani et al.
  verifiedOn: 2026-08-22
  note: >-
    The mechanism predates the paper; the paper made it the whole architecture
    and fixed the vocabulary — self-attention, multi-head attention, query, key,
    value — that everyone now uses.
tags: [core, structure]
zoom: 3
summary: The operation that lets each position in a sequence look at every other
  position and weigh how much each one matters.
fieldMark: Whenever you read that a model "understands context" or "tracks
  long-range dependencies", this is the machinery being described. There is no
  separate memory doing it.
useCase:
  scenario: >-
    A model correctly resolves "it" in "the trophy would not fit in the suitcase
    because it was too small".
  detail: >-
    Nothing in the sentence marks the referent grammatically — both nouns agree.
    Attention lets the representation being built at "it" draw on the
    representations of "trophy" and "suitcase" in proportion to how well each
    fits, and the weighting is learned rather than programmed. The same
    mechanism, applied to a codebase, is what lets a model connect a call site
    to a definition ten thousand tokens away.
relations:
  - type: consumes
    target: token
    note: Weights are computed between token positions, which is why cost scales with their count.
examples:
  - name: Multi-head self-attention
    url: https://arxiv.org/abs/1706.03762
    note: >-
      The paper's own variant: several attention operations run in parallel over
      different learned projections, then concatenated.
    verifiedOn: 2026-08-22
  - name: Hugging Face Transformers
    vendor: Hugging Face
    url: https://huggingface.co/docs/transformers/en/index
    note: Attention implementations readable in source for most published architectures.
    verifiedOn: 2026-08-22
sources:
  - id: attention-paper
    url: https://arxiv.org/abs/1706.03762
    title: Attention Is All You Need — Vaswani et al.
    verifiedOn: 2026-08-22
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A mechanism used in a neural network that indicates the importance of a particular word or part of a word.
  - id: hf-transformers
    url: https://huggingface.co/docs/transformers/en/index
    title: Transformers — Hugging Face documentation
    verifiedOn: 2026-08-22
---

Attention is "a mechanism used in a neural network that indicates the importance
of a particular word or part of a word," typically "a weighted sum over a set of
inputs, where the weight for each input is computed by another part of the
neural network."[[cite:google-glossary]] Both halves matter: it is a weighted
sum, and the weights are themselves learned from the input.

## Why it is not a lookup

A cache or an index answers "where is this token". Attention answers "how much
should this position influence that one", for every pair, and the answer is
recomputed from scratch for every input. There is no stored association between
words. The relationship between "trophy" and "it" is not a fact the model holds;
it is a number the model produces on the spot.

This is also why attention is not memory. Everything it relates has to be
present in the same [context window](context-window). What falls outside the
window is not remembered weakly — it is not there at all.

## Self-attention, and why the paper's title was literal

Earlier architectures used attention as a supplement, connecting an encoder to a
decoder while recurrence did the sequential work. The 2017 paper dispensed with
recurrence and convolutions entirely and built the whole
[transformer](transformer) from attention alone.[[cite:attention-paper]]
Google's glossary calls self-attention and multi-head self-attention "the
building blocks of Transformers."[[cite:google-glossary]]

*Self*-attention means the sequence attends to itself: queries, keys and values
all come from the same input, so every position is described in terms of the
others.

## The cost, and what follows from it

Every position attends to every position, so work grows with the square of the
sequence length. Doubling the input quadruples the attention compute and the
memory it needs at once.

That is the whole economic story of long context. It is why windows are sold in
tiers, why a [harness](harness) works so hard to keep only relevant material in
the prompt, and why so much architecture research since 2017 has been attempts to
get the same result for less than quadratic cost.
