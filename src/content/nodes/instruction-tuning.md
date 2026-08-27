---
title: Instruction tuning
kind: concept
aka:
  - instruction fine-tuning
  - SFT on instructions
canonical:
  status: de-facto
  term: Instruction tuning
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [training]
zoom: 2
summary: Fine-tuning whose task is following instructions in general, rather
  than doing one job — the step that turns a text continuation engine into
  something you can ask for things.
fieldMark: Open-weight releases usually ship in pairs, a base and an "instruct"
  variant. That suffix is this step, and it is the one you want unless you are
  training your own.
useCase:
  scenario: >-
    You download a [base model](foundation-model), ask it a question, and it replies with three more
    questions instead of an answer.
  detail: >-
    Nothing is broken. A [base model](model) completes documents, and a document that
    starts with a question plausibly continues with related questions. The
    instruct variant of the same weights answers, because it was trained on
    instruction-response pairs until responding became the likely continuation.
    Picking the wrong variant from a model hub is one of the most common first
    mistakes in [self-hosting](self-hosting).
flow:
  scenario: >-
    A base model asked "write a haiku about rain" that returns three more
    prompts about rain instead of a haiku.
  path:
    - actor: An instruction
      where: a person, not a system
      does: >-
        "write a haiku about rain"
    - node: instruction-tuning
      where: a training cluster
      does: >-
        fine-tuning on following instructions in general, not one task
      self: true
    - node: fine-tuning
      where: a training cluster
      does: >-
        the mechanism — a second pass on curated examples
    - node: post-training
      where: a training cluster
      does: >-
        the stage it belongs to, usually first in it
  returns: >-
    The difference between a base model and one you can talk to
relations:
  - type: kind-of
    target: fine-tuning
    note: The same mechanism; the task is generalised rather than specific.
  - type: distinguished-from
    target: reinforcement-learning-from-human-feedback
    note: >-
      Instruction tuning imitates a written answer. [RLHF](reinforcement-learning-from-human-feedback) optimises against which
      of several answers people preferred.
examples:
  - name: InstructGPT
    vendor: OpenAI
    url: https://arxiv.org/abs/2203.02155
    note: >-
      The name says it. Instruction-following was the property being trained,
      not any particular task.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A form of fine-tuning that improves a generative AI model's ability to follow instructions.
  - id: instructgpt
    url: https://arxiv.org/abs/2203.02155
    title: Training language models to follow instructions with human feedback — Ouyang et al.
    verifiedOn: 2026-08-22
---

Instruction tuning is "a form of [fine-tuning](fine-tuning) that improves a
[generative AI](generative-ai) model's ability to follow instructions," by
"training a model on a
series of instruction prompts, typically covering a wide variety of
tasks."[[cite:google-glossary]]

The variety is the mechanism. Training on one task produces a model good at that
task. Training on a thousand unrelated tasks, each framed as an instruction,
produces a model that has learned the *shape* of being instructed — and Google's
glossary notes the result: the tuned model "tends to generate useful responses to
zero-shot prompts across a variety of tasks."[[cite:google-glossary]] Including
tasks that were not in the tuning set.

## Why this step is the one that made the technology usable

The capability existed before it. GPT-3 could already do the work given enough
examples in the prompt. What it could not do was recognise a request as a
request.

Instruction tuning closed that gap, and closing it is what made the difference
between a research artifact and a product an ordinary person could use. The
InstructGPT result puts a number on how much it is worth: "outputs from the 1.3B
parameter InstructGPT model are preferred to outputs from the 175B GPT-3,
despite having 100x fewer parameters."[[cite:instructgpt]] That model was tuned
on demonstrations and then further trained against human rankings, so the credit
belongs to [post-training](post-training) as a whole rather than to this step
alone — but a hundred-fold difference in [parameters](parameter) losing to work
that cost a rounding error by comparison is the shape of the finding either
way.

## Base and instruct

This is why a model hub lists two variants of the same weights:

- **Base** — [pretrained](pretraining) only. Continues text. What you start
  from if you intend to do your own post-training.
- **Instruct** (or *chat*, or *it*) — instruction-tuned. Answers when asked.
  What you want if you intend to use the model.

They share an architecture, a [tokenizer](tokenizer) and a parameter count, and
they are not interchangeable in use.
