---
title: ChatGPT
kind: product
vendor: OpenAI
aka: [ChatGPT app]
tags: [product, assistant]
zoom: 1
summary: OpenAI's conversational assistant, running on web, desktop and mobile,
  with connected apps and an agent mode you switch into.
fieldMark: ChatGPT is the container rather than a single behaviour. What it can
  do depends on which mode you selected, which is why capability questions about
  "ChatGPT" rarely have one answer.
relations:
  - type: bundles
    target: connector
  - type: has-variant
    target: chatgpt-work
    note: Work is documented as a mode within ChatGPT, not a separate product.
  - type: distinguished-from
    target: claude-app
examples:
  - name: ChatGPT
    vendor: OpenAI
    url: https://learn.chatgpt.com/docs
    note: >-
      Conversational assistant available on web, desktop app including a Linux
      preview, and mobile, with connected apps and agent mode alongside the
      Codex surfaces.
    verifiedOn: 2026-08-22
sources:
  - id: openai-openai-codex
    url: https://learn.chatgpt.com/docs
    title: OpenAI Codex and ChatGPT documentation
    verifiedOn: 2026-08-22
---

ChatGPT is best read as a container rather than a capability. OpenAI's
documentation presents Chat, Work and Codex as modes and surfaces within one
[product family](product-suite), which means the honest answer to "what can ChatGPT do" is
"which mode?"

That packaging choice is the single biggest difference from Anthropic's, where
[Claude](claude-app), [Cowork](claude-cowork) and [Claude Code](claude-code) are
named products you switch between. The underlying split — conversation, general
agentic work, coding — is the same in both.

## Chat versus the rest

Plain ChatGPT is the [Claude](claude-app) equivalent: conversation, uploaded
files, [connectors](connector) into services you have authorised. Everything
autonomous belongs to [ChatGPT Work](chatgpt-work) or [Codex](openai-codex),
and their sandboxes differ from chat's and from each other's.
