---
title: Connector
aka: [app connection, integration, plugin]
tags: [capability, interface, product-anatomy]
zoom: 2
summary: A packaged link between an assistant and an outside service, so it can
  read from and act in tools you already use.
fieldMark: Connectors are configured per account and listed in a settings panel.
  If you had to authorise it once and it now "just works", it is a connector.
relations:
  - type: implemented-by
    target: mcp
    note: MCP is the open protocol several vendors' connectors are built on.
  - type: consumed-by
    target: harness
sources:
  - url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
  - url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
  - url: https://gemini.google/overview/
    title: Gemini app overview — Google
    verifiedOn: 2026-08-22
---

A connector is the product-level packaging of [tool use](tool-use). The model
still just asks to call a function; the connector is what makes that function
exist, authenticated, without you writing code.

Cowork's documentation describes connecting Claude to tools and data sources
"using MCP", alongside skills and plugins, managed from a Customize panel and
synced from your account at session start. ChatGPT Work describes connected
apps under admin-controlled permissions. Gemini describes extensions into
Workspace, Maps, YouTube and others.

The same shape, three vocabularies.

## Why the scoping detail matters

Connectors are attached to an *account*, not to a machine, and the boundary is
sharper than it looks. Anthropic's documentation notes that Cowork loads the
connectors, skills and plugins enabled for your claude.ai account and
deliberately does **not** read the Claude Code CLI's `~/.claude` directory —
so a skill that exists only on your machine is invisible to Cowork until you
add it in Customize.

Two products from one vendor, sharing an engine, with different extension
scopes. That is exactly the kind of detail a spec sheet flattens and a field
guide should not.
