---
title: OpenAI Codex
kind: product
vendor: OpenAI
aka: [Codex]
tags: [product, agent, coding]
zoom: 1
summary: OpenAI's coding agent, running across a CLI, IDE extension, web, the
  ChatGPT desktop app and a cloud environment.
fieldMark: Codex is the coding surface of the ChatGPT family — the counterpart
  to Claude Code rather than to Cowork.
relations:
  - type: variant-of
    target: chatgpt
  - type: bundles
    target: local-file-access
    note: Through the CLI and IDE extension; Codex cloud runs remotely instead.
    support: partial
  - type: bundles
    target: command-execution
    note: Locally through the CLI and IDE extension; remotely in Codex cloud.
    support: partial
  - type: bundles
    target: background-execution
    note: Via Codex cloud.
  - type: bundles
    target: connector
  - type: distinguished-from
    target: claude-code
  - type: kind-of
    target: harness
examples:
  - name: OpenAI Codex
    vendor: OpenAI
    url: https://learn.chatgpt.com/docs
    note: >-
      Agent platform for code exploration, feature development, code review and
      issue resolution, running on a CLI, IDE extension, web, the ChatGPT
      desktop app including a Linux preview, and Codex cloud. GitLab project
      support added in beta.
    verifiedOn: 2026-08-22
sources:
  - id: openai-openai-codex
    url: https://learn.chatgpt.com/docs
    title: OpenAI Codex and ChatGPT documentation
    verifiedOn: 2026-08-22
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

Codex sits opposite [Claude Code](claude-code) in the two vendors' line-ups: the
coding-shaped packaging of a general agentic substrate.

Its documented workflows are code exploration, feature development, code review
and issue resolution, across a CLI, an IDE extension, the web, the ChatGPT
desktop app and Codex cloud.

## Same substrate, different packaging

OpenAI's own documentation says [ChatGPT Work](chatgpt-work) shares "core
execution, isolation, and permission mechanisms" with Codex. So the split
between them is audience and interface, not engine — precisely the relationship
[Cowork](claude-cowork) has with [Claude Code](claude-code).

Both vendors arrived at the same architecture: one agent substrate, two
packagings, divided by whether the user wants a terminal.

## Where the [surface](surface) changes the answer

Local access depends on where you run it. The CLI and IDE extension work against
files on your machine; Codex cloud runs remotely, which is what lets a task
outlive the window but also what puts your working tree out of reach.
