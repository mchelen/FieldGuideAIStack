---
title: AI slop
kind: concept
aka:
  - generated filler
  - low-quality generated content
canonical:
  status: de-facto
  term: AI slop
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    A vernacular term that a vendor glossary has adopted, which is unusual and
    worth noting — it entered the vocabulary from criticism rather than from
    research or marketing.
tags: [safety, risk]
zoom: 3
summary: Low-quality generated content produced at volume because producing it
  became nearly free — and the training-data problem that follows.
fieldMark: Slop is defined by economics, not by detectability. The tell is
  volume without an author who cared, and the individual piece is often
  unremarkable.
useCase:
  scenario: >-
    A search for a technical question returns nine pages that answer it badly
    in the same shape.
  detail: >-
    Each page is fluent, superficially on-topic, and adds nothing. None of them
    is defective enough to flag individually, which is the point — the failure
    is the ratio, not the artifact. The practical consequence is that finding
    the good source is now the expensive step, and the corpus this material sits
    in is the same corpus the next model trains on.
relations:
  - type: consumed-by
    target: synthetic-data
    note: >-
      The unintended kind. Deliberate synthetic data is curated; slop is scraped
      back in without anyone choosing it.
  - type: distinguished-from
    target: hallucination
    note: >-
      Hallucination is a false claim. Slop can be entirely accurate and still
      worthless, because the problem is that nobody needed it written.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "Output from a generative AI system that favors quantity over quality …
      a web page with AI slop is filled with cheaply produced, AI-generated,
      low-quality content."
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Output from a generative AI system that favors quantity over quality.
  - id: synthetic-survey
    url: https://arxiv.org/abs/2404.07503
    title: Best Practices and Lessons Learned on Synthetic Data — Liu et al.
    verifiedOn: 2026-08-22
---
AI slop is "output from a [generative AI](generative-ai) system that favors
quantity over quality", the example being "a web page with AI slop … filled with
cheaply produced, AI-generated, low-quality content."[[cite:google-glossary]]

The definition is economic rather than technical, and that is the right shape.
Nothing about the output identifies it; what identifies it is that producing it
cost almost nothing and nobody needed it.

## Why it is not the same as hallucination

A [hallucination](hallucination) is a false claim. Slop can be entirely
accurate — a competent, correct, unnecessary summary of something already well
explained.

The failure is at the level of the corpus rather than the artifact. One
mediocre article is unremarkable; ten thousand of them displace the ones worth
reading, and the cost lands on whoever is searching rather than on whoever
published.

## The feedback problem

Models train on the web. The web now contains a large and growing volume of
model output that nobody labelled as such. Successive generations therefore
learn partly from their predecessors, without anyone choosing that arrangement.

The distinction from deliberate [synthetic data](synthetic-data) is entirely in
the curation. The synthetic-data survey stresses "the importance of ensuring its
factuality, fidelity, and unbiasedness"[[cite:synthetic-survey]] — checks that
apply by definition to data someone generated on purpose and by definition do
not apply to material scraped back in unnoticed.

Where the effect goes is not established. What is clear is that the usual
defence — filter for quality — is doing the same job as
[data contamination](data-contamination) detection, on a corpus nobody can see.

## Why detection is the wrong frame

Asking "was this written by a model" is not answerable reliably and is not the
useful question. Plenty of model-assisted writing is good, and plenty of
human-written filler is slop by this definition.

The tractable questions are about origin and effort — which is what
[provenance](provenance) and [watermarking](watermarking) attempt, with the
honest caveat that neither establishes whether something was worth writing.
