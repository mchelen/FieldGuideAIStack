---
title: Claude (product family)
kind: suite
vendor: Anthropic
aka: [Claude ecosystem, Claude suite]
tags: [suite, product]
zoom: 1
summary: Anthropic's family — the Claude assistant, Cowork and Claude Code —
  built on one agentic architecture and sold as separately named products.
fieldMark: Anthropic uses "Claude" for both the assistant and the whole family,
  so "does Claude do that?" is ambiguous by construction. Ask which product.
relations:
  - type: contains
    target: claude-app
  - type: contains
    target: claude-cowork
  - type: contains
    target: claude-code
  - type: kind-of
    target: product-suite
sources:
  - id: anthropic-cowork-overview
    url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
  - id: anthropic-get-started
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    title: Get started with Claude Cowork — Anthropic Help Center
    verifiedOn: 2026-08-22
---

Three products, one engine. Anthropic's own documentation says Cowork "uses the
same agentic architecture that powers [Claude Code](claude-code)", and its docs say
its terminal, IDE, desktop and web surfaces all "connect to the same underlying
Claude Code engine".

## The naming problem

"Claude" names both the conversational assistant and the family it belongs to.
That is not pedantry: it means a sentence like "Claude can't edit my files" is
true of the product and false of the family, and both readings are natural.

This guide splits them — [Claude](claude-app) is the assistant, this page is
the family — because the comparison questions people actually ask are about one
or the other and almost never about both.

## What is shared, and what is not

| | Shared across the family |
| --- | --- |
| Subscription | Yes — one paid plan covers them |
| Agentic engine | Yes — documented explicitly |
| [Connectors](connector), skills, plugins | Account-level, and **not** symmetric |

The asymmetry is documented and easy to miss. Cowork loads what is enabled for
your claude.ai account and deliberately does not read the Claude Code CLI's
`~/.claude` directory, so a skill written for the CLI is invisible in Cowork
until you add it again.

## Choosing between them

Not a capability question — see the [comparison](/compare) for what each
actually bundles. It reduces to two things: whether you want a terminal, and
whether the deliverable is a commit or a document.
