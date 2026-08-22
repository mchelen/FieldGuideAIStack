---
title: Sub-agent
aka: [subagent, agent delegation, parallel workstreams]
tags: [capability, runtime]
zoom: 3
summary: A parent agent spawning child loops, each with its own context window
  and tools, and merging their results.
fieldMark: The giveaway is parallel progress on unrelated parts of one task, and
  a summary that reads like it was assembled from reports.
relations:
  - type: kind-of
    target: agent
  - type: part-of
    target: harness
    note: Delegation is a harness architecture, not a model capability.
sources:
  - url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
  - url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
---

Sub-agents exist to solve a [context window](context-window) problem. One agent
reading forty files spends its whole window on file contents. Forty sub-agents
each reading one file spend forty separate windows and return forty summaries,
and the parent only pays for the summaries.

Cowork's documentation describes complex work "divided into smaller tasks with
parallel workstreams for faster results." Speed is the visible benefit; context
economy is the structural one.

## What it costs

- **Coordination.** The parent has to decompose the task well, and a bad split
  produces confidently wrong sub-results that look consistent.
- **Loss in translation.** Each sub-agent returns a summary, not its reasoning.
  Detail the parent did not know to ask for is gone.
- **Tokens.** Parallel loops multiply spend, and a sub-agent that goes wrong
  burns its whole budget before reporting.

This is a [harness](harness) feature end to end. No model decides to spawn a
sub-agent; a harness decides, and gives the model a tool for requesting it.
