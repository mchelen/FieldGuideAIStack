---
title: Throughput
kind: concept
aka:
  - tokens per second
  - TPS
  - generation speed
canonical:
  status: de-facto
  term: Throughput
  body: AWS, in the Amazon Bedrock user guide
  url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
  title: Increase model invocation capacity with Provisioned Throughput — AWS documentation
  verifiedOn: 2026-08-22
  note: >-
    Used in two senses that are easy to conflate: tokens per second for one
    request, and total tokens per second a deployment serves across all
    requests. Optimising for one trades against the other.
tags: [runtime, constraint]
zoom: 2
summary: How fast tokens come out once they start — per request, or across a
  whole deployment, and the two numbers pull against each other.
fieldMark: Per-request throughput is bounded by memory bandwidth, not by
  arithmetic. That is why a larger model is slower per token on the same
  hardware even when the accelerator is barely working.
useCase:
  scenario: >-
    A serving deployment is upgraded to hardware with far more compute and each
    response arrives at almost exactly the same speed.
  detail: >-
    Generating one token requires reading every active weight out of memory, so
    the ceiling is set by memory bandwidth rather than arithmetic capacity. More
    compute raises how many requests can be served at once, which is total
    throughput, without making any single one faster. Knowing which of the two
    numbers a purchase improves is the difference between a useful upgrade and
    an expensive one.
flow:
  scenario: >-
    A deployment sized for a thousand concurrent users, where the number
    that matters is not how fast one reply is.
  path:
    - actor: A thousand users
      where: a person, not a system
      does: >-
        send requests to the same deployment
    - node: accelerator
      where: the host's own hardware
      does: >-
        one deployment, with fixed memory and fixed compute
    - node: throughput
      where: the host's own hardware
      does: >-
        total tokens per second across everyone being served
      self: true
    - node: latency
      where: what the reader sees
      does: >-
        which trades against it — batching helps one and hurts the other
    - node: provisioned-throughput
      where: the host's own hardware
      does: >-
        and can be bought by the hour instead of by the token
  returns: >-
    Batching raises this and raises waiting at the same time
relations:
  - type: consumes
    target: accelerator
    note: Bounded by the hardware's memory bandwidth before its arithmetic capacity.
examples:
  - name: Provisioned Throughput
    vendor: AWS
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    note: >-
      AWS defines throughput as "the number and rate of inputs and outputs that
      a model processes and returns", and sells a guaranteed level of it.
    verifiedOn: 2026-08-22
sources:
  - id: aws-prov-throughput
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    title: Increase model invocation capacity with Provisioned Throughput — AWS documentation
    verifiedOn: 2026-08-22
  - id: vllm-paper
    url: https://arxiv.org/abs/2309.06180
    title: Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al.
    verifiedOn: 2026-08-22
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

AWS defines it plainly: "throughput refers to the number and rate of inputs and
outputs that a model processes and returns."[[cite:aws-prov-throughput]] In
practice the word covers two distinct measurements, and confusing them is the
usual source of disappointment in a serving project.

- **Per request** — tokens per second reaching one caller. What a user
  experiences after the first token arrives.
- **Per deployment** — total tokens per second across every concurrent request.
  What determines cost per token.

## They trade against each other

Serving many requests together is what makes a deployment efficient, because the
weights are read from memory once and used for all of them. The vLLM work states
the requirement directly: "high throughput serving of large language models
requires batching sufficiently many requests at a time."[[cite:vllm-paper]]

Batching raises total throughput and lowers the per-request rate, since each
request now shares. A provider tuning for cost and a user wanting a fast
response are asking for different points on the same curve.

## What limits the per-request number

Producing one [token](token) requires reading every active
[parameter](parameter) out of memory. Memory bandwidth, not arithmetic, is
therefore the ceiling — which is why per-request speed falls roughly in
proportion to model size and why an [accelerator](accelerator) can be nearly
idle while generation crawls.

[Quantization](quantization) helps for exactly this reason: fewer bits per
weight means less to read per token. A
[mixture of experts](mixture-of-experts) helps for the same reason, by reading
only the active experts.

## Where the memory actually goes

Not only weights. The [KV cache](kv-cache) grows with every token in every
concurrent request, and the vLLM paper identifies this as the binding
constraint: cache memory "is huge and grows and shrinks dynamically", and when
managed badly is "significantly wasted by fragmentation and redundant
duplication, limiting the batch size."[[cite:vllm-paper]]

Fixing that waste raised throughput 2–4× at the same
[latency](latency)[[cite:vllm-paper]] — a memory-management result, not a model
one.[[cite:google-glossary]]
