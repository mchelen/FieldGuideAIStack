---
title: Usage limit
kind: concept
aka:
  - quota
  - spend limit
  - plan cap
canonical:
  status: de-facto
  term: Usage limit
  body: Anthropic, which documents organisation-level usage thresholds alongside rate limits
  url: https://platform.claude.com/docs/en/api/rate-limits
  title: Rate limits — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Distinct from a rate limit and frequently conflated with it. A rate limit
    shapes traffic within a minute; a usage limit caps consumption over a
    billing period, and hitting one is a commercial event rather than a
    throttling one.
tags: [economics]
zoom: 3
summary: The ceiling a plan places on consumption over a period — where a rate
  limit shapes traffic, this stops it.
fieldMark: Check what happens at the ceiling. A rate limit tells you to retry
  shortly; a usage limit tells you to come back next month, and the error looks
  similar enough to be misread.
useCase:
  scenario: >-
    A job starts failing with 429s and backing off does not help.
  detail: >-
    The two failures share a status code and mean opposite things. A rate limit
    is transient and a retry after a short wait succeeds; a usage limit means
    the period's allowance is spent and no amount of waiting within the period
    helps. Reading the error body rather than the status is the whole
    diagnosis, and building retry logic that cannot tell them apart guarantees
    a job that hammers an endpoint for hours to no effect.
flow:
  scenario: >-
    A plan that stops working on the twenty-eighth of the month, having
    worked fine on the twenty-seventh.
  path:
    - node: subscription-tier
      does: >-
        the plan, and what it includes
    - node: usage-limit
      does: >-
        the ceiling on consumption over a period
      self: true
    - node: rate-limit
      does: >-
        the other ceiling, which shapes traffic rather than total
  returns: >-
    One shapes the month, the other shapes the minute
relations:
  - type: distinguished-from
    target: rate-limit
    note: >-
      A rate limit shapes traffic within a minute; a usage limit caps
      consumption over a billing period.
  - type: part-of
    target: subscription-tier
    note: The cap is usually what distinguishes one tier from the next.
examples:
  - name: Claude API usage limits
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/api/rate-limits
    note: >-
      Crossing a monthly usage threshold pauses access with an
      `enforced_spend_limit_reached` error naming the date access returns.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-rate-limits
    url: https://platform.claude.com/docs/en/api/rate-limits
    title: Rate limits — Claude Platform documentation
    verifiedOn: 2026-08-22
---

A [rate limit](rate-limit) is about speed. A usage limit is about total
consumption, and the two arrive looking the same.

Anthropic's error for the second is explicit about which it is: while usage is
paused, requests return HTTP 429 with a message that "your organization has
crossed its monthly API usage threshold, set based on your organization's API
tier", naming the date access returns, under
`enforced_spend_limit_reached`.[[cite:anthropic-rate-limits]]

## Why the shared status code matters

Both are 429. A client that treats every 429 as transient will back off,
retry, back off further, and keep retrying against a limit that will not lift
until the billing period turns over.

The distinguishing information is in the body, not the status: a rate limit
carries `retry-after` and lifts in seconds; a spend limit names a date. Any
retry policy worth having reads far enough to tell them apart.

## What it is for

Two purposes, and they point in different directions:

- **Protecting you** from a runaway loop or a misconfigured job spending more
  than intended. Anthropic describes the thresholds as "intended to reduce
  unintentional overspend."[[cite:anthropic-rate-limits]]
- **Protecting the provider** from credit risk, which is why the ceiling starts
  low on a new account and rises with history rather than with need.

The first is genuinely useful and under-configured. An
[agentic loop](agentic-loop) that fails to terminate is exactly the failure mode
a spend cap exists to bound, and it is cheaper to hit a limit than to discover
the run at the end of the month.

## Where it shows up for end users

As the cap behind a [subscription tier](subscription-tier) — a message limit, a
weekly allowance, a reset time. Same mechanism, different vocabulary, and the
reason a flat-price plan can exist over a variable-cost service at all.
