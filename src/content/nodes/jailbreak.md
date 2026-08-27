---
title: Jailbreak
kind: concept
aka: [safety bypass]
canonical:
  status: de-facto
  term: Jailbreaking
  body: OWASP GenAI Security Project, treated under LLM01 Prompt Injection
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 3
summary: A user persuading a model to do what its training told it to refuse.
fieldMark: The user is the adversary and wants the output. That is the whole
  difference from injection, where the user is the victim.
useCase:
  scenario: >-
    A safety team needs to know whether a refusal actually holds, or only holds
    against people who ask politely.
  detail: >-
    Jailbreaks are how that gets measured, which is why red teams write them
    deliberately. It also explains why the same technique reads as an attack in
    one context and as [evaluation](evaluation) in another: the text is identical and only the
    intent differs, so no filter can separate them and the question is always
    about who is asking rather than what they typed.
relations:
  - type: consumes
    target: model
    note: A jailbreak targets the model's refusal training rather than the harness.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

The distinction from [prompt injection](prompt-injection) is about *who wants
the outcome*, and it is worth holding onto because the two need opposite
defences.

In a jailbreak the user is the adversary. They want the model to produce
something it was trained to decline, and they are willing to spend effort on
phrasing to get it. In injection the user is the victim: somebody else's text
redirected the system while the user was asking for something ordinary.

## Why the defences do not transfer

A jailbreak is a problem between the operator and the user, and the defences
are commercial as much as technical — terms of service, account suspension,
rate limits, refusal training. The user is identifiable and accountable.

Injection is a problem between the system and the data it reads, and none of
those defences apply: there is no account to suspend, because the attacker
never had one.

## What it means for agents

Jailbreaking an agent gets the attacker whatever the agent's own credentials
reach — which is often less than they would like, and always more than the
operator intended. Refusal training constrains what the model will say; it does
not constrain what the [harness](harness) will do. That gap is where
[approval mode](approval-mode) and [excessive agency](excessive-agency) live.
