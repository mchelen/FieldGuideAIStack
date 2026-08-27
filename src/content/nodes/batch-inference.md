---
title: Batch inference
kind: concept
aka:
  - offline inference
  - static inference
  - asynchronous processing
canonical:
  status: de-facto
  term: Batch inference
  body: AWS, in the Amazon Bedrock user guide; Google's glossary carries the same idea as "offline inference"
  url: https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference.html
  title: Process multiple prompts with batch inference — AWS documentation
  verifiedOn: 2026-08-22
  note: >-
    Google's glossary uses "offline inference", also called "static inference",
    and contrasts it with "online inference". The vendor APIs call the same
    thing batch. Both names are in current use for the same trade.
tags: [runtime, economics]
zoom: 2
summary: Submitting many requests to be processed whenever there is spare
  capacity — roughly half price, in exchange for giving up any promise about
  when.
fieldMark: The discount is not a volume discount. You are being paid to be
  flexible about timing, which is what lets a provider fill idle capacity.
useCase:
  scenario: >-
    A backlog of 200,000 documents needs classifying and nobody is waiting for
    any individual result.
  detail: >-
    Sent interactively, this is expensive and will hit rate limits. Submitted as
    a batch, it costs half as much on the Claude API and the provider schedules
    it against spare capacity. The only thing given up is knowing when each
    result lands — and for a backlog, that was never worth anything. Recognising
    which workloads are genuinely [latency](latency)-insensitive is one of the largest
    single levers on an inference bill.
flow:
  scenario: >-
    Ten thousand documents to classify by Thursday, with nobody waiting on
    any single answer.
  path:
    - actor: Ten thousand jobs
      where: your machine
      does: >-
        no interactive user, and a deadline in days
    - node: batch-inference
      where: the provider's servers
      does: >-
        submitted to run whenever there is spare capacity
      self: true
    - node: inference-api
      where: the provider's servers
      does: >-
        the same model, a different endpoint and a different price
    - node: streaming
      where: the provider's servers
      does: >-
        the opposite trade — perceived speed instead of unit cost
  returns: >-
    Roughly half price, for giving up when it happens
relations:
  - type: part-of
    target: inference-api
    note: A separate endpoint with its own lifecycle, not a flag on the normal one.
  - type: distinguished-from
    target: streaming
    note: >-
      Opposite ends of the same trade. [Streaming](streaming) buys perceived speed;
      batching sells it.
examples:
  - name: Message Batches API
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
    note: >-
      Asynchronous processing "cutting costs by 50% and increasing throughput";
      most batches complete within an hour and expire at 24.
    verifiedOn: 2026-08-22
  - name: Bedrock batch inference
    vendor: AWS
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference.html
    note: >-
      Inputs and outputs move through an S3 bucket rather than through the
      request itself.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-batch
    url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
    title: Batch processing — Claude Platform documentation
    verifiedOn: 2026-08-22
    quote: >-
      Instead of processing requests one at a time with immediate responses, batch processing allows you to submit multiple requests together for asynchronous processing.
  - id: aws-batch
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference.html
    title: Process multiple prompts with batch inference — AWS documentation
    verifiedOn: 2026-08-22
    quote: >-
      Batch inference helps you process a large number of requests efficiently by sending a single request and generating the responses in an Amazon S3 bucket.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The process of inferring predictions on multiple unlabeled examples divided into smaller subsets ("batches").
---

"Instead of processing requests one at a time with immediate responses, batch
processing allows you to submit multiple requests together for asynchronous
processing."[[cite:anthropic-batch]] AWS describes the same shape: "submit
multiple prompts and generate responses asynchronously", with input and output
files moving through an S3 bucket.[[cite:aws-batch]]

Google's glossary names the underlying distinction as offline versus online
inference — generating "a batch of predictions and then caching (saving) those
predictions", against "generating predictions on
demand."[[cite:google-glossary]]

## What you are actually being paid for

The Claude API's Message Batches API cuts costs by 50%.[[cite:anthropic-batch]]
That is a large discount for an identical model producing identical output, and
it is worth understanding why it exists.

Serving interactive traffic means holding capacity in reserve for peaks, and
[reserved capacity](provisioned-throughput) is idle capacity most of the time. A
workload with no deadline can be scheduled into those gaps. The discount is the
provider sharing what it saves by filling them — which is why it is a fixed rate
rather than a volume tier.

## The terms that come with it

On the Claude API: "the system processes each batch as fast as possible, with
most batches completing within 1 hour", results are available "when all messages
have completed or after 24 hours, whichever comes first", and "batches expire if
processing does not complete within 24 hours."[[cite:anthropic-batch]]

Note the shape of the promise. Usually fast, guaranteed only by a deadline a day
out. Anything that cannot tolerate that is not a batch workload, and the 50% is
not available to it.

## What fits

Classification and extraction over a backlog, [evaluation](evaluation) runs, dataset
generation, [embedding](embedding) a corpus, periodic reporting. What does not: anything a
person is waiting on, and anything inside an [agent](agent) loop, where the next
step depends on this one.

Batch processing also has its own [rate limits](rate-limit) and its own
retention rules — on the Claude API results are kept for 29 days after
creation.[[cite:anthropic-batch]]
