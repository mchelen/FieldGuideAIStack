---
title: Red teaming
kind: concept
aka:
  - adversarial testing
  - attack simulation
canonical:
  status: de-facto
  term: Red teaming
  body: Borrowed from security; applied to language models in Perez et al. (2022)
  url: https://arxiv.org/abs/2202.03286
  title: Red Teaming Language Models with Language Models — Perez et al.
  verifiedOn: 2026-08-22
  note: >-
    Decades old in security and military planning, where a red team plays the
    adversary. Applied to models it means the same thing and has not been
    redefined; no surveyed AI glossary carries a separate entry.
tags: [evaluation, safety]
zoom: 2
summary: Adversarial testing to find failures before users do — deliberately
  trying to make a system misbehave, rather than checking that it behaves.
fieldMark: Ordinary [evaluation](evaluation) asks whether the system works. Red teaming asks
  what it takes to break it. A team that has only done the first does not know
  the answer to the second.
useCase:
  scenario: >-
    An agent passes every functional test and nobody has tried to make it
    misbehave.
  detail: >-
    Functional tests are written by people imagining correct use, which means
    they systematically miss whatever an adversary would try first — a hostile
    document, an instruction hidden in a tool result, a request phrased to
    sound authorised. Red teaming is the practice of writing those cases
    deliberately, and it finds things no amount of ordinary testing will,
    because ordinary testing is not looking.
flow:
  scenario: >-
    Deliberately trying to make a system misbehave, before somebody who is
    not on your side does it for free.
  path:
    - actor: An attacker's goal
      where: a person, not a system
      does: >-
        adopted on purpose, by your own team
    - node: red-teaming
      where: your evaluation harness
      does: >-
        adversarial testing to find failures before users do
      self: true
    - node: jailbreak
      where: the prompt you send
      does: >-
        one of the techniques, run as a test rather than an attack
    - node: evaluation
      where: your evaluation harness
      does: >-
        which asks the ordinary question: does it work
  returns: >-
    Same technique as an attack; only the intent differs
relations:
  - type: kind-of
    target: evaluation
    note: An evaluation whose objective is failure rather than success.
  - type: consumes
    target: jailbreak
    note: Producing one is often the goal, since a jailbreak that exists is one to fix.
examples:
  - name: Red Teaming Language Models with Language Models
    url: https://arxiv.org/abs/2202.03286
    note: >-
      Automates the search: one model generates test cases against another,
      "uncovering tens of thousands of offensive replies".
    verifiedOn: 2026-08-22
sources:
  - id: red-team-paper
    url: https://arxiv.org/abs/2202.03286
    title: Red Teaming Language Models with Language Models — Perez et al.
    verifiedOn: 2026-08-22
    quote: >-
      In this work, we automatically find cases where a target LM behaves in a harmful way, by generating test cases ("red teaming") using another LM.
    note: Submitted 7 February 2022.
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
---

The premise: "language models often cannot be deployed because of their
potential to harm users in hard-to-predict ways."[[cite:red-team-paper]]
Hard-to-predict is the difficulty. You cannot test for failures you have not
thought of, and the interesting failures are the ones nobody thought of.

## Why humans alone are not enough

The paper's motivation is a capacity problem: "prior work identifies harmful
behaviors before deployment by using human annotators to hand-write test cases.
However, human annotation is expensive, limiting the number and diversity of
test cases."[[cite:red-team-paper]]

Diversity matters more than number. A small team writes test cases that reflect
what a small team imagines, and shares its blind spots.

## Automating the adversary

The method is to turn the problem on the technology: "we automatically find
cases where a target LM behaves in a harmful way, by generating test cases
('red teaming') using another LM", scoring replies "using a classifier trained
to detect offensive content."[[cite:red-team-paper]]

The result is a scale argument: "uncovering tens of thousands of offensive
replies in a 280B parameter LM chatbot."[[cite:red-team-paper]] Not a better
attack than a human would write — many more of them, at a cost that permits
running it on every release.

## What to red-team in an [agentic system](agent)

The surface is larger than a chat model's, because the consequences are.
OWASP's agentic Top 10 is a reasonable checklist to attack
against:[[cite:owasp-agentic-top]]

- **[Prompt injection](prompt-injection)** in every channel the agent reads.
- **[Indirect injection](indirect-prompt-injection)** through documents, pages
  and tool results.
- **[Jailbreaks](jailbreak)** against whatever the
  [system prompt](system-prompt) forbids.
- **[Excessive agency](excessive-agency)** — what can the agent be talked into
  doing with the permissions it holds.
- **[Memory poisoning](memory-poisoning)** — can a false fact be written into
  [long-term memory](long-term-memory) and read back as knowledge.

## What it does not give you

Assurance. Red teaming finds failures; it never establishes their absence, and a
clean run means the team did not find anything rather than that there is nothing
to find.

Which is why it belongs alongside a [permission model](permission-model) and a
[sandbox](sandbox) rather than instead of them. Testing reduces how often
something goes wrong; architecture decides what it costs when it does.
