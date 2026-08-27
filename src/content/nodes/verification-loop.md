---
title: Verification loop
kind: concept
aka:
  - self-verification
  - run-and-fix
canonical:
  status: de-facto
  term: Verification loop
  body: Anthropic, in the Claude Code glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    This page originally recorded the term as `none`, on the claim that no
    surveyed glossary carried it. That was wrong: the Claude Code glossary is
    one of the eight glossaries this guide surveys, and it has an entry.
    Corrected after reading the glossary directly rather than trusting the
    inventory's `attestedBy` field, which is computed from a term-name match
    and had missed it.
tags: [agentic, technique]
zoom: 2
summary: An agent checking its own work by actually running it, then fixing
  what failed — feedback from the world rather than from a model.
fieldMark: >-
  The distinguishing feature is that something other than a model
  produced the feedback. A test result, a compiler error, an HTTP status: facts
  the agent cannot talk its way around.
useCase:
  scenario: >-
    An agent writes a function that looks correct, calls a library method that
    does not exist, and would have shipped it.
  detail: >-
    Reading the code again would not catch it — the invented method has exactly
    the right shape, which is what makes hallucinated APIs so persuasive.
    Running it catches it immediately and unambiguously, and the error message
    tells the agent what to fix. This is why [agentic coding](agentic-coding) works at all, and
    why the same agent given no way to execute anything is a much weaker tool.
relations:
  - type: part-of
    target: agentic-loop
    note: The feedback stage, when the feedback comes from execution.
  - type: consumes
    target: command-execution
    note: >-
      Requires actually running something, which is why it is available to a
      coding agent and not to a chat window.
examples:
  - name: Evaluator-optimizer
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      The documented pattern this generalises: generate, evaluate, refine in a
      loop — here with execution as the evaluator.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      How a session knows the work is actually done rather than just plausible.
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---
Anthropic's [Claude Code](claude-code) glossary puts the purpose first: a
verification loop is "how a session knows the work is actually done rather than
just plausible. You give Claude a check it can run, such as a test suite, a
build, or a screenshot comparison, and Claude iterates until the check passes
instead of stopping after one attempt."[[cite:claude-code-glossary]]

An agent that writes code and stops has produced a guess. An agent that runs it,
reads the failure and fixes it has produced something checked.

The difference is where the feedback came from. [Reflection](reflection) asks a
model to judge; a verification loop asks reality, and reality is not persuaded
by fluent text.

## Why it matters more than any prompting technique

[Hallucination](hallucination) in code is invisible on inspection. An invented
library method is named correctly, fits the surrounding style, and reads exactly
like the real ones — because being plausible is precisely what the model
optimised for.

Executing it collapses the whole question in milliseconds. So does a type
checker, a linter, a schema validator or an HTTP response code. Every one of
them is a source of truth the model did not author.

This is the strongest available answer to "how do you trust agent output": not
by trusting it, but by arranging for it to be checked by something that cannot
be talked into agreeing.

## What makes a good verification signal

- **Fast**, because the loop runs many times.
- **Unambiguous** — pass or fail, not a judgment call.
- **Specific** — an error naming a line beats one naming a file.
- **Hard to satisfy accidentally.** This is the one that bites: a test suite the
  agent can make pass by deleting the test is not a verification signal, it is
  a target.

## Where it does not reach

Anything without an executable criterion. Whether prose is persuasive, whether a
design is sound, whether the requirement was understood correctly — none of it
runs, so none of it can be verified this way.

For those, [reflection](reflection) and a
[human in the loop](human-in-the-loop) are what remain, and they are weaker. The
glossary makes the same point from the other side: a verification loop is "the
prerequisite for … unattended runs", because "without one, the only thing
deciding the agent is finished is the agent
itself."[[cite:claude-code-glossary]]
Recognising which half of a task has a verification signal, and which half does
not, is most of what makes agent output trustworthy in one domain and unreliable
in another.

## Why it generalises the documented pattern

Anthropic's evaluator-optimizer runs "one LLM call [generating] a response while
another provides evaluation and feedback in a
loop."[[cite:anthropic-agents]] A verification loop is that shape with the
evaluator replaced by something that executes.

Their condition for the pattern being worth building — that feedback
demonstrably improves the response — is satisfied trivially here, because a
stack trace is feedback of a quality no critic produces.
