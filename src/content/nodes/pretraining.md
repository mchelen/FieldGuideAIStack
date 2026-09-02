---
title: Pretraining
kind: concept
aka:
  - pre-training
  - base training
canonical:
  status: de-facto
  term: Pre-training
  body: Google, in the Machine Learning Glossary, as the first stage of the training sequence
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Written both ways. Google hyphenates; most vendor documentation does not.
    Nothing turns on the choice.
tags: [training]
zoom: 2
summary: The first and by far the most expensive training pass — a model
  learning language from an enormous general corpus, with no task in mind.
fieldMark: Pretraining is what costs the money and what nobody outside the lab
  repeats. If a company says it "trained its own model" on its own documents,
  it almost certainly fine-tuned someone else's.
useCase:
  scenario: >-
    A team is deciding whether to train a model on its industry's literature or
    to adapt an existing one.
  detail: >-
    Pretraining from scratch means acquiring a corpus measured in trillions of
    tokens, renting a cluster for weeks, and having no working model until the
    end. Adapting an existing model means hundreds or thousands of examples and
    an afternoon. The general language ability the team wants was learned from
    text that has nothing to do with their industry, which is precisely why
    they do not have to pay for it again.
flow:
  scenario: >-
    A model is said to have cost tens of millions of dollars, and almost all
    of that number is one training pass.
  path:
    - actor: A corpus
      where: a training cluster
      does: >-
        an enormous general collection of text
    - node: pretraining
      where: a training cluster
      does: >-
        the first and by far the most expensive pass
      self: true
    - node: self-supervised-learning
      where: a training cluster
      does: >-
        no labels — the next token is the label
    - node: foundation-model
      where: the weights file
      does: >-
        the artifact that comes out, general and not yet aimed
    - node: post-training
      where: a training cluster
      does: >-
        what makes it answer questions instead of continuing text
  returns: >-
    Everything after this is cheap by comparison
relations:
  - type: consumed-by
    target: foundation-model
    note: >-
      Broad data and no target task is exactly what makes a model a foundation
      rather than a tool.
  - type: consumes
    target: token
    note: Corpora are measured in trillions of them, and cost scales with the count.
examples:
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: >-
      Pretrained on a broad corpus and then shown to perform tasks it was never
      trained for, from the prompt alone.
    verifiedOn: 2026-08-22
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: Published as a pretrained base model, before any instruction tuning.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The initial training of a model on a large dataset.
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
    quote: >-
      For all tasks, GPT-3 is applied without any gradient updates or fine-tuning, with tasks and few-shot demonstrations specified purely via text interaction with the model.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
    quote: >-
      The Mistral-7B-v0.1 Large Language Model (LLM) is a pretrained generative text model with 7 billion parameters
---

Google's glossary describes the training sequence in two steps, and pretraining
is the first: "train a [large language model](large-language-model) on a vast
general dataset, such as
all the English language Wikipedia pages."[[cite:google-glossary]] No task, no
labels, no intended application.

## What is actually being learned

The objective is trivial to state: predict the next [token](token). Given
enough text, that one objective forces the model to internalise grammar, facts,
idiom, code syntax, argument structure and a great deal else, because all of
them help with the prediction.

Nothing supervises this. There are no human labels, because the text supplies
its own answer — the next token is right there. That is what makes it possible
to train on a corpus far larger than anyone could annotate, and the scale is
where the capability comes from.

## Why it is the expensive half

Pretraining is measured in trillions of tokens and thousands of [accelerator](accelerator)-days.
Everything after it — [fine-tuning](fine-tuning), [alignment](post-training), safety work — is
orders of magnitude cheaper, and works precisely because the hard part is
already done.

This asymmetry shapes the whole industry. A handful of organisations pretrain; a
very large number adapt. When a [foundation model](foundation-model) is released
with [open weights](open-weights), what is being given away is the pretraining
run.[[cite:hf-mistral]]

## What a [pretrained model](pretrained-model) is like

Not a chatbot. A raw pretrained model continues text rather than answering it —
ask it a question and a plausible continuation is another question, because
that is what documents containing questions tend to look like.

GPT-3 demonstrated that the ability was there and only needed drawing out: the
model performed tasks it had never been trained on, given a few examples in the
prompt.[[cite:gpt3-paper]] Turning that latent ability into something that
reliably answers when asked is the job of everything that comes next.
