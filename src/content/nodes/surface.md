---
title: Surface
aka: [client, entry point]
canonical:
  status: de-facto
  term: Surface
  body: Anthropic, in the Claude Code glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    Vendor vocabulary rather than industry vocabulary — Anthropic defines it as
    "any place you access Claude Code: the CLI, VS Code, JetBrains, Desktop, or
    claude.ai", noting that "all surfaces share the same engine". Other vendors
    have no single word for the distinction, which is part of why product
    comparisons go wrong.
tags: [runtime, product-anatomy]
zoom: 2
summary: Where you actually meet an agent — terminal, IDE, desktop app,
  browser, chat client — as distinct from the engine running underneath it.
fieldMark: Vendors ship the same engine on several surfaces and name each one
  differently. When two products sound like rivals, check whether they are
  actually one engine wearing two faces.
useCase:
  scenario: >-
    Two things with different names turn out to be the same product.
  detail: >-
    A CLI, an IDE extension and a desktop app can be one engine with three
    front ends, and vendors name each one separately. Anthropic's glossary is
    explicit that surfaces "share the same engine" while differing in what they
    can reach — local sessions read your files and settings, cloud sessions
    start from a fresh clone. Asking which surface, rather than which product,
    is usually the question that resolves a contradiction.
relations:
  - type: part-of
    target: harness
    note: The surface is the harness's front end, not a separate system.
sources:
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
    quote: >-
      Get started Claude Code runs on several surfaces: the terminal, IDE extensions, a desktop app, and the web.
  - id: anthropic-cowork-overview
    url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
---

Surface is the most under-used word in this vocabulary, and the one that
dissolves the most confusion. It names *where you sit* — not what is doing the
work.

Anthropic's own documentation is explicit that [Claude Code](claude-code) runs on several
surfaces — terminal, IDE extensions, desktop app, web — and that "each surface
connects to the same underlying Claude Code engine." Cowork's docs go further:
Cowork "uses the same agentic architecture that powers Claude Code, accessible
within Claude Desktop without opening the terminal."

So Claude Code and Cowork are not two engines. They are one agentic
architecture presented to two audiences: one that lives in a terminal, one that
does not.

## Why the distinction earns its own node

Once you separate surface from engine, product comparisons stop being
mysterious:

- **Same engine, different surface** — a repackaging, aimed at a new audience.
- **Different engine, same surface** — a genuine capability difference hiding
  behind a familiar window.
- **Different sandbox per surface** — the same product can have different
  powers depending on where it runs. [ChatGPT Work](chatgpt-work)'s documentation is direct
  about this: on the web it "operates in isolated cloud environments and cannot
  directly access local files or apps," while the desktop app can reach local
  resources.

That last case is the one that catches people out. "Can it edit my files?" has
no single answer for a product — only for a product *on a surface*.
