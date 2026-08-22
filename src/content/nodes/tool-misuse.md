---
title: Tool misuse
kind: concept
canonical:
  status: de-facto
  term: Tool Misuse and Exploitation
  body: OWASP Agentic Security Initiative, ASI02
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 2
summary: An agent using a legitimate tool, exactly as designed, to do something
  harmful.
fieldMark: Nothing in the logs looks wrong. Every call is well-formed and
  permitted; the harm is in the sequence, not in any single step.
useCase:
  scenario: >-
    An agent with read access to a repository and permission to open issues
    posts your internal architecture notes into a public tracker.
  detail: >-
    Both tools worked correctly and both were meant to be available. The read
    was authorised, the write was authorised, and nothing connected them until
    the agent did. This is why per-tool permissioning is weaker than it looks:
    approving each capability separately approves every combination of them, and
    the combinations are where the damage is.
relations:
  - type: consumes
    target: tool-use
  - type: distinguished-from
    target: excessive-agency
    note: Excessive agency is holding too much power; misuse is misapplying what is held.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

OWASP's ASI02 describes agents misusing legitimate tools "due to prompt
injection, misalignment, or unsafe delegation or ambiguous instruction",
leading to data exfiltration, tool output manipulation or workflow
hijacking.[[cite:owasp-agentic-top]]

The word doing the work is *legitimate*. No tool was compromised and no
permission was exceeded. The agent used what it was given, in a way nobody
intended and nobody forbade.

## Why combinations are the unit of risk

OWASP notes that memory, dynamic tool selection and delegation contribute to
misuse "via chaining, privilege escalation, and unintended
actions".[[cite:owasp-agentic-top]] Chaining is the key term. Read plus write is
not two capabilities; it is one exfiltration path. Search plus send is another.

This is uncomfortable because permissions are almost always granted per tool.
An operator approving a [connector](connector) is reasoning about that
connector, not about its product with every other connector already enabled —
and the number of pairs grows far faster than the number of approvals.

## Relationship to excessive agency

OWASP is explicit that ASI02 relates to LLM06 Excessive Agency but focuses on
the misuse of legitimate tools.[[cite:owasp-agentic-top]] The split is worth
keeping: [excessive agency](excessive-agency) is a question of what the agent
was given, tool misuse is a question of what it did with it. One is fixed at
design time, the other at run time.
