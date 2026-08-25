---
title: Vector database
kind: concept
aka:
  - vector store
  - vector search engine
canonical:
  status: de-facto
  term: Vector database
  body: Wikipedia, which records the three names in current use
  url: https://en.wikipedia.org/wiki/Vector_database
  title: Vector database — Wikipedia
  verifiedOn: 2026-08-22
  note: >-
    No surveyed glossary carries it. "Vector store" and "vector search engine"
    are used for the same thing, and increasingly the capability is an
    extension to an ordinary database rather than a product of its own.
tags: [context, infrastructure]
zoom: 2
summary: A store indexed by embedding and queried by similarity rather than by
  exact match — the retrieval half of most RAG systems.
fieldMark: Ask whether it needs to be a separate database. Postgres, SQLite and
  most search engines now index vectors, and a second datastore is a real
  operational cost to carry.
useCase:
  scenario: >-
    A support corpus of 40,000 articles has to be searched by meaning, fast,
    on every question.
  detail: >-
    Comparing a query embedding against 40,000 stored ones exhaustively is
    possible but wasteful, and the cost grows with the corpus. A vector database
    builds an approximate nearest-neighbour index that returns the closest
    matches in roughly constant time, trading exactness for speed. The word
    "approximate" is the trade: results are near-best rather than best, which
    for retrieval feeding a language model is almost always the right call.
relations:
  - type: consumes
    target: embedding
    note: What it stores and what it indexes; the vectors come from an embedding model.
  - type: consumed-by
    target: retrieval-augmented-generation
    note: The retrieval half of the standard pipeline.
examples:
  - name: Vector database
    url: https://en.wikipedia.org/wiki/Vector_database
    note: >-
      Records the use-cases as "similarity search, semantic search, multi-modal
      search, recommendations engines, object detection, and
      retrieval-augmented generation".
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-vectordb
    url: https://en.wikipedia.org/wiki/Vector_database
    title: Vector database — Wikipedia
    verifiedOn: 2026-08-22
    quote: >-
      The retrieval component of a RAG can be any search system, but is most often implemented as a vector database.
  - id: anthropic-contextual-retrieval
    url: https://www.anthropic.com/engineering/contextual-retrieval
    title: Introducing Contextual Retrieval — Anthropic
    verifiedOn: 2026-08-22
    quote: >-
      At runtime, when a user inputs a query to the model, the vector database is used to find the most relevant chunks based on semantic similarity to the query.
---

A vector database "is a database that stores and retrieves
[embeddings](embedding) of data in vector space", and typically implements
"approximate nearest neighbor algorithms so users can search for records
semantically similar to a given input, unlike traditional databases which
primarily look up records by exact match."[[cite:wikipedia-vectordb]]

The contrast in that last clause is the whole product. Ordinary indexes answer
"where is this value". A vector index answers "what is closest to this
position", which is a different question with a different data structure behind
it.

## Why "approximate" is in the name

Finding the genuinely nearest vector means comparing against every stored one,
which does not scale. Approximate nearest-neighbour indexes give up guaranteed
exactness for a large constant-factor speedup, returning results that are nearly
always among the true best.

For retrieval feeding a [model](model) this is a good trade: the pipeline is
going to hand several candidates to a
[reranker](reranking) anyway,[[cite:anthropic-contextual-retrieval]] and being
occasionally off by one position at the tail costs nothing.

## Where it sits

In the standard [RAG](retrieval-augmented-generation) pipeline it holds the
chunk embeddings and answers the similarity query at question
time.[[cite:anthropic-contextual-retrieval]] Wikipedia's list of use-cases is
broader than that — "similarity search, [semantic search](semantic-search),
multi-modal search, recommendations engines, object detection, and retrieval-
augmented generation"[[cite:wikipedia-vectordb]] — and predates the current
interest by years.

## Whether you need one

Often not. The capability is now an extension to databases teams already run,
and a corpus of a few thousand chunks can be searched by brute force in
milliseconds with no index at all.

A separate datastore is a real operational cost — another thing to back up,
secure, keep in sync and pay for — and it is worth being honest about whether
the corpus is large enough to earn it. The first question is usually whether
retrieval is needed at all: under about 500 pages, the whole corpus fits in a
long [context window](context-window).[[cite:anthropic-contextual-retrieval]]
