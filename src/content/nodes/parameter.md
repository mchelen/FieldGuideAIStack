---
title: Parameter
kind: concept
aka:
  - weight
  - weights and biases
canonical:
  status: de-facto
  term: Parameter
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Marked a fundamentals term in Google's glossary and used identically across
    the field. The contrast that matters is with hyperparameter, not with any
    rival name.
tags: [core, artifact]
zoom: 2
summary: One of the learned numbers inside a model. The count is the headline
  spec, and it is what "7B" or "70B" in a model's name refers to.
fieldMark: Parameter count times bytes per parameter gives the download size,
  near enough. A 7B model at 16 bits is about 14GB — if the numbers do not
  reconcile, the weights are quantized.
useCase:
  scenario: >-
    You want to run a model on a laptop with 16GB of memory and need to know
    which ones are even candidates.
  detail: >-
    Parameter count sets the floor. Mistral 7B publishes 7,241,732,096
    parameters stored at 16 bits, and its weight files total about 14.5GB —
    which will not leave room for anything else on that machine. The same model
    quantized to 4 bits lands near 4GB and fits comfortably. Reading the
    parameter count first tells you which question you are actually asking.
relations:
  - type: part-of
    target: model
    note: The learned numbers are the model's content; the architecture is its shape.
  - type: distinguished-from
    target: temperature
    note: >-
      Parameters are learned during training. Temperature is a hyperparameter
      supplied per call and never appears in the weight files.
examples:
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: >-
      The model card publishes 7,241,732,096 BF16 parameters and about 14.5GB
      of weight files — two bytes per parameter.
    verifiedOn: 2026-08-22
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: 175 billion parameters, the paper that made the count a headline number.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The weights and biases that a model learns during training.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
    note: >-
      Figures read from the model card and the tensor summary on that page:
      7,241,732,096 BF16 parameters, 14,483,523,165 bytes of weight files.
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
    note: Submitted 28 May 2020. The GPT-3 paper.
---

Parameters are "the weights and biases that a model learns during
training."[[cite:google-glossary]] They are the entire learned content of a
[model](model) — what remains when training stops and what you are downloading
when you download [open weights](open-weights).

## Why the count is the headline number

It is the only spec that is both public and comparable. Architecture details
vary, training data is usually undisclosed, and benchmark scores move; the
parameter count is a single integer that everyone reports. The GPT-3 paper made
it a headline by scaling to 175 billion and showing that capability arrived with
scale.[[cite:gpt3-paper]]

It is also a poor proxy for quality, and increasingly so. A well-trained smaller
model routinely beats a badly-trained larger one, and mixture-of-experts designs
report a total count far above the number actually used per token. The figure
tells you what a model *costs to run*, more reliably than what it can do.

## Parameters and the file on disk

The arithmetic is direct, which makes it a useful sanity check. Mistral 7B
declares 7,241,732,096 parameters at BF16 — 16 bits, two bytes each — and
weight files totalling 14,483,523,165 bytes.[[cite:hf-mistral]] Two bytes per
parameter, with nothing else of significance in the file.

Halving the bits per parameter halves the download and roughly halves the memory
needed to serve it. That trade is the whole of quantization, and it is why the
same model appears in a dozen sizes on a model hub.

## Not to be confused with hyperparameters

Google's glossary draws the line explicitly: hyperparameters "are the values that
you (or a hyperparameter tuning service) supply to the model," learning rate
being the example.[[cite:google-glossary]] Anything you can change at call time —
[temperature](temperature) among them — is on that side of the line. Parameters
are fixed the moment training ends.
