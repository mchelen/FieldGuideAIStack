---
title: Accelerator
kind: concept
aka:
  - accelerator chip
  - GPU
  - TPU
canonical:
  status: de-facto
  term: Accelerator chip
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google's entry notes the short form: "accelerator chips (or just
    accelerators, for short)". GPU and TPU are specific products within the
    category, not synonyms for it, though GPU is often used loosely as one.
tags: [runtime, infrastructure]
zoom: 2
summary: The specialised hardware that training and inference actually run on —
  and whose memory capacity and bandwidth set most of the practical limits in
  this guide.
fieldMark: Two specs matter and they are different. Memory capacity decides
  whether a model fits; memory bandwidth decides how fast it generates. Compute
  throughput is rarely the binding constraint for serving.
useCase:
  scenario: >-
    Choosing hardware to self-host a model, faced with a spec sheet full of
    numbers.
  detail: >-
    Start with memory capacity, because it is pass or fail: the weights plus the
    KV cache for every concurrent request have to fit, or the model does not
    run. Then look at memory bandwidth, which sets tokens per second. Compute
    throughput matters for training and for serving many requests at once, and
    is usually the least binding of the three for a single-user deployment —
    which is why the headline number on the box is the least useful one.
flow:
  scenario: >-
    A deployment that fits or does not fit, decided by memory capacity
    before anything about speed comes up.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        ask whether this deployment fits at all
    - node: model
      where: the host's own hardware
      does: >-
        weights that have to be resident to be served
    - node: kv-cache
      where: the host's own hardware
      does: >-
        plus per-request state for every concurrent conversation
    - node: accelerator
      where: the host's own hardware
      does: >-
        and both have to fit in its memory, or nothing runs
      self: true
    - node: throughput
      where: the host's own hardware
      does: >-
        only then does how fast it goes become the question
  returns: >-
    Capacity is pass or fail. Speed is a negotiation.
relations:
  - type: hosts
    target: model
    note: The weights sit in its memory for as long as the model is being served.
  - type: part-of
    target: model-host
    note: What a hosting service is renting you, one layer down.
examples:
  - name: Tensor Processing Units
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      Google's own example of the category — "dedicated hardware for deep
      learning".
    verifiedOn: 2026-08-22
  - name: NVIDIA GPUs
    vendor: NVIDIA
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      Google notes they were "initially designed for graphics processing" and
      are "designed to enable parallel processing".
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A category of specialized hardware components designed to perform key computations needed for deep learning algorithms.
  - id: vllm-paper
    url: https://arxiv.org/abs/2309.06180
    title: Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al.
    verifiedOn: 2026-08-22
  - id: aws-prov-throughput
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    title: Increase model invocation capacity with Provisioned Throughput — AWS documentation
    verifiedOn: 2026-08-22
---

An accelerator chip is "a category of specialized hardware components designed
to perform key computations needed for deep learning algorithms", which "can
significantly increase the speed and efficiency of training and inference tasks
compared to a general-purpose CPU."[[cite:google-glossary]]

Google's own examples are its Tensor Processing Units, "with dedicated hardware
for deep learning", and NVIDIA's GPUs, "though initially designed for graphics
processing … designed to enable parallel
processing."[[cite:google-glossary]] The second is worth noting: the hardware
this field runs on was built for something else, and was adopted because the
shape of the arithmetic happened to match.

## Why memory, not compute, is the number to read

For serving, the binding constraints are both about memory.

**Capacity** decides whether the model runs at all. The
[parameters](parameter) must fit, and so must the [KV cache](kv-cache) for every
concurrent request — which the vLLM paper identifies as the thing that actually
limits batch size, being "huge" and growing "dynamically."[[cite:vllm-paper]]

**Bandwidth** decides how fast it generates. Every active weight is read from
memory for every token produced, so per-request
[throughput](throughput) tracks bandwidth rather than arithmetic capacity.

A chip with abundant compute and insufficient memory bandwidth generates slowly
while looking busy on paper. This is why [quantization](quantization) helps
performance and not only footprint, and why a
[mixture of experts](mixture-of-experts) is fast for its size.

## What it explains elsewhere in the guide

Most of the economics. Accelerators are expensive, scarce and power-hungry,
which is why inference is metered per [token](token) rather than sold flat, why
guaranteed capacity is a separate product billed by the
hour,[[cite:aws-prov-throughput]] and why [batch inference](batch-inference) is
discounted — a provider that can fill idle accelerator time will pay you for the
flexibility.

It is also why running a model locally is a hardware question before it is a
software one.
