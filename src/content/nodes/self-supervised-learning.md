---
title: Self-supervised learning
kind: concept
aka:
  - SSL
  - surrogate labels
canonical:
  status: de-facto
  term: Self-supervised learning
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [models, training]
zoom: 3
summary: Learning from unlabelled data by inventing the labels from its own
  structure — the trick that made training on the whole web possible.
fieldMark: The label is always something hidden and then revealed. Next-token
  prediction is self-supervised because the next token was already there; no
  human wrote it down as an answer.
useCase:
  scenario: >-
    Someone asks how a model can be trained on trillions of tokens when nobody
    could possibly have labelled them.
  detail: >-
    Nobody did. The text supplies its own answer: hide the next word and the
    correct label is the word that was already there. That converts an
    unlabelled corpus into a supervised problem with a free, exactly correct
    label for every position — which removes the annotation bottleneck that
    bounded the scale of everything before it.
flow:
  scenario: >-
    A training run over a trillion tokens with nobody labelling anything,
    because the next word is the label.
  path:
    - actor: Unlabelled text
      does: >-
        an enormous amount of it, and no annotators
    - node: self-supervised-learning
      does: >-
        the labels come from the data's own structure
      self: true
    - node: pretraining
      does: >-
        which is this, at the largest scale anyone runs
    - node: fine-tuning
      does: >-
        and where labelled data comes back in, in far smaller amounts
  returns: >-
    Scale became possible because labelling stopped being the bottleneck
relations:
  - type: consumed-by
    target: pretraining
    note: The mechanism that makes pretraining possible without any labelling.
  - type: distinguished-from
    target: fine-tuning
    note: >-
      Fine-tuning uses labels somebody wrote. Self-supervised learning uses
      labels the data already contained.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "Converting an unsupervised machine learning problem into a supervised
      machine learning problem by creating surrogate labels from unlabeled
      examples."
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A family of techniques for converting an unsupervised machine learning problem into a supervised machine learning problem by creating surrogate labels from unlabeled examples.
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
---

Self-supervised learning is "a family of techniques for converting an
unsupervised machine learning problem into a supervised machine learning problem
by creating surrogate labels from unlabeled examples." Google notes that "some
Transformer-based models such as BERT use self-supervised
learning."[[cite:google-glossary]]

*Surrogate labels* is the phrase to hold onto. The labels are real and correct;
they were simply already present in the data rather than added by anyone.

## The trick

Hide part of the input and predict it. For a [language model](large-language-model), hide the next [token](token) — the correct answer is the token that was
there. For an [encoder](tokenizer)-style model like BERT, hide a token in the middle and
predict it from both sides.

Either way the supervision is free, exact, and available at every position of
every document. A trillion-token corpus yields a trillion training examples with
no annotation at all.

## Why this is the unlock

Supervised learning was bounded by labelling. Every example needed a human, so
dataset size was bounded by budget, and model capacity was bounded by dataset
size.

Self-supervision removed the bound. Once the objective supplies its own labels,
the constraint moves to how much text exists and how much compute you can buy —
which is exactly the regime the [scaling laws](scaling-laws) describe, and why
[pretraining](pretraining) could grow the way it did.

The GPT-3 result then showed what the resulting models could do without any
task-specific training at all.[[cite:gpt3-paper]]

## Where the supervision comes back

Everything after pretraining. [Fine-tuning](fine-tuning) needs written examples,
[instruction tuning](instruction-tuning) needs demonstrations, and
[RLHF](reinforcement-learning-from-human-feedback) needs human rankings — all of
them labelled by people, all of them small, and all of them expensive per
example in a way pretraining never was.

The division is exact: capability comes from the free labels, behaviour comes
from the paid ones.
