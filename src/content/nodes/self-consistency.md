---
title: Self-consistency
kind: concept
aka:
  - majority voting
  - sample-and-vote
canonical:
  status: de-facto
  term: Self-consistency
  body: Wang et al. (2022), where the decoding strategy was named
  url: https://arxiv.org/abs/2203.11171
  title: Self-Consistency Improves Chain of Thought Reasoning in Language Models — Wang et al.
  verifiedOn: 2026-08-22
tags: [context, technique]
zoom: 3
summary: Sampling several independent reasoning paths for the same question and
  taking the answer most of them agree on.
fieldMark: It requires a non-zero temperature to work at all. At temperature 0
  every sample is the same sample, and the vote is unanimous and meaningless.
useCase:
  scenario: >-
    A model gets a hard arithmetic question right most of the time and you need
    it right more often than that.
  detail: >-
    Sample the answer five times at a non-zero temperature and take the
    majority. Wrong answers tend to be wrong in different ways and scatter;
    right answers converge, because there are many routes to one correct
    result and no agreement among the incorrect ones. The cost is five calls
    instead of one, which makes this a technique for high-value questions
    rather than a default.
relations:
  - type: consumes
    target: chain-of-thought-prompting
    note: >-
      It replaces the single greedy chain with many sampled ones, so it needs
      chains to vote over.
  - type: consumes
    target: test-time-compute
    note: Buying accuracy with repeated sampling is spending at answer time.
examples:
  - name: Self-Consistency Improves Chain of Thought Reasoning
    url: https://arxiv.org/abs/2203.11171
    note: >-
      "Samples a diverse set of reasoning paths instead of only taking the
      greedy one, and then selects the most consistent answer."
    verifiedOn: 2026-08-22
sources:
  - id: self-consistency-paper
    url: https://arxiv.org/abs/2203.11171
    title: Self-Consistency Improves Chain of Thought Reasoning in Language Models — Wang et al.
    verifiedOn: 2026-08-22
    quote: >-
      In this paper, we propose a new decoding strategy, self-consistency, to replace the naive greedy decoding used in chain-of-thought prompting.
    note: Submitted 21 March 2022, last revised 7 March 2023.
  - id: cot-paper
    url: https://arxiv.org/abs/2201.11903
    title: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al.
    verifiedOn: 2026-08-22
---

Self-consistency is "a new decoding strategy … to replace the naive greedy
decoding used in chain-of-thought prompting. It first samples a diverse set of
reasoning paths instead of only taking the greedy one, and then selects the most
consistent answer by marginalizing out the sampled reasoning
paths."[[cite:self-consistency-paper]]

Less formally: ask the same question several times, let the model reason
differently each time, and take the answer that came up most.

## The intuition it rests on

The paper states it directly: "a complex reasoning problem typically admits
multiple different ways of thinking leading to its unique correct
answer."[[cite:self-consistency-paper]]

Correct answers have many routes to them and agree at the end. Incorrect answers
are wrong in idiosyncratic ways and scatter. Agreement across independent
attempts is therefore evidence, and disagreement is a usable signal that the
question was hard.

## What it needs

**Sampling.** At [temperature](temperature) 0 the model returns its single most
likely continuation every time, so five samples are one sample repeated. The
diversity is the mechanism, and it has to be paid for with randomness.

**Chains to vote over.** It is a modification of
[chain-of-thought prompting](chain-of-thought-prompting) rather than an
independent technique — the reasoning paths are what get sampled, and the final
answers are what get counted.[[cite:cot-paper]]

**A comparable answer.** Majority voting requires answers that can be checked
for equality. It works cleanly for a number or a label and badly for a
paragraph, which bounds where it applies.

## What it costs

*N* times the [tokens](token) and *N* times the money, for one question. This is
[test-time compute](test-time-compute) spent in its most straightforward form —
parallel rather than serial, so [latency](latency) need not multiply if the
calls are concurrent, but cost does.

That makes it a technique for decisions worth paying for, not a global default.
The signal it produces — how much the samples disagreed — is often as valuable
as the answer, because it tells you when to escalate to a human.
