---
title: Tool Use
aka: [function calling, tool calling]
canonical:
  status: de-facto
  term: Tool use
  body: Anthropic, which names the capability and records "function calling" as the alternative
  url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
  title: Tool use with Claude — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Anthropic's phrasing is "tool use (also called function calling)". The
    older name is narrower — it assumed the thing being called was one of your
    functions — and lost ground as the category widened to search, code
    execution and whole toolsets.
tags: [capability, interface]
zoom: 2
summary: The model emits a structured request to run a named function with
  arguments; the caller runs it and feeds the result back. The model never
  executes anything itself.
fieldMark: Tool use always has two halves in the transcript — a request from the
  model and a result supplied by something else. If you only ever see one half,
  you are looking at a summary, not the raw exchange.
useCase:
  scenario: >-
    An assistant needs today's exchange rate, which is not in its weights.
  detail: >-
    Rather than inventing a number, the model emits a structured request naming
    a tool and its arguments, and your code decides whether to run it. That
    boundary — model proposes, caller disposes — is what every permission
    control in this guide attaches to, and it is why tool use is the capability
    that turns a text generator into something that can act at all.
relations:
  - type: part-of
    target: inference-api
    note: Tool schemas are a field on the request; tool calls are a response type.
sources:
  - id: mcp-model-context
    url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
    title: Model Context Protocol — Architecture overview
    verifiedOn: 2026-08-22
  - id: anthropic-claude-api
    url: https://platform.claude.com/docs/en/api/overview
    title: Claude API overview — Anthropic
    verifiedOn: 2026-08-22
---

Tool use is the mechanism that lets a text predictor affect the world, and it
works by *not* letting it. The model cannot run code. What it can do is produce
a structured object saying "call `read_file` with `{path: 'src/index.ts'}`".
The [harness](harness) decides whether to honour that, runs it, and returns the
output as another message.

That indirection is where every safety and permission control lives. Approval
prompts, sandboxing, allowlists, audit logs — all of them sit in the gap between
the model asking and the harness doing.

## The shape of a tool

A tool is a name, a description, and a JSON Schema for its inputs. The
description is prompt text: it is the only thing telling the model when the tool
applies, so its wording materially changes behaviour. The schema is a contract:
it lets the caller validate arguments before executing anything.

MCP's `tools/list` response shows the canonical fields — `name`, `title`,
`description`, and `inputSchema` — and its documentation notes that names should
follow a clear pattern (`calculator_arithmetic` rather than `calculate`) because
the name is what the model reasons about.

## Tool use is not MCP

Tool use is a capability of the model and its API. [MCP](mcp) is a protocol for
*where the tools come from*. You can have tool use with tools hardcoded into
your harness and no MCP anywhere.
