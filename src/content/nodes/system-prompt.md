---
title: System prompt
kind: concept
aka:
  - system message
  - developer message
  - preamble
canonical:
  status: de-facto
  term: System prompt
  body: Anthropic, in the Claude Platform documentation, where it is the `system` parameter of the [Messages API](inference-api)
  url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
  title: Prompting best practices — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    No surveyed glossary carries the term; it is an API convention rather than
    a research concept. Vendors name the field differently — system, developer,
    instructions — for the same position in the request.
tags: [context, technique]
zoom: 2
summary: Standing instructions sent ahead of the conversation on every request,
  setting role, rules and format before the user says anything.
fieldMark: The system prompt is the product. Two products on the same model
  differ mostly here, and it is the part of a request the user never sees and
  cannot edit.
useCase:
  scenario: >-
    A support assistant should stay on topic, use the company's terminology, and
    never quote a price.
  detail: >-
    None of that belongs in the user's message, because the user does not know
    it and should not be able to change it. It goes in the system prompt, where
    it is applied to every request without being restated. The cost is that it
    is sent every time — so a long system prompt is a fixed charge on every
    call, which is what prompt caching exists to relieve.
flow:
  scenario: >-
    An assistant that answers in the wrong tone, and the fix is a paragraph
    nobody in the conversation can see.
  path:
    - actor: The operator
      does: >-
        writes standing rules once: role, format, what to refuse
    - node: system-prompt
      does: >-
        sent ahead of the conversation on every single request
      self: true
    - node: harness
      does: >-
        prepends it to the messages before each call
    - node: context-window
      does: >-
        it occupies space here permanently, and is billed every time
  returns: >-
    Strong guidance, not enforcement — content can argue with it
relations:
  - type: part-of
    target: context-window
    note: Occupies the front of it on every request, and is paid for on every request.
  - type: consumed-by
    target: harness
    note: >-
      The harness owns it. It is the main thing a harness contributes beyond
      the loop and the tools.
examples:
  - name: The `system` parameter
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
    note: >-
      A top-level request field rather than a message. "Setting a role in the
      system prompt focuses Claude's behavior and tone for your use case."
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-prompting
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
    title: Prompting best practices — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: anthropic-caching
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    title: Prompt caching — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

The system prompt is a separate field in the request rather than a message in
the conversation. On the Claude API it is the top-level `system` parameter, and
Anthropic's guidance is that "setting a role in the system prompt focuses
Claude's behavior and tone for your use case", noting that "even a single
sentence makes a difference."[[cite:anthropic-prompting]]

Google's glossary describes the same move under prompt categories, as a role
prompt.[[cite:google-glossary]] What the separate field adds is position and
[provenance](provenance): it always comes first, and it always comes from the operator.

## What lives in it

- **Role and tone** — who the assistant is and how it writes.
- **Rules** — what to refuse, what to never claim, when to hand off.
- **Format** — structure the caller intends to parse.
- **Context that never changes** — product facts, terminology, the current date.
- **Tool guidance** — when to reach for which tool, beyond what the schemas say.

Between two products built on the same [model](model), this file is most of the
difference. It is the [harness](harness)'s main contribution to behaviour
alongside the loop itself.

## Why it is not a security boundary

It is text in the same stream as everything else. The [model](model) is more
inclined to follow it, because [post-training](post-training) taught it to
prefer instructions in that position — but "more inclined" is a tendency, not a
guarantee.

Anything a system prompt forbids can be argued with, and a
[prompt injection](prompt-injection) arriving in a fetched document competes for
the same attention. Treat it as strong guidance and enforce real constraints
outside the model, in the [approval mode](approval-mode) and in what the tools
will actually do.

## What it costs

It is re-sent on every request, so a 5,000-token system prompt is a 5,000-token
charge on every single call, plus its share of
[time to first token](time-to-first-token).

This is precisely the workload [prompt caching](prompt-caching) exists for: an
unchanging prefix at the front of every request. Put the stable parts first and
the variable parts last, or the cache never hits.[[cite:anthropic-caching]]
