---
title: Gemini (product family)
kind: suite
vendor: Google
aka: [Gemini ecosystem]
tags: [suite, product]
zoom: 1
summary: Google's family — the Gemini assistant and the Spark agent — split by
  subscription tier rather than by product name or interface.
fieldMark: Google gates the agent behind a paid tier rather than a separate
  product. The same app does more or less depending on what you pay.
relations:
  - type: contains
    target: gemini-app
  - type: contains
    target: gemini-spark
  - type: kind-of
    target: product-suite
sources:
  - url: https://gemini.google/overview/
    title: Gemini app overview — Google
    verifiedOn: 2026-08-22
  - url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    title: Gemini Spark, new Chrome browsing integration — Google
    verifiedOn: 2026-08-22
---

The third packaging strategy. Where Anthropic sells separate products and
OpenAI sells modes, Google sells **tiers**: [Gemini](gemini-app) is the
assistant, and [Gemini Spark](gemini-spark) is the agent, reached by
subscribing rather than by switching product or mode.

## No coding product in the family

The gap in the table is real rather than an omission on my part. Anthropic and
OpenAI both ship a coding-shaped packaging of their agent; Google's family, as
documented on these pages, does not have a direct counterpart in the consumer
Gemini line.

That is worth stating rather than quietly leaving blank, and worth re-checking
— it is the kind of gap that closes without announcement.

## What the tier model changes

Tiering has the same effect as OpenAI's modes but for a different reason: the
product name is stable while its capabilities move underneath. Two people can
both say "I use Gemini" and mean materially different things, and neither is
wrong.

It also puts the most consequential capability in this guide —
[browser automation](browser-automation) using your logged-in accounts and
saved passwords — behind a payment rather than behind a separate installation
or an explicit switch.
