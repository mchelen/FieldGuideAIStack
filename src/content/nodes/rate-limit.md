---
title: Rate limit
kind: concept
aka:
  - quota
  - throttling
canonical:
  status: de-facto
  term: Rate limit
  body: Anthropic, in the Claude Platform documentation; standard across web APIs generally
  url: https://platform.claude.com/docs/en/api/rate-limits
  title: Rate limits — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Ordinary API vocabulary. What is specific to model APIs is that the limits
    are denominated in tokens per minute as well as requests, so a single large
    request can exhaust a budget that a hundred small ones would not.
tags: [runtime, constraint]
zoom: 2
summary: The cap on how much you may call an API in a window — for model APIs,
  counted in tokens per minute as well as requests.
fieldMark: A 429 that arrives on the first request of the minute is a token
  limit, not a request limit. Check which one the error names before adding
  retries.
useCase:
  scenario: >-
    A job well under the requests-per-minute limit gets throttled anyway.
  detail: >-
    Each request carries a long document, so the token budget goes first. The
    limits are separate — requests per minute, input tokens per minute, output
    tokens per minute — and any one of them can bind alone. Backing off on
    request count does nothing if the constraint is tokens; sending less per
    request does. Reading which limit the error names is the whole diagnosis.
relations:
  - type: part-of
    target: inference-api
    note: Enforced at the API boundary, per organisation and often per workspace.
  - type: consumes
    target: token
    note: The budget is denominated in them, not only in requests.
examples:
  - name: Claude API rate limits
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/api/rate-limits
    note: >-
      Measured in requests per minute, input tokens per minute and output
      tokens per minute for each model class, using a token bucket.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-rate-limits
    url: https://platform.claude.com/docs/en/api/rate-limits
    title: Rate limits — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: anthropic-batch
    url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
    title: Batch processing — Claude Platform documentation
    verifiedOn: 2026-08-22
---

"To mitigate misuse and manage capacity on the API, limits are in place on how
much an organization can use the Claude API."[[cite:anthropic-rate-limits]] Two
motives, and they behave differently: abuse prevention is about you, capacity
management is about everyone else.

## Three limits, any one of which binds

The Claude API's limits "are measured in requests per minute (RPM), input tokens
per minute (ITPM), and output tokens per minute (OTPM) for each model class",
and exceeding any of them returns a 429 "describing which rate limit was
exceeded, along with a `retry-after` header indicating how long to
wait."[[cite:anthropic-rate-limits]]

This is what makes model APIs different from ordinary ones. Request count is a
poor proxy for load when one request can carry a hundred thousand
[tokens](token) and another carries twenty. A long-context workload will exhaust
a token budget while barely touching the request budget, and the fix for one is
not the fix for the other.

## Continuous replenishment, not a reset

"The API uses the token bucket algorithm to do rate limiting. This means that
your capacity is continuously replenished up to your maximum limit, rather than
being reset at fixed intervals."[[cite:anthropic-rate-limits]]

Worth internalising, because it changes what a good client does. There is no
moment at which the budget refills, so waiting for the top of the minute
achieves nothing and a burst of retries at that instant is the worst possible
pattern. Anthropic also warns that a nominal per-minute rate "might be enforced
as 1 request per second", so short bursts can trip a limit that the minute-long
average would not.[[cite:anthropic-rate-limits]]

Respect `retry-after`, back off exponentially, and spread load rather than
synchronising it.

## What limits are and are not

"All limits described here represent maximum allowed usage, not guaranteed
minimums."[[cite:anthropic-rate-limits]] A ceiling, not a reservation — nothing
promises you can reach it under contention. Guaranteed capacity is a different
product, sold as [provisioned throughput](provisioned-throughput).

## Working within them

Move latency-insensitive work to [batch inference](batch-inference), which has
its own separate limits.[[cite:anthropic-batch]] Send fewer tokens where the
constraint is tokens. And treat 429 as an expected condition to handle rather
than an error to log, because at any real volume it will happen.
