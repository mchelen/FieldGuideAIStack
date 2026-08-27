---
title: Agent card
kind: concept
aka:
  - AgentCard
  - agent manifest
canonical:
  status: standard
  term: AgentCard
  body: The A2A Protocol specification, where it is a required object
  url: https://a2a-protocol.org/latest/specification/
  title: A2A Protocol Specification
  verifiedOn: 2026-08-22
  note: >-
    Specified rather than conventional — the spec says servers MUST publish one.
    Not to be confused with a model card, which documents a trained model rather
    than a running agent.
tags: [interfaces, structure]
zoom: 3
summary: A machine-readable declaration of an agent's identity, capabilities and
  interaction requirements — how one agent finds out what another can do.
fieldMark: It is served at a well-known URL, like `robots.txt`. That makes an
  agent discoverable by anyone who knows the domain, which is a deliberate
  design choice with consequences.
useCase:
  scenario: >-
    An agent needs to delegate a task and has a domain but no documentation.
  detail: >-
    Fetching `/.well-known/agent-card.json` returns what the agent is, what
    skills it offers, which protocols it speaks and how to authenticate. That is
    enough to decide whether to delegate and how — without a human reading
    documentation, and without a bespoke integration written per pair. The card
    is doing the job an OpenAPI document does for a service, for a counterparty
    that has judgment rather than endpoints.
flow:
  scenario: >-
    An agent needing to know whether another agent, built by someone else,
    can do the thing it wants to delegate.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        want your agent to use somebody else's
    - actor: A delegation
      where: wherever the product runs
      does: >-
        one agent wants another to do something
    - node: agent-card
      where: on the wire
      does: >-
        a machine-readable declaration of identity and capability
      self: true
    - node: agent-to-agent-protocol
      where: on the wire
      does: >-
        the protocol it is published under
    - node: multi-agent-system
      where: on the wire
      does: >-
        which is the arrangement this makes possible between vendors
  returns: >-
    Discovery without a prior integration
relations:
  - type: consumed-by
    target: multi-agent-system
    note: >-
      Discovery is what lets a set of independently-built agents become a
      system rather than a set of bespoke integrations.
examples:
  - name: A2A Agent Card
    url: https://a2a-protocol.org/latest/specification/
    note: >-
      "A2A Servers MUST make an Agent Card available", found via a well-known
      URI, a registry, or direct configuration.
    verifiedOn: 2026-08-22
sources:
  - id: a2a-spec
    url: https://a2a-protocol.org/latest/specification/
    title: A2A Protocol Specification
    verifiedOn: 2026-08-22
    quote: >-
      Agent Card: A JSON metadata document published by an A2A Server, describing its identity, capabilities, skills, service endpoint, and authentication requirements.
---

"A2A Servers MUST make an Agent Card available. The Agent Card describes the
server's identity, capabilities, skills, and interaction requirements. Clients
use this information for discovering suitable agents and configuring
interactions."[[cite:a2a-spec]]

MUST, not SHOULD. Without a card there is nothing to discover, and discovery is
the problem the [protocol](agent-to-agent-protocol) exists to solve.

## What it carries

The specification defines the card alongside a family of related objects:
`AgentProvider`, `AgentCapabilities`, `AgentExtension`, `AgentSkill`,
`AgentInterface` and `AgentCardSignature`.[[cite:a2a-spec]]

Two of those are worth noticing. **AgentSkill** is a declared capability rather
than a described endpoint — closer to "what I can do for you" than to an API
method. And **AgentCardSignature** exists because a self-published claim about
one's own capabilities is exactly the kind of thing an adversary would forge.

The card must also "properly declare supported protocols", so a client knows
which interfaces it can actually use.[[cite:a2a-spec]]

## How it is found

Three mechanisms: "Well-Known URI: accessing
`https://{server_domain}/.well-known/agent-card.json`", "Registries/Catalogs",
and "Direct Configuration."[[cite:a2a-spec]]

The well-known URI reuses a pattern the web already has, and it makes discovery
work with nothing more than a domain name. That is the point and also the
consequence: an agent publishing a card is announcing its capabilities to
anyone who asks.

## Not a model card

A [model card](model-card) documents a trained artifact — its training data,
evaluations and limitations — for a human reading before adoption. An agent card
declares a running service's capabilities, in a schema, for another program
reading before delegating.

Different subject, different audience, different format. The similar names are
an accident worth being deliberate about.

## What it does not establish

Whether any of it is true. The card is written by the agent's operator and says
what they want it to say; signatures establish that the card came from whoever
holds the key, not that its claims are accurate.

Discovery tells you what an agent *offers*. Whether it does that well, and
whether its results should be trusted, is the same unsolved problem as with any
other counterparty.
