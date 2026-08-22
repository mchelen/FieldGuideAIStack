---
title: Data exfiltration
kind: concept
aka:
  - data leakage
  - unauthorised disclosure
canonical:
  status: de-facto
  term: Data exfiltration
  body: Long-standing security vocabulary; the agentic case is covered by OWASP's ASI02
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
  note: >-
    Borrowed unchanged from security. What the agentic case adds is that the
    exfiltration is performed by an authorised component using authorised
    tools, which defeats monitoring built to spot unauthorised activity.
tags: [safety, risk]
zoom: 2
summary: An agent being induced to send data somewhere it should not — using
  its own legitimate access, which is what makes it hard to detect.
fieldMark: Look at what the agent can reach outward. Read access decides what
  can be taken; outbound capability decides whether it can leave. A sandbox
  with unrestricted network egress bounds the first and not the second.
useCase:
  scenario: >-
    An agent summarising a competitor's page also emails a customer list to an
    address found on it.
  detail: >-
    Nothing malfunctioned and no credential was stolen. The agent read a page
    containing an instruction, could not distinguish it from the task, and used
    tools it was legitimately granted to carry it out. Host monitoring sees
    approved software making approved calls under valid credentials, which is
    exactly why this class of incident is caught late or not at all.
relations:
  - type: consumed-by
    target: prompt-injection
    note: The usual payload — injection is the mechanism, exfiltration is the goal.
  - type: distinguished-from
    target: tool-misuse
    note: >-
      Tool misuse is the agent applying a legitimate tool wrongly. Exfiltration
      names what the data does as a result.
examples:
  - name: OWASP ASI02 — Tool Misuse and Exploitation
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    note: >-
      Gives chained-tool exfiltration as a worked example, including an agent
      induced to combine an internal CRM tool with an external email tool.
    verifiedOn: 2026-08-22
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---
OWASP puts exfiltration first among the consequences of [tool misuse](tool-misuse): agents "can misuse legitimate tools due to [prompt injection](prompt-injection), misalignment, or unsafe delegation or ambiguous instruction —
leading to data exfiltration, tool output manipulation or workflow
hijacking."[[cite:owasp-agentic-top]]

The word *legitimate* is doing the work. This is not an intruder using stolen
access; it is your own component using its own access, for a purpose nobody
intended.

## Why the usual detection fails

OWASP's example is worth quoting in full because it explains the whole
detection problem: "a security-automation agent receives an injected instruction
that causes it to chain together legitimate administrative tools — PowerShell,
cURL, and internal APIs — to exfiltrate sensitive logs. Because every command is
executed by trusted binaries under valid credentials, host-centric monitoring
(EDR/XDR) sees no" anomaly.[[cite:owasp-agentic-top]]

Every signal a monitoring system looks for is absent. Approved software,
approved credentials, approved network paths, no privilege escalation. The only
unusual thing is the *intent*, which is not a property any of those tools
measure.

## The two capabilities that combine

Exfiltration needs both halves, and either alone is survivable:

- **Reach inward** — the agent can read something sensitive. Usually granted
  deliberately, because reading is what makes it useful.
- **Reach outward** — the agent can cause bytes to leave. Email, HTTP, a
  webhook, a commit, a filename in a URL.

OWASP's chaining example is precisely this combination: "an agent is tricked
into chaining a secure, internal-only CRM tool with an external email tool,
exfiltrating a sensitive customer list to an
attacker."[[cite:owasp-agentic-top]] Two safe tools; one unsafe composition.

This is why a [sandbox](sandbox) with unrestricted network egress is weaker than
it looks. It bounds what can be damaged and not what can leave.

## Channels that are easy to miss

- A URL the agent fetches, with data in the query string.
- An image or link rendered in a response, fetched by the *user's* browser.
- A commit message, an issue comment, a log line.
- A tool argument passed to a third-party [MCP server](mcp-server).

Anything that can carry a string outward is a channel, which is a larger set
than "the agent can send email".

## What actually helps

Narrowing outbound capability rather than inbound. An agent that reads widely
and can reach only one known destination is a much smaller problem than the
reverse, and egress control is enforceable in the network where intent is not
enforceable in the prompt.
