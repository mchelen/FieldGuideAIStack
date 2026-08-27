---
title: Latency
kind: concept
aka:
  - response time
canonical:
  status: de-facto
  term: Latency
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Borrowed from systems engineering unchanged. What is specific to model
    serving is that it decomposes into two numbers that behave differently,
    and quoting only the total hides which one is the problem.
tags: [runtime, constraint]
zoom: 2
summary: How long a request takes end to end — and for a model, a number that
  is only useful once split into the wait before output starts and the rate it
  arrives at.
fieldMark: A single latency figure on a vendor page is close to meaningless
  without the output length it was measured at. Generation is serial, so the
  total scales with how much the model was asked to say.
useCase:
  scenario: >-
    Two models [benchmark](benchmark) at the same average latency and one feels far quicker
    to use.
  detail: >-
    The averages hide the split. One starts producing text in 300ms and streams
    slowly; the other thinks for two seconds and then arrives all at once. Users
    experience the first as responsive because something is happening, and the
    second as broken. Optimising the total without knowing which half dominates
    is how teams spend a quarter on the wrong number.
flow:
  scenario: >-
    Two deployments benchmark at the same average, and one of them feels
    noticeably quicker to everyone using it.
  path:
    - actor: A request
      does: >-
        sent, and then waited on
    - node: inference-api
      does: >-
        the call, and everything the network adds to it
    - node: time-to-first-token
      does: >-
        how long until anything appears — what a person feels
    - node: latency
      does: >-
        end to end, only useful once split into its parts
      self: true
    - node: throughput
      does: >-
        the same deployment measured for volume rather than for waiting
  returns: >-
    One average hides the number users actually notice
relations:
  - type: part-of
    target: inference-api
    note: A property of the call, not of the weights.
  - type: contains
    target: time-to-first-token
    note: The waiting half.
  - type: contains
    target: throughput
    note: The producing half.
examples:
  - name: Amazon Bedrock
    vendor: AWS
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
    note: >-
      A managed host where the same model is served at different latencies
      depending on region and capacity purchased.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The time it takes for a model to process input and generate a response.
  - id: aws-what-is
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
    title: What is Amazon Bedrock? — AWS documentation
    verifiedOn: 2026-08-22
---

Latency is "the time it takes for a model to process input and generate a
response." Google's glossary lists what moves it: "input and output token
lengths, model complexity, [and] the infrastructure the model runs
on."[[cite:google-glossary]]

Output token length is the one that surprises people. Generation is serial — a
[model](model) produces one [token](token) at a time, each conditioned on the
last — so a request asking for a thousand tokens takes roughly ten times as long
as one asking for a hundred, regardless of difficulty.

## Why one number is not enough

The total decomposes into two measurements that respond to entirely different
interventions:

- **[Time to first token](time-to-first-token)** — the wait before anything
  appears. Set by prompt length, queueing, and how much of the prompt has to be
  processed before generation can start.
- **[Throughput](throughput)** — how fast tokens arrive once they do. Set by
  the model's size and the hardware's memory bandwidth.

A long prompt with a short answer is dominated by the first. A short prompt with
a long answer is dominated by the second. Reporting the sum tells you which
kind of request was measured and nothing about which half you could fix.

## What perceived speed actually tracks

Not the total. With [streaming](streaming), a user judges responsiveness on time
to first token and then on whether output keeps up with reading speed. Once
throughput exceeds that, further gains are invisible.

This is why a slower model that starts sooner is routinely preferred to a faster
one that pauses first — a fact about attention rather than about engineering,
and one that survives every attempt to argue with it.

## Where the infrastructure comes in

The same weights served on different hardware, in different regions, at
different levels of contention, produce materially different
numbers.[[cite:aws-what-is]] Latency is a property of a deployment, not of a
model, and a figure quoted without both is not comparable to anything.
