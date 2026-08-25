---
title: Semantic search
kind: concept
aka:
  - vector search
  - similarity search
  - dense retrieval
canonical:
  status: de-facto
  term: Semantic search
  body: Wikipedia, which records the standard contrast with lexical search
  url: https://en.wikipedia.org/wiki/Semantic_search
  title: Semantic search — Wikipedia
  verifiedOn: 2026-08-22
  note: >-
    Predates language models by well over a decade; the term is stable and the
    implementation changed underneath it. What is now meant in practice is
    embedding-based retrieval specifically.
tags: [context, technique]
zoom: 2
summary: Search by meaning rather than by literal words — matching a query to
  documents that share no vocabulary with it.
fieldMark: >-
  Semantic search is bad at exactly what keyword search is good at:
  identifiers, error codes, product names, negation. Systems that ship only one
  of the two fail on the other's cases.
useCase:
  scenario: >-
    A user searches "locked out of my account" and the right article is titled
    "Can't sign in".
  detail: >-
    Keyword search returns nothing — the two phrases share no words. Semantic
    search returns the article, because the query and the title land near each
    other in embedding space even though the strings do not overlap. Reverse the
    case and it flips: a user searching for error code E4021 wants a literal
    match, and semantic similarity will happily return E4022.
relations:
  - type: consumes
    target: embedding
    note: The query and the documents are compared as vectors, not as strings.
  - type: distinguished-from
    target: retrieval-augmented-generation
    note: >-
      Semantic search finds documents for a person to read. RAG finds them for
      a model to answer from. Same retrieval, different consumer.
examples:
  - name: Semantic search
    url: https://en.wikipedia.org/wiki/Semantic_search
    note: >-
      "Search with meaning, as distinguished from lexical search where the
      search engine looks for literal matches of the query words."
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-semantic-search
    url: https://en.wikipedia.org/wiki/Semantic_search
    title: Semantic search — Wikipedia
    verifiedOn: 2026-08-22
    quote: >-
      Modern semantic search systems use vector embeddings which convert words, phrases, or documents into numerical vectors.
  - id: anthropic-contextual-retrieval
    url: https://www.anthropic.com/engineering/contextual-retrieval
    title: Introducing Contextual Retrieval — Anthropic
    verifiedOn: 2026-08-22
---

Semantic search "denotes search with meaning, as distinguished from lexical
search where the search engine looks for literal matches of the query words or
variants of them, without understanding the overall meaning of the
query."[[cite:wikipedia-semantic-search]]

The goal is old — improving accuracy "by understanding the searcher's intent and
the contextual meaning of terms" — and the current implementation is
[embeddings](embedding): "modern semantic search systems use
vector" representations.[[cite:wikipedia-semantic-search]]

## What it is good at

Vocabulary mismatch, which is the failure mode keyword search cannot address at
all. A user rarely searches with the words a document was written in, and
comparing positions in a learned space rather than strings closes that gap
without anyone maintaining a synonym list.

Paraphrase, related concepts, and questions phrased as questions all work for
the same reason.

## What it is bad at

- **Exact identifiers.** Error codes, SKUs, function names, version numbers.
  "Close in meaning" is the wrong relation for a string that must match exactly.
- **Negation.** "Does not renew automatically" embeds close to its opposite,
  because the words are nearly all shared and the one that reverses the meaning
  is small.
- **Rare terms.** A word the embedding model saw seldom is placed poorly, and a
  bad position is invisible from outside.
- **Recency and other metadata.** Nothing about the geometry knows which
  document is current.

## Which is why serious systems run both

Anthropic's description of a standard retrieval pipeline uses BM25 "to find top
chunks based on exact matches" *and* embeddings "to find top chunks based on
semantic similarity", then combines them "using rank fusion
techniques" — "balancing precise term matching with broader semantic
understanding."[[cite:anthropic-contextual-retrieval]]

Hybrid retrieval is not a hedge. The two methods fail on disjoint sets of
queries, which is the ideal case for combining them.

## Search for people, search for models

The mechanics are identical; the consumers differ. A person scans a ranked list
and recovers from a bad result by reading the next one. A model receives the top
few passages and answers from them, with no way to notice that the right one was
ranked eleventh.

That is why [reranking](reranking) matters so much more in
[RAG](retrieval-augmented-generation) than in a search box: precision at the very
top is the only precision that counts.
