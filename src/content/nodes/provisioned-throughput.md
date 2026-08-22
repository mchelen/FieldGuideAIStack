---
title: Provisioned throughput
kind: concept
aka:
  - reserved capacity
  - dedicated capacity
canonical:
  status: de-facto
  term: Provisioned Throughput
  body: AWS, in the Amazon Bedrock user guide
  url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
  title: Increase model invocation capacity with Provisioned Throughput — AWS documentation
  verifiedOn: 2026-08-22
  note: >-
    AWS's product name for the arrangement; other hosts sell the same thing
    under other names. What is common is the trade: an hourly commitment in
    exchange for capacity that is yours whether or not you use it.
tags: [serving, economics]
zoom: 3
summary: Paying for guaranteed capacity by the hour rather than per token —
  which converts a variable cost into a fixed one, in both directions.
fieldMark: Rate limits are ceilings, not reservations. Provisioned throughput
  is the product you buy when you need the floor, and it bills whether or not
  you reach it.
useCase:
  scenario: >-
    A workload must not be throttled during a known peak, and standard limits
    are described as maximums rather than guarantees.
  detail: >-
    Ordinary rate limits state what you may not exceed, not what you are assured
    of getting under contention. Provisioned throughput buys the assurance:
    capacity reserved for you at a fixed hourly price, with longer commitments
    discounted further. It is worth it when the load is predictable and heavy,
    and wasteful the rest of the time, because idle reserved capacity costs
    exactly as much as busy reserved capacity.
relations:
  - type: distinguished-from
    target: token-billing
    note: >-
      Capacity by the hour against consumption by the token. The same service,
      billed on opposite principles.
  - type: consumes
    target: throughput
    note: What is being reserved — inputs and outputs per minute, at a committed level.
examples:
  - name: Bedrock Provisioned Throughput
    vendor: AWS
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    note: >-
      Priced per Model Unit per hour, with no-commitment, one-month and
      six-month terms at increasing discounts.
    verifiedOn: 2026-08-22
sources:
  - id: aws-prov-throughput
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    title: Increase model invocation capacity with Provisioned Throughput — AWS documentation
    verifiedOn: 2026-08-22
  - id: anthropic-rate-limits
    url: https://platform.claude.com/docs/en/api/rate-limits
    title: Rate limits — Claude Platform documentation
    verifiedOn: 2026-08-22
---

"Throughput refers to the number and rate of inputs and outputs that a model
processes and returns. You can purchase Provisioned Throughput to provision a
higher level of throughput for a model at a fixed cost. You're billed hourly for
a Provisioned Throughput that you purchase."[[cite:aws-prov-throughput]]

Hourly, for capacity — not per token, for consumption. That inversion is the
entire product.

## Why it exists

Because a [rate limit](rate-limit) is a ceiling and not a floor. Anthropic states
this explicitly: "all limits described here represent maximum allowed usage, not
guaranteed minimums."[[cite:anthropic-rate-limits]]

For most workloads that is fine. For one where being throttled is a business
problem, the difference between "you may not exceed this" and "this is reserved
for you" is the whole question, and provisioned capacity is the only product
that answers it.

## The unit and the commitment

AWS prices in Model Units: "an MU delivers a specific throughput level for the
specified model", specifying "the number of input tokens that an MU can process
across all requests within a span of one minute" and the equivalent for
output.[[cite:aws-prov-throughput]]

Capacity is then bought for a term, with the discount rising with the
commitment: "no commitment", one month, or six months, where longer terms mean
"the more discounted the hourly price becomes" and shorter ones can be deleted
at will.[[cite:aws-prov-throughput]]

That ladder is the familiar cloud bargain — certainty for the provider, price
for you.

## When the arithmetic works

Compare reserved cost per hour against what the same traffic would cost per
token, at your *actual* utilisation rather than your peak. Reserved capacity
costs the same idle as busy, so the break-even depends almost entirely on how
flat the load is.

Heavy and predictable favours provisioning. Spiky or exploratory favours
[token billing](token-billing) by a wide margin, and the mistake in both
directions is estimating from peak rather than from average.

## Where it becomes mandatory

AWS notes one case where the choice disappears: "if you customized a model, you
must purchase Provisioned Throughput to be able to use it."[[cite:aws-prov-throughput]] A [fine-tuned](fine-tuning) model cannot share capacity with
everyone else's traffic, so the serving cost of a custom model is structurally
different from the [base model](pretrained-model)'s — a fact worth knowing
before the fine-tuning run rather than after.