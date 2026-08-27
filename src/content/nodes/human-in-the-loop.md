---
title: Human in the loop
kind: concept
aka:
  - HITL
  - human oversight
  - approval gate
canonical:
  status: de-facto
  term: Human-in-the-loop
  body: Long-standing in automation and control engineering; used unchanged for agentic systems
  url: https://www.anthropic.com/engineering/building-effective-agents
  title: Building effective agents — Anthropic
  verifiedOn: 2026-08-22
  note: >-
    Not carried by the surveyed AI glossaries under this name, though the idea
    appears throughout them. It predates machine learning entirely, and the
    agentic usage adds nothing to the meaning except the stakes.
tags: [agentic, safety]
zoom: 2
summary: A person required in the decision path before an action lands — the
  oldest control in this guide, and the one every other guardrail falls back to.
fieldMark: Ask what the human is actually given. A prompt saying "run this
  command?" with no context is a rubber stamp with extra steps, and the tenth
  one in a row is approved without reading.
useCase:
  scenario: >-
    An agent is trusted to edit code and not trusted to push it.
  detail: >-
    The gate goes exactly at that boundary: everything before it runs freely,
    and the one irreversible step waits. Placing gates well is the whole skill —
    too few and a mistake escapes, too many and the person clicking approve
    stops reading, which is worse than no gate because it manufactures the
    appearance of oversight without the substance.
flow:
  scenario: >-
    An agent that pauses before the one step that spends money, and does not
    pause before the forty that do not.
  path:
    - node: agentic-loop
      where: wherever the product runs
      does: >-
        runs unattended, step after step
    - node: approval-mode
      where: wherever the product runs
      does: >-
        the policy deciding which steps stop
    - node: human-in-the-loop
      where: a person, not a system
      does: >-
        a person answers, and the loop continues
      self: true
    - node: scheduled-task
      where: nobody, at 3am
      does: >-
        which is where there may be nobody to ask at all
  returns: >-
    Ask about everything and the answer stops being read
relations:
  - type: implemented-by
    target: approval-mode
    note: The policy layer that decides which actions reach a person.
  - type: part-of
    target: agentic-loop
    note: A termination or pause condition inserted into the cycle.
examples:
  - name: Building effective agents
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: >-
      Recommends "extensive testing in sandboxed environments, along with the
      appropriate guardrails" for autonomous agents.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

Everything else in the safety toolkit is probabilistic. A
[system prompt](system-prompt) is guidance a model usually follows; a
[verification loop](verification-loop) catches what it can execute; a
[sandbox](sandbox) bounds the damage. A human in the loop is the only control
that stops an action outright.

Which is why it is the fallback for everything the others cannot cover, and why
its placement matters more than its presence.

## Where the gate goes

At the irreversible step. Editing a file is recoverable; pushing it is less so;
sending an email is not at all. The natural boundary is where undo stops
working, and an [approval mode](approval-mode) is the mechanism for expressing
that boundary as policy rather than as vigilance.

Placing gates earlier than that — approving each read, each search — costs
attention without buying safety, and attention is the resource this control
actually runs on.

## Approval fatigue is the failure mode

A person asked to approve fifty actions approves the fiftieth without reading
it. This is not a discipline problem; it is what happens to any human placed in
a high-frequency, low-information loop, and it has been documented in aviation
and industrial control for decades.

The consequence is specific and worth stating plainly: **a badly designed gate
is worse than none**, because it produces a record of approval for a decision
nobody made. If a system needs sign-off to be meaningful, it has to ask rarely
and say enough.

## What a good prompt contains

- **What is about to happen**, in the terms of the task rather than the API.
- **What it will affect** — which files, which service, whose data.
- **Whether it can be undone**, and how.
- **Why the agent wants it**, so the human can judge the reasoning and not only
  the action.

"Run `rm -rf ./build`?" and "Delete the build directory to force a clean
rebuild, as the last three builds failed with stale artifacts?" ask for the same
permission and are not the same question.

## Where it does not scale

[Background execution](background-execution), scheduled tasks and long
autonomous runs all move work to
times when nobody is watching. A gate that requires a person is a gate that
stalls, and the honest options are to narrow what the agent may do unattended or
to accept that the review happens afterwards.

Anthropic's advice points the same way: autonomy suits "trusted environments",
with testing "in sandboxed environments, along with the appropriate
guardrails."[[cite:anthropic-agents]] When the human cannot be in the loop, the
boundary has to be in the environment.
