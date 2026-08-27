---
title: Memory poisoning
kind: concept
aka:
  - term: Memory & Context Poisoning
    usedBy: OWASP Agentic Security Initiative (ASI06)
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    verifiedOn: 2026-08-22
canonical:
  status: de-facto
  term: Memory & Context Poisoning
  body: OWASP Agentic Security Initiative, ASI06
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
tags: [safety, risk]
zoom: 2
summary: Corrupting what an agent stores, so that later runs reason from
  falsehoods it now believes it learned.
fieldMark: The symptom appears long after the cause, in a session that looks
  ordinary. If an agent is confidently wrong about something nobody told it
  today, ask what it wrote down and when.
useCase:
  scenario: >-
    An agent records a preference during one task, and six weeks later applies
    it to a project where it is actively harmful.
  detail: >-
    This is the benign version and it is the same mechanism. Whatever writes to
    memory is a write path into every future run, so the security question and
    the staleness question have one answer: what can write, what validates it,
    and how does anything ever get retracted. Most systems have a good answer to
    the first and no answer to the third.
flow:
  scenario: >-
    A false fact written into an agent's notes on Tuesday and reasoned from
    as true every day after.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        ask it to read something you did not write
    - node: prompt-injection
      where: the open web
      does: >-
        gets one instruction in, once
    - node: memory-poisoning
      where: wherever the product runs
      does: >-
        which is to write something false into what persists
      self: true
    - node: memory
      where: wherever the product runs
      does: >-
        and it is read back as established fact on every later run
  returns: >-
    One injection, then persistence does the rest
relations:
  - type: consumes
    target: memory
  - type: kind-of
    target: prompt-injection
    note: Injection that persists, rather than acting only within the run that carried it.
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

[Memory](memory) makes an agent better until someone else can write to it.

OWASP's ASI06 covers anything an agent "retains, retrieves, or reuses, such as
summaries, embeddings, and RAG stores", and explicitly excludes one-time input
prompts, which belong to LLM01. Adversaries "corrupt or seed this context with
malicious or misleading data, causing future reasoning, planning, or [tool use](tool-use) to
become biased, unsafe, or aid exfiltration."[[cite:owasp-agentic-top]]

## Persistence is the whole problem

A [prompt injection](prompt-injection) that lands in the [context window](context-window) affects
one run. The same text written into memory affects every run after it, from a
store the agent treats as its own prior knowledge rather than as untrusted
input.

That inversion is what makes it hard to see. Content arriving from a tool call
is at least nominally external. Content arriving from memory arrives with the
system's own authority behind it.

## Why the scope is wider than "memory"

OWASP's framing includes embeddings and retrieval stores, which means a
poisoned document in a knowledge base is the same class of attack as a poisoned
memory entry. Anything that gets retrieved into a prompt later is an ingestion
surface, whether or not the product calls it memory.

Worth asking of any system that remembers: who can write, is the write
validated, and is there any path by which a wrong entry gets removed rather
than merely outvoted.
