---
title: Harness
aka: [agent harness, scaffolding, agent framework, agent loop]
tags: [core, runtime]
zoom: 1
summary: The program that turns a model into something useful — it assembles
  context, calls the model, executes the tools the model asks for, and loops.
fieldMark: If it has a permission prompt, a working directory, a config file, or
  a `--help` flag, it is a harness. Harnesses are versioned and shipped on a
  release cadence measured in days; models change on a cadence of months.
relations:
  - type: consumes
    target: inference-api
    note: A harness is, mechanically, a loop around HTTP requests.
  - type: consumes
    target: mcp
    note: Optional, but the common way harnesses acquire third-party tools.
examples:
  - name: Claude Code
    vendor: Anthropic
    url: https://code.claude.com/docs/en/overview
    note: >-
      Agentic coding tool that reads a codebase, edits files, runs commands,
      and integrates with development tools. Runs in the terminal, IDE
      extensions, a desktop app, and the browser.
    verifiedOn: 2026-08-22
  - name: OpenAI Codex
    vendor: OpenAI
    url: https://learn.chatgpt.com/docs
    note: >-
      Agent platform for code exploration, feature development, code review,
      and issue resolution. Surfaces include a CLI, IDE extension, web,
      the ChatGPT desktop app, and Codex cloud.
    verifiedOn: 2026-08-22
sources:
  - url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
  - url: https://learn.chatgpt.com/docs
    title: OpenAI Codex documentation
    verifiedOn: 2026-08-22
---

A [model](model) can only answer. A harness is what lets something *happen*.

Strip a coding agent down and the harness is a loop:

1. Gather context — the user's message, files, prior turns, tool results.
2. Send it to the [inference API](inference-api) along with tool definitions.
3. Read the response. If the model asked to call a tool, run it.
4. Feed the result back in. Go to 2.

Everything that makes one agent feel different from another lives in that loop,
not in the model: which tools exist, what gets loaded into context and what gets
dropped, when the user is asked to approve an action, how failures are retried,
how sub-agents are spawned.

## Why the distinction matters commercially

The same model behind two harnesses produces markedly different results, and the
same harness can often be pointed at a different model. Claude Code and OpenAI
Codex both document running against models other than their vendor's default.
Harness and model are separately swappable parts — which is exactly why treating
them as one thing leads people astray when comparing products.

## The confusable neighbours

- [Agent](agent) — what you get when a harness drives a model in a loop. The
  harness is the machinery; the agent is the behaviour.
- **Framework/SDK** — a library for *building* a harness rather than a harness
  you run.
