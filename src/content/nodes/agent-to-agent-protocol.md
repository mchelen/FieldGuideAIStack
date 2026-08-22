---
title: Agent-to-agent protocol
kind: concept
aka:
  - A2A
  - Agent2Agent
canonical:
  status: standard
  term: Agent2Agent (A2A) Protocol
  body: The A2A Protocol specification, an open standard with published governance
  url: https://a2a-protocol.org/latest/
  title: A2A Protocol
  verifiedOn: 2026-08-22
tags: [interfaces, structure]
zoom: 2
summary: An open protocol for agents built by different vendors to discover and
  delegate to each other — the complement to MCP rather than a rival.
fieldMark: MCP connects an agent to tools. A2A connects an agent to another
  agent. The distinction is whether the far end has judgment of its own.
useCase:
  scenario: >-
    A scheduling agent built on one framework needs work done by a travel agent
    built on another, at a different company.
  detail: >-
    No shared codebase, no shared model, and no way to import one into the
    other. What is needed is a wire protocol: a way to find the far agent,
    read what it can do, hand it a task and receive results. That is what A2A
    specifies, and the reason it exists is that the alternative — bespoke
    integration per pair — does not scale past a handful of agents.
relations:
  - type: distinguished-from
    target: mcp
    note: >-
      MCP connects an agent to tools and data. A2A connects agents to each
      other. The A2A site frames them as complementary.
  - type: consumes
    target: agent-card
    note: >-
      Discovery: a server must publish one describing what it is and can do.
examples:
  - name: A2A Protocol
    url: https://a2a-protocol.org/latest/
    note: >-
      "An open standard for seamless communication and collaboration between AI
      agents", with interoperability across frameworks as the stated goal.
    verifiedOn: 2026-08-22
sources:
  - id: a2a-site
    url: https://a2a-protocol.org/latest/
    title: A2A Protocol
    verifiedOn: 2026-08-22
  - id: a2a-spec
    url: https://a2a-protocol.org/latest/specification/
    title: A2A Protocol Specification
    verifiedOn: 2026-08-22
---

"The Agent2Agent (A2A) Protocol is an open standard for seamless communication
and collaboration between AI agents. In a world where agents are built using
diverse frameworks and by different vendors, A2A provides the definitive common
language for agent interoperability."[[cite:a2a-site]]

The premise is the interesting part. It assumes agents will be built by people
who do not share a codebase, a model or an employer — and that they will
nonetheless need to work together.

## Complementary to MCP, not competing

The site states the division directly: build "with ADK (or any framework), equip
with MCP (or any tool), and communicate with A2A, to remote agents, local
agents, and humans."[[cite:a2a-site]] It describes the pair as connecting
"agents to tools and data through MCP, and to other agents through
A2A."[[cite:a2a-site]]

The line is about what sits at the far end. [MCP](mcp) reaches a
[server](mcp-server) that does what it is told — deterministic, scoped,
described by a schema. A2A reaches another [agent](agent), which has its own
model, its own context and its own judgment.

That difference is not cosmetic. A tool call either succeeds or fails; a
delegation can be misunderstood, partially completed, or declined for reasons.

## Discovery is the hard part it specifies

"A2A Servers MUST make an [Agent Card](agent-card) available. The Agent Card
describes the server's identity, capabilities, skills, and interaction
requirements. Clients use this information for discovering suitable agents and
configuring interactions."[[cite:a2a-spec]]

Three ways to find one: "Well-Known URI: accessing
`https://{server_domain}/.well-known/agent-card.json`", "Registries/Catalogs:
querying curated catalogs of agents", or "Direct Configuration: pre-configured
Agent Card URLs or content."[[cite:a2a-spec]]

The well-known URI is the notable choice — the same pattern the web already uses
for `robots.txt` and security contacts, which makes an agent discoverable by
anyone who knows its domain.

## What it inherits from being between agents

Everything in [multi-agent systems](multi-agent-system) applies, now across a
trust boundary. A delegated task is described rather than shared, results come
back as summaries, and the far agent's output enters your
[context window](context-window) as text your model will act on.

OWASP's agentic risks include forged agent-to-agent messages for this reason.
The specification carries security schemes — API keys, OAuth2, OpenID Connect,
mutual TLS[[cite:a2a-spec]] — which establish who is talking, and not whether
what they said should be believed.
