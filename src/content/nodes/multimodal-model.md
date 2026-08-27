---
title: Multimodal model
kind: concept
aka:
  - vision-language model
  - VLM
  - omni model
canonical:
  status: de-facto
  term: Multimodal model
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [artifact]
zoom: 2
summary: A model whose inputs, outputs, or both cover more than one modality —
  text and images and audio arriving through the same door.
fieldMark: Ask which direction. A model that reads images and writes text is
  multimodal in, unimodal out, and most products described as multimodal are
  exactly that.
useCase:
  scenario: >-
    A user pastes a screenshot of a stack trace instead of copying the text.
  detail: >-
    A text-only model needs an OCR step in front of it, which loses layout,
    highlighting and everything else the screenshot conveyed. A multimodal model
    takes the image directly, because the image was converted into the same
    token stream the text would have been. This is also what makes browser
    automation and screen understanding possible without a separate vision
    pipeline bolted on.
flow:
  scenario: >-
    A screenshot pasted into a chat window and described, by a system that
    only ever reads tokens.
  path:
    - actor: An image
      does: >-
        pixels, pasted alongside a question about them
    - node: tokenizer
      does: >-
        turns it into tokens too — the model reads nothing else
    - node: multimodal-model
      does: >-
        inputs or outputs covering more than one modality
      self: true
    - node: model
      does: >-
        underneath, the same next-token contract
  returns: >-
    Everything becomes tokens. There is no second mechanism.
relations:
  - type: kind-of
    target: model
    note: Distinguished by what it accepts and emits, not by how it is built.
  - type: consumes
    target: tokenizer
    note: >-
      The tokenizer is where the modalities converge; each input type is
      translated into the same unified space.
examples:
  - name: Gemini
    vendor: Google
    url: https://gemini.google/overview/
    note: >-
      Google describes it as "an interface to a multimodal LLM (handling text,
      audio, images and more)".
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A model whose inputs, outputs, or both include more than one modality.
  - id: google-gemini-app
    url: https://gemini.google/overview/
    title: Gemini app overview — Google
    verifiedOn: 2026-08-22
---

A multimodal model is "a model whose inputs, outputs, or both include more than
one modality."[[cite:google-glossary]] Google's own example is a model taking an
image and a caption and scoring how well they match: "this model's inputs are
multimodal and the output is unimodal."[[cite:google-glossary]]

Keeping the direction straight is most of the clarity here. Reading images and
writing text is the common case, and it is a different capability from
generating images.

## How more than one modality fits in one model

Through the [tokenizer](tokenizer). Google's glossary describes a multimodal
tokenizer translating "input text into subwords and input images into small
patches", then converting all of them "into a single unified embedding space,
which enables the model to 'understand' a stream of multimodal
input."[[cite:google-glossary]]

Once everything is [tokens](token) in one space, the
[transformer](transformer) is indifferent to where they came from. The
architecture did not have to change; the front door did.

## Why it matters for agents

An [agent](agent) that can see is a different thing from one that cannot. Reading
a rendered page, a chart, a design mockup or a screenshot of an error is
ordinary work for a multimodal model and impossible for a text-only one without
a separate pipeline that loses information at every step.

[Browser automation](browser-automation) is the clearest case: the page as
rendered carries layout, emphasis and state that the underlying markup does not
make obvious.

## Reading the claim carefully

"Multimodal" on a product page usually means image input. Audio in, image out,
video in and real-time [streaming](streaming) are separate capabilities that arrive
separately, are priced separately, and are often served by different models
behind one name. Google's own overview describes [Gemini](gemini-app) as "an interface to a
multimodal LLM (handling text, audio, images and more)" — an accurate sentence
that leaves every one of those questions open.[[cite:google-gemini-app]]
