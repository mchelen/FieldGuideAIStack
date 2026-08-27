---
title: Token pricing
kind: concept
aka:
  - input and output rates
  - per-million-token pricing
canonical:
  status: de-facto
  term: Model pricing
  body: Anthropic, whose published table shows the standard shape
  url: https://platform.claude.com/docs/en/about-claude/pricing
  title: Pricing — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Rates change frequently and per model; this page describes the shape of the
    pricing rather than any figure, and dates the figures it does quote.
tags: [economics]
zoom: 2
summary: Charging input and output tokens at different rates — with cached
  input cheaper again, which is where most of the available saving is.
fieldMark: Output typically costs several times input. A prompt that asks for
  brevity is a cost control, and one that asks the model to restate its input
  is an expensive habit.
useCase:
  scenario: >-
    A cost estimate built on an average per-call price is wrong by a factor of
    several.
  detail: >-
    An average assumes one rate. There are at least four — base input, cache
    write, cache read, and output — and they differ by more than an order of
    magnitude end to end. A workload that is mostly long cached prompts with
    short answers and one that is short prompts with long answers cost
    completely different amounts at identical call volumes, and only the token
    mix predicts which is which.
flow:
  scenario: >-
    Four rates on one invoice for what looks like one thing, and a prompt
    whose layout decides which apply.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        find four rates for what looked like one thing
    - node: token-billing
      where: your invoice
      does: >-
        charges by consumption, counted separately in and out
    - node: token-pricing
      where: a contract, not a computer
      does: >-
        input, output and cached input all priced differently
      self: true
    - node: prompt-caching
      where: the provider's servers
      does: >-
        which is the cheapest of them, by an order of magnitude
    - node: cost-per-task
      where: your invoice
      does: >-
        and the number that actually matters, once retries are counted
  returns: >-
    Prompt layout is a pricing decision
relations:
  - type: part-of
    target: token-billing
    note: The rate card behind the billing model.
  - type: consumes
    target: prompt-caching
    note: >-
      Cached reads are priced far below base input, which is what makes caching
      an economic decision rather than a [latency](latency) optimisation.
examples:
  - name: Claude pricing
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/about-claude/pricing
    note: >-
      Claude Opus 5 at $5 per million input tokens against $25 per million
      output, with cache hits at $0.50, read 2026-08-22.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-pricing
    url: https://platform.claude.com/docs/en/about-claude/pricing
    title: Pricing — Claude Platform documentation
    verifiedOn: 2026-08-22
    note: >-
      Figures read from the model pricing table on the date shown. Rates are
      per model and change; the ratios are the durable part.
  - id: anthropic-batch
    url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
    title: Batch processing — Claude Platform documentation
    verifiedOn: 2026-08-22
---

The published table has more columns than people expect. For Claude Opus 5 on
the date read: **$5** per million base input tokens, **$6.25** for a 5-minute
cache write, **$10** for a 1-hour cache write, **$0.50** for cache hits and
refreshes, and **$25** per million output tokens.[[cite:anthropic-pricing]]

Five rates for one model. The figures move; the *shape* is what transfers.

## Output costs several times input

Five times, in the example above. The reason is mechanical rather than
commercial: input is processed in parallel, and output is produced one
[token](token) at a time, each conditioned on the last. Generation occupies the
[accelerator](accelerator) serially in a way reading the prompt does not.

Two practical consequences. Asking for brevity is a real cost control, not a
style preference. And any pattern where the model restates its input — echoing a
document before commenting on it, repeating a schema — pays the expensive rate
for tokens you already paid the cheap rate for.

## Cached input is where the saving is

A cache hit at $0.50 against $5 base input is a tenth of the
price.[[cite:anthropic-pricing]] For an [agent](agent) re-sending a long
unchanged prefix on every step, that ratio is the difference between a viable
loop and an unaffordable one.

Writing to the cache costs *more* than base input — 1.25× at five minutes, 2× at
an hour — so a prefix read once loses money and one read many times approaches a
90% saving on that portion. [Prompt caching](prompt-caching) is therefore a
decision with arithmetic behind it rather than a setting to turn on
indiscriminately.

## The other multipliers

[Batch inference](batch-inference) cuts costs by 50% for work with no
deadline,[[cite:anthropic-batch]] and stacks with caching. Anthropic notes the
caching multipliers "stack with other pricing modifiers such as the Batch API
discount."[[cite:anthropic-pricing]]

Between model tiers the spread is larger again — an order of magnitude between
the cheapest and most capable models in the same
family[[cite:anthropic-pricing]] — which is what makes routing easy requests to
a smaller model the single largest lever on most bills.

## Reading a price list

Do not compute an average rate. Estimate the token mix — how much input, how
much of it cached, how much output — and price each stream separately. Two
workloads with identical call counts routinely differ several-fold, and the
average conceals exactly the thing you could change.
