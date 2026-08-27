---
title: Zero-shot prompting
kind: concept
aka:
  - direct prompting
canonical:
  status: de-facto
  term: Zero-shot prompting
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [context, technique]
zoom: 3
summary: Asking with no examples at all, relying entirely on what training
  already instilled — which is what almost every real prompt is.
fieldMark: Every chat message you have ever sent was zero-shot. The term exists
  to name the baseline the other techniques are measured against.
useCase:
  scenario: >-
    A prompt asks for a country's currency and gets "Rupee", "INR", "₹" and
    "Indian rupee" on different runs.
  detail: >-
    Google's own example. Every answer is correct and none of them is the one
    format a caller can parse. Zero-shot leaves output shape unspecified, so the
    model picks a plausible one each time. This is the exact failure that
    one example in the prompt fixes, and it is why [few-shot prompting](few-shot-prompting) exists as
    a technique rather than as a curiosity.
flow:
  scenario: >-
    The baseline every other prompting technique is measured against — just
    the instruction, and nothing else.
  path:
    - actor: An instruction
      does: >-
        no examples, no worked reasoning, no scaffolding
    - node: zero-shot-prompting
      does: >-
        the baseline case, and often good enough
      self: true
    - node: few-shot-prompting
      does: >-
        the next thing to try when it is not
    - node: prompt-engineering
      does: >-
        and the measurement that says whether it helped
  returns: >-
    Try this first — the alternatives cost context
relations:
  - type: kind-of
    target: prompt-engineering
    note: The baseline case — no examples, no [scaffolding](harness).
  - type: distinguished-from
    target: few-shot-prompting
    note: >-
      The difference is examples in the prompt, not examples in training. Both
      run against the same finished model.
examples:
  - name: Zero-shot prompting
    url: https://www.promptingguide.ai/techniques/zeroshot
    note: The community reference's entry, framed as the baseline technique.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A prompt that does not provide an example of how you want the large language model to respond.
  - id: promptguide-zeroshot
    url: https://www.promptingguide.ai/techniques/zeroshot
    title: Zero-Shot Prompting — Prompt Engineering Guide
    verifiedOn: 2026-08-22
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
---

Zero-shot prompting is "a prompt that does not provide an example of how you
want the [large language model](large-language-model) to respond."[[cite:google-glossary]] You ask; the
model answers from what it already knows.

Almost everything anyone sends a model is zero-shot. The term is useful because
it names the baseline — the thing the other techniques have to beat.

## Why it works, when it works

It should not obviously work at all. A model that has never been shown the task
has no reason to know what output you want.

The GPT-3 paper is where this stopped being surprising: models at sufficient
scale perform tasks they were not trained for, given only a description of what
is wanted.[[cite:gpt3-paper]] [Instruction tuning](instruction-tuning) then made
it dependable rather than occasional, by training the model to recognise a
request as a request.

Zero-shot capability is therefore not a prompting trick. It is a property that
was bought during [post-training](post-training) and that prompting merely
draws on.[[cite:promptguide-zeroshot]]

## Where it breaks

Google's example is exact. Asked for a country's official currency, "the large
language model might respond with any of the following: Rupee, INR, ₹, Indian
rupee, The rupee, The Indian rupee" — and "all of the answers are correct,
though you might prefer a particular format."[[cite:google-glossary]]

That is the characteristic zero-shot failure. Not wrongness, but unconstrained
form. When the answer is right and the shape is unpredictable, examples fix it
and more instructions usually do not.

## When to reach past it

- The output has to be parsed and the format keeps drifting.
- The task is unusual enough that "correct" is hard to state but easy to
  demonstrate.
- The task needs several steps —
  [chain-of-thought](chain-of-thought-prompting) territory.

Otherwise zero-shot is the right default, because it is the shortest prompt and
therefore the cheapest and the least likely to mislead.
