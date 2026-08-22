---
title: Knowledge cutoff
kind: concept
aka:
  - training cutoff
  - training data cutoff
canonical:
  status: contested
  body: Anthropic, which publishes two different cutoffs per model and distinguishes them
  url: https://platform.claude.com/docs/en/about-claude/models/overview
  title: Models overview — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    No glossary carries the term, and the vendor that documents it most
    carefully publishes two dates that are not the same. Anthropic separates
    "reliable knowledge cutoff" — "the date through which a model's knowledge is
    most extensive and reliable" — from "training data cutoff", "the broader
    date range of training data used". Most discussion collapses them.
tags: [models, constraint]
zoom: 2
summary: The date after which a model knows nothing first-hand — and, on closer
  inspection, two dates rather than one.
fieldMark: A model does not know its own cutoff reliably. Asking it is a poor
  way to find out, and it will often answer with a date from its training data
  rather than a fact about itself.
useCase:
  scenario: >-
    A model confidently describes a library's API and the API changed six
    months ago.
  detail: >-
    It is not wrong about what it learned; it is answering from a world that
    stopped. Nothing in the model marks a fact as stale, and no amount of
    prompting makes it aware of what happened afterwards. The fix is to put the
    current documentation in the prompt — retrieval, a fetched page, a pasted
    file — because the alternative is asking it to know something it cannot.
relations:
  - type: part-of
    target: model
    note: Fixed when training ends; no serving-side setting changes it.
  - type: distinguished-from
    target: retrieval-augmented-generation
    note: >-
      Retrieval is how you work around a cutoff, not how you move it. The
      knowledge arrives in the prompt, not in the weights.
examples:
  - name: Claude models overview
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/about-claude/models/overview
    note: >-
      Publishes both a "reliable knowledge cutoff" and a "training data cutoff"
      per model, and they differ.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-models
    url: https://platform.claude.com/docs/en/about-claude/models/overview
    title: Models overview — Claude Platform documentation
    verifiedOn: 2026-08-22
    note: >-
      Dates read from the comparison table on this page. They are per-model and
      change with each release.
---

Everything a [model](model) knows first-hand was in its
[pretraining](pretraining) corpus, and the corpus stopped at some point. After
that date the model has no information — not out-of-date information, none — and
nothing about producing text signals the difference.

## Two dates, not one

Anthropic publishes both, and distinguishes them explicitly: "reliable knowledge
cutoff indicates the date through which a model's knowledge is most extensive
and reliable. Training data cutoff is the broader date range of training data
used."[[cite:anthropic-models]]

The gap is real and can be months. Data from the tail end of the range is
present but thin — a few weeks of coverage rather than years of it, before
anyone had written the follow-ups, corrections and explanations that make a
topic well-represented.

So a model's knowledge does not end at a wall. It thins out, and the earlier
date is where it is still dependable.

## Why the model is a bad witness about it

Asked when its knowledge ends, a model produces a plausible answer rather than a
retrieved fact. It has no privileged access to its own training process, and the
date it offers is often one that appeared frequently in its data.

This matters more than it sounds, because a model that misjudges its own cutoff
will confidently reason about "recent" developments that predate it by a year.
Read the vendor's published figure.[[cite:anthropic-models]]

## What it explains

- **Stale APIs and library versions** — the most common practical failure in
  [agentic coding](agentic-coding).
- **Confident wrongness about events**, since nothing marks the boundary.
- **Why the current date is worth putting in the
  [system prompt](system-prompt)** — the model does not otherwise know what
  today is.

## Why retrieval is the answer and fine-tuning is not

A cutoff is a property of the weights, so moving it means training. Retrieval
does not move it — it sidesteps it, by putting current text in the
[context window](context-window) where the model reads rather than recalls.

That is a better trade in almost every case: an edit takes effect immediately,
the source can be cited, and nothing has to be re-trained when the fact changes
again.
