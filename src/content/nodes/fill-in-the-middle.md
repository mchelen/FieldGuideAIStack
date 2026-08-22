---
title: Fill in the middle
kind: concept
aka:
  - FIM
  - infilling
canonical:
  status: de-facto
  term: Fill in the middle
  body: Bavarian et al. (2022), where the training transformation was described and named
  url: https://arxiv.org/abs/2207.14255
  title: Efficient Training of Language Models to Fill in the Middle — Bavarian et al.
  verifiedOn: 2026-08-22
  note: >-
    Abbreviated FIM throughout the literature and in the special tokens models
    use for it. "Infilling" is the older, more general word for the same
    capability.
tags: [models, capability]
zoom: 3
summary: Generating text given both what precedes and what follows it — the
  capability behind code completion inside an existing file.
fieldMark: An autoregressive model cannot do this natively, because it only
  ever continues. FIM is a data transformation applied during training, not a
  different architecture.
useCase:
  scenario: >-
    A developer puts the cursor in the middle of a function and expects a
    completion that fits what comes after.
  detail: >-
    Plain left-to-right generation sees only the text before the cursor and
    will happily write something that contradicts the lines below. FIM training
    teaches the model to condition on both sides, which is what makes inline
    completion useful rather than merely plausible. Almost every code model
    ships with it for exactly this reason.
relations:
  - type: consumes
    target: autoregressive-model
    note: >-
      A transformation of the training data, not a change to how generation
      works — the model is still producing tokens left to right.
  - type: consumed-by
    target: agentic-coding
    note: The capability behind completion inside an existing file.
examples:
  - name: Efficient Training of Language Models to Fill in the Middle
    url: https://arxiv.org/abs/2207.14255
    note: >-
      "Moves a span of text from the middle of a document to its end", and
      reports no harm to left-to-right capability.
    verifiedOn: 2026-08-22
sources:
  - id: fim-paper
    url: https://arxiv.org/abs/2207.14255
    title: Efficient Training of Language Models to Fill in the Middle — Bavarian et al.
    verifiedOn: 2026-08-22
    note: Submitted 28 July 2022.
---

An [autoregressive model](autoregressive-model) predicts the next
[token](token) from the ones before it. Filling a gap needs the tokens *after*
it too, which the architecture does not provide.

The solution is not architectural. "Autoregressive language models can learn to
infill text after we apply a straightforward transformation to the dataset,
which simply moves a span of text from the middle of a document to its
end."[[cite:fim-paper]]

Rearrange the training data so the "middle" arrives last, and continuing the
sequence *is* filling the gap. The model still only ever continues.

## Why the result was worth a paper

Because the obvious worry is that teaching a model to do this costs it something
elsewhere. The paper's contribution is evidence that it does not: "training
models with a large fraction of data transformed in this way does not harm the
original left-to-right generative capability, as measured by perplexity and
sampling evaluations across a wide range of scales."[[cite:fim-paper]]

A free capability, in other words. That is what made it standard rather than
optional — the paper's own framing is "the usefulness, simplicity, and
efficiency" of training this way.[[cite:fim-paper]]

## Where you meet it

Inline code completion. The cursor sits in the middle of a file, and a
completion that ignores the lines below it is worse than useless — it will
redeclare a variable, contradict a return type, or duplicate what follows.

This is why code models ship FIM and why a chat model used for the same job
performs worse at it than its general ability suggests. The capability is
specific and it was trained in.

## The tell

Special tokens. A FIM-trained model has vocabulary entries marking prefix,
suffix and middle, and the calling convention involves assembling the request in
that order rather than as plain text. Seeing those tokens in a
[tokenizer](tokenizer)'s vocabulary is how you know a model supports it.
