---
title: Chunking
kind: concept
aka:
  - text splitting
  - segmentation
canonical:
  status: none
  note: >-
    No surveyed glossary carries the term, and no vendor documents a standard
    strategy. It is named consistently in practice and is the least principled
    step in the retrieval pipeline — which is why it is where most retrieval
    quality is lost.
tags: [context, technique]
zoom: 3
summary: Splitting documents into retrievable pieces — and the losses that
  causes, because a piece removed from its document stops saying what it meant.
fieldMark: When retrieval fails on a question the corpus plainly answers, look
  at the chunks before blaming the embedding model. The passage was probably
  retrieved and no longer said anything on its own.
useCase:
  scenario: >-
    A question about one company's quarterly revenue keeps returning the wrong
    company's figures.
  detail: >-
    Anthropic's worked example: a chunk reads "The company's revenue grew by 3%
    over the previous quarter", which "on its own doesn't specify which company
    it's referring to or the relevant time period". The document knew; the chunk
    does not. Splitting discards exactly the context that made the sentence
    findable, and no amount of embedding quality recovers information that is no
    longer in the text.
flow:
  scenario: >-
    A 200-page handbook cut into retrievable pieces, and a sentence whose
    meaning was in the paragraph before it.
  path:
    - actor: A document
      where: your machine
      does: >-
        200 pages, far too long to retrieve whole
    - node: chunking
      where: your infrastructure
      does: >-
        split into pieces small enough to fetch and send
      self: true
    - node: token
      where: your infrastructure
      does: >-
        each piece sized in these, because the budget is
    - node: retrieval-augmented-generation
      where: the prompt you send
      does: >-
        and only whole pieces can ever come back
  returns: >-
    A piece torn out of context can be retrieved out of context
relations:
  - type: consumed-by
    target: retrieval-augmented-generation
    note: The preprocessing step everything downstream inherits.
  - type: consumes
    target: token
    note: >-
      Chunk size is chosen in them — usually no more than a few hundred, which
      is what forces the trade.
examples:
  - name: Contextual Retrieval
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/contextual-retrieval
    note: >-
      Prepending chunk-specific explanatory context before embedding; reported
      to cut failed retrievals by 49%, and by 67% combined with reranking.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-contextual-retrieval
    url: https://www.anthropic.com/engineering/contextual-retrieval
    title: Introducing Contextual Retrieval — Anthropic
    verifiedOn: 2026-08-22
---

Retrieval needs pieces small enough to be precise and self-contained enough to
be meaningful, and documents rarely divide that way. Anthropic states the
problem in one sentence: splitting "works well for many applications" but "can
lead to problems when individual chunks lack sufficient
context."[[cite:anthropic-contextual-retrieval]]

## The worked example

A corpus of SEC filings, and the question "What was the revenue growth for ACME
Corp in Q2 2023?" A relevant chunk contains: "The company's revenue grew by 3%
over the previous quarter."

As Anthropic notes, "this chunk on its own doesn't specify which company it's
referring to or the relevant time period, making it difficult to retrieve the
right information or use the information
effectively."[[cite:anthropic-contextual-retrieval]]

Two failures at once. The chunk will not be found, because nothing in it matches
the query's entities. And if it is found, it cannot be used, because it does not
say what it is about.

## The trade nobody escapes

- **Small chunks** retrieve precisely and lose their context — pronouns without
  antecedents, figures without subjects, steps without the procedure they belong
  to.
- **Large chunks** keep their context and retrieve imprecisely, because a single
  [embedding](embedding) averaging several topics is close to none of them, and
  because they spend more [context window](context-window) per hit.

There is no size that avoids this, which is why chunking is the least principled
step in the pipeline and the one most worth experimenting on.

## What actually helps

**Split on structure, not length.** Headings, sections and paragraph boundaries
carry meaning that a character count does not.

**Overlap.** Repeating a little text between adjacent chunks stops a sentence
being cut in half at a boundary, at the cost of some duplication.

**Add the missing context back.** This is Anthropic's Contextual Retrieval:
prepend "chunk-specific explanatory context to each chunk before embedding", so
the ACME chunk carries its company and quarter with it. Reported to reduce
failed retrievals by 49%, and by 67% "when combined with
[reranking](reranking)."[[cite:anthropic-contextual-retrieval]]

That result is worth reading carefully, because it says the largest single win
available in retrieval came from repairing what chunking had broken.
