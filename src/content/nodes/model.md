---
title: Model
aka: [foundation model, base model, LLM, weights]
canonical:
  status: de-facto
  term: Model
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google defines it generally — "the set of parameters and structure needed
    for a system to make predictions" — which is precise and much broader than
    product usage. In marketing, "model" routinely names the artifact, the API
    and the whole product; keeping the narrow sense is what makes the rest of
    this guide's distinctions possible.
tags: [core, artifact]
zoom: 1
summary: The trained artifact itself — an architecture plus a set of learned
  weights that maps input tokens to output token probabilities. Nothing more.
fieldMark: A model has a name and a version, a parameter count, and a file size.
  It has no memory, no tools, and no opinion about how it is called. If the thing
  you are looking at can read a file or run a command, you are looking at a
  harness, not a model.
useCase:
  scenario: >-
    Someone asks whether a model can read their files.
  detail: >-
    No model can. A model maps input tokens to output token probabilities and
    has no way to reach anything — reading files is a tool the harness offers
    and executes. The question is almost always really about a product, and
    separating the two is the single most useful move available when reasoning
    about what any of this can do.
relations:
  - type: distinguished-from
    target: harness
    note: The model predicts tokens; the harness decides what to do with them.
  - type: distinguished-from
    target: model-provider
    note: Claude is a model. Anthropic is the provider that trained it.
sources:
  - id: anthropic-claude-api
    url: https://platform.claude.com/docs/en/api/overview
    title: Claude API overview — Anthropic
    verifiedOn: 2026-08-22
---

A model is a **file**, or more precisely a set of them: an architecture
definition and the billions of learned parameters that fill it. Given a
sequence of tokens, it returns a probability distribution over the next token.
That is the entire contract.

Everything else you associate with "using an AI" — that it remembers your last
message, that it can search the web, that it stops and asks before deleting a
file — is supplied by software wrapped around the model. Keeping this boundary
sharp is the single most useful move in learning the stack, because almost every
other term in this guide is defined by which side of it the thing sits on.

## Why the confusion is so common

Products are marketed by model name. "Claude wrote my tests" and "GPT reviewed
my PR" both name the model but describe the work of a [harness](harness). The
model contributed judgment; the harness contributed the file system, the loop,
and the permission prompt.

## What varies between models

- **Parameter count and architecture** — capacity and shape.
- **[Context window](context-window)** — how much input it can attend to at
  once.
- **[Training cutoff](knowledge-cutoff)** — the date after which it knows
  nothing first-hand.
- **Modality** — text, images, audio in and out.
- **Release terms** — whether you can download the weights at all, and under
  what license. See [open weights](open-weights).