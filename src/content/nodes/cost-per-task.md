---
title: Cost per task
kind: concept
aka:
  - unit economics
  - cost per completed job
canonical:
  status: none
  note: >-
    No vendor publishes it and no glossary defines it, because it is a property
    of your system rather than of anyone's product. It is nonetheless the only
    number that answers whether a feature is affordable.
tags: [economics]
zoom: 2
summary: What one completed job costs once retries, tool calls and failures are
  counted — as opposed to what one API call costs.
fieldMark: Per-[token pricing](token-pricing) is the vendor's unit. Cost per task is yours, and
  the ratio between them is where agentic systems surprise people.
useCase:
  scenario: >-
    A budget built from per-call pricing comes in an order of magnitude low.
  detail: >-
    One user action is not one call. An agentic loop may run twenty steps, each
    re-sending the whole conversation and every tool result so far, and a
    proportion of runs fail and are retried from the start. The vendor's price
    list is accurate and answers a different question than the one being asked.
    Measuring the completed job — including the runs that did not complete — is
    the only estimate that predicts a bill.
flow:
  scenario: >-
    A per-token price that looks cheap, and a finished job that took
    nineteen calls and two retries.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        ask what one finished job actually costs
    - node: agentic-loop
      where: wherever the product runs
      does: >-
        one instruction becomes many calls
    - node: token-pricing
      where: a contract, not a computer
      does: >-
        each call is priced per token, which looks small
    - node: cost-per-task
      where: your invoice
      does: >-
        what one completed job costs once retries are counted
      self: true
  returns: >-
    The unit that matters is the job, not the call
relations:
  - type: consumes
    target: token-pricing
    note: The rate card is the input; the token count of a whole task is the multiplier.
  - type: consumed-by
    target: agentic-loop
    note: >-
      A loop's cost is the sum of its steps, and each step re-sends everything
      before it.
examples:
  - name: Batch processing
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
    note: >-
      A 50% discount available to work with no deadline — one of the few levers
      that changes cost per task without changing the task.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-batch
    url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
    title: Batch processing — Claude Platform documentation
    verifiedOn: 2026-08-22
    quote: >-
      The pricing discounts from prompt caching and Message Batches can stack, providing even greater cost savings when both features are used together.
  - id: anthropic-pricing
    url: https://platform.claude.com/docs/en/about-claude/pricing
    title: Pricing — Claude Platform documentation
    verifiedOn: 2026-08-22
    quote: >-
      A cache hit costs 10% of the standard input price, which means caching pays off after one cache read for the 5-minute duration (1.25x write), or after two cache reads for the 1-hour duration (2x write).
---

The vendor bills per [token](token). Nobody's product is a token. The number
that decides whether a feature ships is what one completed job costs, and
getting from one to the other is where estimates go wrong.

## What a task actually contains

- **Several calls, not one.** An [agentic loop](agentic-loop) runs until a
  termination condition, and the step count is not knowable in advance.
- **Quadratic growth without caching.** The
  [inference API](inference-api) is stateless, so step *n* re-sends everything
  from steps 1 to *n−1*. Twenty steps is not twenty times one step; it is
  closer to two hundred times, unless [prompt caching](prompt-caching) is
  working.
- **Tool results**, usually the largest and least predictable input.
- **Failures.** Runs that produce nothing still cost, and they belong in the
  average.
- **Retries**, which multiply everything above.

Any one of these can dominate. Together they are why per-call arithmetic
underestimates so reliably.

## The levers, roughly in order of size

1. **Route to a smaller model** where the task allows. The spread between tiers
   is an order of magnitude.[[cite:anthropic-pricing]]
2. **Cache the prefix.** A cache hit is a tenth of base
   input,[[cite:anthropic-pricing]] and an agent's prefix is unchanged by
   construction.
3. **Batch anything with no deadline** — a flat 50%
   discount.[[cite:anthropic-batch]]
4. **Shorten output**, which is billed at several times the input rate.
5. **Fail earlier.** A run that cannot succeed costs the same as one that can
   until something stops it, which is what a step budget is for.
6. **Lower [effort](effort-level)** on requests that were never hard.

Notice that four of the six are decisions made while writing prompts and loops,
not while negotiating a contract. Cost is an engineering property here in a way
it was not under licensed software.

## Measuring it rather than estimating it

The reliable method is to instrument. A [trace](tracing) carrying token counts
in and out, cache hit rates and step counts turns cost per task into a
measurement — including the failed runs, which no estimate remembers to include
and which are often a large fraction of the total.

That is the same argument as everywhere else in this guide: the number you can
compute from a price list is not the number that shows up on the bill.
