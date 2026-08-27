---
title: Non-human identity
kind: concept
aka:
  - NHI
  - agent identity
  - machine identity
canonical:
  status: de-facto
  term: Non-Human Identity (NHI)
  body: OWASP GenAI Security Project, which maps its agentic Top 10 to an OWASP Non-Human Identities Top 10
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
  note: >-
    Established in identity and access management before agents, for service
    accounts and workload identities. The agentic case adds a wrinkle: the
    identity now belongs to something that makes decisions.
tags: [safety, orgs]
zoom: 2
summary: The credential an agent acts under — and the question of who is
  accountable when the acting thing is not a person.
fieldMark: Ask whose credentials the agent is using. If the answer is "the
  user's", every action it takes is indistinguishable from that person's, and
  the audit log cannot tell you who decided.
useCase:
  scenario: >-
    An agent opens a pull request and a reviewer needs to know whether a human
    approved it.
  detail: >-
    If the agent pushes with the owner's credentials, the answer is
    unrecoverable — the commit, the pull request and the approval all bear the
    same name, and any control requiring two parties collapses because both
    parties are one account. Giving the agent its own identity restores the
    distinction, which is what makes least privilege and separation of duties
    enforceable at all.
flow:
  scenario: >-
    An audit log full of actions, all of them attributed to a person who was
    asleep at the time.
  path:
    - node: autonomous-agent
      does: >-
        acts without anyone being asked in the moment
    - node: non-human-identity
      does: >-
        the credential it acts under, which should not be a person's
      self: true
    - node: permission-model
      does: >-
        what that credential is allowed to do, decided separately
  returns: >-
    Accountability needs the actor to be nameable
relations:
  - type: part-of
    target: permission-model
    note: >-
      Who the agent is determines what it may do; the two questions cannot be
      separated.
  - type: consumed-by
    target: autonomous-agent
    note: Autonomy without a distinct identity is autonomy nobody can audit.
examples:
  - name: OWASP ASI03 — Identity and Privilege Abuse
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    note: >-
      Covers manipulated delegation chains, role inheritance and inherited
      credentials, and maps to the OWASP Non-Human Identities Top 10.
    verifiedOn: 2026-08-22
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
    note: >-
      Published under CC BY-SA 4.0. ASI03 is Identity and Privilege Abuse;
      Appendix C maps to the OWASP Non-Human Identities Top 10 (2025).
---

OWASP's ASI03 names the root cause precisely: "this risk arises from the
architectural mismatch between user-centric identity systems and agentic design.
Without a distinct, governed identity of its own, an agent operates in an
attribution gap that makes enforcing true least privilege
impossible."[[cite:owasp-agentic-top]]

*Attribution gap* is the phrase worth keeping. It is not that the agent has too
much access — that is [excessive agency](excessive-agency). It is that nobody
can tell afterwards who did what.

## What "identity" covers here

OWASP is explicit that it means two things: "identity in this context includes
both the agent's assigned persona and any authentication material (API keys,
OAuth tokens, delegated user sessions) that represent
it."[[cite:owasp-agentic-top]]

The persona matters because agents present themselves to other agents; the
credentials matter because that is what actually opens doors. Both are
forgeable, and an [agent card](agent-card) is a self-published claim about the
first.

## Why borrowing a human's identity breaks things

When an agent acts as a person, three properties are lost at once:

- **Attribution.** The log says the person did it.
- **Least privilege.** The agent inherits everything that person can do,
  including everything unrelated to its task.
- **Separation of duties.** Any control requiring two parties collapses when
  both parties are one account — the author cannot be required to approve their
  own work, so the requirement silently does nothing.

That third one is the sharp edge, because the control appears to be configured
and is not in force. Nothing errors; the gate simply never binds.

## What ASI03 describes going wrong

"Identity & Privilege Abuse exploits dynamic trust and delegation in agents to
escalate access and bypass controls by manipulating delegation chains, role
inheritance, control flows, and agent context; context includes cached
credentials or conversation history across interconnected
systems."[[cite:owasp-agentic-top]]

Note that delegation is the attack surface. A [multi-agent
system](multi-agent-system) passing work between agents is passing authority
along with it, and "agent-to-agent trust or inherited credentials can be
exploited to escalate access."[[cite:owasp-agentic-top]]

## The remedies are unglamorous

A distinct identity per agent. Credentials scoped to the task rather than to the
person. Short-lived tokens rather than long-lived keys — OWASP recommends
"per-run ephemeral credentials with one-time audience
binding".[[cite:owasp-agentic-top]] And keys the agent cannot read: "keys must
never be directly available to agents; instead, orchestrators should mediate
signing operations so that a compromised agent cannot simply exfiltrate or
misuse long-lived keys."[[cite:owasp-agentic-top]]
