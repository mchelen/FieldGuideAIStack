---
title: Token billing
kind: concept
aka:
  - usage-based pricing
  - consumption pricing
canonical:
  status: de-facto
  term: Token-based pricing
  body: Universal across model providers; Anthropic publishes rates per million tokens
  url: https://platform.claude.com/docs/en/about-claude/pricing
  title: Pricing — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    No glossary defines it, because it is a commercial arrangement rather than
    a technical one. What makes it worth a page is that it changed what
    software costs are — from a fixed licence to a variable that scales with
    how much the product is used.
tags: [serving, economics]
zoom: 2
summary: Charging by consumption rather than by seat or licence — the unit
  being tokens, which is why the bill scales with how much the product is used
  rather than by how many people use it.
fieldMark: Token billing makes cost a property of usage, not of headcount. A
  successful feature therefore costs more than an unsuccessful one, which is
  the opposite of how software economics used to work.
useCase:
  scenario: >-
    A feature launches, gets popular, and the infrastructure bill rises with
    it rather than staying flat.
  detail: >-
    Under a per-seat licence the marginal user is free and the marginal query
    is free. Under token billing neither is, and cost becomes something product
    decisions move directly — a longer [system prompt](system-prompt), an extra reasoning step,
    a retry policy. That makes cost an engineering concern owned by the people
    writing prompts, which is a genuinely new arrangement and one most teams
    discover late.
flow:
  scenario: >-
    An invoice that goes up because usage went up, on a product with no
    seats to count.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        open an invoice with no seats on it
    - node: token
      where: your invoice
      does: >-
        the unit of consumption, in and out
    - node: token-billing
      where: your invoice
      does: >-
        charged by what you used, not by who has a licence
      self: true
    - node: token-pricing
      where: a contract, not a computer
      does: >-
        at different rates for input, output and cache reads
    - node: provisioned-throughput
      where: the host's own hardware
      does: >-
        or by the hour, if variable cost is the problem
  returns: >-
    Cost scales with use, which is the point and the risk
relations:
  - type: consumes
    target: token
    note: The unit the meter counts, in and out, at different rates.
  - type: distinguished-from
    target: subscription-tier
    note: >-
      Consumption against packaging. Most vendors sell both, to different
      buyers, for the same underlying service.
examples:
  - name: Claude pricing
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/about-claude/pricing
    note: >-
      Published per million tokens, with separate columns for base input, cache
      writes, cache reads and output.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-pricing
    url: https://platform.claude.com/docs/en/about-claude/pricing
    title: Pricing — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: aws-prov-throughput
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html
    title: Increase model invocation capacity with Provisioned Throughput — AWS documentation
    verifiedOn: 2026-08-22
---

Inference is metered. Vendors publish rates per million
[tokens](token) — Anthropic's table has separate columns for "Base Input
Tokens", cache writes at two lifetimes, "Cache Hits & Refreshes", and "Output
Tokens"[[cite:anthropic-pricing]] — and the bill is the sum of what actually
flowed.

## Why this arrangement rather than a licence

Because the cost of serving is genuinely variable. An
[accelerator](accelerator) is expensive, scarce and power-hungry, and a request
consumes a measurable amount of it. Charging a flat fee would mean heavy users
subsidised by light ones on a spread far wider than software licensing usually
copes with.

The consequence is that the vendor's cost structure is visible in the price
list, which is unusual and occasionally useful: output costs more than input
because generation is serial, and cached input costs a fraction because the work
was already done.

## What it changes for the people building

Cost becomes an engineering variable rather than a procurement line. Things that
were free under a licence now have a price:

- **Prompt length**, paid on every call — which is what makes
  [prompt caching](prompt-caching) an economic decision rather than an
  optimisation.
- **Conversation length**, since the [inference API](inference-api) is stateless
  and the whole history is re-sent.
- **Reasoning depth**, via [effort level](effort-level) and
  [test-time compute](test-time-compute).
- **Retries and [agentic loops](agentic-loop)**, where one user action can be
  dozens of billed calls.

That last one is why [cost per task](cost-per-task) is the number worth tracking
and per-call pricing is not.

## The alternatives, and who takes them

**[Provisioned throughput](provisioned-throughput)** — capacity by the hour
rather than consumption by the token, "billed hourly", with discounts for longer
commitments.[[cite:aws-prov-throughput]] For predictable heavy load.

**[Subscription tiers](subscription-tier)** — a flat price with a
[usage limit](usage-limit) behind it. For end users, who will not price a task
in tokens.

**[Self-hosting](self-hosting)** — capital and operations instead of a meter.

All three are ways of converting a variable cost into a fixed one, which is what
buyers generally want and what makes the variable arrangement the wholesale
option rather than the retail one.
