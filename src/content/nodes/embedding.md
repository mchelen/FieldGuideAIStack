---
title: Embedding
kind: concept
aka:
  - embedding vector
  - vector representation
canonical:
  status: de-facto
  term: Embedding vector
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google distinguishes the embedding vector from the embedding layer that
    produces it. In everyday use "embedding" means the vector, and the
    distinction only matters when discussing training.
tags: [core, artifact]
zoom: 2
summary: A list of numbers representing a piece of content, positioned so that
  things with similar meaning end up near each other.
fieldMark: Embeddings are how search works when it is not keyword search. If a
  product finds documents that share no words with the query, it is comparing
  vectors.
useCase:
  scenario: >-
    A support search should return the article about "can't sign in" when
    someone types "locked out of my account".
  detail: >-
    Keyword search returns nothing — the two phrases share no words. Embedding
    each article and each query into the same space and comparing distances
    returns the right article, because the representations are close even though
    the strings are not. This is the retrieval half of every
    retrieval-augmented system, and the reason vector databases exist as a
    product category.
relations:
  - type: consumes
    target: token
    note: Text is tokenized first; the embedding is computed over the token sequence.
  - type: part-of
    target: model
    note: >-
      The first layer of a language model maps tokens to embeddings before any
      attention happens.
examples:
  - name: Claude embeddings
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/embeddings
    note: Vendor documentation for producing embeddings for search and retrieval.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Broadly speaking, an array of floating-point numbers taken from any hidden layer that describe the inputs to that hidden layer.
  - id: anthropic-embeddings
    url: https://platform.claude.com/docs/en/build-with-claude/embeddings
    title: Embeddings — Claude Platform documentation
    verifiedOn: 2026-08-22
---

An embedding vector is "an array of floating-point numbers … that describe the
inputs" to a layer, and Google's glossary is emphatic that it "is not a bunch of
random numbers": the values are determined "through training, similar to the way
a neural network learns other weights."[[cite:google-glossary]]

The property that makes them useful is geometric. Similar things land near each
other, because that arrangement is what made the training objective work.

## Why a number line for meaning helps

Text is discrete and unforgiving. "Locked out" and "can't sign in" share no
characters, and no amount of string comparison brings them together.

Positions in a continuous space can be compared by distance, and distance turns
out to track similarity of meaning closely enough to build on. That is the whole
basis of [semantic search](semantic-search), clustering, deduplication and
recommendation.

## Inside the model and beside it

Two related uses, often confused:

- **Inside.** The first layer of a [language model](large-language-model) maps
  each [token](token) to an
  embedding, which is what the [transformer](transformer) actually operates on.
  Google's glossary describes the embedding layer as learning "a lower dimension
  embedding vector" from a high-dimensional categorical
  feature.[[cite:google-glossary]]
- **Beside.** A separate embedding model turns whole documents into single
  vectors for retrieval. Different model, different purpose, same
  idea.[[cite:anthropic-embeddings]]

## What they cannot do

An embedding is lossy by construction — a paragraph compressed to a few thousand
numbers keeps what the training objective rewarded keeping and discards the
rest. Negation, numbers and small but decisive distinctions survive poorly, so
"the contract does not renew automatically" and "the contract renews
automatically" can sit uncomfortably close.

Retrieval built on embeddings alone inherits this, which is why serious systems
combine it with keyword matching rather than replacing one with the other.
