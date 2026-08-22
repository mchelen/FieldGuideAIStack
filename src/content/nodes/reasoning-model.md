---
title: Reasoning model
kind: concept
aka:
  - RLM
  - large reasoning model
  - thinking model
canonical:
  status: contested
  body: Wikipedia, which records both "reasoning language model" and "large reasoning model" in use
  url: https://en.wikipedia.org/wiki/Reasoning_language_model
  title: Reasoning language model — Wikipedia
  verifiedOn: 2026-08-22
  note: >-
    No glossary among those surveyed defines it and vendors each brand it
    differently — thinking, reasoning, extended thinking. The mechanism is
    agreed; the name is not, and "reasoning" imports a claim about what the
    model is doing that the mechanism does not settle.
tags: [artifact]
zoom: 2
summary: A model trained to work through a problem in steps before answering,
  spending compute at answer time as a way to get further than a single pass
  would.
fieldMark: The tell is a visible or billed "thinking" phase before the answer.
  Those intermediate tokens are generated, charged for, and usually discarded.
useCase:
  scenario: >-
    A model gets a multi-step arithmetic or planning question wrong in one pass
    and right when asked to show its working.
  detail: >-
    Producing an answer token by token gives the model no scratch space. Writing
    the intermediate steps out gives it one, since each step becomes context for
    the next. A reasoning model does this by default rather than on request,
    having been trained to. The cost is latency and tokens; the gain shows up on
    exactly the tasks where the first token commits you to an answer you have
    not worked out yet.
relations:
  - type: kind-of
    target: model
    note: Distinguished by post-training and by how it spends compute at answer time.
  - type: consumes
    target: test-time-compute
    note: Spending more at answer time is the mechanism, not a side effect.
examples:
  - name: Chain-of-thought prompting
    url: https://arxiv.org/abs/2201.11903
    note: >-
      The prompting technique that showed step-by-step working improves
      reasoning, before it was trained in rather than asked for.
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-rlm
    url: https://en.wikipedia.org/wiki/Reasoning_language_model
    title: Reasoning language model — Wikipedia
    verifiedOn: 2026-08-22
  - id: cot-paper
    url: https://arxiv.org/abs/2201.11903
    title: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al.
    verifiedOn: 2026-08-22
    note: Submitted 28 January 2022, last revised 10 January 2023.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

Reasoning language models are "large language models that are trained further to
solve tasks that take several steps of reasoning." They "tend to do better on
logic, math, and programming tasks than standard LLMs, can revisit and revise
earlier steps, and make use of extra computation while answering as another way
to scale performance, alongside the number of training examples, parameters, and
training compute."[[cite:wikipedia-rlm]]

The last clause is the significant one. Training-time scale was the only dial
for years. This is a second one.

## The prompting result that became a training target

[Chain-of-thought prompting](chain-of-thought-prompting) showed that "generating
a chain of thought — a series of intermediate reasoning steps — significantly
improves the ability of large language models to perform complex reasoning",
elicited by putting a few worked examples in the prompt.[[cite:cot-paper]]
Google's glossary describes the same technique as encouraging a model "to
explain its reasoning, step by step."[[cite:google-glossary]]

A reasoning model is what happens when that behaviour is trained in rather than
requested. The scratch space is not an instruction you supply; it is what the
model does.

## Why the name is contested

"Reasoning" describes what the output looks like. Whether the intermediate
tokens are the model's actual process, or a plausible narrative generated
alongside it, is not something the mechanism settles — and the visible trace is
not evidence either way, because producing convincing text is exactly what these
systems do.

Vendors hedge with their own words: thinking, extended thinking, reasoning
effort. This guide uses the term the field uses and notes that it carries a
claim the evidence does not.

## What it costs

Intermediate tokens are real [tokens](token): generated serially, billed, and
counted against the [context window](context-window). A reasoning model is
slower and more expensive per answer by design.

That makes it a routing decision rather than a default. Extraction,
classification and formatting gain nothing from a thinking phase; multi-step
planning, debugging and mathematics gain a great deal.
