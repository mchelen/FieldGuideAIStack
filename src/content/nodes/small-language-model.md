---
title: Small language model
kind: concept
aka:
  - SLM
  - efficient model
canonical:
  status: none
  note: >-
    No surveyed glossary carries the term and no threshold exists, which is
    unsurprising given that "large" has no threshold either. It is used
    relationally — small compared to the frontier of the same year — so a model
    called small in one year is a model called large two years earlier.
tags: [artifact]
zoom: 3
summary: A language model small enough to run somewhere a frontier model
  cannot — a laptop, a phone, a container — and trained to be good despite it
  rather than in spite of it.
fieldMark: The number moves every year. Treat "small" as a claim about where
  the model can run, not about how many parameters it has.
useCase:
  scenario: >-
    A feature needs a model call on every keystroke, offline, on a phone.
  detail: >-
    A frontier model is disqualified by latency and connectivity before cost
    even comes up. A model of a few billion parameters, quantized, runs locally
    in tens of milliseconds and never leaves the device — which also removes the
    entire question of what data was sent where. The trade is real capability,
    and it is worth making precisely when the task is narrow enough not to need
    the difference.
flow:
  scenario: >-
    A model that has to run on a laptop, where the frontier model is not an
    option at any price.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        need it to run on a laptop, not a data centre
    - actor: A constraint
      where: your machine
      does: >-
        a laptop, offline, with a few gigabytes
    - node: small-language-model
      where: your machine
      does: >-
        small enough to run where a frontier model cannot
      self: true
    - node: large-language-model
      where: the provider's servers
      does: >-
        the comparison it always loses on open-ended work
    - node: model
      where: the weights file
      does: >-
        and the same contract, at a different size
  returns: >-
    Latency, cost and privacy — and a narrower range
relations:
  - type: kind-of
    target: model
    note: Distinguished by where it can run rather than by what it is.
  - type: distinguished-from
    target: large-language-model
    note: >-
      Both are relational terms with no threshold. The line moves every year, in
      the same direction.
examples:
  - name: phi-1
    vendor: Microsoft
    url: https://arxiv.org/abs/2306.11644
    note: >-
      1.3 billion parameters, trained for four days on eight accelerators, and
      competitive on code benchmarks with much larger models.
    verifiedOn: 2026-08-22
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: Small enough to run on one consumer accelerator once quantized.
    verifiedOn: 2026-08-22
sources:
  - id: phi-paper
    url: https://arxiv.org/abs/2306.11644
    title: Textbooks Are All You Need — Gunasekar et al.
    verifiedOn: 2026-08-22
    note: Submitted 20 June 2023, last revised 2 October 2023. The phi-1 paper.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
---

"Small" is defined by contrast with a moving target. A
[large language model](large-language-model) has no parameter threshold either,
so both terms describe position relative to the frontier of a given year rather
than any fixed size.

What makes the category worth naming is the constraint it is built against: a
small language model is one that runs where a frontier model cannot — on a
laptop, a phone, an edge device, or a container small enough to schedule
anywhere.

## Data quality as the substitute for scale

The interesting finding is that small models got much better without getting
bigger. The phi-1 work trained "a new large language model for code, with
significantly smaller size than competing models" — 1.3 billion
[parameters](parameter), four days on eight accelerators — using "a selection of
'textbook quality' data from the web" together with synthetically generated
textbooks and exercises.[[cite:phi-paper]]

The paper's title is the argument. Curation partially substitutes for scale,
which is why the capability of a given model size has risen year on year
independently of anyone training a bigger model.

## What you actually gain

- **[Latency](latency)** — tens of milliseconds locally against a network round trip.
- **Cost** — no per-token bill at all once the model is on the device.
- **Privacy** — input that never leaves the machine raises no question about
  where it was sent.
- **Availability** — no dependency on a [model provider](model-provider) being
  reachable, or on being in business.

## And what you give up

General capability, long-horizon reasoning, and breadth of knowledge. Small
models are competitive on narrow, well-specified tasks — classification,
extraction, routing, autocomplete — and are not substitutes for a frontier model
on open-ended work. [Distillation](distillation) is a common way to close part
of the gap for one task at a time.
