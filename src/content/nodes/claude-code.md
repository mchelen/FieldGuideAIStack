---
title: Claude Code
kind: product
vendor: Anthropic
aka: [claude CLI]
tags: [product, agent, coding]
zoom: 1
summary: Anthropic's agentic coding tool — reads a codebase, edits files, runs
  commands, and works across terminal, IDE, desktop and browser.
fieldMark: Claude Code is the one with a working directory and a git history. Its
  deliverable is a commit.
relations:
  - type: bundles
    target: local-file-access
  - type: bundles
    target: command-execution
    note: On your machine, in your working directory.
  - type: bundles
    target: browser-automation
    note: Through its Chrome integration, for debugging live web applications.
    support: partial
  - type: bundles
    target: sub-agent
  - type: bundles
    target: background-execution
  - type: bundles
    target: approval-mode
    note: Hooks run shell commands before or after actions, gating them.
  - type: bundles
    target: connector
  - type: bundles
    target: memory
    note: CLAUDE.md files read at session start, plus auto memory across sessions.
  - type: kind-of
    target: harness
examples:
  - name: Claude Code
    vendor: Anthropic
    url: https://code.claude.com/docs/en/overview
    note: >-
      Agentic coding tool that reads a codebase, edits files, runs commands and
      integrates with development tools. Runs on terminal, IDE extensions,
      desktop app and web, all connecting to the same underlying engine.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
---

Claude Code is a [harness](harness) in the fullest sense: a loop that assembles
context, calls the [model](model), runs the tools the model asks for, and
repeats until the job is done or you stop it.

Its documentation lists terminal, VS Code, JetBrains, desktop app and web as
[surfaces](surface), and is explicit that "each surface connects to the same
underlying Claude Code engine, so your repo's CLAUDE.md files, settings, and MCP
servers work across all of them."

## What it ships

Everything [Cowork](claude-cowork) has, plus the things a codebase demands:
[command execution](command-execution) in your working directory, git
operations, CI integration, and [MCP](mcp) servers configured per project.

The execution detail is where it separates from Cowork most sharply. Both can
run commands; Claude Code runs them on **your machine**, against your toolchain
and your working tree, while Cowork runs them in an [isolated
environment](sandbox) on Anthropic's servers. Same engine, different blast
radius.

The [browser automation](browser-automation) is narrower than Cowork's — a
Chrome integration aimed at debugging live web applications rather than general
web errands.

## Claude Code or Cowork?

Not a capability question. Both run the same engine. Ask instead:

- Is the deliverable a **code change**, or a **document**? Claude Code's outputs
  land in a repository; Cowork's land as spreadsheets, decks and formatted files.
- Do you want a **terminal**? That is the barrier Cowork removes, and the reason
  it exists as a separate product.
- Whose **extensions** do you need? Claude Code reads `~/.claude`; Cowork reads
  your [claude.ai](claude-app) account and deliberately does not read `~/.claude`.
