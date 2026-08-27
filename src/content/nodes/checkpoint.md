---
title: Checkpoint
kind: concept
aka:
  - model snapshot
  - weights file
canonical:
  status: de-facto
  term: Checkpoint
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [training, artifact]
zoom: 3
summary: A saved snapshot of a model's parameters — what training writes out
  periodically, and what "downloading a model" actually downloads.
fieldMark: A version suffix on a model name, or a directory of
  `model-00001-of-00004.safetensors` files, is a checkpoint. A model version is
  a checkpoint someone decided to publish.
useCase:
  scenario: >-
    A training run fails eleven days in, on borrowed cluster time.
  detail: >-
    With checkpoints written every few hours, the loss is a few hours of
    compute; without them, it is eleven days. At the scale of a pretraining run
    — thousands of accelerators, weeks of wall-clock time, hardware failures
    expected rather than exceptional — checkpointing is not a convenience but
    the thing that makes the run finishable at all.
flow:
  scenario: >-
    A model name with a date after it, and a question about which exact set
    of numbers is being served.
  path:
    - actor: A training run
      does: >-
        long, and saved periodically as it goes
    - node: checkpoint
      does: >-
        one saved set of weights, at one point in that run
      self: true
    - node: parameter
      does: >-
        the numbers themselves, at that moment
    - node: model-card
      does: >-
        which should say which one you are actually getting
  returns: >-
    "The model" is usually one of many saved states
relations:
  - type: contains
    target: parameter
    note: The serialised parameters, plus enough optimiser state to resume from.
examples:
  - name: Mistral 7B weight files
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: >-
      Sharded safetensors files totalling 14,483,523,165 bytes — a published
      checkpoint, distributed as several files.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Data that captures the state of a model's parameters either during training or after training is completed.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
---

A checkpoint is "data that captures the state of a model's parameters either
during training or after training is completed."[[cite:google-glossary]] Google's
glossary describes the loop it exists for: stop training, capture the
checkpoint, "later, reload the checkpoint, possibly on different hardware,
restart training."[[cite:google-glossary]]

## Two jobs, one artifact

**During training**, checkpoints are insurance. A run measured in weeks across
thousands of accelerators will lose nodes, and resuming from four hours ago is
survivable where restarting is not.

**After training**, the final checkpoint is the deliverable. It is what gets
evaluated, versioned, published and served — the file the whole
[pretraining](pretraining) run existed to produce.

## Why this is the right word for "a model"

[Model](model) is used loosely for the architecture, the product, the vendor's
API and the file. Checkpoint names only the last of those precisely: this set of
[parameters](parameter), at this point in training.

That precision matters when versions move. The `v0.1` in
`mistralai/Mistral-7B-v0.1` is not decoration: it identifies which checkpoint,
and a later version under the same name would be a different set of numbers in
the same architecture.[[cite:hf-mistral]] A published model release is a
checkpoint someone chose to freeze.

## What is inside

The [parameters](parameter), serialised — plus, for a training checkpoint, the
optimiser state needed to resume, which can be several times larger than the
weights themselves. A checkpoint published for inference is usually stripped of
that, which is why a downloadable model is smaller than what the training run
was writing.
