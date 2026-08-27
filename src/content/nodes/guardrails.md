---
title: Guardrails
kind: concept
aka:
  - safety filters
  - content moderation
canonical:
  status: de-facto
  term: Guardrails
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google's definition is unusually broad — "any software or process that
    prevents harm to humans or systems" — which covers most of the safety
    section of this guide. In vendor marketing it usually means input and
    output classifiers specifically.
tags: [safety]
zoom: 2
summary: Checks around the model that block disallowed input or output —
  external to the model, and therefore not arguable with.
fieldMark: A guardrail runs outside the model. If a rule is enforced by asking
  the model nicely, it is a system prompt instruction, not a guardrail, and it
  can be talked out of.
useCase:
  scenario: >-
    A product must never emit a customer's full card number, whatever the user
    asks.
  detail: >-
    Instructing the model not to gets it right nearly always, and nearly is not
    a policy. A classifier or a regular expression on the way out blocks the
    string regardless of what the model decided, and cannot be argued with
    because it is not participating in the conversation. That independence is
    the entire property being bought.
relations:
  - type: part-of
    target: permission-model
    note: The output-side layer, alongside what the [harness](harness) will and will not execute.
  - type: distinguished-from
    target: approval-mode
    note: >-
      A guardrail decides automatically and always. An approval mode routes a
      decision to a person.
examples:
  - name: Machine Learning Glossary
    vendor: Google
    url: https://developers.google.com/machine-learning/glossary
    note: >-
      "Any software or process that prevents harm to humans or systems",
      including data leaks and offensive material.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      Any software or process that prevents harm to humans or systems.
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

Guardrails are "any software or process that prevents harm to humans or
systems", where harm "can take many forms, including preventing data leaks or
unauthorized access, or ensuring that an LLM's responses don't contain offensive
material."[[cite:google-glossary]]

That is broad enough to cover a [sandbox](sandbox), a
[permission model](permission-model) and an
[approval mode](approval-mode). In practice the word usually means something
narrower: classifiers on the way in and on the way out.

## Why external is the whole point

A [system prompt](system-prompt) instruction is guidance the
[model](model) weighs against everything else in its
[context window](context-window), and a
[prompt injection](prompt-injection) competes with it on equal terms.

A guardrail does not weigh anything. It is a separate check — a classifier, a
regular expression, a schema, an allowlist — that runs regardless of what the
model concluded and cannot be persuaded, because it is not in the conversation.

The distinction is the same one that separates advice from mechanism throughout
the [permission model](permission-model), applied to content rather than to
actions.

## Where they sit

- **Input** — before the model sees it. Catches obvious abuse and known attack
  strings, and misses anything phrased differently.
- **Output** — before the user sees it. Catches leaked secrets, personal data
  and disallowed content, and is where the reliable wins are.
- **Between steps** — in an [agentic loop](agentic-loop), on tool arguments and
  tool results. The least common and often the most valuable, since this is
  where [indirect prompt injection](indirect-prompt-injection) arrives.

## What they cannot do

Detect prompt injection reliably. The attack is indistinguishable from
legitimate text — a document warning about injection contains the same strings
as an attack — and OWASP's agentic guidance is explicit that agents "cannot
reliably distinguish instructions from related
content."[[cite:owasp-agentic-top]]

So a guardrail is good at recognising *outputs* that must not pass, and poor at
recognising *inputs* that intend harm. Designing around the first and not
relying on the second is the difference between a guardrail that helps and one
that provides the appearance of safety.

## The cost of a bad one

False positives are the usual failure, and they are expensive in a specific way:
a guardrail that blocks legitimate work teaches users to route around it, which
removes the guardrail and the visibility at the same time.
