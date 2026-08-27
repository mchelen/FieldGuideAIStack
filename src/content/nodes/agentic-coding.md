---
title: Agentic coding
kind: concept
aka:
  - AI coding agent
  - autonomous coding
canonical:
  status: de-facto
  term: Agentic coding
  body: Anthropic, in the [Claude Code](claude-code) glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    Recent and vendor-coined, but consistently used for the same contrast:
    an assistant that acts against a codebase, as opposed to one that returns
    text a person applies.
tags: [agentic, core]
zoom: 2
summary: Using an agent to write, run and fix code rather than to suggest it —
  the distinction being whether the tool can act on the repository itself.
fieldMark: The test is whether it can run the tests. A tool that writes code
  and cannot execute anything is a suggestion engine, however good the code is.
useCase:
  scenario: >-
    A dependency upgrade breaks eleven tests across four files.
  detail: >-
    A completion tool can propose a fix for each failure, and a person applies
    them one at a time and re-runs the suite. An agent reads the failures, edits
    the files, runs the suite itself, sees which fixes worked, and iterates.
    The difference is not code quality — it is that the feedback loop closed
    without a human ferrying results back and forth.
flow:
  scenario: >-
    An agent that edits files, runs the suite, reads the failure and edits
    again — rather than suggesting a line.
  path:
    - actor: A failing test
      does: >-
        the goal, and the thing that says when it is met
    - node: agentic-coding
      does: >-
        the agent writes, runs and fixes rather than suggesting
      self: true
    - node: command-execution
      does: >-
        which is what makes running it possible at all
    - node: verification-loop
      does: >-
        and what lets the loop stop on evidence
  returns: >-
    Review shifts from reading lines to reading diffs
relations:
  - type: consumes
    target: command-execution
    note: Running the code is what distinguishes it from suggesting the code.
  - type: consumes
    target: verification-loop
    note: >-
      A test suite is an unusually good verification signal, which is why this
      domain works better than most.
examples:
  - name: Claude Code
    vendor: Anthropic
    url: https://code.claude.com/docs/en/glossary
    note: >-
      Described as agentic "because it has tools that let it act, not just
      advise".
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A workflow where the AI can read files, run commands, and make changes autonomously while you watch, redirect, or step away, as opposed to chat-based assistants that only respond with text you must apply yourself.
---

Agentic coding is "a workflow where the AI can read files, run commands, and
make changes autonomously while you watch, redirect, or step away, as opposed to
chat-based assistants that only respond with text you must apply
yourself."[[cite:claude-code-glossary]]

The distinction is capability, not cleverness: a tool "is agentic because it has
tools that let it act, not just advise."[[cite:claude-code-glossary]]

## Why coding is where agents work best

Because software has something most domains lack: an oracle. Tests pass or fail.
Code compiles or does not. A type checker is not persuaded by a confident
explanation.

That makes a [verification loop](verification-loop) available, and a
verification loop is what converts a plausible answer into a checked one. An
invented library method survives any amount of re-reading and dies instantly on
execution.

Most other domains have no equivalent. This is the single best explanation for
why agentic coding matured before agentic anything-else, and it is worth
remembering before assuming the results transfer.

## What it requires

- **[Local file access](local-file-access)** — reading the repository, not a
  pasted snippet.
- **[Command execution](command-execution)** — running the tests, the build, the
  linter.
- **A loop** — [ReAct](react) in practice: read the failure, change something,
  run again.
- **A [permission model](permission-model)** — because all of the above is
  exactly what you would not hand to an untrusted process.

Remove command execution and what remains is a very good completion tool. The
loop cannot close.

## What changes about the work

Review moves from "is this line right" to "is this change right", because the
agent produces changes rather than lines. The [turn](turn) becomes the unit of
attention, and reading a diff becomes more important than reading a suggestion.

It also concentrates the risk. An agent with write access and a shell is an
agent that can do real damage from a misread instruction or an
[indirect prompt injection](indirect-prompt-injection) in a file it opened —
which is why the [sandbox](sandbox) and the
[autonomy level](autonomy-level) questions are sharper here than anywhere else
in the guide.
