---
title: Subscription tier
kind: concept
aka:
  - plan
  - seat pricing
canonical:
  status: none
  note: >-
    Ordinary commercial vocabulary with no technical definition. It earns a
    page because tiers decide which capabilities a user has at all, which makes
    "can product X do Y" a question about the plan as often as about the
    product.
tags: [economics]
zoom: 2
summary: The packaging that decides which capabilities you get at all — and the
  usual reason two people describe the same product differently.
fieldMark: When two accounts of a product disagree, check the plans before
  checking the facts. Tier gating is the most common source of contradictory
  but honest reports.
useCase:
  scenario: >-
    A colleague says the product can run scheduled tasks and yours cannot find
    the setting.
  detail: >-
    Both statements are true on their own plans. Capability gating by tier is
    pervasive and rarely visible from inside the product — the feature is not
    disabled with an explanation, it is simply absent. This is worth checking
    first in any disagreement about what a product does, and it is why this
    guide records capabilities per product with sources rather than from
    experience.
flow:
  scenario: >-
    Two accounts on the same product where one has a capability the other
    cannot buy at any usage level.
  path:
    - actor: A capability
      does: >-
        present in the product, absent from your account
    - node: subscription-tier
      does: >-
        the packaging that decides what you get at all
      self: true
    - node: usage-limit
      does: >-
        and how much of it, over a period
    - node: token-billing
      does: >-
        as opposed to paying for what you actually used
  returns: >-
    Which features exist for you is decided here, not by usage
relations:
  - type: consumes
    target: usage-limit
    note: The cap behind the flat price, and usually what separates one tier from the next.
examples:
  - name: Claude API usage tiers
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/api/rate-limits
    note: >-
      Rate and usage limits are set per tier, with organisations moving between
      tiers as usage history accumulates.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-rate-limits
    url: https://platform.claude.com/docs/en/api/rate-limits
    title: Rate limits — Claude Platform documentation
    verifiedOn: 2026-08-22
---

A tier is a bundle: a price, a set of capabilities, and a
[usage limit](usage-limit). It is not a technical concept at all, and it decides
more about what a person can actually do than most technical concepts on these
pages.

## Why it belongs in a field guide

Because capability gating makes product descriptions unreliable. Two users of
the same named product may have access to different models, different
[context windows](context-window), different tools, and different
[background execution](background-execution) — with nothing in the interface
explaining the difference.

The practical consequence is a research discipline: a claim about what a product
does needs the plan attached, or it is not a claim about anything. That is why
the product pages in this guide cite documentation rather than experience.

## Flat price over a variable cost

A subscription is a fixed price for a service whose delivery cost is
variable — every request consumes [tokens](token) the vendor pays for. The
arrangement only works with a ceiling behind it, which is what the
[usage limit](usage-limit) is doing.

Hence the shape almost every consumer plan has taken: a monthly price, a cap
expressed in messages or a weekly allowance, and a reset. The cap is not an
afterthought; it is what makes the flat price possible.

## Tiers as a rate-limit mechanism too

On the API side, tiers do the same job with different vocabulary. Anthropic's
limits are set per tier, with organisations placed on one and moving between
them as usage history accumulates — and on some platforms not moving
automatically at all.[[cite:anthropic-rate-limits]]

So "which tier" answers questions about [throughput](throughput) as well as about features,
which is worth knowing when a capacity problem looks technical and is
commercial.

## What to ask about a plan

- **Which models**, and at what [context window](context-window).
- **Which capabilities** — tools, [computer use](computer-use),
  [scheduled tasks](scheduled-task), background runs.
- **What the cap is**, in what unit, and when it resets.
- **What happens at the cap** — queue, degrade to a smaller model, or stop.

The last one is the least documented and the most consequential, because it
determines whether hitting the limit is an inconvenience or an outage.
