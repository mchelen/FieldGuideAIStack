---
title: Agent
aka: [AI agent, agentic system]
tags: [core, runtime]
zoom: 1
summary: A model driven in a loop by a harness, with tools, working toward a
  goal across multiple turns without a human in each one.
fieldMark: The tell is autonomy across turns. If you write one prompt and it
  makes twenty tool calls before coming back to you, it is an agent. If every
  model call is one you typed, it is a chat interface.
relations:
  - type: contains
    target: harness
  - type: contains
    target: model
  - type: contains
    target: tool-use
sources:
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
---

"Agent" is the least precise term in common use, which is why this guide defines
it by its parts rather than its vibe. An agent is the *composition* of a
[model](model), a [harness](harness) that loops, and a set of tools the model can
invoke. Remove any one and the word stops applying: a model alone answers; a
harness with no tools is a chat client; tools with no loop is a plugin system.

## The useful axis: how many turns between humans

Rather than arguing about whether something "really" is an agent, ask how many
model calls happen between one human input and the next.

| Human inputs per model call | What it is usually called |
| --- | --- |
| One to one | Chat, completion, autocomplete |
| One to a handful | Assisted workflow, "copilot" |
| One to dozens or hundreds | Agent |

The interesting engineering problems — [context management](context-
engineering), permissioning, error recovery, cost control — all appear as you
move down that table, and they are all [harness](harness) problems.

## Multi-agent

A "[multi-agent system](multi-agent-system)" is normally one harness spawning
sub-loops, each with its own [context window](context-window) and tool set,
coordinated by a parent. It is a harness architecture, not a different kind of
model.