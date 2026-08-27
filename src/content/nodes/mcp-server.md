---
title: MCP server
kind: concept
aka:
  - tool server
canonical:
  status: standard
  term: MCP Server
  body: The Model Context Protocol specification
  url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
  title: Architecture overview — Model Context Protocol
  verifiedOn: 2026-08-22
tags: [interfaces, structure]
zoom: 2
summary: The program that serves tools, resources and prompts to an MCP client —
  the unit an integration is packaged and shipped as.
fieldMark: A server is a process, not a service. A local one usually speaks
  STDIO and serves a single client; a remote one speaks HTTP and serves many.
useCase:
  scenario: >-
    Three different AI applications in a team all need access to the same
    internal ticketing system.
  detail: >-
    Written as an [MCP](mcp) server, the integration is built once and each application
    connects to it — the alternative being three bespoke integrations that drift
    apart. This is the whole argument for a protocol here: the N-by-M problem of
    every host needing custom code for every tool collapses into N plus M.
flow:
  scenario: >-
    One wrapper around an internal API, used by four assistants nobody wrote
    any code for.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        want an internal API reachable from four assistants
    - actor: An internal API
      where: your infrastructure
      does: >-
        the thing you actually want reachable
    - node: mcp-server
      where: your infrastructure
      does: >-
        declares what it offers, in one standard shape
      self: true
    - node: mcp
      where: on the wire
      does: >-
        the protocol both ends agreed on
    - node: mcp-client
      where: wherever the product runs
      does: >-
        one per server, held by whichever application connects
  returns: >-
    Written once, and every client that speaks it can use it
relations:
  - type: part-of
    target: mcp
    note: One of the three participants the specification names.
  - type: consumed-by
    target: mcp-client
    note: One client per server, each maintaining a dedicated connection.
examples:
  - name: MCP architecture
    url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
    note: >-
      "Local MCP servers that use the STDIO transport typically serve a single
      MCP client, whereas remote MCP servers … will typically serve many."
    verifiedOn: 2026-08-22
sources:
  - id: mcp-architecture
    url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
    title: Architecture overview — Model Context Protocol
    verifiedOn: 2026-08-22
---
"MCP follows a client-server architecture where an MCP host — an AI application
like [Claude Code](claude-code) or Claude Desktop — establishes connections to
one or more MCP servers. The MCP host accomplishes this by creating one [MCP
client](mcp-client) for each MCP server."[[cite:mcp-architecture]]

Three participants, and the naming trips people up: the **host** is the
application, the **client** is one connection inside it, and the **server** is
the thing being connected to.

## What a server provides

Tools the model can call, resources it can read, and prompts it can use. The
specification is deliberately narrow about scope: "MCP focuses solely on the
protocol for context exchange — it does not dictate how AI applications use LLMs
or manage the provided context."[[cite:mcp-architecture]]

That restraint is why it works across hosts. A server declares what it offers
and knows nothing about the [harness](harness) on the other side, its
[context engineering](context-engineering), or its
[permission model](permission-model).

## Local and remote are different animals

"Local MCP servers that use the STDIO transport typically serve a single MCP
client, whereas remote MCP servers that use the Streamable HTTP transport will
typically serve many MCP clients."[[cite:mcp-architecture]]

The consequences diverge sharply:

- **Local, STDIO** — a subprocess with your user's permissions and your
  filesystem. Trivial to run, and inside every boundary you have.
- **Remote, HTTP** — a service with authentication, multi-tenancy, and a
  network hop. Harder to stand up, and outside the machine.

A local server is not sandboxed by being a server. It runs where you run it,
which is why [project trust](project-trust) and a
[sandbox](sandbox) apply to MCP servers exactly as to any other code a
repository can bring with it.

## Why the protocol earns its existence

Without it, every host writes custom code for every tool. With it, a tool is
written once and every host can use it — the same argument that produced
language servers for editors, and the same shape of win.

The cost is a third party in the trust chain. A server's tool descriptions and
results enter the model's [context window](context-window), which makes an
untrusted server a route for [indirect prompt injection](indirect-prompt-injection).