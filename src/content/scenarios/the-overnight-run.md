---
title: The overnight run
order: 8
summary: Halcyon wants the maintenance backlog triaged before the yard opens,
  and finds that every oversight control they rely on assumes somebody is
  awake.
cast:
  - name: Britt Sørensen
    role: Chief engineer, fleet
  - name: Ama Osei
    role: Engineering lead
concepts:
  - scheduled-task
  - background-execution
  - human-in-the-loop
  - autonomy-level
  - agentic-loop
  - tracing
outcome: >-
  The overnight job reads, drafts and files nothing. Britt arrives to a ranked
  list and a trace for each item. Halcyon's rule — unattended runs get a
  narrower permission set than the same agent gets at 10am.
---

Britt's yard team starts at 06:00 and spends the first hour reading the previous
day's defect reports. The proposal was obvious: have an agent read them
overnight, cross-reference the manuals, and produce a ranked list by 05:30.

The scheduling was the easy part. What it exposed was that Halcyon's entire
safety approach rested on an assumption nobody had written down.

## Every gate they had assumed a person

Their [approval mode](approval-mode) sends anything consequential to a human.
Their incident rule from the refund email says a person clicks send. Their
agent-in-the-yard permissions ask before anything outside the test suite.

All of it works because somebody is at a desk. At 03:00 nobody is, and a
[human in the loop](human-in-the-loop) becomes a job that stalls until morning —
which defeats the point of running it overnight.

Ama listed the three honest options, none of them free:

1. **Narrow what it may do**, so nothing needing approval is reachable.
2. **Queue the request** and let it wait, accepting that the 05:30 list may be
   incomplete.
3. **Act and report**, moving the review to after the fact.

## Why they picked the narrow one

[Autonomy level](autonomy-level) is not one setting; it is a mapping from action
classes to policies, and the mapping can differ by context. Halcyon's overnight
agent gets a different mapping from the same agent at 10am:

| | Attended | Overnight |
| --- | --- | --- |
| Read reports and manuals | yes | yes |
| Draft a work order | yes | yes |
| **File** a work order | ask | **no** |
| Order a part | ask | **no** |
| Message a supplier | ask | **no** |

The overnight column has no "ask" row in it at all, which is the design: if
nothing can require approval, nothing can stall waiting for it.

## Compounding was the argument that convinced Britt

An [agentic loop](agentic-loop) amplifies whatever it repeats, and a
[scheduled task](scheduled-task) repeats the loop. A misconfigured job that does
something slightly wrong does it every night until somebody notices — and since
nobody is watching, that may be a fortnight.

Britt's line: *a mistake at 10am is a mistake; a mistake at 03:00 is a
subscription.*

## What made it debuggable

[Background execution](background-execution) means the run leaves no trace in
anyone's screen, so Ama instrumented it before shipping it. Each night's job
writes a [trace](tracing): the prompt as actually sent, which manual sections
were retrieved, what the model concluded, and how many steps it took.

The first week's traces are how they found that a third of the runs were
retrieving the wrong vessel class — a bug that would have been invisible in the
output, because the ranked list looked entirely reasonable either way.
