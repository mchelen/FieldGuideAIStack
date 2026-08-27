---
title: Prompt caching
kind: concept
aka:
  - context caching
  - prefix caching
canonical:
  status: de-facto
  term: Prompt caching
  body: Anthropic, in the Claude Platform documentation
  url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
  title: Prompt caching — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Named similarly across vendors — prompt caching, context caching, prefix
    caching — with the mechanism identical and the pricing and lifetimes
    different. No standard exists; the feature is about four years old.
tags: [runtime, economics]
zoom: 2
summary: Keeping the processed state of a prompt prefix between requests, so
  repeated context is paid for once rather than on every call.
fieldMark: It only works on an exact prefix. Change one character near the top
  of the prompt — a timestamp in the system prompt is the classic — and
  everything after it is a cache miss.
useCase:
  scenario: >-
    An agent re-sends the same 30,000-token system prompt and tool schema on
    every step of a long task.
  detail: >-
    Without caching, that prefix is processed and billed on every call, which
    for a fifty-step task means fifty times. With it, the prefix is written once
    and read thereafter — on the Claude API, a read costs a tenth of the base
    input token price. Agent economics rest on this more than on any other
    single feature, because agents are precisely the workload that re-sends an
    unchanged prefix over and over.
flow:
  scenario: >-
    Step 12 of a fifty-step agent task, re-sending the same 30,000-token system
    prompt and tool schema it sent on step 11.
  path:
    - actor: The agent
      does: re-sends the unchanged prefix, then the new step
    - node: inference-api
      does: receives the call and looks at the prefix first
    - node: prompt-caching
      does: finds the prefix already stored and stops there
      self: true
    - node: kv-cache
      does: hands back the attention state instead of rebuilding it
    - node: model
      does: processes only the new step
  returns: Prefix read at 0.1x, not processed again
relations:
  - type: consumes
    target: kv-cache
    note: The same attention state, retained between requests rather than within one.
  - type: part-of
    target: inference-api
    note: A request-level feature, enabled per call rather than per model.
examples:
  - name: Claude prompt caching
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    note: >-
      Automatic caching or explicit `cache_control` breakpoints, with 5-minute
      and 1-hour lifetimes.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-caching
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    title: Prompt caching — Claude Platform documentation
    verifiedOn: 2026-08-22
    note: >-
      Pricing multipliers, minimum cacheable lengths and retention behaviour
      read from this page on the date shown. All are vendor policy and move.
  - id: vllm-paper
    url: https://arxiv.org/abs/2309.06180
    title: Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al.
    verifiedOn: 2026-08-22
---

Prompt caching "optimizes your API usage by allowing resuming from specific
prefixes in your prompts", which "significantly reduces processing time and
costs for repetitive tasks or prompts with consistent
elements."[[cite:anthropic-caching]]

The mechanism is the [KV cache](kv-cache) surviving past the end of a request.
Anthropic describes the flow: the system "checks if a prompt prefix, up to a
specified cache breakpoint, is already cached from a recent query. If found, it
uses the cached version … Otherwise, it processes the full prompt and caches the
prefix once the response begins."[[cite:anthropic-caching]]

## Prefix, and only prefix

This is the constraint everything else follows from. Caching resumes from a
point; it cannot skip a changed region and pick up after it, because the state
at every position depends on everything before it.

So prompt layout becomes a cost decision. Stable content — [system
prompt](system-prompt), tool schemas, the document under discussion — goes at
the top. Anything that varies goes at the bottom. A timestamp or a session id
near the front of a long prompt invalidates the entire cache on every call, and
does so silently.

## What it costs and saves

On the Claude API at the date read: 5-minute cache writes are billed at 1.25×
the base input token price, 1-hour writes at 2×, and **cache reads at 0.1×**.
There is a floor on what can be cached — 512 tokens for some models, 1,024 or
more for others — and entries have "a minimum lifetime of 5 minutes (standard)
or 1 hour (extended)".[[cite:anthropic-caching]]

The arithmetic that follows: a prefix read twice roughly breaks even, and one
read many times approaches a 90% saving on that portion. These are vendor
figures on a vendor page and they move; the shape of the trade is what is stable.

## Why agents depend on it

An [agent](agent) loop re-sends a growing conversation on every step, because
the [inference API](inference-api) is stateless. The prefix is identical each
time by construction. Without caching, cost grows with the square of the number
of steps; with it, roughly linearly.

Multi-step agentic work is not merely cheaper with prompt caching — at long
horizons it is a different order of expense.

## What it is not

Not a semantic cache. It does not recognise that two differently-worded requests
mean the same thing, and returns no saved *answers* — only saved processing of
identical leading text. And it is not memory: nothing carries across a lapsed
cache except what you send again.[[cite:vllm-paper]]
