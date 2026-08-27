---
title: Grounding
kind: concept
aka:
  - source attribution
  - factual grounding
canonical:
  status: de-facto
  term: Grounding
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Used in a second, unrelated sense in robotics and cognitive science —
    symbol grounding, connecting representations to the physical world. In the
    applied stack the retrieval sense is the one meant.
tags: [context, safety]
zoom: 2
summary: Basing an answer on retrieved trusted sources rather than on what the
  model remembers — the goal that retrieval, citations and search tools all
  serve.
fieldMark: Grounding is a property of the answer, not of the system. A
  pipeline that retrieves documents and then answers from memory anyway is
  ungrounded, and looks identical from outside.
useCase:
  scenario: >-
    An answer needs to be checkable by whoever receives it.
  detail: >-
    Ungrounded, the reader has one option: believe it or verify it themselves
    from scratch. Grounded, the answer names the passage it rests on and
    verification takes seconds. That difference decides whether a model's output
    can be used in work with consequences — not because grounding makes the
    model more accurate, but because it makes the answer auditable when it is
    not.
flow:
  scenario: >-
    An answer that has to be checkable by the person reading it, in a domain
    where being confidently wrong is expensive.
  path:
    - actor: A question
      where: a person, not a system
      does: >-
        one the model would happily answer from memory
    - node: retrieval-augmented-generation
      where: your infrastructure
      does: >-
        fetches the passages that bear on it
    - node: grounding
      where: the prompt you send
      does: >-
        the answer is built from those, not from what the model recalls
      self: true
    - node: citation-precision-and-recall
      where: what the reader sees
      does: >-
        and every claim points at the passage it rests on
  returns: >-
    Checkable by the reader, which recall alone never is
relations:
  - type: consumes
    target: context-window
    note: The trusted source has to be in it at answer time; nothing else counts.
  - type: distinguished-from
    target: hallucination
    note: >-
      Grounding is the mitigation, not the cure. A grounded system still
      hallucinates when retrieval misses and the model answers anyway.
examples:
  - name: Retrieval-augmented generation
    url: https://arxiv.org/abs/2005.11401
    note: Google's glossary calls RAG "a common grounding technique".
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The process of basing all or part of an LLM's response on information retrieved from one or more trusted sources.
  - id: rag-paper
    url: https://arxiv.org/abs/2005.11401
    title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al.
    verifiedOn: 2026-08-22
    quote: >-
      For language generation tasks, we find that RAG models generate more specific, diverse and factual language than a state-of-the-art parametric-only seq2seq baseline.
---

Grounding is "the process of basing all or part of an LLM's response on
information retrieved from one or more trusted sources." Google's example is a
weather forecast: asked for today's outlook in Berlin, the model "might ground
the response on information it gathers from the European Centre for
Medium-Range Weather Forecasts."[[cite:google-glossary]]

Two conditions are doing the work — *retrieved*, and *trusted*. A model
recalling something it read during training satisfies neither.

## Why it is the answer to the knowledge problem

A [model](model) has no way to distinguish what it knows from what it is
producing, which is what makes [hallucination](hallucination) undetectable from
inside the output. Nothing about the model fixes that.

Putting the source text in front of it changes the task from recall to reading,
and reading is something these systems do well. Google records
[retrieval-augmented generation](retrieval-augmented-generation) as "a common
grounding technique",[[cite:google-glossary]] and the RAG paper frames the same
motive as making [provenance](provenance) possible at all.[[cite:rag-paper]]

## Grounded is not the same as correct

Four things can go wrong even when the pipeline is working:

- **The source is wrong.** Grounding inherits whatever it was pointed at.
- **The passage was not retrieved.** The model then answers from memory, and
  usually does so without saying it has.
- **The citation does not support the sentence.** A reference attached to a
  claim it does not make is worse than no reference, because it borrows
  credibility it has not earned.
- **The model contradicts the source.** Rare, and a reason to check rather than
  assume.

## How to tell whether a system is actually grounded

Ask what happens when retrieval returns nothing useful. A grounded system says
it does not know; an ungrounded one wearing retrieval as decoration answers
anyway, and the two are indistinguishable on the questions where retrieval
happened to work.

That is the test worth running before trusting the label.
