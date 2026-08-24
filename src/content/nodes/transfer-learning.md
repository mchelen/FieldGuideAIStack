---
title: Transfer learning
kind: concept
aka:
  - knowledge transfer
canonical:
  status: de-facto
  term: Transfer learning
  body: Google, in the Machine Learning Glossary; long-standing in the literature
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    One of the older terms in this guide and carried by three of the surveyed
    glossaries. What changed is scale: transfer used to be a technique among
    others, and is now the default way every applied model gets built.
tags: [models, training]
zoom: 3
summary: Reusing what a model learned on one task to do better on another — the
  assumption underneath the entire foundation-model economy.
fieldMark: Every time someone fine-tunes rather than trains from scratch, this
  is the bet being made. It is so routine now that the name has almost
  disappeared from practice.
useCase:
  scenario: >-
    A classifier is needed for a domain with four hundred labelled examples.
  detail: >-
    Four hundred examples is nowhere near enough to learn language from
    scratch, and it is ample to adapt a model that already has. What transfers
    is everything general — grammar, world knowledge, the shape of reasoning —
    learned from a corpus that had nothing to do with the domain. That
    asymmetry is why small datasets became useful, and it is the reason most
    applied machine learning stopped starting from zero.
relations:
  - type: consumed-by
    target: fine-tuning
    note: Fine-tuning is transfer learning's dominant form, under a different name.
  - type: consumes
    target: pretraining
    note: The general phase is what there is to transfer from.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "Transferring information from one machine learning task to another …
      from a task where there is more data to one where there is less data."
    verifiedOn: 2026-08-22
  - name: LoRA
    url: https://arxiv.org/abs/2106.09685
    note: >-
      Frames the paradigm directly: "large-scale pre-training on general domain
      data and adaptation to particular tasks or domains".
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Transferring information from one machine learning task to another.
  - id: lora-paper
    url: https://arxiv.org/abs/2106.09685
    title: "LoRA: Low-Rank Adaptation of Large Language Models — Hu et al."
    verifiedOn: 2026-08-22
---

Transfer learning is "transferring information from one machine learning task to
another", which "might involve transferring knowledge from the solution of a
simpler task to a more complex one, or … from a task where there is more data to
one where there is less data."[[cite:google-glossary]]

Google's framing of why it mattered is worth keeping: "most machine learning
systems solve a single task."[[cite:google-glossary]] That was the normal state
of affairs, and transfer was the exception.

## It is now the default

The LoRA paper states the modern paradigm in one sentence: "an important
paradigm of natural language processing consists of large-scale pre-training on
general domain data and adaptation to particular tasks or
domains."[[cite:lora-paper]]

Read that as a claim about economics. The expensive, general phase is done once
by someone with a cluster; the cheap, specific phase is done many times by
everyone else. [Foundation models](foundation-model) are that arrangement given
a name, and transfer learning is the assumption that makes it work.

## What actually transfers

Not the task. The representations — how language is structured, what words
relate to what, the shape of an argument, the syntax of a dozen programming
languages. None of it was learned for your task and nearly all of it applies.

This is why a few hundred examples suffice for
[fine-tuning](fine-tuning) when millions would be needed from scratch. You are
not teaching the model to read; you are pointing something that already reads at
a particular job.

## Where it does not

Transfer is not free and not universal. A target domain far from the training
distribution transfers poorly, and the failure is quiet — the model produces
fluent output in the right shape and is simply worse than its confidence
suggests.

The general rule of thumb: the more the target resembles something in
[pretraining](pretraining), the better transfer works, and the less anyone
notices when it does not.
