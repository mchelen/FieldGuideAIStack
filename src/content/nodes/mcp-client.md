---
title: MCP client
kind: concept
aka:
  - protocol client
canonical:
  status: standard
  term: MCP Client
  body: The Model Context Protocol specification
  url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
  title: Architecture overview — Model Context Protocol
  verifiedOn: 2026-08-22
  note: >-
    Frequently confused with the host. The specification is precise: the host is
    the application, and a client is one connection it maintains per server.
tags: [interfaces, structure]
zoom: 3
summary: The connection a host creates for each server it talks to — one per
  server, dedicated, and the reason servers stay isolated from each other.
fieldMark: Count them. A host with four servers has four clients, and no server
  can see the others' traffic. The isolation is structural rather than a
  policy anyone enforces.
useCase:
  scenario: >-
    An application connects to a trusted internal server and a third-party one
    at the same time.
  detail: >-
    Each connection is separate by construction — the third-party server sees
    only its own requests and results, not those of the internal one. That does
    not make it safe, because whatever it returns still reaches the model's
    context window alongside everything else. The isolation is at the transport,
    not in the prompt, and confusing the two is where trust assumptions go
    wrong.
relations:
  - type: part-of
    target: mcp
    note: The connection half of the protocol's client-server architecture.
examples:
  - name: MCP architecture
    url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
    note: >-
      "The MCP host accomplishes this by creating one MCP client for each MCP
      server. Each MCP client maintains a dedicated connection."
    verifiedOn: 2026-08-22
sources:
  - id: mcp-architecture
    url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
    title: Architecture overview — Model Context Protocol
    verifiedOn: 2026-08-22
    quote: >-
      The MCP host accomplishes this by creating one MCP client for each MCP server.
---

The specification names three participants and the middle one is the least
intuitive: "MCP Host: the AI application that coordinates and manages one or
multiple MCP clients. MCP Client: a component that maintains a connection to an
MCP server."[[cite:mcp-architecture]]

So a client is not an application. It is a connection object *inside* one, and
there is exactly one per [server](mcp-server).

## Why one per server

Because the alternative — a single client multiplexing several servers — would
mean a shared channel, shared lifecycle and shared failure. "Each MCP client
maintains a dedicated connection with its corresponding MCP
server."[[cite:mcp-architecture]]

The consequences are worth stating, since they are easy to over-read:

- **Separate lifecycles.** One server crashing does not disturb the others.
- **Separate transports.** A local STDIO connection and a remote HTTP one
  coexist without either knowing.
- **Separate capability negotiation.** Each server declares what it supports to
  its own client.

## The isolation that is not there

What the per-client structure does *not* give you is isolation in the
[context window](context-window). Every server's tool descriptions and every
server's results end up in the same prompt, read by the same
[model](model), with no marker of origin.

A malicious server cannot read another server's traffic. It can put text in
front of the model that talks about another server's data, ask for a tool from
another server to be called, or simply carry an
[indirect prompt injection](indirect-prompt-injection). The transport is
isolated; the prompt is not, and the prompt is where the decisions get made.

## Why this matters when reading [MCP](mcp) documentation

"Client" in most protocol writing means the application. Here it means a
connection, and "host" means the application. Getting the vocabulary backwards
makes the security discussion incoherent — the questions about trust are about
hosts and servers, and the client is the plumbing between them.
