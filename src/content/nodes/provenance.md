---
title: Provenance
kind: concept
aka:
  - content credentials
  - content authenticity
canonical:
  status: standard
  term: Content Credentials
  body: C2PA — the Coalition for Content Provenance and Authenticity — which publishes an open technical standard
  url: https://c2pa.org/
  title: C2PA — Verifying Media Content Sources
  verifiedOn: 2026-08-22
  note: >-
    Google's glossary defines provenance generally as "data detailing how a
    piece of digital media content was created or changed"; C2PA is the
    specification that implements it, under the name Content Credentials.
tags: [openness, safety]
zoom: 2
summary: Evidence of where a model, dataset or piece of content came from —
  attached to the artifact rather than asserted about it.
fieldMark: Provenance is a record, not a verdict. It says what was claimed and
  by whom, and a well-formed record of a false claim is still well-formed.
useCase:
  scenario: >-
    An image arrives in a news pipeline and someone has to decide whether it is
    a photograph.
  detail: >-
    Detection — asking a classifier whether it looks generated — is unreliable
    and gets worse as models improve. Provenance inverts the problem: the
    capture device or the generating tool signs a record of what it did, and
    the question becomes whether that record is present and verifiable rather
    than whether the pixels look real. Absence of a record proves nothing, which
    is the honest limit of the approach.
relations:
  - type: implemented-by
    target: watermarking
    note: >-
      One mechanism for carrying it — inside the content rather than alongside
      it, so it survives stripping of the metadata.
  - type: consumed-by
    target: ai-bill-of-materials
    note: An inventory is only as strong as the provenance behind each entry.
examples:
  - name: C2PA Content Credentials
    url: https://c2pa.org/
    note: >-
      "An open technical standard for publishers, creators and consumers to
      establish the origin and edits of digital content."
    verifiedOn: 2026-08-22
sources:
  - id: c2pa
    url: https://c2pa.org/
    title: C2PA — Verifying Media Content Sources
    verifiedOn: 2026-08-22
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Data detailing how a piece of digital media content was created or changed.
---

Google's glossary keeps it to one line: provenance is "data detailing how a
piece of digital media content was created or
changed."[[cite:google-glossary]]

C2PA — "the Coalition for Content Provenance and Authenticity" — is the standard
that implements it, providing "an open technical standard for publishers,
creators and consumers to establish the origin and edits of digital content",
under the name Content Credentials.[[cite:c2pa]]

Their own analogy is apt: Content Credentials "function like a nutrition label
for digital content, giving a peek at the content's history available for anyone
to access, at any time."[[cite:c2pa]]

## Why provenance rather than detection

Detection asks whether content *looks* generated, and gets harder every year by
construction — models are optimised to produce output indistinguishable from the
real thing, so a detector is competing against the entire field's research
budget.

Provenance asks a different question: what does the record say, and does it
verify. That question does not get harder as models improve, because it is about
signatures rather than about pixels.

## What it does not establish

Truth. A signed record says that a particular tool or organisation asserted a
particular history — not that the assertion is accurate, and not that the
content is worth trusting.

And the asymmetry is severe: a present, valid credential is evidence; an absent
one is nothing at all. Most content has no credential, stripping metadata is
trivial, and screenshotting removes it entirely. A system treating "no
provenance" as "probably generated" would be wrong about most of the internet.

This is why [watermarking](watermarking) exists alongside it — carrying the mark
*inside* the content, where a copy-paste does not remove it.

## Where it applies beyond media

The same question runs through the model supply chain. Which corpus, which
[checkpoint](checkpoint), which [fine-tune](fine-tuning), under which licence —
recorded on a [model card](model-card) if anywhere, and unverified there too.

An [AI bill of materials](ai-bill-of-materials) is provenance applied to
dependencies rather than to content, and it inherits the same limitation: the
inventory records what publishers declared.
