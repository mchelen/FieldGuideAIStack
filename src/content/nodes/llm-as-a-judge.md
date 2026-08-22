---
title: LLM-as-a-judge
kind: concept
aka:
  - model-graded evaluation
  - AI grader
canonical:
  status: de-facto
  term: LLM-as-a-judge
  body: Zheng et al. (2023), where the practice was named and its biases catalogued
  url: https://arxiv.org/abs/2306.05685
  title: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena — Zheng et al.
  verifiedOn: 2026-08-22
tags: [evaluation, technique]
zoom: 2
summary: Using a model to score another model's output — cheap enough to run on
  everything, with biases the paper that named it documented in detail.
fieldMark: Ask which order the candidates were shown in. Position bias is real
  and large, and an evaluation that does not swap the order is measuring
  something other than quality.
useCase:
  scenario: >-
    A team needs to score two thousand summaries and cannot read them.
  detail: >-
    Human judgment is the standard and is not available at that volume. A judge
    model scores all two thousand in minutes, and — this is the part that
    matters — the paper that named the technique found strong judges "can match
    both controlled and crowdsourced human preferences". The caveat is equally
    documented: it does so while carrying position, verbosity and
    self-enhancement biases that have to be controlled for rather than hoped
    away.
relations:
  - type: kind-of
    target: evaluation
    note: An evaluation method, and the one that made evaluating open-ended output affordable.
  - type: distinguished-from
    target: autorater-evaluation
    note: >-
      An autorater is a model trained on human ratings. A judge is a general
      model prompted to rate. Google's glossary keeps them separate.
examples:
  - name: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena
    url: https://arxiv.org/abs/2306.05685
    note: >-
      Names the technique, verifies agreement with human preference, and
      catalogues the biases.
    verifiedOn: 2026-08-22
sources:
  - id: judge-paper
    url: https://arxiv.org/abs/2306.05685
    title: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena — Zheng et al.
    verifiedOn: 2026-08-22
    note: Submitted 9 June 2023, last revised 24 December 2023.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---
The problem it solves is stated in the paper's first line: "evaluating [large
language model](large-language-model) based chat assistants is challenging due
to their broad capabilities and the inadequacy of existing benchmarks in
measuring human preferences."[[cite:judge-paper]]

The response was to "explore using strong LLMs as judges to evaluate these
models on more open-ended questions", and the headline finding is that it works:
"strong LLM judges like GPT-4 can match both controlled and crowdsourced human
preferences."[[cite:judge-paper]]

## The biases, named by the paper that endorsed the method

The same abstract lists them: "position, verbosity, and self-enhancement biases,
as well as limited reasoning ability."[[cite:judge-paper]] Each has a practical
consequence:

- **Position** — which candidate appears first affects which wins. Swap the
  order and average, or the score partly measures your [prompt template](prompt-template).
- **Verbosity** — longer answers score better, whether or not they say more. The
  same bias [RLHF](reinforcement-learning-from-human-feedback) picks up from
  human raters, for the same reason.
- **Self-enhancement** — a judge prefers output resembling its own. Judging a
  model with a sibling of that model is not an independent measurement.
- **Limited reasoning** — a judge is worse at checking a hard answer than at
  preferring a fluent one, which is precisely backwards for the hard cases.

That a paper proposing a technique documents its failure modes this plainly is
unusual, and it is the reason to cite it rather than a vendor page.

## Where it is strong and where it is not

**Strong**: relative comparison. "Which of these two is better" is a question
judges answer well, and it is what most evaluation actually needs.

**Weak**: absolute scoring. "Rate this 1–10" produces numbers that drift between
runs and mean little across tasks.

**Weakest**: anything requiring knowledge the judge lacks. A judge cannot verify
a fact it does not know, and will grade a confident falsehood well — which makes
it a poor instrument for [factuality](factuality) and a good one for style,
completeness and instruction-following.

## Not the same as an autorater

Google's glossary reserves [autorater evaluation](autorater-evaluation) for "an
ML model trained on data created by human evaluation", noting that "the best
autoraters are fine-tuned specifically to the task you are
evaluating."[[cite:google-glossary]]

A judge is a general model with a prompt. An autorater is a trained instrument.
The first is what almost everyone uses; the second is what you build when the
first is not accurate enough on your task.
