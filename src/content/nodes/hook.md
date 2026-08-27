---
title: Hook
kind: concept
aka:
  - lifecycle hook
  - event handler
canonical:
  status: de-facto
  term: Hook
  body: Anthropic, in the Claude Code glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    An ordinary software term used without modification. What it adds in an
    agentic harness is a specific contrast: hooks fire deterministically where
    tools fire at the model's discretion.
tags: [agentic, structure]
zoom: 3
summary: A user-defined handler the harness runs automatically at a fixed point
  in its lifecycle — before a tool, after an edit, at session start.
fieldMark: A hook is the deterministic half of a harness. If a rule must hold
  every time regardless of what the model decides, it belongs in a hook and not
  in the system prompt.
useCase:
  scenario: >-
    Every file the agent edits should be formatted, and asking it nicely works
    most of the time.
  detail: >-
    Most of the time is the problem. A system prompt instruction is guidance the
    model usually follows and occasionally does not, especially deep into a long
    task. A hook on the post-edit event runs the formatter every time, without
    consulting the model at all. The distinction is the same one that separates
    a permission model's layers: advice versus mechanism.
flow:
  scenario: >-
    A rule that has to hold every time, in a system whose main component is
    probabilistic.
  path:
    - actor: You
      where: your machine
      does: >-
        write down a rule that has to hold every time
    - actor: An event
      where: wherever the product runs
      does: >-
        the agent is about to call a tool
    - node: hook
      where: wherever the product runs
      does: >-
        a deterministic handler that runs on it, every time
      self: true
    - node: tool-use
      where: wherever the product runs
      does: >-
        which it can block, alter, or let through
    - node: harness
      where: wherever the product runs
      does: >-
        the part of the system that guarantees it runs
  returns: >-
    Deterministic, which is exactly what a prompt is not
relations:
  - type: part-of
    target: harness
    note: The harness owns the lifecycle, so it owns the points a hook can attach to.
  - type: distinguished-from
    target: tool-use
    note: >-
      A tool runs because the model asked. A hook runs because an event
      happened, whatever the model wanted.
examples:
  - name: Claude Code hooks
    vendor: Anthropic
    url: https://code.claude.com/docs/en/hooks
    note: >-
      Handlers can be "a shell command, HTTP endpoint, MCP tool, LLM prompt, or
      subagent", attached to events such as PreToolUse and PostToolUse.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A user-defined handler that executes automatically at a specific point in Claude Code’s lifecycle, such as before a tool runs, after a file edit, or at session start.
  - id: claude-code-hooks
    url: https://code.claude.com/docs/en/hooks
    title: Hooks reference — Claude Code documentation
    verifiedOn: 2026-08-22
---
A hook is "a user-defined handler that executes automatically at a specific
point in [Claude Code](claude-code)'s lifecycle, such as before a tool runs,
after a file edit, or at session start."[[cite:claude-code-glossary]]

The sentence that makes it a concept rather than a configuration detail comes
next: "hooks are deterministic: they fire at fixed lifecycle points rather than
at the model's discretion."[[cite:claude-code-glossary]]

## Why determinism is the whole point

Everything else a [harness](harness) does routes through the
[model](model)'s judgment. A [system prompt](system-prompt) is advice; a tool is
offered and may not be used; an instruction can be outweighed by fifty turns of
subsequent context.

A hook is not consulted. The event happens and the handler runs, which makes it
the right place for anything that must hold every time — formatting, linting,
audit logging, blocking a command class, injecting a fact into the prompt.

This is the same distinction the [permission model](permission-model) draws
between advice and mechanism, applied to behaviour rather than to safety.

## The shape of one

Anthropic's reference describes three parts: the **hook event** (the lifecycle
point), the **matcher** (which events fire it), and the **handler** (what runs).
Handlers can be "a shell command, HTTP endpoint, MCP tool, LLM prompt, or
subagent."[[cite:claude-code-hooks]]

That an LLM prompt can be a handler is a nice inversion: the deterministic
mechanism fires reliably, and what it runs may itself be a model call.

## Where they attach

The useful events cluster around the boundaries of a [turn](turn) and around
tool execution — before a tool runs, after it returns, when it fails, when a
prompt is submitted, at session start, at the end of a
turn.[[cite:claude-code-hooks]]

Before-tool events are the interesting ones for control, because they can refuse.
After-tool events are the interesting ones for consistency, because they can fix.

## The cost of using them

Hooks run on every matching event, so a slow one is a tax on every tool call.
And because they bypass the model entirely, a hook that does something surprising
is invisible in the transcript — the agent sees the result and not the cause,
which makes a misbehaving hook unusually confusing to debug from the
conversation alone.
