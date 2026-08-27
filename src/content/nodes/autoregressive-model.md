---
title: Autoregressive model
kind: concept
aka:
  - auto-regressive model
  - causal language model
canonical:
  status: de-facto
  term: Auto-regressive model
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google hyphenates; most current writing does not. The term is inherited
    from time-series statistics, where an autoregressive model predicts from
    its own past values, and the meaning carries over exactly.
tags: [models, structure]
zoom: 3
summary: A model that predicts from its own previous predictions — which is
  every current large language model, and the source of several of their
  properties.
fieldMark: Autoregression is why output is serial and why the first token
  commits you. A model cannot revise what it has already emitted, only continue
  from it.
useCase:
  scenario: >-
    A long answer takes ten times as long as a short one, on the same question.
  detail: >-
    Each token is produced from all the tokens before it, including the ones the
    model just produced, so generation cannot be parallelised the way reading
    the prompt can. Output length translates almost directly into wall-clock
    time. The same property explains why asking for the answer first and the
    reasoning after performs worse than the reverse — the answer would be
    committed before the reasoning exists.
flow:
  scenario: >-
    A reply that cannot be revised once written, because each word was
    chosen given the ones already committed.
  path:
    - node: token
      does: >-
        one at a time, appended to what came before
    - node: autoregressive-model
      does: >-
        predicts the next from its own previous predictions
      self: true
    - node: model
      does: >-
        which is every current large language model
    - node: fill-in-the-middle
      does: >-
        and the trick needed to write into a gap instead
  returns: >-
    No going back — a bad early token is now context
relations:
  - type: kind-of
    target: model
    note: A property of how it generates, shared by every current [language model](large-language-model).
  - type: consumes
    target: token
    note: Each one is predicted from the sequence so far, its own output included.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "All Transformer-based large language models are auto-regressive", in
      contrast with GAN-based image models that generate in one pass.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

An autoregressive model is "a model that infers a prediction based on its own
previous predictions. For example, auto-regressive language models predict the
next token based on the previously predicted tokens." Google adds the scope:
"all Transformer-based large language models are
auto-regressive."[[cite:google-glossary]]

The contrast makes it concrete. GAN-based image models "generate an image in a
single forward-pass and not iteratively in steps", and are therefore not
autoregressive.[[cite:google-glossary]] Language models are, and a surprising
amount follows from it.

## What follows

**Generation is serial.** Reading the prompt can be done in parallel — that is
[attention](attention)'s whole advantage — but producing output cannot, because
token *n+1* depends on token *n*. This is why
[throughput](throughput) is measured per token and why a long answer costs
proportional time.

**There is no revision.** Once a token is emitted it is in the context and
everything after is conditioned on it. The model cannot go back, which is why
[chain-of-thought prompting](chain-of-thought-prompting) works at all — writing
the reasoning first is the only way to have it available before committing to
an answer — and why [tree of thoughts](tree-of-thoughts) had to add backtracking
externally.

**The first token matters disproportionately.** A poor opening constrains
everything after it, and the model will continue in the direction it started
rather than contradict itself.

## Why the alternative matters less than it sounds

Non-autoregressive generation — producing a whole sequence at once, or filling
in gaps — exists and is used, notably in
[fill-in-the-middle](fill-in-the-middle) training. But the dominant mode is
left-to-right, and the properties above are the ones a practitioner meets.

The [encoder and decoder](encoder-and-decoder) distinction is the related
architectural question: decoder-only models are the autoregressive ones, and
they are what nearly all current language models are.
