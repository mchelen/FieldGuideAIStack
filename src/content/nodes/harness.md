---
title: Harness
aka: [agent harness, scaffolding, agent framework, agent loop]
canonical:
  status: de-facto
  term: Agentic harness
  body: Anthropic, in the Claude Code glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    Vendor-coined and not yet universal. "Agent framework" and "scaffolding"
    describe the same component, and much writing has no word for it at all —
    which is precisely the confusion this guide exists to fix, since most
    claims about what "the AI" can do are claims about the harness.
tags: [core, runtime]
zoom: 1
summary: The program that turns a model into something useful — it assembles
  context, calls the model, executes the tools the model asks for, and loops.
fieldMark: If it has a permission prompt, a working directory, a config file, or
  a `--help` flag, it is a harness. Harnesses are versioned and shipped on a
  release cadence measured in days; models change on a cadence of months.
useCase:
  scenario: >-
    Two products built on the same model behave completely differently.
  detail: >-
    The model is identical; everything else is not. The harness supplies the
    [system prompt](system-prompt), the tools, the permission gating, what stays in the [context
    window](context-window) and what gets dropped. When a comparison of two AI products turns
    out to be a comparison of two harnesses, the model name in the marketing
    was the least informative thing on the page.
flow:
  scenario: >-
    A coding agent is asked to fix a failing test, and does four things the
    model cannot do by itself.
  path:
    - actor: You
      does: >-
        ask for the failing test to be fixed
    - node: harness
      does: >-
        builds the prompt, calls the model, executes what it asks for
      self: true
    - node: inference-api
      does: >-
        the only channel to the model, and the only thing it sees
    - node: approval-mode
      does: >-
        decides whether the next command runs without asking you
    - node: command-execution
      does: >-
        runs the test and hands the output back as the next input
  returns: >-
    Every capability in the product is on this side of the call
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
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
    quote: >-
      Claude Code runs on several surfaces: the terminal, IDE extensions, a desktop app, and the web.
  - id: openai-openai-codex
    url: https://learn.chatgpt.com/docs
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
same harness can often be pointed at a different model. [Claude Code](claude-code) and [OpenAI Codex](openai-codex) both document running against models
other than their vendor's default. Harness and model are separately swappable
parts — which is exactly why treating them as one thing leads people astray when
comparing products.

## The confusable neighbours

- [Agent](agent) — what you get when a harness drives a model in a loop. The
  harness is the machinery; the agent is the behaviour.
- **Framework/[SDK](software-development-kit)** — a library for *building* a harness rather than a harness
  you run.
