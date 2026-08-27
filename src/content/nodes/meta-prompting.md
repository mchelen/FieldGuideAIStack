---
title: Meta-prompting
kind: concept
aka:
  - prompt optimisation
  - structure-oriented prompting
canonical:
  status: contested
  body: The Prompt Engineering Guide, which records the structure-oriented sense
  url: https://www.promptingguide.ai/techniques/meta-prompting
  title: Meta Prompting — Prompt Engineering Guide
  verifiedOn: 2026-08-22
  note: >-
    Two distinct meanings share the name. One is a prompting style that
    supplies the structure of a problem rather than worked examples. The other
    is using a model to write or improve a prompt for another model. Neither
    has displaced the other and context has to disambiguate.
tags: [context, technique]
zoom: 3
summary: Prompting about the structure of a problem rather than its content —
  and, in the other common sense, using a model to write the prompt.
fieldMark: Ask which sense is meant before agreeing about it. "We use
  meta-prompting" describes two quite different practices with different costs.
useCase:
  scenario: >-
    A few-shot prompt with long worked examples is eating the [context window](context-window) and
    the examples keep biasing the answer toward their own specifics.
  detail: >-
    Supplying the abstract shape of the problem and its solution instead —
    the steps, the form of the answer, what a good one contains — gets the same
    guidance at a fraction of the tokens, and without the model latching onto
    incidental details of whichever examples were chosen. The trade is that
    structure is harder to write than examples are to collect.
flow:
  scenario: >-
    A prompt about the shape of a problem rather than its content, and a
    second model rewriting the first one's prompt.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        have a prompt that works inconsistently
    - actor: A weak prompt
      where: your machine
      does: >-
        producing inconsistent output
    - node: meta-prompting
      where: the prompt you send
      does: >-
        prompt about structure, not content — or have a model rewrite it
      self: true
    - node: few-shot-prompting
      where: the prompt you send
      does: >-
        the alternative it is usually measured against
    - node: prompt-engineering
      where: your evaluation harness
      does: >-
        and the evaluation set that says which one won
  returns: >-
    Fewer tokens than examples, and harder to predict
relations:
  - type: kind-of
    target: prompt-engineering
    note: A prompting style in one sense, and prompting applied to itself in the other.
  - type: distinguished-from
    target: few-shot-prompting
    note: >-
      Structure-oriented against content-driven. Few-shot shows instances; meta
      prompting describes the shape those instances share.
examples:
  - name: Meta Prompting
    url: https://www.promptingguide.ai/techniques/meta-prompting
    note: >-
      Catalogues the structure-oriented sense, drawing on Zhang et al. (2024),
      with the comparison against few-shot prompting on the MATH benchmark.
    verifiedOn: 2026-08-22
sources:
  - id: promptguide-meta
    url: https://www.promptingguide.ai/techniques/meta-prompting
    title: Meta Prompting — Prompt Engineering Guide
    verifiedOn: 2026-08-22
    quote: >-
      Abstract examples: Employs abstracted examples as frameworks, illustrating the structure of problems and solutions without focusing on specific details.
  - id: promptguide-fewshot
    url: https://www.promptingguide.ai/techniques/fewshot
    title: Few-Shot Prompting — Prompt Engineering Guide
    verifiedOn: 2026-08-22
---

The [Prompt Engineering](prompt-engineering) Guide records meta prompting as a technique that "employs
abstracted examples as frameworks, illustrating the structure of problems and
solutions without focusing on specific details", drawing "from type theory to
emphasize the categorization and logical arrangement of components in a
prompt."[[cite:promptguide-meta]]

Against [few-shot prompting](few-shot-prompting), the difference is what the
prompt carries: meta prompting "focuses on a more structure-oriented approach as
opposed to a content-driven approach which few-shot prompting
emphasizes."[[cite:promptguide-meta]]

## The claimed advantages

Three, as recorded: "token efficiency — reduces the number of tokens required by
focusing on structure rather than detailed content"; "fair comparison — provides
a more fair approach for comparing different problem-solving models by
minimizing the influence of specific examples"; and "zero-shot efficacy — can be
viewed as a form of [zero-shot prompting](zero-shot-prompting), where the influence of specific
examples is minimized."[[cite:promptguide-meta]]

The second is a research argument rather than a product one, and it is the
interesting one. A model's score on a few-shot [benchmark](benchmark) partly measures how
well the chosen examples suited it. Removing the examples removes that
confound.[[cite:promptguide-fewshot]]

## The other sense

In common usage — especially around agents — meta-prompting means using a model
to write or improve a prompt given to a model. Draft a prompt, run it, show a
model the failures, have it revise.

This is a different practice with a different economics, and it is closer to an
optimisation loop than to a prompting style. It works, within limits: a model is
good at rewriting instructions to be clearer and poor at knowing which rewrite
will actually score better, so the loop needs a real [evaluation](evaluation) set to close
around or it optimises for plausibility.

## Which to say

Both senses are current and neither is going away, which is why this page
records the term as contested. In writing, name the practice rather than the
category — "structure-oriented prompting" or "model-generated prompts" — and the
ambiguity disappears.
