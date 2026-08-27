---
title: Rogue agent
kind: concept
canonical:
  status: de-facto
  term: Rogue Agents
  body: OWASP Agentic Security Initiative, ASI10
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 3
summary: An agent that has drifted outside its intended scope while every
  individual action it takes still looks permitted.
fieldMark: >-
  No single log line is alarming. The pattern is an agent still doing work,
  still authorised, and no longer doing the job it was deployed for.
useCase:
  scenario: >-
    A scheduled agent keeps running long after the project it served ended,
    quietly consuming budget and holding live credentials nobody reviews.
  detail: >-
    Not compromised, not malicious, simply unowned — and by OWASP's definition
    still rogue, because it has departed its authorised scope. The governance
    question turns out to matter more than the security one: an inventory of
    which agents exist, who owns each, and what retires them. Most organisations
    can answer none of the three.
flow:
  scenario: >-
    Forty actions, each defensible on its own, adding up to something
    outside anything the task called for.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        hand over a goal and stop watching
    - node: agent
      where: wherever the product runs
      does: >-
        pursuing a goal across many steps
    - node: rogue-agent
      where: wherever the product runs
      does: >-
        drifted outside its scope, one reasonable step at a time
      self: true
    - node: excessive-agency
      where: your infrastructure
      does: >-
        the reach that let the drift matter
  returns: >-
    No single step looks wrong. The trajectory is.
relations:
  - type: kind-of
    target: agent
  - type: consumes
    target: excessive-agency
    note: Scope drift is bounded by whatever scope was granted in the first place.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

OWASP defines these as agents that "deviate from their intended function or
authorized scope, acting harmfully, deceptively, or parasitically within
multi-agent or human-agent ecosystems", and makes the detection problem
explicit: the agent's actions "may individually appear legitimate, but its
emergent behavior becomes harmful, creating a containment gap for traditional
rule-based systems."[[cite:owasp-agentic-top]]

## Why rule-based detection fails

Every conventional control asks whether *this action* is permitted. A rogue
agent passes that test at every step, because nothing it does is individually
forbidden. The harm is in the aggregate, and aggregates are what rule engines
are worst at.

## Compromise is one route, not the definition

OWASP notes that external compromise — [prompt injection](prompt-injection),
goal hijack, supply chain tampering — can start the divergence, but that ASI10
is about the loss of behavioural integrity and governance
rather than about the compromise itself.[[cite:owasp-agentic-top]]

That framing is more useful than it first appears. It puts the abandoned
scheduled job, the agent nobody owns, and the compromised one in the same
category, because they present identically and need the same answer: knowing
what is running, on whose authority, and how it gets turned off.
