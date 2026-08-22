---
title: Few-shot prompting
kind: concept
aka:
  - in-context learning
  - one-shot prompting
canonical:
  status: de-facto
  term: Few-shot prompting
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google treats one-shot and few-shot as separate entries distinguished only
    by example count. "In-context learning" is the research term for the same
    phenomenon and carries a claim — that something like learning is happening
    — that the prompting term avoids.
tags: [context, technique]
zoom: 2
summary: Putting a few worked examples in the prompt so the model infers the
  task and the output format from them rather than from a description.
fieldMark: The examples are paid for on every call, forever. Few-shot is a
  recurring token cost traded against a one-off fine-tuning cost, and which is
  cheaper depends entirely on volume.
useCase:
  scenario: >-
    Extracted records must come back in one exact shape, and describing the
    shape in prose keeps producing near-misses.
  detail: >-
    Three worked examples usually settle it where three paragraphs of
    instructions do not, because format is easier to demonstrate than to
    specify. The examples ride along on every request, so at high volume the
    same consistency is eventually cheaper to buy through fine-tuning — but
    few-shot gets there today, with no training run and nothing to maintain.
relations:
  - type: kind-of
    target: prompt-engineering
    note: Examples inside the prompt, with the weights untouched.
  - type: consumes
    target: context-window
    note: The examples occupy it on every call, and compete with the actual input.
examples:
  - name: Few-shot prompting
    url: https://www.promptingguide.ai/techniques/fewshot
    note: The community reference's entry, with worked comparisons against zero-shot.
    verifiedOn: 2026-08-22
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: >-
      Named for this: "Language Models are Few-Shot Learners". The paper that
      established that examples in the prompt substitute for training.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
  - id: promptguide-fewshot
    url: https://www.promptingguide.ai/techniques/fewshot
    title: Few-Shot Prompting — Prompt Engineering Guide
    verifiedOn: 2026-08-22
---

Few-shot prompting is "a prompt that contains more than one (a 'few') example
demonstrating how the [large language model](large-language-model) should respond."[[cite:google-glossary]]
One example is one-shot; none is [zero-shot](zero-shot-prompting).

Google's worked example is a currency lookup: the question, then "France: EUR"
and "United Kingdom: GBP" as demonstrations, then "India:" as the actual
query.[[cite:google-glossary]] The examples do not explain the format. They
exhibit it.

## The finding underneath it

This is what the GPT-3 paper was named for. Humans "can generally perform a new
language task from only a few examples or from simple instructions", and the
paper set out to show that scaled language models could
too.[[cite:gpt3-paper]] The result — that a model adapts to a task from
examples in the prompt, with no gradient updates at all — is why prompting
became a discipline instead of a formality.

The research name for it is *in-context learning*, which is a stronger claim
than the prompting name makes. Nothing is retained: the next call knows nothing
about this one.

## Why examples beat instructions for format

Because format is demonstrated more precisely than it is described. "Return the
currency code" leaves room for "EUR", "eur", "Euro (EUR)" and a sentence
explaining the answer. Two examples leave much less.

Google records the trade in one line: few-shot "generally produces more
desirable results than zero-shot prompting and one-shot prompting. However,
few-shot prompting requires a lengthier prompt."[[cite:google-glossary]]

## What it costs, precisely

Every example is [tokens](token) in the
[context window](context-window) on every call. Five long examples on a
high-volume endpoint is a permanent tax, paid whether or not the request needed
the help.

They also compete for space with the thing you actually want reasoned about,
which matters most in exactly the long-context work where the examples were
meant to help.

## Where the examples go wrong

- **Unrepresentative examples** teach the wrong pattern, confidently.
- **Ordering effects** are real; models are sensitive to which example came last.
- **Label imbalance** biases the output — three positives and one negative in the
  examples skews what comes back.[[cite:promptguide-fewshot]]

Few-shot examples are a small training set with no validation split. They
deserve the same suspicion.
