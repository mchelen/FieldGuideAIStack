---
title: Quantization
kind: concept
aka:
  - weight quantization
  - low-precision inference
canonical:
  status: contested
  body: Google, in the Machine Learning Glossary, which lists three unrelated senses
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google calls it an "overloaded term" and gives three meanings, only one of
    which is the one used in current practice. This guide covers that sense —
    reducing the bits used to store a model's parameters — and flags that the
    word means something else in older machine-learning writing.
tags: [training, runtime]
zoom: 2
summary: Storing a model's weights at lower precision — 4 or 8 bits instead of
  16 — so it fits in less memory and runs faster, at some cost in quality.
fieldMark: Quantization is why the same model appears on a hub in a dozen sizes
  with names like Q4_K_M. The parameter count is identical across all of them;
  only the bits per parameter change.
useCase:
  scenario: >-
    A 70-billion-parameter model needs 140GB at 16 bits and your machine has 48.
  detail: >-
    At 4 bits the same weights need roughly 35GB and the model runs locally.
    Nothing about the architecture or the parameter count changed — each number
    is simply stored less precisely. Whether the quality loss matters is an
    empirical question for your task, and the only honest way to answer it is
    to evaluate both. The alternative is not a better-quality large model; it
    is no local model at all.
flow:
  scenario: >-
    A 14GB model that has to run on a laptop with 8GB of memory to spare,
    without retraining anything.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        have 8GB free and a 14GB model
    - node: parameter
      where: the weights file
      does: >-
        the learned numbers, at 16 bits each
    - node: quantization
      where: the weights file
      does: >-
        stored at 8 or 4 bits instead — the same count, less precision
      self: true
    - node: on-device-inference
      where: your machine
      does: >-
        which is what makes it fit on hardware you own
    - node: distillation
      where: a training cluster
      does: >-
        the other way to shrink one, and a genuinely different model
  returns: >-
    Smaller and faster, at some accuracy you have to measure
relations:
  - type: consumes
    target: parameter
    note: Reduces the bits used to store each one, leaving the count unchanged.
examples:
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: >-
      Published at BF16 — two bytes per parameter, about 14.5GB. Community
      4-bit builds of the same weights land near a quarter of that.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
---

In the sense that matters here, quantization means "reducing the number of bits
used to store a model's parameters." Google's glossary gives the example
directly: parameters stored as 32-bit floating-point numbers converted "from 32
bits down to 4, 8, or 16 bits."[[cite:google-glossary]]

The [parameter](parameter) count does not change. Only the precision of each
number does.

## What it buys, in the vendor's own list

Google records the gains as reduced "compute, memory, disk, and network usage",
reduced "time to infer", and reduced "power consumption" — followed immediately
by the caveat that "quantization sometimes decreases the correctness of a
model's predictions."[[cite:google-glossary]]

That last sentence is doing a lot of work, and it is deliberately vague, because
how much correctness is lost depends on the model, the method and the task in a
way nobody can state in general.

## The arithmetic

Mistral 7B ships at BF16: 7,241,732,096 parameters, two bytes each, about
14.5GB of weight files.[[cite:hf-mistral]] The same weights at 8 bits are near
7GB; at 4 bits, near 3.6GB.

Memory is usually the binding constraint on running a model locally, so halving
the bits does not make a model somewhat cheaper — it decides whether the model
runs on your hardware at all. This is the entire reason local model hosting is
accessible to people without server-grade equipment.

## Not the same as making a smaller model

[Distillation](distillation) trains a new, genuinely smaller model. Quantization
keeps every weight of the original and rounds it. They are frequently confused
because both are pitched as "making the model smaller", and they degrade in
quite different ways: a distilled model is a weaker model, while a heavily
quantized one is the same model getting its own numbers slightly wrong.

## The old meaning

Google lists two other senses — quantile bucketing, and transforming data into
zeroes and ones.[[cite:google-glossary]] Neither is what anyone means by the
word today, but both appear in pre-2020 machine-learning writing, which is worth
knowing before reading an older paper.
