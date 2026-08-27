---
title: Memory
kind: concept
aka:
  - statefulness
  - term: Memory
    usedBy: OWASP Agentic Security Initiative
    url: https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/
    verifiedOn: 2026-08-22
    note: Named "Memory / Statefulness", one of three core agentic capabilities.
canonical:
  status: de-facto
  term: Memory / Statefulness
  body: OWASP Agentic Security Initiative, "Agentic AI — Threats and Mitigations" v1.1, CC BY-SA 4.0
  url: https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/
  title: Agentic AI — Threats and Mitigations v1.1 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [capability, runtime, product-anatomy]
zoom: 2
summary: What an agent retains — within a run, and across runs — given that the
  model underneath remembers nothing at all.
fieldMark: Ask whether a new session knows what the last one did. If it does,
  something wrote state down, and that something is not the model.
useCase:
  scenario: >-
    You tell an assistant on Monday that the team uses tabs, not spaces, and on
    Friday it uses tabs without being told again.
  detail: >-
    Nothing in the model made that happen. The inference API is stateless, so
    Friday's request carried Monday's preference because the harness stored it
    somewhere and chose to include it. Every design question follows from that:
    what gets written down, who can read it, how it is refreshed, and what
    happens when it becomes wrong. Memory is a harness feature that reads to
    users like a model one, which is why disappointment with it is so common.
flow:
  scenario: >-
    An assistant that remembers your project conventions on Monday, having
    been told them on Friday.
  path:
    - actor: A fact
      does: >-
        worth keeping past the end of this conversation
    - node: memory
      does: >-
        what the agent retains — the model underneath retains nothing
      self: true
    - node: short-term-memory
      does: >-
        within the run, this is just the conversation so far
    - node: long-term-memory
      does: >-
        across runs, it is files the harness reads and writes
    - node: context-window
      does: >-
        and either way it is re-sent, and re-paid for, on every call
  returns: >-
    A harness feature, every time. Never the model.
relations:
  - type: part-of
    target: harness
  - type: distinguished-from
    target: context-window
    note: The window is a per-call ceiling; memory is what survives between calls.
sources:
  - id: owasp-agentic-ai
    url: https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/
    title: Agentic AI — Threats and Mitigations v1.1 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
    note: >-
      Published December 2025 under CC BY-SA 4.0. Names Memory / Statefulness as
      one of three core agentic capabilities, alongside Planning & Reasoning and
      Action and Tool Use, and distinguishes session-based short-term from
      persistent long-term memory.
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
---

The [model](model) remembers nothing. The [inference API](inference-api) is
stateless and re-sends the whole conversation every turn. So any sense that a
system knows you is manufactured above the model, by a [harness](harness) that
decided to write something down and put it back in later.

OWASP's agentic taxonomy names this as one of three core capabilities, and
splits it the way the implementations do: **session-based short-term** memory,
holding the reasoning and tool results of the current run, and **persistent
long-term** memory that survives across runs.[[cite:owasp-agentic-ai]]

## Why it is not the [context window](context-window)

They get conflated constantly, and the distinction is sharp. The window is a
ceiling on a single call. Memory is what gets selected to go inside that ceiling
next time. A larger window does not give a system memory; it raises the budget
that memory competes for.

Put the other way: memory is a retrieval problem wearing a psychological name.
Something has to decide what is worth keeping, and later, what is worth
recalling — and both decisions are made by software, not by the model.

## What varies between products

- **Where it lives.** A file in your repository, a vendor-side profile, or a
  [vector store](vector-database). Anthropic's [Claude Code](claude-code)
  documents `CLAUDE.md` files read at the start of every session, plus auto
  memory that saves learnings across sessions without being
  asked.[[cite:anthropic-claude-code]]
- **Who can see it.** Personal, project, or organisation scope — which turns
  memory into an access-control question the moment more than one person is
  involved.
- **How it goes wrong.** OWASP lists memory and context poisoning among its top
  agentic risks, because state an attacker can write is state the agent will
  later trust.[[cite:owasp-agentic-ai]]

## The failure nobody designs for

Memory makes systems better until the day it makes them confidently wrong. A
preference recorded in March is applied in September; a fact that was true of
one project leaks into another. Stale memory is harder to notice than absent
memory, because the output stays fluent — it just quietly stops matching
reality.
