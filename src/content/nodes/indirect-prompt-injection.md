---
title: Indirect prompt injection
kind: concept
aka: [second-order prompt injection]
canonical:
  status: contested
  note: >-
    OWASP folds it into ASI01 Agent Goal Hijack rather than naming it
    separately, listing poisoned external data and deceptive tool outputs among
    the techniques. The term is widely used in research and is worth keeping,
    because the distinction it draws — who supplied the hostile text — decides
    which defences can possibly work.
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 2
summary: Injection arriving through content the agent reads, rather than
  through anything the user typed.
fieldMark: The user is not the attacker and is not being fooled. Look for a
  fetch — a page, a document, an issue, an email — between the request and the
  bad behaviour.
useCase:
  scenario: >-
    Someone files an issue in your tracker containing instructions addressed to
    the coding agent, and waits for a maintainer to ask the agent to triage it.
  detail: >-
    The maintainer's request is innocent, the agent is behaving normally, and
    the hostile text was authored by a stranger months earlier. Every defence
    aimed at the user — confirmation prompts, intent checks, rate limits — sits
    on the wrong side of the problem, because the person being asked to confirm
    has no idea there is anything to confirm.
relations:
  - type: kind-of
    target: prompt-injection
  - type: consumes
    target: browser-automation
    note: An agent that reads the open web reads whatever the web chooses to say to it.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

The variant that matters most for agents, because agents read things.

Direct [prompt injection](prompt-injection) requires the user to paste hostile
text. Indirect injection requires only that the attacker put it somewhere the
agent will eventually look: a web page, a README, a code comment, a calendar
invitation, a support ticket. OWASP lists poisoned external data and deceptive
tool outputs among the techniques for hijacking an agent's
goals.[[cite:owasp-agentic-top]]

## The user is not the weak point

This is what makes it structurally nastier than the direct form. The user is
not being tricked and cannot help. They asked a reasonable question; the agent
went and read something; the something was hostile.

Consent-based defences degrade accordingly. A confirmation dialogue works when
the person confirming understands the request. Here they are approving an
action whose true origin is invisible to them, which turns approval into
theatre.

## Why credentialed browsing changes the calculation

An agent that browses without credentials and gets injected can be made to
fetch things and lie about them. An agent browsing *as you*, with your sessions
and saved passwords, can be made to act as you. That is the difference between
the two designs [Gemini Spark](gemini-spark) and [ChatGPT Work](chatgpt-work)
have chosen, and it is why Google pairs its credentialed browsing with
prompt-injection protections rather than shipping it plain.
