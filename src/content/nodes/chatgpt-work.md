---
title: ChatGPT Work
kind: product
vendor: OpenAI
aka: [Work mode, ChatGPT agent mode]
tags: [product, agent]
zoom: 1
summary: OpenAI's agentic mode for multi-step work inside Business and
  Enterprise workspaces, producing documents, spreadsheets and presentations.
fieldMark: There is no "ChatGPT Cowork". OpenAI shipped Work, and calls it a
  mode within ChatGPT rather than a separate product — the naming near-collision
  with Claude Cowork is the thing to watch for.
relations:
  - type: variant-of
    target: chatgpt
  - type: bundles
    target: local-file-access
    note: Desktop app only. On the web it runs in an isolated cloud environment and cannot reach local files.
    support: partial
  - type: bundles
    target: browser-automation
    note: Cloud browser only — documented as unable to accept credentials, sign in, or complete payments.
    support: partial
  - type: bundles
    target: command-execution
    note: Code and shell execution inside an isolated cloud environment, with configurable network access.
    support: partial
  - type: bundles
    target: background-execution
  - type: bundles
    target: connector
  - type: distinguished-from
    target: claude-cowork
    note: Closest counterpart across vendors, and the reason for the naming confusion.
examples:
  - name: ChatGPT Work
    vendor: OpenAI
    url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    note: >-
      Enterprise experience within ChatGPT Business and Enterprise workspaces
      that completes multi-step tasks using the information, files, applications
      and tools available to an authorised workspace member. Shares core
      execution, isolation and permission mechanisms with Codex.
    verifiedOn: 2026-08-22
sources:
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

Start with the naming, because it is the most common mistake about this product:
**OpenAI has not shipped anything called "ChatGPT Cowork."** It shipped *Work*,
and describes it as an experience within ChatGPT Business and Enterprise
workspaces rather than a standalone product.

The confusion is understandable — [Claude Cowork](claude-cowork) occupies the
same niche — but the names are not parallel and neither are the sandboxes.

## What it ships

Its documentation describes completing "multi-step tasks using the information,
files, applications, and tools available to an authorized workspace member",
with code and shell execution under configurable network access controls.

Two limits deserve emphasis because they are where it diverges most from its
Anthropic counterpart:

- **[Local file access](local-file-access) is surface-dependent.** On the web it
  "operates in isolated cloud environments and cannot directly access local
  files or apps" — you upload, or you reach data through connected apps. The
  desktop app can reach local resources.
- **[Browser automation](browser-automation) is uncredentialed.** The cloud
  browser "can't accept credentials, use a password manager or saved form
  entries, sign in to a website, or complete payments."

That second limit is a deliberate and consequential difference from
[Gemini Spark](gemini-spark), which does the opposite.

## Relationship to Codex

OpenAI's documentation says Work shares "core execution, isolation, and
permission mechanisms" with [Codex](openai-codex). The same structural pattern
as Anthropic's: one agentic substrate, packaged for coders and non-coders
separately.
