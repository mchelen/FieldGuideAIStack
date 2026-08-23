---
title: The agent in the yard
order: 4
summary: Ama's four engineers try a coding agent, and the interesting decisions
  turn out to be about permissions rather than about code.
cast:
  - name: Ama Osei
    role: Engineering lead
concepts:
  - agentic-coding
  - command-execution
  - verification-loop
  - permission-model
  - sandbox
  - approval-mode
outcome: >-
  The agent runs the test suite freely, edits freely on a branch, and cannot
  push, deploy or touch the payment module. Ama's summary — "we spent one day on
  the tool and three on the boundary, which was the right ratio."
---

Halcyon's booking system is twelve years old and has 1,900 tests, which is the
one genuinely fortunate fact in this story.

Ama's team tried a coding agent on the sort of work nobody enjoys: a dependency
upgrade that broke eleven tests across four files.

## Why it worked at all

Not because the code was better than what an engineer would write. Because the
agent could run the tests.

[Agentic coding](agentic-coding) is distinguished from a completion tool by
being able to act — read files, run commands, see what happened. An invented
library method survives any amount of re-reading and dies instantly on
execution, which is why [command execution](command-execution) rather than code
quality is the capability that matters.

That loop — change something, run the suite, read the failure, change something
else — is a [verification loop](verification-loop), and it works here for a
reason that does not generalise: software has an oracle. Tests pass or fail, and
a compiler is not persuaded by a confident explanation. Most of Halcyon's other
problems have no equivalent.

## Where the three days went

The first day was setup. The next three were spent on a question Ama had not
expected to be the hard one: *what should it be allowed to do?*

The [permission model](permission-model) they arrived at has four layers, and
the order matters because they are not equally strong:

1. **The prompt** says what to work on. Guidance, and no more than that.
2. **The harness** allows `npm test` and `npm run lint` without asking, asks
   before anything else, and refuses `git push` outright.
3. **The sandbox** — a container with the repository mounted and no credentials
   in the environment.
4. **The credentials** the agent has are read-only on everything except a
   scratch branch.

Ama's rule, written in the repository: *if a rule matters, it cannot live in
layer one.* A [system prompt](system-prompt) instruction is a preference the
model usually honours and a hostile file it reads can argue with.

## The setting they got wrong first

[Approval mode](approval-mode) started at ask-every-time, which lasted about
ninety minutes. Approving forty file reads teaches you to approve the
forty-first without looking, which is worse than no gate at all — it produces a
record of approval for a decision nobody made.

They moved the gate to where undo stops working. Edits on a branch are
recoverable and now run freely; pushing is not and still stops.

## What they will not let it near

The payment module, by a rule in the [sandbox](sandbox) rather than a sentence in
the prompt. Not because the agent has done anything wrong, but because the
question Ama asks about any control is *can it misbehave*, not *has it* — and a
boundary tested only by the model's cooperation has not been tested.
