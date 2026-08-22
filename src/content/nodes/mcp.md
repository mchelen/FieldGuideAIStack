---
title: Model Context Protocol (MCP)
aka: [MCP]
canonical:
  status: standard
  term: Model Context Protocol
  body: specified at modelcontextprotocol.io, created by Anthropic and published as an open standard
  url: https://modelcontextprotocol.io/docs/learn/architecture
  title: Model Context Protocol — Architecture overview
  verifiedOn: 2026-08-22
useCase:
  scenario: >-
    You write one integration for your issue tracker and it works in Claude, in
    ChatGPT, in VS Code and in Cursor without being rewritten for each.
  detail: >-
    Before a shared protocol, every AI application needed its own plugin format,
    so an integration was written once per client and maintained N times. MCP
    turns that into one server speaking a documented protocol, which any client
    can discover through `tools/list` and call through `tools/call`. The
    protocol's own documentation makes the analogy explicit: a USB-C port for
    AI applications.
tags: [protocol, interface, standard]
zoom: 2
summary: An open standard for connecting AI applications to external tools and
  data, so a tool built once works in any client that speaks the protocol.
fieldMark: Three words give it away — host, client, server. If a doc describes
  an AI app spawning one client per connected server, that is MCP.
relations:
  - type: distinguished-from
    target: tool-use
    note: MCP supplies tools; tool use is how the model invokes them.
  - type: consumed-by
    target: harness
examples:
  - name: Model Context Protocol
    url: https://modelcontextprotocol.io/docs/getting-started/intro
    note: >-
      Open-source standard for connecting AI applications to data sources,
      tools, and workflows; documented as supported across clients including
      Claude, ChatGPT, Visual Studio Code, and Cursor.
    verifiedOn: 2026-08-22
sources:
  - url: https://modelcontextprotocol.io/docs/getting-started/intro
    title: What is the Model Context Protocol (MCP)? — modelcontextprotocol.io
    verifiedOn: 2026-08-22
  - url: https://modelcontextprotocol.io/docs/learn/architecture
    title: Model Context Protocol — Architecture overview
    verifiedOn: 2026-08-22
---

The protocol's own analogy is a USB-C port for AI applications: a standardized
way to connect an AI app to external systems, so an integration written once
works everywhere instead of once per product.

## Three participants, and the one everyone mixes up

- **MCP Host** — the AI application (a [harness](harness) like [Claude Code](claude-code), or
  an IDE) that coordinates connections.
- **MCP Client** — a connection manager. The host creates *one client per
  server*.
- **MCP Server** — the program that actually provides context.

The trap is the word "server". An MCP server is not necessarily remote: the
documentation is explicit that "MCP server" means the program serving context
regardless of where it runs. A filesystem server launched as a local subprocess
over stdio is a server; so is a hosted service reached over HTTP.

## Two layers

| Layer | What it defines |
| --- | --- |
| Data layer | A JSON-RPC 2.0 protocol: discovery, primitives, notifications |
| Transport layer | How bytes move: stdio for local processes, Streamable HTTP for remote, plus authorization |

## Primitives

Servers expose three: **tools** (executable functions), **resources** (data
sources), and **prompts** (reusable templates). Each has `*/list` for discovery
and, for tools, `tools/call` for execution — which is why a client can present a
server's capabilities without knowing anything about it in advance.

Clients expose primitives too. **Elicitation** lets a server ask the user for
more information. Note that **sampling** and **logging**, both once client
primitives, are marked deprecated as of protocol version `2026-07-28`; new
implementations are directed to integrate with provider APIs directly and to log
to stderr or OpenTelemetry. Version-dated statements like this are exactly why
every claim here carries a `verifiedOn`.
