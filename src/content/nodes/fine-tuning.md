---
title: Fine-tuning
kind: concept
aka:
  - supervised fine-tuning
  - SFT
canonical:
  status: de-facto
  term: Fine-tuning
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [training, core]
zoom: 2
summary: A second training pass on an already-trained model, using a much
  smaller set of task-specific examples to move its weights toward one job.
fieldMark: Fine-tuning changes the weights; prompting does not. If the change
  survives a restart with an empty prompt, it was training. If it disappears,
  it was context.
useCase:
  scenario: >-
    A team wants a model that always returns their exact JSON schema, and
    prompting gets it right nine times in ten.
  detail: >-
    A few hundred examples of correct output will usually close that gap, where
    a longer prompt will not — format compliance is the classic case where
    fine-tuning beats instruction. The trade is that the behaviour is now baked
    into a model artifact that has to be versioned, evaluated and re-made
    whenever the [base model](model) moves, whereas a prompt is a string you can edit.
    Try the prompt first; reach for fine-tuning when the failures are about
    form rather than knowledge.
flow:
  scenario: >-
    A model that gets the task right but never in the format the downstream
    system needs, on a few thousand examples.
  path:
    - node: pretrained-model
      where: a training cluster
      does: >-
        the starting point — someone else's expensive training run
    - node: fine-tuning
      where: a training cluster
      does: >-
        a second pass, on a much smaller set of task-specific examples
      self: true
    - node: parameter-efficient-fine-tuning
      where: a training cluster
      does: >-
        usually this, so the base weights are never copied
    - node: parameter
      where: the weights file
      does: >-
        what actually changes, and how much of it
  returns: >-
    A dataset and a model to maintain, forever
relations:
  - type: consumes
    target: parameter
    note: Full fine-tuning updates every one of them, which is what makes it expensive.
  - type: distinguished-from
    target: distillation
    note: >-
      Fine-tuning specialises one model. [Distillation](distillation) trains a smaller model to
      imitate a larger one — different goal, different artifact.
examples:
  - name: InstructGPT
    vendor: OpenAI
    url: https://arxiv.org/abs/2203.02155
    note: Supervised fine-tuning on labeler demonstrations as the first post-training stage.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A second, task-specific training pass performed on a pre-trained model to refine its parameters for a specific use case.
  - id: instructgpt
    url: https://arxiv.org/abs/2203.02155
    title: Training language models to follow instructions with human feedback — Ouyang et al.
    verifiedOn: 2026-08-22
    quote: >-
      In this paper, we show an avenue for aligning language models with user intent on a wide range of tasks by fine-tuning with human feedback.
---
Fine-tuning is "a second, task-specific training pass performed on a [pre-
trained model](pretrained-model) to refine its parameters for a specific use
case," and it "typically involves hundreds or thousands of examples focused on
the specific task."[[cite:google-glossary]]

The ratio is the point. [Pretraining](pretraining) needs trillions of
[tokens](token); fine-tuning needs a spreadsheet. Everything general was already
learned, and the second pass only has to point it somewhere.

## What it is good at, and what it is not

Fine-tuning reliably teaches **form**: output shape, tone, house style, domain
vocabulary, a consistent refusal policy.

It teaches **facts** unreliably. A few hundred examples of correct answers about
your product does not install those answers so much as make the model more
willing to produce confident-sounding text in that shape. For knowledge, putting
the document in the [context window](context-window) beats training on it, and
does so at a fraction of the cost.

## Fine-tuning versus prompting

The honest default is to prompt first. A prompt is editable, inspectable,
versionable as text, and free to change. A fine-tuned model is an artifact: it
has to be trained, evaluated, hosted, and re-made every time the [base
model](foundation-model) is
replaced — which for a hosted [model provider](model-provider) may be sooner
than you would like.

Fine-tuning earns its cost when the prompt needed to get the behaviour is long
enough to be expensive on every call, or when the behaviour is a matter of
consistency that instructions keep failing to enforce.

## Where it sits in the pipeline

Supervised fine-tuning is the first stage of
[post-training](post-training).[[cite:instructgpt]] The same mechanism appears
again as [instruction tuning](instruction-tuning), where the task being trained
is following instructions in general, and again in cheaper form as
[parameter-efficient fine-tuning](parameter-efficient-fine-tuning), which
freezes most of the model instead of moving all of it.
