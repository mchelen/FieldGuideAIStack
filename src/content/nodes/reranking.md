---
title: Reranking
kind: concept
aka:
  - cross-encoder reranking
  - second-stage ranking
canonical:
  status: de-facto
  term: Reranking
  body: Anthropic, in the Contextual Retrieval write-up; standard in information retrieval long before language models
  url: https://www.anthropic.com/engineering/contextual-retrieval
  title: Introducing Contextual Retrieval — Anthropic
  verifiedOn: 2026-08-22
  note: >-
    Borrowed from classical information retrieval, where two-stage ranking is
    decades old. Nothing about the term is new; what is new is which model does
    the second stage.
tags: [context, technique]
zoom: 3
summary: A second pass that reorders retrieved candidates by relevance, so only
  the best few reach the prompt.
fieldMark: Reranking is the cheap fix people skip. Retrieve broadly, rerank
  hard, and pass few — it improves answers and reduces cost at the same time,
  which almost nothing else in this stack does.
useCase:
  scenario: >-
    A retrieval step returns 150 plausible chunks and the prompt can afford ten.
  detail: >-
    Similarity search is fast and blunt: it ranks by distance in embedding
    space, which correlates with relevance without being it. A reranking model
    scores each candidate against the actual query and picks the best twenty.
    Because the model then reads less, the answer improves and the call gets
    cheaper and faster together — the retrieval pipeline's one genuinely free
    lunch.
relations:
  - type: consumed-by
    target: retrieval-augmented-generation
    note: The filtering stage between retrieval and the prompt.
  - type: consumes
    target: embedding
    note: >-
      It exists because embedding similarity is an approximation of relevance
      rather than a measure of it.
examples:
  - name: Contextual Retrieval with reranking
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/contextual-retrieval
    note: >-
      Retrieve the top 150 chunks, rerank, pass the top 20. Combined with
      contextual embeddings, reported to cut failed retrievals by 67%.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-contextual-retrieval
    url: https://www.anthropic.com/engineering/contextual-retrieval
    title: Introducing Contextual Retrieval — Anthropic
    verifiedOn: 2026-08-22
---

"With large knowledge bases, this initial retrieval often returns a lot of
chunks — sometimes hundreds — of varying relevance and importance. Reranking is
a commonly used filtering technique to ensure that only the most relevant chunks
are passed to the model."[[cite:anthropic-contextual-retrieval]]

## Why the first pass is not enough

[Similarity search](semantic-search) has to be fast, because it runs against the
whole corpus. That speed is bought by comparing pre-computed
[embeddings](embedding) — each document encoded once, in advance, without
knowing what would be asked.

A reranker scores each candidate *against this query*, which is a strictly
better-informed judgment and far too expensive to run over an entire corpus.
Doing the cheap thing broadly and the expensive thing narrowly is the whole
design.

## The shape of it

Anthropic's steps, with their own numbers: "perform initial retrieval to get the
top potentially relevant chunks (we used the top 150); pass the top-N chunks,
along with the user's query, through the reranking model; … give each chunk a
score based on its relevance and importance to the prompt, then select the top-K
chunks (we used the top 20)."[[cite:anthropic-contextual-retrieval]]

150 in, 20 out. Retrieve generously, because a chunk that never reaches the
reranker cannot be recovered later; pass sparingly, because everything passed
costs [tokens](token) and attention.

## Why it improves cost and quality together

Almost every other lever in this guide trades one against the other. This one
does not, and Anthropic says why: reranking "provides better responses and
reduces cost and latency because the model is processing less
information."[[cite:anthropic-contextual-retrieval]]

Fewer, better passages is simply a better prompt. Padding a
[context window](context-window) with marginal material makes answers worse as
well as more expensive, which is the part that surprises people.

## What it does not fix

Anything that was never retrieved. Reranking reorders the candidate set and can
only ever choose from it — if [chunking](chunking) destroyed the passage's
meaning or the first pass missed it, there is nothing left to promote.
