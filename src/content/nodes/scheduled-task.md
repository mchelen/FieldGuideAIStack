---
title: Scheduled task
kind: concept
aka:
  - routine
  - cron job
  - recurring prompt
canonical:
  status: contested
  body: Anthropic, which documents session-scoped "scheduled tasks" and cloud "Routines" as different things
  url: https://code.claude.com/docs/en/scheduled-tasks
  title: Scheduled tasks — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    The word is used for two arrangements with different lifetimes. Anthropic's
    scheduled tasks "are session-scoped: they live in the current conversation
    and stop when you start a new one", while Routines run independently of any
    session. Confusing them is how a reminder quietly stops firing.
tags: [agentic, runtime]
zoom: 3
summary: Agent work that runs on a timetable rather than on request — and the
  oversight problem that follows from nobody being there when it does.
fieldMark: Ask what happens when it needs approval. A scheduled run cannot fall
  back to a human, so either its permissions are narrower than an interactive
  run's or nobody has thought about it.
useCase:
  scenario: >-
    A build should be checked every hour and a failure investigated.
  detail: >-
    Scheduling the check is the easy half. The hard half is what the agent may
    do when it finds something at three in the morning — investigate and report,
    or investigate and fix. That question is a permission decision, not a
    scheduling one, and the honest answer is usually that unattended runs get a
    narrower autonomy level than the same agent gets when someone is watching.
relations:
  - type: consumes
    target: background-execution
    note: >-
      A timetable is only useful if work can run with nobody attending it.
  - type: distinguished-from
    target: human-in-the-loop
    note: >-
      Directly in tension. A gate that requires a person is a gate that stalls
      when the schedule fires at night.
examples:
  - name: Claude Code scheduled tasks
    vendor: Anthropic
    url: https://code.claude.com/docs/en/scheduled-tasks
    note: >-
      Session-scoped: "they live in the current conversation and stop when you
      start a new one". Routines are the cloud equivalent that survives.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-scheduled
    url: https://code.claude.com/docs/en/scheduled-tasks
    title: Scheduled tasks — Claude Code documentation
    verifiedOn: 2026-08-22
---

Scheduled tasks "let Claude re-run a prompt automatically on an interval",
useful "to poll a deployment, babysit a PR, check back on a long-running build,
or remind yourself to do something later in the
session."[[cite:claude-code-scheduled]]

## Two lifetimes wearing one name

Anthropic's session-scoped tasks "live in the current conversation and stop when
you start a new one", surviving a resume only while unexpired. For "scheduling
that survives independently of any session", the answer is a different feature —
Routines, a desktop scheduled task, or ordinary
CI.[[cite:claude-code-scheduled]]

That distinction is the reason this page records the term as contested. Both
arrangements are called scheduling, and the failure mode of picking the wrong one
is silent: the task simply stops firing, and nothing reports that it did.

## Polling versus events

Worth stating because scheduling is often reached for when it is not the right
tool. Anthropic's own documentation points elsewhere first: "to react to events
as they happen instead of polling, see Channels: your CI can push the failure
into the session directly."[[cite:claude-code-scheduled]]

A schedule is a guess about when something might have changed. An event is the
thing having changed. Where both are available, polling costs
[tokens](token) on every tick to usually learn nothing.

## The oversight problem

This is the substantive issue and it is not about scheduling at all.

An interactive agent can stop and ask — that is what
[approval mode](approval-mode) and a
[human in the loop](human-in-the-loop) are for. A scheduled run at 3am has
nobody to ask. The options are all compromises:

- **Narrow the [autonomy level](autonomy-level)** for unattended runs, so
  nothing needing approval is reachable.
- **Queue the request** and let the task stall until morning, which often
  defeats the point of scheduling it.
- **Act and report**, moving the review to after the fact.

Products differ on which they choose, and rarely say so on the page that
advertises the scheduling.

## Compounding, unattended

An [agentic loop](agentic-loop) amplifies its own mistakes, and a schedule
repeats the loop. A misconfigured task that does something slightly wrong does
it every hour until somebody notices — which, since nobody is watching, may be a
while. Scheduled agent work deserves a lower [permission model](permission-model)
and a louder failure mode than the same work run by hand.
