---
title: Short-term memory
kind: concept
aka:
  - working memory
  - session state
canonical:
  status: none
  note: >-
    No surveyed glossary carries the term, and it is borrowed from cognitive
    psychology where it means something else entirely. In agentic systems it
    names the state scoped to one session — which is mostly just the context
    window, described from a different angle.
tags: [agentic, structure]
zoom: 3
summary: State that lasts only for the current run — in practice the
  conversation itself, since there is nowhere else for it to live.
fieldMark: Short-term memory is not a store the agent writes to. It is the
  transcript, and "remembering" means the fact is still in the window.
useCase:
  scenario: >-
    An agent is told a constraint early in a long task and violates it two
    hours later.
  detail: >-
    It did not forget in any ordinary sense. The constraint either fell outside
    the context window, or survived compaction only as a summarised phrase, or
    is still present and outweighed by everything added since. All three are
    context problems, and the fix is to move the constraint somewhere it is
    re-read rather than merely remembered — a file, a task list, a [system
    prompt](system-prompt).
flow:
  scenario: >-
    Everything an agent knows inside one run, which is the conversation and
    nothing else.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        start a task and keep going for eighty turns
    - actor: One run
      where: wherever the product runs
      does: >-
        a task, from first message to last
    - node: memory
      where: wherever the product runs
      does: >-
        what the agent retains at all, since the model retains nothing
    - node: short-term-memory
      where: wherever the product runs
      does: >-
        the conversation so far, re-sent on every call
      self: true
    - node: context-window
      where: the prompt you send
      does: >-
        and it lasts exactly as long as it fits
    - node: compaction
      where: wherever the product runs
      does: >-
        which is what happens when it stops fitting
  returns: >-
    It ends with the run, unless something writes it down
relations:
  - type: kind-of
    target: memory
    note: The half that does not survive the session.
  - type: part-of
    target: session
    note: Scoped to it by definition, and gone when it ends.
examples:
  - name: Claude Code sessions
    vendor: Anthropic
    url: https://code.claude.com/docs/en/glossary
    note: >-
      A session's transcript is the store: "a conversation tied to your current
      directory, with its own independent context window".
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      The working memory for a session, holding conversation history, file contents, command outputs, CLAUDE.md, auto memory, loaded skills, and system instructions.
---

There is no short-term memory store. There is a [context window](context-window)
containing a transcript, and everything called short-term memory is a way of
talking about what is currently in it.

That is worth insisting on, because the psychological metaphor implies a
faculty — something the agent maintains, consults and updates — and no such
component exists. Anthropic's glossary describes a
[session](session) as the boundary: a conversation "with its own independent
context window."[[cite:claude-code-glossary]]

## What follows from it being the transcript

- **Nothing is stored deliberately.** Everything that happened is present until
  it is dropped, whether or not it was worth keeping.
- **Nothing is retrieved deliberately.** The whole thing is re-sent on every
  call, so "recalling" is just the model reading further back.
- **Forgetting is a management decision**, not a decay process:
  [compaction](compaction) summarises it, truncation drops it, and a new session
  discards all of it.
- **Recency wins.** A constraint stated once at the start competes with fifty
  turns of subsequent material, and loses more often than people expect.

## Why "it forgot" is usually the wrong diagnosis

The three real causes look identical from outside: the material fell out of the
window, it survived compaction only in summary, or it is present and outweighed.

Each has a different fix, and none of them is a better model. This is
[context engineering](context-engineering)'s home ground — deciding what stays,
what gets summarised, and what is written down somewhere it will be re-read.

## Where the boundary sits

Anything that must survive the session has to be written outside it, which is
[long-term memory](long-term-memory). The line between the two is not a
capability of the agent; it is a decision about where a fact was put.
