---
title: Chain-of-thought prompting
kind: concept
aka:
  - CoT
  - step-by-step prompting
canonical:
  status: de-facto
  term: Chain-of-thought prompting
  body: Wei et al. (2022), where the technique was named; carried by Google's Machine Learning Glossary
  url: https://arxiv.org/abs/2201.11903
  title: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al.
  verifiedOn: 2026-08-22
tags: [context, technique]
zoom: 2
summary: Asking for the intermediate steps rather than only the answer, which
  gives the model somewhere to do the work before committing to a conclusion.
fieldMark: The gain arrives with scale. On a small model, asking for working
  produces plausible-looking working and the same wrong answer.
useCase:
  scenario: >-
    A multi-step word problem is answered wrong in one line and right when the
    model is asked to show its calculations.
  detail: >-
    Nothing about the model changed between the two runs. Answering immediately
    means the first token is emitted before any of the problem has been worked
    through, and everything after it is a continuation of that commitment.
    Writing the steps first means each one becomes context for the next. The
    scratch space is the whole mechanism, and it is why this technique
    eventually became something models were trained to do unprompted.
flow:
  scenario: >-
    An arithmetic word problem the model gets wrong when asked for the
    answer and right when asked for the working.
  path:
    - actor: A problem
      where: a person, not a system
      does: >-
        several steps, one answer expected
    - node: chain-of-thought-prompting
      where: the prompt you send
      does: >-
        ask for the intermediate steps, not only the answer
      self: true
    - node: self-consistency
      where: the prompt you send
      does: >-
        sample it several times and take the majority
    - node: reasoning-model
      where: the provider's servers
      does: >-
        or buy a model trained to do it without being asked
  returns: >-
    The steps are tokens, and tokens are the budget
relations:
  - type: kind-of
    target: prompt-engineering
    note: A prompt-level intervention, with the weights untouched.
  - type: consumed-by
    target: reasoning-model
    note: >-
      What a reasoning model has trained in rather than asked for. The technique
      became an architecture decision.
examples:
  - name: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
    url: https://arxiv.org/abs/2201.11903
    note: >-
      Reports improvement on "arithmetic, commonsense, and symbolic reasoning"
      from a few worked exemplars in the prompt.
    verifiedOn: 2026-08-22
  - name: Chain-of-Thought Prompting
    url: https://www.promptingguide.ai/techniques/cot
    note: The community reference's entry, with zero-shot CoT variants.
    verifiedOn: 2026-08-22
sources:
  - id: cot-paper
    url: https://arxiv.org/abs/2201.11903
    title: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al.
    verifiedOn: 2026-08-22
    note: Submitted 28 January 2022, last revised 10 January 2023.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A prompt engineering technique that encourages a large language model (LLM) to explain its reasoning, step by step.
  - id: promptguide-cot
    url: https://www.promptingguide.ai/techniques/cot
    title: Chain-of-Thought Prompting — Prompt Engineering Guide
    verifiedOn: 2026-08-22
---

Chain-of-thought prompting is "a [prompt engineering](prompt-engineering) technique that encourages a
[large language model](large-language-model) to explain its reasoning, step by
step."[[cite:google-glossary]] The 2022 paper describes the mechanism as
"generating a chain of thought — a series of intermediate reasoning steps",
which "significantly improves the ability of large language models to perform
complex reasoning."[[cite:cot-paper]]

## Why writing it down helps

A [model](model) commits to each [token](token) as it emits it and cannot
revise. Answering a multi-step problem in one line means the answer is produced
before any of the intermediate quantities exist.

Producing the steps first creates them, and each becomes context the next step
can condition on. Google's phrasing is that chain-of-thought "forces the LLM to
perform all the calculations, which might lead to a more correct
answer."[[cite:google-glossary]] The scratch space is the whole trick.

## What the paper actually reported

The method was "a simple method called chain of thought prompting, where a few
chain of thought demonstrations are provided as exemplars in prompting", with
gains across "arithmetic, commonsense, and symbolic reasoning
tasks."[[cite:cot-paper]]

And a caveat that gets dropped when the technique is repeated as advice: such
"reasoning abilities emerge naturally in *sufficiently large* language
models."[[cite:cot-paper]] Below that scale, asking for working yields
working-shaped text and no improvement.

## Where it went

Into the models. A [reasoning model](reasoning-model) does this by default,
having been trained to rather than asked to, and spends
[test-time compute](test-time-compute) on it as a matter of course. The
prompting technique is what established that the compute was worth spending.

For models without that training, the zero-shot variant — appending an
instruction to think step by step, with no exemplars — recovers much of the
benefit at almost no prompt cost.[[cite:promptguide-cot]]

## What it does not do

It does not make the reasoning true. The visible chain is generated text like
any other, and a wrong step stated fluently leads to a wrong answer with more
supporting detail than the one-line version had. Chain-of-thought improves
accuracy on average and makes the failures more persuasive, which is a real
trade rather than a free win.
