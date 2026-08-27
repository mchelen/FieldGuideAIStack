---
title: Approval Mode
aka: [permission mode, confirmation prompt]
canonical:
  status: de-facto
  term: Permission mode
  body: Anthropic, in the [Claude Code](claude-code) glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    The vendor term is "permission mode" — "the baseline approval behavior for
    the session". This page is titled "approval mode", which was written before
    the vendor term was checked; the two name the same thing and the vendor's
    is the one to use in writing. Nothing standardises the mode names
    themselves, which is what makes autonomy levels hard to compare.
tags: [capability, safety, product-anatomy]
zoom: 2
summary: The policy deciding which agent actions need your say-so — every one,
  only risky ones, or none.
fieldMark: A product with only one setting has made the trade-off for you. Look
  for a tier list; that is where the vendor tells you which actions it considers
  dangerous.
useCase:
  scenario: >-
    An agent is trusted to edit code and not trusted to push it.
  detail: >-
    The mode is where that line gets expressed as policy rather than as
    vigilance. Everything below the boundary runs freely; the irreversible step
    waits for a person. Placing it well is the whole skill — too few gates and
    a mistake escapes, too many and whoever is clicking approve stops reading,
    which manufactures the appearance of oversight without the substance.
relations:
  - type: part-of
    target: harness
  - type: consumes
    target: tool-use
    note: The gate sits between the model asking and the [harness](harness) doing.
sources:
  - id: anthropic-get-started
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    title: Get started with Claude Cowork — Anthropic Help Center
    verifiedOn: 2026-08-22
  - id: google-gemini-spark
    url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    title: Gemini Spark, new Chrome browsing integration — Google
    verifiedOn: 2026-08-22
---

[Tool use](tool-use) creates a gap between the model asking to do something and
something actually being done. Approval mode is the policy that fills the gap,
and it is where a product's real safety posture lives.

Anthropic's [Cowork](claude-cowork) documentation describes three settings: **manual**, pausing
for approval on every action; **auto**, running autonomously with safety checks
that block risky actions; and **skip**, with no prompts or checks. It also notes
that auto consumes more usage, because the safety verification is itself work.

That detail is worth dwelling on. Checking is not free, which means "safe by
default" has a running cost, which means there will always be pressure to turn
it off.

## Approval and [background execution](background-execution) pull against each
other

Confirm-everything is coherent while you are watching. It is useless for a task
running while you sleep — the agent stops at the first prompt and waits for
someone who is not there. So products that run unattended need a middle tier,
and the interesting question becomes *which actions land in it*.

Google's [Spark](gemini-spark) announcement draws that line at payments and other sensitive
transactions, keeping user approval for those while allowing routine web errands
to proceed. Every vendor draws it somewhere. Where they draw it tells you more
about the product than the feature list does.
