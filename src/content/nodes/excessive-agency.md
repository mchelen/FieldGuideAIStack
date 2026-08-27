---
title: Excessive agency
kind: concept
canonical:
  status: de-facto
  term: Excessive Agency
  body: OWASP GenAI Security Project, LLM06 in the Top 10 for LLM Applications
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 2
summary: An agent holding more permission, autonomy or reach than its task
  actually needs.
fieldMark: Compare the credential to the job. If an agent that summarises
  tickets can also close them, delete them and email about them, the excess is
  the finding — no exploit required.
useCase:
  scenario: >-
    Setting up an agent to triage inbound bug reports, and reaching for an
    existing service account because making a narrower one is a half-day of
    work.
  detail: >-
    That decision is the vulnerability, and it is made before any attacker
    appears. Every later failure — injection, misuse, a plain mistake — is
    scoped by it. The habit worth building is sizing the credential to the task
    rather than to convenience, because the blast radius of an agent is set at
    provisioning time and nothing at run time can shrink it.
flow:
  scenario: >-
    An agent set up to triage bug reports that also holds write access to
    the repository, because that was the default.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        grant the agent access, once, and move on
    - actor: A task
      where: a person, not a system
      does: >-
        read issues, label them, nothing more
    - node: excessive-agency
      where: your infrastructure
      does: >-
        permission, autonomy or reach beyond what the task needs
      self: true
    - node: approval-mode
      where: wherever the product runs
      does: >-
        the setting that decides whether anyone is asked first
    - node: tool-misuse
      where: your infrastructure
      does: >-
        and what the surplus turns into when something goes wrong
  returns: >-
    No exploit required — the reach was granted
relations:
  - type: consumes
    target: approval-mode
    note: Approval gates are the run-time answer to a design-time excess.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

The oldest idea in security, applied to agents: least privilege. OWASP carries
it as LLM06, and its agentic Top 10 positions [tool misuse](tool-misuse) as the
neighbouring entry that "addresses excessive autonomy but focuses on the misuse
of legitimate tools".[[cite:owasp-agentic-top]]

Excessive agency is unusual among the risks here because **it is present
without an attacker.** There is no exploit to detect. The condition is simply
that the agent can do more than it needs to, and it was created that way by
someone reasonable, in a hurry, reusing a credential that already existed.

## Three axes, usually confused

- **Permission** — what the credential can reach. The classic one.
- **Autonomy** — how many steps run without a human. Governed by
  [approval mode](approval-mode).
- **Reach** — how many systems are in scope at all. The one most often
  overlooked, because it grows by adding [connectors](connector) rather than by
  changing any setting.

An agent can be tightly permissioned and still have excessive reach, which is
why a connector count is a useful risk signal on its own.

## Why it compounds every other entry

Each of the other risks is scaled by this one. [Prompt injection](prompt-injection)
costs whatever the agent can do. [Tool misuse](tool-misuse) is bounded by which
tools exist. [Rogue agent](rogue-agent) behaviour is bounded by scope.

Which makes excessive agency the cheapest thing on this list to fix and the
least satisfying, because the fix is paperwork rather than engineering.
