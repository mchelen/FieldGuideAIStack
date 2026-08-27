---
title: Distillation
kind: concept
aka:
  - knowledge distillation
  - teacher-student training
canonical:
  status: de-facto
  term: Distillation
  body: Google, in the Machine Learning Glossary; introduced as knowledge distillation by Hinton, Vinyals and Dean (2015)
  url: https://arxiv.org/abs/1503.02531
  title: Distilling the Knowledge in a Neural Network — Hinton, Vinyals and Dean
  verifiedOn: 2026-08-22
tags: [training]
zoom: 3
summary: Training a small model to imitate a large one's outputs, keeping much
  of the behaviour at a fraction of the size and cost.
fieldMark: The "mini", "flash" and "haiku" tier of a model family is usually a
  distilled sibling rather than an independently trained model. That is why the
  small tier tends to share the large one's habits.
useCase:
  scenario: >-
    A classification step runs on every request and the frontier model that does
    it well is too slow and too expensive to keep there.
  detail: >-
    Use the large model to label a corpus of real traffic, then train a small
    model on its outputs. The small model inherits the large one's judgment for
    this narrow job while costing a fraction to run — a trade that works
    precisely because the task is narrow. The student does not become generally
    capable; it becomes a cheap imitation on the distribution it was shown.
relations:
  - type: consumes
    target: model
    note: Two of them — a teacher whose outputs are the training signal, and a student learning to match.
  - type: distinguished-from
    target: quantization
    note: >-
      Both shrink a model. [Quantization](quantization) stores the same weights less precisely;
      distillation trains a different, smaller set of weights.
examples:
  - name: Distilling the Knowledge in a Neural Network
    url: https://arxiv.org/abs/1503.02531
    note: >-
      The 2015 paper that established the technique, framed as compressing an
      ensemble into a single deployable model.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The process of reducing the size of one model (known as the teacher ) into a smaller model (known as the student ) that emulates the original model's predictions as faithfully as possible.
  - id: hinton-distillation
    url: https://arxiv.org/abs/1503.02531
    title: Distilling the Knowledge in a Neural Network — Hinton, Vinyals and Dean
    verifiedOn: 2026-08-22
    note: Submitted 9 March 2015.
---

Distillation is "the process of reducing the size of one model (known as the
*teacher*) into a smaller model (known as the *student*) that emulates the
original model's predictions as faithfully as possible."[[cite:google-glossary]]

The student is trained to minimise the difference between its outputs and the
teacher's — not to match the original training labels. It is learning from
another model rather than from the world.

## Why imitating a model beats training on the data

The teacher's output carries more information than a label does. A label says
"cat". A teacher's distribution says "cat, and mildly plausible as a lynx, and
not remotely a car" — a shape that took the teacher a full training run to
learn, handed over for free.

The original 2015 work framed this as a deployment problem: ensembles predict
well but "making predictions using a whole ensemble of models is cumbersome and
may be too computationally expensive to allow deployment to a large number of
users."[[cite:hinton-distillation]] Compressing that knowledge into one
deployable model was the goal, and the goal has not changed.

## The trade

Google's glossary states it plainly: the benefits are "faster inference time"
and "reduced memory and energy usage", while "the student's predictions are
typically not as good as the teacher's."[[cite:google-glossary]]

There is no free lunch, only a favourable exchange rate. On a narrow task the
gap can be small enough to be invisible; across everything the teacher can do,
it is not.

## Where you meet it

Small tiers of a model family are commonly distilled from the large one, which
is why they share a voice and a formatting habit with their larger siblings.
It is also the mechanism behind an ongoing dispute in the field: training a
model on another vendor's outputs is distillation, and most
[inference API](inference-api) terms of service prohibit it.
