---
title: Regression testing
kind: concept
aka:
  - non-regression testing
  - change verification
canonical:
  status: standard
  term: Regression testing
  body: Established software engineering practice, long predating machine learning
  url: https://en.wikipedia.org/wiki/Regression_testing
  title: Regression testing — Wikipedia
  verifiedOn: 2026-08-22
  note: >-
    Borrowed wholesale from software engineering, where it is settled
    vocabulary. What is new is that the system under test is non-deterministic,
    which breaks the usual assumption that a passing test stays passing for the
    same reason.
tags: [evaluation, technique]
zoom: 2
summary: Checking that a change did not break what previously worked — harder
  here, because the same input does not reliably produce the same output.
fieldMark: A flaky test in ordinary software is a defect. In a model-backed
  system some variance is inherent, so the question becomes how much change is
  a regression — which somebody has to decide rather than discover.
useCase:
  scenario: >-
    A prompt is edited to fix one bad case and three previously-good cases
    quietly start failing.
  detail: >-
    Prompts are global. A sentence added to steer one situation applies to every
    request, and the cases it damages are the ones nobody re-checked. This is
    the most common way model-backed systems degrade, and it is invisible
    without a saved set of cases that gets re-run on every change — which is
    exactly what regression testing is.
relations:
  - type: kind-of
    target: evaluation
    note: An evaluation run against your own prior behaviour rather than against a standard.
  - type: distinguished-from
    target: benchmark
    note: >-
      A benchmark compares models against each other. Regression testing
      compares your system against its own previous version.
examples:
  - name: Regression testing
    url: https://en.wikipedia.org/wiki/Regression_testing
    note: >-
      "Re-running functional and non-functional tests to ensure that previously
      developed and tested software still performs as expected after a change."
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-regression
    url: https://en.wikipedia.org/wiki/Regression_testing
    title: Regression testing — Wikipedia
    verifiedOn: 2026-08-22
---

Regression testing is "re-running functional and non-functional tests to ensure
that previously developed and tested software still performs as expected after a
change. If not, that would be called a regression."[[cite:wikipedia-regression]]

The definition transfers unchanged. The assumption underneath it does not.

## What breaks when the system is a model

Ordinary regression testing rests on determinism: the same input produced the
same output yesterday, so a difference today is a change you made. Here the same
input may produce different output for no reason at all —
[temperature](temperature) above zero guarantees it, and even at zero a model
version change or a serving-side difference can move things.

So a failing case is ambiguous in a way it never was before. It could be your
change, or it could be variance. Three consequences:

- **Run each case more than once** and compare distributions rather than single
  outputs, at least where it matters.
- **Pin what you can.** Temperature 0 and an explicit model version remove two
  of the three sources.
- **Decide the threshold deliberately.** How much movement counts as a
  regression is a judgment somebody has to make and write down; it cannot be
  discovered from the data.

## What to test

Not the wording of the output. Test the properties you actually depend on:

- **Structure** — does it parse, does it match the schema.
- **Content** — does the answer contain the required facts.
- **Refusals** — does it still decline what it should.
- **[Tool use](tool-use)** — did it call the right tool with the right
  arguments.

A test asserting exact output text will fail on a harmless rephrasing and teach
everyone to ignore the suite, which is worse than not having one.

## Why prompts make it essential

A [prompt](prompt-engineering) is global state. Unlike a code change scoped to
one function, an added instruction applies to every request the system handles,
and its effects on cases nobody re-checked are unobserved by construction.

The [system prompt](system-prompt) is therefore the highest-risk file in a
model-backed product, and the least likely to have tests. A saved set of cases
re-run on every edit is the cheapest available protection, and it is the same
artifact as the [eval](evaluation) set — which is a good argument for building
it once and using it for both.
