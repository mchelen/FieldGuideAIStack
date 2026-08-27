---
title: Permission model
kind: concept
aka:
  - permissions
  - allowlist
  - guardrails
canonical:
  status: none
  note: >-
    Borrowed from operating systems and web platforms, where it has precise
    meanings, and used loosely here. No surveyed glossary defines it for agents,
    and vendors describe theirs in product documentation rather than against
    any common model.
tags: [agentic, safety]
zoom: 2
summary: What an agent is allowed to do, who decided, and where the decision is
  enforced — the concrete answer to questions the word "autonomous" leaves open.
fieldMark: Find where enforcement happens. A rule in the system prompt is
  advice; a rule in the harness is a mechanism; a rule in the sandbox holds even
  if the other two are talked around.
useCase:
  scenario: >-
    An agent is meant to run the test suite and nothing else.
  detail: >-
    Written in the system prompt, that is a request the model will usually
    honour and can be argued out of by a hostile file it reads. Written as an
    allowlist in the harness, only matching commands execute. Written as a
    container with no network and a read-only mount, it holds even if the
    harness is wrong. The three look the same in a demo and differ entirely
    under adversarial input — which is when it matters.
flow:
  scenario: >-
    An incident review asking a simple question — was the agent allowed to
    do that, and who decided.
  path:
    - actor: An action
      does: >-
        the agent is about to take it
    - node: permission-model
      does: >-
        what is allowed, who decided, and where it is enforced
      self: true
    - node: approval-mode
      does: >-
        the part of it a person answers in the moment
    - node: sandbox
      does: >-
        the part enforced by the environment, not by asking
    - node: non-human-identity
      does: >-
        and the credentials it acts under, which are not yours
  returns: >-
    A policy you can read beats a promise in a prompt
relations:
  - type: implemented-by
    target: approval-mode
    note: The runtime policy, and the part users actually see.
  - type: consumes
    target: sandbox
    note: >-
      The layer that still holds when a policy is bypassed, because it is not
      enforced by the same component being bypassed.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Recommends "appropriate guardrails" and sandboxed testing as the
      counterpart to agent autonomy.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

Three questions, and a permission model is the answer to all three: what may the
agent do, who decided, and what enforces it.

The third is the one that separates a real model from a described one, because
the layers have very different strength.

## The layers, weakest first

1. **The [system prompt](system-prompt).** "Do not delete files." Guidance a
   [model](model) usually follows, and a [prompt injection](prompt-injection)
   competes with on equal terms — it is text in the same stream.
2. **The [harness](harness).** An allowlist, a denylist, an
   [approval mode](approval-mode). Real enforcement: the tool call simply does
   not execute. Bounded by whatever the harness itself is permitted to do.
3. **The [sandbox](sandbox).** A container, a filesystem mount, a network
   policy. Holds even when layers 1 and 2 are wrong, because it is not the same
   component.
4. **The credentials.** A token scoped to one repository cannot touch another,
   whatever anyone convinces whom. The most durable layer, and the one that
   requires the most work up front.

Anything enforced only at layer 1 should be described as a preference.

## Why [excessive agency](excessive-agency) is the failure to design against

OWASP's agentic Top 10 covers the shape directly: agents holding more permission
than their task requires, where a manipulated agent's capability becomes the
attacker's capability.[[cite:owasp-agentic-top]]

The permission model is where that is prevented, and the discipline is
unglamorous — scope credentials narrowly, grant tools per task rather than per
product, and make the default deny rather than allow.

## Who decides

Rarely one party. A vendor sets what the product can do at all; an administrator
sets organisational policy; a user sets their own preference; and the agent
sometimes proposes an escalation mid-run.

Escalation is worth watching, because "the agent asked for more access and the
user granted it while focused on something else" is how a carefully-chosen
[autonomy level](autonomy-level) becomes the widest one by lunchtime.

## The test worth running

Not whether the agent behaves. Whether it *can* misbehave.

Point it at a file containing instructions to do something forbidden and see
which layer stops it. If the answer is that the model declined, the permission
model has not been tested — the model's cooperation is what you were trying not
to depend on.[[cite:anthropic-agents]]
