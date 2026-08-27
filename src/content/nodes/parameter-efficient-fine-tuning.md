---
title: Parameter-efficient fine-tuning
kind: concept
aka:
  - PEFT
  - parameter-efficient tuning
  - LoRA
canonical:
  status: de-facto
  term: Parameter-efficient tuning
  body: Google, in the Machine Learning Glossary, which records both forms
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google's entry states that "parameter-efficient tuning is also known as
    parameter-efficient fine-tuning." The abbreviation PEFT is more common in
    practice than either full form.
tags: [training]
zoom: 3
summary: Fine-tuning that freezes almost all of a model's weights and trains a
  small number of new ones — most of the benefit at a fraction of the cost.
fieldMark: The output is a small adapter file, often a few megabytes, not a
  full model. If someone shares "a fine-tune" as a download that would fit on a
  floppy disk, this is what it is.
useCase:
  scenario: >-
    You need forty variants of one model, one per customer, and cannot host
    forty copies of the weights.
  detail: >-
    Full fine-tuning gives you forty complete models to store and serve. PEFT
    gives you one set of base weights and forty small adapters that can be
    swapped at load time, or in some serving stacks per request. The economics
    of per-customer and per-task model customisation rest almost entirely on
    this difference.
flow:
  scenario: >-
    Twenty customer-specific variants of one model, without twenty full
    copies of its weights.
  path:
    - node: fine-tuning
      does: >-
        the goal — a model adapted to one task
    - node: parameter-efficient-fine-tuning
      does: >-
        freeze the base, train a small number of new weights
      self: true
    - node: parameter
      does: >-
        so what is stored per variant is megabytes, not gigabytes
  returns: >-
    One base model, many small adapters beside it
relations:
  - type: kind-of
    target: fine-tuning
    note: The same objective, reached by moving far fewer numbers.
  - type: consumes
    target: parameter
    note: >-
      Freezes the pretrained ones and trains a small number of added ones
      instead.
examples:
  - name: LoRA
    url: https://arxiv.org/abs/2106.09685
    note: >-
      Freezes the pretrained weights and injects trainable rank decomposition
      matrices into each transformer layer. The dominant method in practice.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A set of techniques to fine-tune a large pre-trained language model (PLM) more efficiently than full fine-tuning.
  - id: lora-paper
    url: https://arxiv.org/abs/2106.09685
    title: "LoRA: Low-Rank Adaptation of Large Language Models — Hu et al."
    verifiedOn: 2026-08-22
    quote: >-
      LoRA performs on-par or better than fine-tuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite having fewer trainable parameters, a higher training throughput, and, unlike adapters, no additional inference latency.
    note: Submitted 17 June 2021, last revised 16 October 2021.
---

Parameter-efficient tuning is "a set of techniques to fine-tune a large
pre-trained [language model](large-language-model) more efficiently than full
fine-tuning", tuning "far
fewer parameters than full fine-tuning, yet generally produc[ing] a large
language model that performs as well (or almost as well)."[[cite:google-glossary]]

The claim worth pausing on is the second one. Freezing 99% of a model and
training the remainder is not a compromise that loses most of the benefit — it
recovers close to all of it.

## The problem it was invented for

The LoRA paper is explicit about the economics: "as we pre-train larger models,
full fine-tuning, which retrains all model parameters, becomes less feasible.
Using GPT-3 175B as an example — deploying independent instances of fine-tuned
models, each with 175B parameters, is prohibitively
expensive."[[cite:lora-paper]]

The blocker is not the training run. It is the *deployment*: one fine-tune per
customer, per task or per experiment means one full copy of the weights each.

## How LoRA does it

It "freezes the [pre-trained model](pretrained-model) weights and injects
trainable rank decomposition matrices into each layer of the
[Transformer](transformer) architecture."[[cite:lora-paper]] The original
[parameters](parameter) never move. The adaptation lives in small added
matrices, trained alongside them.

Because the base is untouched, adapters compose with it at load time and can be
swapped without reloading the model. One copy of the weights in memory serves
many adaptations.

## Why it changed who can fine-tune

Full [fine-tuning](fine-tuning) of a mid-sized model needs a cluster; a LoRA
adapter for the same model can be trained on a single consumer [accelerator](accelerator) and
shipped as a file measured in megabytes. That collapse in cost is why fine-tunes
of open-weight models are shared the way plugins are, and why the practice
exists outside well-funded labs at all.
