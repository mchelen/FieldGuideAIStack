---
title: Effort level
kind: concept
aka:
  - reasoning effort
  - thinking budget
canonical:
  status: de-facto
  term: Effort
  body: Anthropic, where it is an API parameter and a Claude Code setting
  url: https://platform.claude.com/docs/en/build-with-claude/effort
  title: Effort — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Each vendor names its own version of this dial, which is why the underlying
    idea is filed under test-time compute here and this page covers the
    productised control. Anthropic calls it effort; the concept has no settled
    cross-vendor name.
tags: [agentic, runtime]
zoom: 3
summary: How much inference compute a request may spend on reasoning — the
  productised form of test-time compute, exposed as a single setting.
fieldMark: Effort trades capability for cost and speed in one direction only.
  Lowering it is a decision to accept worse answers on hard requests, which is
  correct for easy ones and expensive to get wrong.
useCase:
  scenario: >-
    A pipeline runs thousands of simple classifications and a handful of
    genuinely hard analyses through the same model.
  detail: >-
    Spending maximum reasoning on the classifications wastes most of the budget
    on requests that were never difficult. Setting effort per request rather
    than per deployment lets one model serve both, and makes the routing
    decision explicit — which requests deserve the spend — rather than leaving
    it to a model tier chosen months ago.
relations:
  - type: kind-of
    target: test-time-compute
    note: The vendor control for it, exposed as one parameter.
  - type: part-of
    target: inference-api
    note: Set per request, alongside [temperature](temperature) and the rest.
examples:
  - name: The effort parameter
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/effort
    note: >-
      "Control how many tokens Claude uses when responding"; high is the
      default, and setting it to high is identical to omitting it.
    verifiedOn: 2026-08-22
  - name: Claude Code effort level
    vendor: Anthropic
    url: https://code.claude.com/docs/en/glossary
    note: >-
      "Controls how much of the adaptive-reasoning thinking budget Claude uses
      on each turn."
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-effort
    url: https://platform.claude.com/docs/en/build-with-claude/effort
    title: Effort — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A setting that controls how much of the adaptive-reasoning thinking budget Claude uses on each turn.
---

"The effort parameter lets you control how many tokens Claude spends when
responding to requests. You can trade off between response thoroughness and
token efficiency with a single model."[[cite:anthropic-effort]]

A single model is the significant phrase. Before a dial like this, choosing how
much compute a request got meant choosing a model tier — a procurement decision
made once. Effort makes it a per-request decision made by the caller.

## What the settings mean

Anthropic's default is high: "by default, Claude uses high effort, spending as
many tokens as needed for excellent results." It can be raised "to max for the
absolute highest capability", or lowered "to be more conservative with token
usage, optimizing for speed and cost while accepting some reduction in
capability."[[cite:anthropic-effort]]

Two details worth keeping: setting effort to high "produces exactly the same
behavior as omitting the effort parameter entirely", and the parameter "affects
all tokens in the res[ponse]" rather than only a thinking
phase.[[cite:anthropic-effort]]

In [Claude Code](claude-code) the same dial is described per [turn](turn): it
"controls how much of the adaptive-reasoning thinking budget Claude uses on each
turn. Higher effort means more thinking tokens and deeper reasoning; lower
effort is faster and cheaper."[[cite:claude-code-glossary]]

## Why it belongs to the caller

[Test-time compute](test-time-compute) is the concept; effort is the handle. The
significance of exposing it is that the person making the request usually knows
something the model does not — whether this particular question is hard, whether
anyone is waiting, whether being wrong is expensive.

That knowledge could not previously be expressed. Now it is one field.

## The honest caveat

Lowering effort buys speed and cost by "accepting some reduction in
capability."[[cite:anthropic-effort]] There is no setting that is cheaper and
equally good.

Which makes the interesting engineering question routing rather than tuning:
identifying which requests are genuinely easy, and being willing to be wrong
about it occasionally.
