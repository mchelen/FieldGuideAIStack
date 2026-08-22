---
title: Sandbox
kind: concept
aka:
  - isolated environment
  - container
canonical:
  status: de-facto
  term: Sandbox
  body: Long-standing in computer security; used unchanged for agent execution environments
  url: https://www.anthropic.com/engineering/building-effective-agents
  title: Building effective agents — Anthropic
  verifiedOn: 2026-08-22
  note: >-
    The security meaning — a bounded environment where untrusted code runs
    without reaching what matters — transfers without modification, which is why
    nobody redefined it. Anthropic's Claude Code glossary carries it as
    "Sandboxing", scoped to one tool: "OS-level filesystem and network isolation
    for the Bash tool". This page originally said no surveyed glossary carried
    it, which was wrong.
tags: [agentic, safety]
zoom: 2
summary: The bounded environment an agent's commands and code run inside, so
  that a bad step damages a copy rather than the original.
fieldMark: A sandbox is defined by what is outside it. Ask what the agent can
  still reach — the network, mounted credentials, the host filesystem — because
  a container with the developer's SSH keys mounted is not isolating much.
useCase:
  scenario: >-
    An agent is asked to upgrade a dependency and the upgrade script does
    something unexpected.
  detail: >-
    In a sandbox the blast radius is a disposable container: throw it away and
    nothing outside changed. On the developer's machine the same script has the
    developer's permissions, their credentials, their network access and their
    other projects. The agent behaved identically in both cases; only the
    consequences differ, which is the entire argument for isolating first and
    trusting second.
relations:
  - type: consumed-by
    target: permission-model
    note: >-
      The layer that still holds when a policy is wrong, because it is enforced
      elsewhere.
  - type: hosts
    target: command-execution
    note: Where an agent's commands should run, if the environment allows it.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Recommends "extensive testing in sandboxed environments, along with the
      appropriate guardrails" for autonomous agents.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

A sandbox does not make an [agent](agent) safer. It makes the agent's mistakes
cheaper, which is a different and more achievable goal.

Anthropic's recommendation for autonomous agents pairs the two things that
always go together: "extensive testing in sandboxed environments, along with the
appropriate guardrails."[[cite:anthropic-agents]]

## Why it is the layer that holds

A [system prompt](system-prompt) can be argued with. A
[harness](harness) allowlist can have a gap. Both are enforced by components the
agent is talking to.

A sandbox is enforced by something else entirely — the kernel, the container
runtime, the network policy — and no amount of persuasion crosses that boundary.
That is what makes it the load-bearing layer of a
[permission model](permission-model) rather than one option among several.

## What a sandbox is actually made of

- **Filesystem** — what is mounted, and read-only or writable. The commonest
  mistake is mounting more of the host than the task needs.
- **Network** — outbound access is how data leaves. A sandbox with unrestricted
  egress bounds damage to your files and not to your secrets.
- **Credentials** — anything reachable from inside is inside. Tokens in the
  environment are part of the sandbox's contents, not outside it.
- **Resources** — CPU, memory, disk, time. Not security, but the difference
  between a runaway loop and an outage.
- **Lifetime** — disposable is the point. A sandbox reused across tasks
  accumulates state and stops being a clean boundary.

A sandbox is also a way to *reduce* friction rather than add it. Anthropic
describes its purpose as letting commands "run inside a boundary you define
upfront, so Claude can work freely within it without per-command approval
prompts", and notes that it is "a separate layer from permission
rules."[[cite:claude-code-glossary]] Drawing the boundary once is what makes a
wide [autonomy level](autonomy-level) safe to grant.

## The specific thing it defends against

Not a malicious agent. The realistic case is
[indirect prompt injection](indirect-prompt-injection): the agent reads a file,
a web page or a tool result containing instructions, follows them, and does
something nobody asked for — which OWASP's agentic Top 10 covers as agents being
unable to distinguish instructions from content.[[cite:owasp-agentic-top]]

The agent is not compromised in any conventional sense. It was persuaded. A
sandbox is the control that does not care whether the agent was persuaded,
because it never consulted the agent.

## Where it is unavailable

Local coding tools frequently run with the developer's full permissions, because
that is what makes them useful — the whole point is to touch the real
repository. [Remote and background execution](background-execution) is easier to
isolate precisely because nothing there is anyone's laptop.

That trade is worth being explicit about rather than discovering later: the
convenience of a local agent and the containment of a sandboxed one are, today,
substantially in tension.
