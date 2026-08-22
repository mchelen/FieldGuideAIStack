---
title: Watermarking
kind: concept
aka:
  - content watermarking
  - statistical watermarking
canonical:
  status: none
  note: >-
    No standard and no interoperability. Each vendor's watermark is detectable
    only by that vendor's tool, which makes the capability real and the
    ecosystem-level guarantee absent. C2PA standardises provenance metadata;
    nothing standardises the mark inside the content.
tags: [openness, safety]
zoom: 3
summary: Marking generated content so it can later be identified — embedded in
  the content itself rather than attached as metadata.
fieldMark: Ask who can detect it. A watermark only one company can read
  identifies content for that company, which is a much narrower guarantee than
  it sounds like.
useCase:
  scenario: >-
    A platform wants to label AI-generated images without depending on metadata
    that any upload strips.
  detail: >-
    Attached provenance travels alongside the file and disappears on the first
    screenshot or re-encode. A watermark lives in the content — in the pixel
    values, the audio waveform, or the choice of tokens — so it survives the
    ordinary handling that removes metadata. What it does not survive is a
    determined adversary, and what it cannot do is prove absence.
relations:
  - type: implements
    target: provenance
    note: >-
      Carries the same claim inside the content, where copying and re-encoding
      do not remove it.
  - type: distinguished-from
    target: ai-slop
    note: >-
      Watermarking identifies what a model produced. It says nothing about
      whether the output was worth producing.
examples:
  - name: SynthID
    vendor: Google DeepMind
    url: https://deepmind.google/models/synthid/
    note: >-
      Embeds watermarks "directly into AI-generated images, audio, text or
      video", imperceptible to humans and detectable by its own tooling.
    verifiedOn: 2026-08-22
sources:
  - id: synthid
    url: https://deepmind.google/models/synthid/
    title: SynthID — Google DeepMind
    verifiedOn: 2026-08-22
  - id: c2pa
    url: https://c2pa.org/
    title: C2PA — Verifying Media Content Sources
    verifiedOn: 2026-08-22
---
"SynthID embeds digital watermarks directly into AI-generated images, audio,
text or video. The watermarks are embedded across Google's [generative
AI](generative-ai) consumer products, and are imperceptible to humans — but can
be detected by SynthID's technology."[[cite:synthid]]

The last clause is the one to read carefully. Imperceptible to humans, and
detectable by *its own tooling* — which is where the capability's limits begin.

## Why inside rather than alongside

[Provenance](provenance) metadata is attached to a file and travels with it
until something strips it, which happens constantly and mostly by accident:
re-encoding, screenshotting, uploading to a platform that rewrites images.

A watermark is in the content. Google reports the image watermark is "designed
to stand up to modifications like cropping, adding filters, changing frame
rates, or lossy compression", and that it "doesn't change the image or video
quality."[[cite:synthid]]

Text is the harder case, and the mechanism is different again: rather than
altering pixels, a text watermark biases which [tokens](token) get chosen, in a
pattern a detector can recognise statistically and a reader cannot see. It is
correspondingly more fragile — paraphrasing degrades it in a way cropping does
not degrade an image mark.

## Why this is recorded as having no canonical form

Because each vendor's watermark is detectable only by that vendor. There is no
shared scheme, no cross-vendor detector, and no way for a platform to check
content generically the way it can check a [C2PA](provenance) credential.

C2PA standardises the *record*.[[cite:c2pa]] Nothing standardises the mark, so
watermarking today is a set of parallel private systems rather than an
ecosystem-level property.

## What it cannot do

- **Prove absence.** Unwatermarked content is the overwhelming majority, so "no
  watermark" carries no information.
- **Survive an adversary.** The defences are aimed at ordinary handling, not at
  someone deliberately removing the mark.
- **Cover [open weights](open-weights).** A model whose weights you hold can be
  run without whatever watermarking the vendor's product applied — the mark is a
  property of the serving path, not of the architecture.

That last point is the structural one. Watermarking is a control available to
whoever operates the model, which makes it strongest exactly where the model is
least accessible.
