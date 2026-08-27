---
title: Prompt injection
kind: concept
aka:
  - term: Agent Goal Hijack
    usedBy: OWASP Agentic Security Initiative (ASI01)
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    verifiedOn: 2026-08-22
    note: The agentic framing, covering manipulation of objectives rather than only of output.
canonical:
  status: de-facto
  term: Prompt Injection
  body: OWASP GenAI Security Project, LLM01 in the Top 10 for LLM Applications and ASI01 for agents
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 2
summary: Text the system treats as instructions when it was only ever supposed
  to be content.
fieldMark: Ask where the text came from. If any part of the prompt was written
  by someone other than the operator — a web page, an email, a file, another
  agent — injection is possible by construction.
useCase:
  scenario: >-
    You ask an agent to summarise a competitor's pricing page, and it emails
    your customer list to an address on that page.
  detail: >-
    Nothing malfunctioned. The page contained a line addressed to the agent
    rather than to you, and the agent could not tell the difference, because
    there is no difference to tell — instructions and content arrive as the same
    undifferentiated text. The more tools the agent holds, the more the failure
    costs, which is why injection is a design constraint on agents rather than a
    bug to be patched out of models.
relations:
  - type: consumes
    target: tool-use
    note: Injection matters in proportion to what the model can ask to be done.
  - type: distinguished-from
    target: jailbreak
    note: Injection comes from data the system reads; a [jailbreak](jailbreak) comes from the user.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
    note: >-
      Published 9 December 2025 under CC BY-SA 4.0, with more than 100
      contributors. ASI01 is Agent Goal Hijack.
---

The root cause is stated plainly in OWASP's agentic Top 10: agents and the
underlying model "cannot reliably distinguish instructions from related
content."[[cite:owasp-agentic-top]] Everything else follows from that one
sentence.

A [model](model) receives a single stream of text. Some of it came from the
operator, some from the user, some from a web page the agent fetched two steps
ago. The stream carries no reliable marker of origin, so an instruction written
into a document is, to the model, the same kind of thing as an instruction
written into the [system prompt](system-prompt).

## Why agents raise the stakes rather than the odds

Injection is no more likely in an agent than in a chat window. It is far more
expensive. OWASP describes attackers manipulating "an agent's objectives, task
selection, or decision pathways" through prompt-based manipulation, deceptive
tool outputs, malicious artefacts, forged agent-to-agent messages and poisoned
external data.[[cite:owasp-agentic-top]]

A chat model that falls for an injection says something wrong. An agent that
falls for one *does* something wrong, with whatever credentials it holds.

## Why it is not solved

It is not a filter problem. The system cannot detect the attack by inspecting
text, because the attack is indistinguishable from legitimate text — a document
that says "ignore your previous instructions" might be a security article about
prompt injection.

So mitigations are architectural rather than textual: constrain what the agent
may do ([approval mode](approval-mode)), constrain what it can reach, and
assume any content it reads may be hostile. Treat it as a property of the
design, in the way SQL injection was until parameterised queries existed — with
the difference that no equivalent of a parameterised query exists here.
