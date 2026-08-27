---
title: Time to first token
kind: concept
aka:
  - TTFT
  - prefill latency
canonical:
  status: none
  note: >-
    No surveyed glossary carries the term. It is standard in serving practice
    and universally abbreviated TTFT, but it belongs to the applied stack
    rather than to the machine-learning literature, and no body defines it.
tags: [runtime, constraint]
zoom: 3
summary: How long a request waits before the first token appears — the number
  users actually experience as speed.
fieldMark: TTFT scales with the length of the prompt, not the answer. If a
  system got slower to start when nothing about the model changed, look at what
  grew in the prompt.
useCase:
  scenario: >-
    An assistant feels sluggish only in long conversations, and the model, the
    hardware and the answer length are all unchanged.
  detail: >-
    The prompt grew. Every turn re-sends the whole conversation, and all of it
    must be processed before the first output token can be produced. The fix is
    not a faster model — it is sending less, or arranging for the unchanged
    prefix to be cached so it does not have to be processed again.
flow:
  scenario: >-
    Two systems finishing in the same eight seconds, one of which felt fast
    and one of which did not.
  path:
    - actor: A request
      where: a person, not a system
      does: >-
        sent, and then waited on in silence
    - node: time-to-first-token
      where: what the reader sees
      does: >-
        how long until anything appears at all
      self: true
    - node: token
      where: on the wire
      does: >-
        after which the rest arrive at their own rate
    - node: latency
      where: what the reader sees
      does: >-
        of which this is the half a person actually experiences
  returns: >-
    The number users feel, hidden inside the average
relations:
  - type: distinguished-from
    target: throughput
    note: >-
      Two halves of latency with different causes. Prompt length drives one;
      model size and memory bandwidth drive the other.
  - type: consumes
    target: token
    note: The prefill cost scales with how many are in the prompt.
examples:
  - name: Streaming messages
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/streaming
    note: >-
      Streaming is what makes TTFT visible: with `"stream": true` the first
      token reaches the client as soon as it exists.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-streaming
    url: https://platform.claude.com/docs/en/build-with-claude/streaming
    title: Streaming messages — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: anthropic-caching
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    title: Prompt caching — Claude Platform documentation
    verifiedOn: 2026-08-22
    quote: >-
      This eliminates the cache-miss latency penalty on the first user interaction, reducing time-to-first-token (TTFT) for latency-sensitive applications.  How it works Set max_tokens: 0 in your request.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

Before a [model](model) can emit anything, it has to read the whole prompt.
Every [token](token) in the input is processed, and the internal state that
[attention](attention) needs is computed across all of them. Only then does
generation begin.

That preparation is what time to first token measures, and it is why the number
tracks input length rather than output length — the opposite of
[throughput](throughput).

## Why it dominates the experience

Google's glossary lists input token length first among the factors influencing
[latency](latency).[[cite:google-glossary]] In an interactive product it is not
merely one factor: it is the entire perceived wait. With
[streaming](streaming), everything after the first token arrives progressively
and reads as progress; everything before it reads as the system doing
nothing.[[cite:anthropic-streaming]]

## What makes it worse

- **Long prompts.** The relationship is direct, and long-context work pays it on
  every call.
- **Growing conversations.** The [inference API](inference-api) is stateless, so
  the entire history is re-sent and re-processed each turn.
- **Large tool schemas and system prompts.** Paid on every request, including
  the ones that never use the tools.
- **Queueing.** Under contention, the wait to start being served is
  indistinguishable to the user from the model being slow.

## What fixes it

[Prompt caching](prompt-caching) is the direct answer: the vendor keeps the
processed state for a prefix and resumes from it instead of recomputing.
Anthropic describes this as "resuming from specific prefixes in your prompts",
reducing processing time and cost for "repetitive tasks or prompts with
consistent elements."[[cite:anthropic-caching]]

Sending less works too, and is usually the cheaper realisation: much of what
sits in a long prompt is there because nobody removed it.
