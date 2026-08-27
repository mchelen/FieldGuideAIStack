---
title: Autorater evaluation
kind: concept
aka:
  - autorater
  - trained grader
canonical:
  status: de-facto
  term: Autorater evaluation
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google's term, and largely Google's alone — most practitioners say
    "LLM-as-a-judge" for anything model-graded and do not draw the distinction.
    It is worth keeping, because a trained rater and a prompted one differ in
    exactly the way that matters for accuracy.
tags: [evaluation, technique]
zoom: 3
summary: Automated scoring by a model trained on human ratings — human judgment
  compressed into something that runs on everything.
fieldMark: The distinguishing feature is training data. If nobody produced
  human labels for the task, it is a judge with a prompt, whatever it is called.
useCase:
  scenario: >-
    A judge model's scores correlate only loosely with what your reviewers
    actually think is good.
  detail: >-
    A general model brings general taste, and your task may not want it. Having
    reviewers rate a few hundred outputs and [fine-tuning](fine-tuning) a rater on those labels
    produces an instrument calibrated to your standard rather than to the
    internet's. It costs a labelling exercise and pays back on every subsequent
    [evaluation](evaluation) run, which makes it worth doing exactly when evaluation is
    continuous rather than occasional.
relations:
  - type: kind-of
    target: evaluation
    note: An automated method, distinguished by being trained rather than prompted.
  - type: consumes
    target: fine-tuning
    note: The rater is fine-tuned on human ratings, which is what makes it an autorater.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "An ML model trained on data created by human evaluation. Ideally, an
      autorater learns to mimic a human evaluator."
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A hybrid mechanism for judging the quality of a generative AI model's output that combines human evaluation with automatic evaluation.
  - id: judge-paper
    url: https://arxiv.org/abs/2306.05685
    title: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena — Zheng et al.
    verifiedOn: 2026-08-22
---
Autorater evaluation is "a hybrid mechanism for judging the quality of a
[generative AI](generative-ai) model's output that combines human evaluation
with automatic evaluation. An autorater is an ML model trained on data created
by human evaluation. Ideally, an autorater learns to mimic a human
evaluator."[[cite:google-glossary]]

Hybrid is the operative word, and Google's own note clarifies where the human
went: "a running autorater is a fully automated process; humans 'only' provide
data that helps train an autorater."[[cite:google-glossary]]

## The trade being made

Human evaluation is accurate and does not scale. Automatic evaluation scales and
is not accurate. An autorater spends human effort once, on labels, and gets an
automated instrument that approximates that judgment thereafter.

It is the same move as [distillation](distillation), applied to taste rather
than to capability: expensive judgment compressed into something cheap enough to
run continuously.

## Prebuilt versus fitted

Google notes both exist, and which is better: "prebuilt autoraters are
available, but the best autoraters are fine-tuned specifically to the task you
are evaluating."[[cite:google-glossary]]

That is the expected result, and it is the argument for building one. A general
rater encodes general preferences; a task-specific one encodes yours, including
the parts of your standard nobody has written down.

## When it is worth the labelling

Rarely for a one-off comparison — [LLM-as-a-judge](llm-as-a-judge) is available
immediately and often good enough, with the biases the judge paper
documents.[[cite:judge-paper]]

Usually for continuous evaluation, where the rater runs on every change for
months and the labelling cost amortises. The signal that it is time is a judge
whose scores keep disagreeing with your reviewers in a consistent direction:
that disagreement is exactly what training on your labels would fix.

## What it inherits

Whatever the human labels contained, including their inconsistencies. An
autorater trained on ratings that three reviewers disagreed about learns the
average of a disagreement, and reports it with unwarranted steadiness.
