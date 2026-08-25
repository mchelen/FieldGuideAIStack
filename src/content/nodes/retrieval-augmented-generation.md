---
title: Retrieval-augmented generation
kind: concept
aka:
  - RAG
  - retrieval augmentation
canonical:
  status: de-facto
  term: Retrieval-augmented generation
  body: Lewis et al. (2020), where the term was coined; carried by Google's Machine Learning Glossary
  url: https://arxiv.org/abs/2005.11401
  title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al.
  verifiedOn: 2026-08-22
tags: [context, technique]
zoom: 1
summary: Fetching relevant documents at question time and putting them in the
  prompt, so the answer rests on retrieved text rather than on what training
  happened to instil.
fieldMark: RAG is a retrieval problem wearing a generation costume. When a RAG
  system gives a bad answer, the failure is almost always that the right
  passage was never retrieved.
useCase:
  scenario: >-
    An assistant needs to answer from a company handbook that changes monthly.
  detail: >-
    Fine-tuning on the handbook would bake a snapshot into weights that have to
    be re-made on every revision, and would still give no way to show where an
    answer came from. Retrieval fetches the current passage at question time and
    puts it in the prompt, so an edit takes effect immediately and the answer
    can cite the paragraph it rests on. Freshness and provenance are the two
    things retrieval buys that training cannot.
relations:
  - type: kind-of
    target: grounding
    note: Google's glossary calls it "a common grounding technique" — one of several.
  - type: consumes
    target: context-window
    note: Retrieved passages occupy it, competing with the conversation for space.
examples:
  - name: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
    url: https://arxiv.org/abs/2005.11401
    note: The paper that named the pattern, framed around provenance and updatable knowledge.
    verifiedOn: 2026-08-22
  - name: Contextual Retrieval
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/contextual-retrieval
    note: >-
      Published 19 September 2024. Documents the standard pipeline and reports
      49% fewer failed retrievals from adding context to chunks.
    verifiedOn: 2026-08-22
sources:
  - id: rag-paper
    url: https://arxiv.org/abs/2005.11401
    title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al.
    verifiedOn: 2026-08-22
    quote: >-
      We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) -- models which combine pre-trained parametric and non-parametric memory for language generation.
    note: Submitted 22 May 2020, last revised 12 April 2021.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A technique for improving the quality of large language model (LLM) output by grounding it with sources of knowledge retrieved after the model was trained.
  - id: anthropic-contextual-retrieval
    url: https://www.anthropic.com/engineering/contextual-retrieval
    title: Introducing Contextual Retrieval — Anthropic
    verifiedOn: 2026-08-22
    quote: >-
      A Standard Retrieval-Augmented Generation (RAG) system that uses both embeddings and Best Match 25 (BM25) to retrieve information.
---

The 2020 paper starts from what a [model](model) cannot do with knowledge held
in its weights: "their ability to access and precisely manipulate knowledge is
still limited", and "providing provenance for their decisions and updating their
world knowledge remain open research problems."[[cite:rag-paper]]

Both problems have the same fix. Put the knowledge in the prompt instead of in
the weights — the paper's "explicit non-parametric memory" — and it can be
updated by editing a document and cited by naming one.[[cite:rag-paper]]

## The standard pipeline

Anthropic's write-up gives the shape most systems still use. Ahead of time:
"break down the knowledge base … into smaller chunks of text, usually no more
than a few hundred tokens", "use an embedding model to convert these chunks into
vector embeddings", and "store these embeddings in a
[vector database](vector-database) that allows for searching by semantic
similarity."[[cite:anthropic-contextual-retrieval]]

At question time: the database finds "the most relevant chunks based on semantic
similarity to the query", and those chunks are added to the
prompt.[[cite:anthropic-contextual-retrieval]]

Strong systems run two retrievals rather than one — BM25 for "exact matches"
alongside [embeddings](embedding) for "semantic similarity", combined with rank
fusion — because keyword search and
[semantic search](semantic-search) fail on different
things.[[cite:anthropic-contextual-retrieval]]

## Where it goes wrong

Not in the generation. If the right passage reached the prompt, a competent
model will use it; if it did not, no amount of prompting recovers. Retrieval
quality is the system, and [chunking](chunking) and
[reranking](reranking) are where most of it is won or lost.

## The honest first question

Anthropic's own advice is worth repeating because it is so often skipped: "if
your knowledge base is smaller than 200,000 tokens (about 500 pages of
material), you can just include the entire knowledge base in the prompt that you
give the model, with no need for RAG."[[cite:anthropic-contextual-retrieval]]

Long [context windows](context-window) plus
[prompt caching](prompt-caching) removed the reason for a great many retrieval
pipelines. Build one when the corpus genuinely does not fit — not because the
architecture diagram looks more serious with a vector database in it.

## What it does and does not fix

It grounds answers in supplied text, which is the strongest available mitigation
for [hallucination](hallucination) on factual questions, and Google's glossary
records it as "a common grounding technique."[[cite:google-glossary]]

It does not make the model reason better, and it introduces its own failure: a
retrieved passage that is relevant-looking and wrong is more persuasive than no
passage at all.
