---
title: Data contamination
kind: concept
aka:
  - test set contamination
  - benchmark leakage
canonical:
  status: de-facto
  term: Data contamination
  body: Standard in the evaluation literature; studied directly in Deng et al. (2023)
  url: https://arxiv.org/abs/2311.09783
  title: Investigating Data Contamination in Modern Benchmarks for Large Language Models — Deng et al.
  verifiedOn: 2026-08-22
  note: >-
    Inherited from ordinary machine learning, where train/test leakage is a
    long-known error. What is new is that the training set is the web and the
    test sets are published on it, so contamination is the default rather than
    a mistake.
tags: [models, evaluation]
zoom: 2
summary: Test data leaking into training, which inflates benchmark scores
  without improving anything — and is now the normal condition rather than an
  accident.
fieldMark: A benchmark published before a model's training cutoff is a
  benchmark that model may have memorised. The date comparison is the first
  check, and it is usually enough to be suspicious.
useCase:
  scenario: >-
    A model scores well on a public benchmark and poorly on privately-held
    questions of the same kind.
  detail: >-
    That gap is the signature. The public set was on the web, the web was in the
    pretraining corpus, and some of what looks like capability is recall. It is
    rarely deliberate — nobody trained on the test set on purpose — but the
    effect on the number is the same, and it is why a private held-out set is
    worth more than any published score.
relations:
  - type: consumed-by
    target: benchmark
    note: What makes a benchmark score stop meaning what it appears to mean.
  - type: consumes
    target: pretraining
    note: The leak happens in the corpus, before anyone is evaluating anything.
examples:
  - name: Investigating Data Contamination in Modern Benchmarks
    url: https://arxiv.org/abs/2311.09783
    note: >-
      Proposes retrieval-based and prompting-based methods for open-source and
      proprietary models respectively.
    verifiedOn: 2026-08-22
  - name: Proving Test Set Contamination in Black Box Language Models
    url: https://arxiv.org/abs/2310.17623
    note: >-
      Provides "provable guarantees of test set contamination … without access
      to pretraining data or model weights".
    verifiedOn: 2026-08-22
sources:
  - id: contamination-paper
    url: https://arxiv.org/abs/2311.09783
    title: Investigating Data Contamination in Modern Benchmarks for Large Language Models — Deng et al.
    verifiedOn: 2026-08-22
    note: Submitted 16 November 2023, last revised 3 April 2024.
  - id: black-box-contamination
    url: https://arxiv.org/abs/2310.17623
    title: Proving Test Set Contamination in Black Box Language Models — Oren et al.
    verifiedOn: 2026-08-22
    quote: >-
      We show that it is possible to provide provable guarantees of test set contamination in language models without access to pretraining data or model weights.
    note: Submitted 26 October 2023, last revised 24 November 2023.
---

The symptom came first: "a disparity between the inflated benchmark scores and
the actual performance of LLMs, raising concerns about potential contamination
of evaluation benchmarks."[[cite:contamination-paper]]

The mechanism is unremarkable. [Benchmarks](benchmark) are published so people
can use them; the web is scraped for [pretraining](pretraining); the benchmark
is on the web. No misconduct is required at any step.

## Why it is hard to check

"This issue is especially critical for closed-source models and certain
open-source models where training data transparency is
lacking."[[cite:contamination-paper]] You cannot search a corpus you cannot see,
and almost nobody publishes theirs.

Two research approaches exist, aimed at the two cases:

- **Retrieval against the corpus**, where the corpus is available — "a
  retrieval-based system to explore potential overlaps between evaluation
  benchmarks and pretraining corpora."[[cite:contamination-paper]]
- **Statistical tests from outside**, where it is not. The black-box work
  provides "provable guarantees of test set contamination in language models
  without access to pretraining data or model weights", exploiting the fact that
  "when there is no data contamination, all orderings of an exchangeable
  benchmark should be equally" likely.[[cite:black-box-contamination]] A model
  that prefers the canonical ordering has seen it.

That second result is elegant: memorisation of a *sequence* is detectable even
when memorisation of *content* is not.

## What it does to a score

It inflates it without improving anything, and it inflates it unevenly — most on
the benchmarks that have been public longest, which are usually the
best-known ones.

So contamination does not merely add noise. It systematically favours older,
more-cited benchmarks, which is exactly where a reader is most likely to take
the number seriously.

## What to do about it

- **Compare dates.** A benchmark older than the model's
  [knowledge cutoff](knowledge-cutoff) deserves suspicion by default.
- **Hold out privately.** A test set nobody published cannot leak. This is the
  single strongest argument for building your own
  [evaluation](evaluation) set.
- **Prefer live evaluation.** An [arena](leaderboard) drawing fresh questions
  from users cannot be trained on in advance.
- **Watch the gap.** Strong public scores with weak private ones is the
  signature, and it is measurable without proving anything about the corpus.
