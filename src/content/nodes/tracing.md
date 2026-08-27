---
title: Tracing
kind: concept
aka:
  - observability
  - span
canonical:
  status: standard
  term: Trace
  body: OpenTelemetry, whose trace and span model is the industry standard for distributed systems
  url: https://opentelemetry.io/docs/concepts/signals/traces/
  title: Traces — OpenTelemetry documentation
  verifiedOn: 2026-08-22
  note: >-
    One of the few terms here with an actual specification behind it. The
    agentic usage adds nothing new to the model; what it adds is which
    attributes are worth recording, which is why OpenTelemetry has separate
    generative-AI semantic conventions.
tags: [evaluation, runtime]
zoom: 2
summary: Recording what an agent did, step by step, so a run can be inspected
  afterwards — the only way to answer "why did it do that".
fieldMark: A trace is per-run and after the fact. If the question is "why did
  this particular run go wrong", you need a trace; if it is "how often does
  this go wrong", you need an eval.
useCase:
  scenario: >-
    An agent produced a wrong answer once, an hour ago, and nobody can reproduce
    it.
  detail: >-
    Without a trace there is nothing to look at — the run was a sequence of
    stateless calls that left no record. With one, you can see which tool
    returned what, what the prompt looked like at each step, and where the
    reasoning turned. Agentic systems are non-deterministic enough that
    reproduction is often impossible, which makes recording the run the only
    reliable form of debugging available.
flow:
  scenario: >-
    A run that went wrong somewhere in nineteen steps, and a reviewer who
    was not watching any of them.
  path:
    - node: agentic-loop
      does: >-
        nineteen steps, each with a call and a result
    - node: tracing
      does: >-
        each one recorded, so the run can be inspected afterwards
      self: true
    - node: evaluation
      does: >-
        and the record is what a measurement is computed from
  returns: >-
    Not logging — the unit is the step, not the line
relations:
  - type: part-of
    target: agentic-loop
    note: Each iteration is a span; the run is the trace.
  - type: consumed-by
    target: evaluation
    note: >-
      Traces are where an eval set comes from — real runs, with their inputs and
      what actually happened.
examples:
  - name: OpenTelemetry traces
    url: https://opentelemetry.io/docs/concepts/signals/traces/
    note: >-
      "The path of a request through your application"; spans carry a name,
      parent id, timestamps, attributes, events and status.
    verifiedOn: 2026-08-22
sources:
  - id: otel-traces
    url: https://opentelemetry.io/docs/concepts/signals/traces/
    title: Traces — OpenTelemetry documentation
    verifiedOn: 2026-08-22
---

A trace is "the path of a request through your application", giving "the big
picture of what happens when a request is
made."[[cite:otel-traces]] It is built from spans, each representing "a unit of
work or operation" and carrying a name, a parent span id, start and end
timestamps, attributes, events and a status.[[cite:otel-traces]]

Nothing about that model needed changing for agents. What changed is what the
spans contain.

## Why agents need it more than ordinary software

Three properties combine badly:

- **Non-determinism.** The same input can produce a different run, so
  reproducing a failure is not reliably possible.
- **Depth.** One [turn](turn) can be dozens of model calls and hundreds of tool
  executions, all invisible from outside.
- **Statelessness.** Each call leaves no record of itself. If nothing wrote the
  step down, it did not happen as far as any later investigation is concerned.

For ordinary software, logs plus a debugger usually suffice because you can run
it again. Here, the run is the only artifact, and only if you kept it.

## What is worth putting in a span

- The prompt as actually sent, after assembly — not the template.
- The tool called, its arguments, and what it returned.
- Token counts in and out, and whether the [prompt cache](prompt-caching) hit.
- [Latency](latency), split into the wait and the generation.
- The model and its settings, including [effort](effort-level) and
  [temperature](temperature).
- Which [hooks](hook) fired, since they act without the model's involvement and
  are otherwise invisible in the transcript.

The prompt-as-sent is the one most often missing and most often needed. A
template plus variables is not the same artifact as the string the model read,
and [context engineering](context-engineering) failures are precisely
differences between the two.

## Traces and evals feed each other

A trace answers "what happened in this run". An [evaluation](evaluation) answers
"how often does this happen". They are different questions and the same data:
the most useful eval set is real traces, with the inputs that occurred and the
behaviour that should have followed.

Teams that trace early get an eval set for free. Teams that do not end up
inventing test cases from memory, which selects for the failures they already
remember.
