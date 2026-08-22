---
title: Software development kit
kind: concept
aka:
  - SDK
  - client library
canonical:
  status: de-facto
  term: Client SDK
  body: Anthropic, which distinguishes client SDKs from the CLI and from framework libraries
  url: https://platform.claude.com/docs/en/cli-sdks-libraries/overview
  title: CLI, SDKs, and libraries — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Ordinary software vocabulary. The distinction worth keeping is between an
    SDK, which wraps the API call, and a harness or framework, which wraps the
    loop — they are frequently marketed as the same kind of thing.
tags: [interfaces, structure]
zoom: 3
summary: The vendor library wrapping an inference API — types, retries and
  streaming, so you are not assembling HTTP requests by hand.
fieldMark: An SDK gives you the call. A harness gives you the loop. If a
  library manages conversation state, tools and a permission model, it is the
  second thing wearing the first thing's name.
useCase:
  scenario: >-
    A first integration is written with raw HTTP and works, then starts failing
    intermittently under load.
  detail: >-
    What is missing is everything an SDK already handles: retry with backoff on
    429 and 5xx, respecting the retry-after header, accumulating a streamed
    response correctly across event types, and typed request bodies that catch
    a malformed parameter before it becomes a runtime error. None of it is hard
    and all of it is tedious, which is precisely the work a client library is
    for.
relations:
  - type: consumes
    target: inference-api
    note: A wrapper over the HTTP surface, not a different one.
  - type: distinguished-from
    target: harness
    note: >-
      An SDK wraps the call. A harness wraps the loop — state, tools, approvals.
      Marketing rarely separates them.
examples:
  - name: Claude client SDKs
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/cli-sdks-libraries/overview
    note: >-
      "General-purpose Messages API clients for Python, TypeScript, C#, Go,
      Java, PHP, and Ruby", with streaming, retries and error handling built in.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-sdks
    url: https://platform.claude.com/docs/en/cli-sdks-libraries/overview
    title: CLI, SDKs, and libraries — Claude Platform documentation
    verifiedOn: 2026-08-22
---

Anthropic separates its tooling into three kinds, and the separation is the
useful part: a CLI "for shell scripting and interactive use", client SDKs —
"general-purpose Messages API clients" — and "libraries and
integrations."[[cite:anthropic-sdks]]

The SDKs are described as providing "idiomatic interfaces, type safety, and
built-in support for streaming, retries, and error
handling", across "Python, TypeScript, C#, Go, Java, PHP, and
Ruby."[[cite:anthropic-sdks]]

## What it saves you

Nothing conceptual. The [inference API](inference-api) is HTTP and can be called
with `curl`. What an SDK removes is a list of small correctness problems that
each cost an afternoon and a production incident:

- **Retries** that respect `retry-after` and back off, rather than hammering a
  [rate limit](rate-limit).
- **[Streaming](streaming)** accumulation across several event types, including
  the ones that cannot be partially recovered.
- **Types**, so a wrong parameter name fails at compile time rather than as a
  400 in production.
- **Auth and versioning headers**, set correctly and consistently.

## Why it is not a harness

This is the distinction that matters and the one most often blurred. An SDK
gives you *one call, done properly*. A [harness](harness) gives you the
[agentic loop](agentic-loop): conversation state, tool execution, an
[approval mode](approval-mode), [context engineering](context-engineering).

A library that manages all of that is an agent framework wearing an SDK's name,
and the question to ask before adopting one is which of the two you actually
need. A great many applications need the first and buy the second.

## The portability question

An SDK is vendor-specific by construction — it wraps one vendor's API shape.
Switching providers means rewriting the call sites, which is the ordinary cost of
a client library and worth knowing about before it is load-bearing.

Anthropic's own list includes an OpenAI SDK compatibility
layer,[[cite:anthropic-sdks]] which is the usual industry response: not a
standard, but a shim that lets code written against the most widespread shape
reach a different [model provider](model-provider).
