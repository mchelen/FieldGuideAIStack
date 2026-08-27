---
title: On-device inference
kind: concept
aka:
  - edge inference
  - local inference
canonical:
  status: de-facto
  term: On-device
  body: Google, in its AI Edge developer documentation
  url: https://developers.google.com/edge
  title: Google AI Edge — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    "On-device", "edge" and "local" are used interchangeably for the same
    arrangement, with "edge" carrying an older meaning from distributed
    computing that predates any of this.
tags: [serving, infrastructure]
zoom: 3
summary: Running a model on the user's own hardware — a phone, a laptop, an
  embedded device — so nothing is sent anywhere.
fieldMark: The constraint is memory and battery, not cleverness. What runs
  on-device is decided almost entirely by how small the model can be made
  without becoming useless.
useCase:
  scenario: >-
    A feature needs a model call on every keystroke, offline, on a phone.
  detail: >-
    [Latency](latency) and connectivity disqualify a hosted model before cost is even
    discussed, and the privacy question disappears entirely because nothing
    leaves the device. What makes it possible is a small model quantized hard
    enough to fit in the memory a phone will spare — which is why the
    capability of small models matters far more here than anywhere else in the
    stack.
flow:
  scenario: >-
    A model running on a phone in aeroplane mode, answering with no network
    and no per-token bill.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        want it working with the network off
    - actor: A device
      where: your machine
      does: >-
        a phone, with a few gigabytes to spare
    - node: quantization
      where: a training cluster
      does: >-
        shrinks the weights enough to fit
    - node: on-device-inference
      where: your machine
      does: >-
        runs it locally, with no request leaving the device
      self: true
    - node: self-hosting
      where: your machine
      does: >-
        the same argument at a different scale
  returns: >-
    No network, no bill, no audit trail either
relations:
  - type: kind-of
    target: self-hosting
    note: The extreme case — hosted on the end user's own hardware rather than a server.
  - type: consumes
    target: quantization
    note: What makes a model small enough to fit at all.
examples:
  - name: Google AI Edge
    vendor: Google
    url: https://developers.google.com/edge
    note: >-
      An "end-to-end stack for building and deploying on-device ML and AI
      across platforms", including running LLMs on Android, iOS, web and
      embedded devices.
    verifiedOn: 2026-08-22
sources:
  - id: google-edge
    url: https://developers.google.com/edge
    title: Google AI Edge — Google for Developers
    verifiedOn: 2026-08-22
  - id: phi-paper
    url: https://arxiv.org/abs/2306.11644
    title: Textbooks Are All You Need — Gunasekar et al.
    verifiedOn: 2026-08-22
    quote: >-
      Despite this small scale, phi-1 attains pass@1 accuracy 50.6% on HumanEval and 55.5% on MBPP.
---

On-device inference is [self-hosting](self-hosting) taken to its limit: the
model runs on the end user's hardware. Google's AI Edge is positioned exactly
this way — an "end-to-end stack for building and deploying on-device ML and AI
across platforms", including running the "same LLM across Android, iOS, Web, and
embedded devices."[[cite:google-edge]]

## What it changes

**Privacy stops being a policy question.** Input that never leaves the device
raises no question about where it was sent, who retains it, or under what terms.
No agreement, no region selection, no audit.

**Latency loses the network.** Tens of milliseconds locally against a round trip,
which is the difference between a feature that can run on every keystroke and
one that cannot.

**Availability stops depending on anyone.** No [rate limit](rate-limit), no
outage, no vendor.

**Marginal cost goes to zero.** There is no per-[token](token) bill, which
changes what is worth doing at all — an on-device model can be called
speculatively in a way a metered one never can.

## What it costs

Capability, and not marginally. The models that fit are
[small](small-language-model) by any current standard, and the gap against a
frontier model on open-ended work is large.

The counterweight is that small models keep getting better without getting
bigger — the phi-1 result showed curated data partially substituting for scale,
reaching well above what 1.3 billion [parameters](parameter) would
predict.[[cite:phi-paper]] The size that fits on a phone is fixed by hardware;
what that size can do is not.

## The engineering constraints

- **Memory**, which is the hard limit and why
  [quantization](quantization) is not optional here.
- **Battery and thermals** — sustained inference on a phone is a power budget
  problem before it is a speed problem.
- **Heterogeneity** — the same model has to run across wildly different hardware,
  which is what a runtime like Google's is for.[[cite:google-edge]]

## The hybrid shape

Most products that use on-device inference do not use it exclusively: the small
local model handles the common, latency-sensitive, private cases, and hard
requests are routed to a hosted model.

That routing decision — which requests are easy — is the same one
[effort level](effort-level) makes within a single model, made across two
models instead.
