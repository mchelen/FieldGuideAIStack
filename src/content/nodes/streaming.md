---
title: Streaming
kind: concept
aka:
  - server-sent events
  - SSE
  - incremental response
canonical:
  status: de-facto
  term: Streaming
  body: Anthropic, in the Claude Platform documentation; the transport is the W3C server-sent events standard
  url: https://platform.claude.com/docs/en/build-with-claude/streaming
  title: Streaming messages — Claude Platform documentation
  verifiedOn: 2026-08-22
tags: [runtime, interfaces]
zoom: 2
summary: Returning tokens as they are produced instead of waiting for the whole
  response — the reason chat interfaces feel responsive.
fieldMark: Streaming changes nothing about how long the full answer takes. It
  changes when you see the first word, which is the only part users measure.
useCase:
  scenario: >-
    A long answer takes twelve seconds either way, and one version feels fine.
  detail: >-
    Streamed, the first words appear in under a second and the rest arrives
    faster than anyone reads. Buffered, the user watches a spinner for twelve
    seconds. The total is identical; the experience is not comparable. This is
    also why streaming is close to mandatory for anything interactive and
    unnecessary for anything batch.
relations:
  - type: part-of
    target: inference-api
    note: A request option, set per call.
  - type: consumes
    target: token
    note: Delivered as they are generated rather than accumulated.
examples:
  - name: Claude streaming messages
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/streaming
    note: >-
      Set `"stream": true` to receive the response incrementally as server-sent
      events, including text, tool use and thinking deltas.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-streaming
    url: https://platform.claude.com/docs/en/build-with-claude/streaming
    title: Streaming messages — Claude Platform documentation
    verifiedOn: 2026-08-22
---

"When creating a Message, you can set `"stream": true` to incrementally stream
the response using server-sent events (SSE)."[[cite:anthropic-streaming]] One
flag, and the response arrives as a sequence of deltas rather than a single
body.

Nothing about generation changes. The [model](model) was always producing one
[token](token) at a time; streaming simply stops hiding that from the client.

## What it buys and does not buy

It buys perceived speed, entirely through
[time to first token](time-to-first-token). Total
[latency](latency) is unchanged — arguably slightly worse, given per-event
overhead — and the user's experience is transformed anyway, because a wait with
visible progress is a different thing from a wait without it.

## What it costs the client

Streaming makes the response a process rather than a value, and several things
that were simple stop being simple:

- **Partial output on failure.** A connection that drops mid-stream leaves you
  holding half an answer. Anthropic's guidance is to capture what arrived and
  construct a continuation request that asks the model to resume from
  it.[[cite:anthropic-streaming]]
- **Structure arrives incrementally.** JSON is not parseable until it is
  complete, so anything rendering structured output has to buffer or parse
  speculatively.
- **Content blocks are not uniform.** Messages "can contain multiple content
  blocks (`text`, `tool_use`, `thinking`)", and Anthropic notes that
  [tool use](tool-use) and extended thinking blocks "cannot be partially
  recovered."[[cite:anthropic-streaming]]

## When not to stream

[Batch inference](batch-inference) and any pipeline where a machine consumes the
whole output. Nobody is watching, partial output has no value, and the
complexity buys nothing.

Streaming is a user-interface decision that happens to live in the API.
