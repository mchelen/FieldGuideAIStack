---
title: Tree of thoughts
kind: concept
aka:
  - ToT
  - deliberate search
canonical:
  status: de-facto
  term: Tree of Thoughts
  body: Yao et al. (2023), where the framework was named
  url: https://arxiv.org/abs/2305.10601
  title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models — Yao et al."
  verifiedOn: 2026-08-22
tags: [context, technique]
zoom: 3
summary: Exploring branching reasoning paths and backtracking, rather than
  committing to one linear chain — search applied to the model's own
  intermediate steps.
fieldMark: The distinguishing feature is backtracking. If the method cannot
  abandon a partial line of reasoning and return to an earlier branch, it is a
  chain with extra steps.
useCase:
  scenario: >-
    A planning problem where the first move decides whether the rest is
    solvable at all.
  detail: >-
    Linear reasoning commits to that first move and then rationalises whatever
    follows, because a model generating left to right has no way to take it
    back. Tree of thoughts generates several candidate first moves, evaluates
    how promising each looks, expands the good ones and abandons the dead ends.
    It is ordinary search, with the model supplying both the candidate moves and
    the position [evaluation](evaluation).
flow:
  scenario: >-
    A puzzle where the first plausible line of reasoning is wrong, and
    committing to it early is the whole failure.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        pose a puzzle where the first idea is usually wrong
    - node: chain-of-thought-prompting
      where: the prompt you send
      does: >-
        one line of reasoning, followed to the end
    - node: tree-of-thoughts
      where: wherever the product runs
      does: >-
        several branches, evaluated, with backtracking
      self: true
    - node: self-consistency
      where: the provider's servers
      does: >-
        the cheaper cousin — sample several, take the majority
  returns: >-
    Many times the tokens, for the problems that need it
relations:
  - type: consumes
    target: chain-of-thought-prompting
    note: Generalises it — a chain is one path through the tree.
  - type: distinguished-from
    target: self-consistency
    note: >-
      Both spend compute on multiple paths. Self-consistency votes over complete
      independent chains; tree of thoughts explores and prunes a shared tree.
examples:
  - name: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models"
    url: https://arxiv.org/abs/2305.10601
    note: >-
      "Enables exploration over coherent units of text (thoughts) that serve as
      intermediate steps toward problem solving."
    verifiedOn: 2026-08-22
sources:
  - id: tot-paper
    url: https://arxiv.org/abs/2305.10601
    title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models — Yao et al."
    verifiedOn: 2026-08-22
    quote: >-
      Our experiments show that ToT significantly enhances language models' problem-solving abilities on three novel tasks requiring non-trivial planning or search: Game of 24, Creative Writing, and Mini Crosswords.
    note: Submitted 17 May 2023, last revised 3 December 2023.
  - id: self-consistency-paper
    url: https://arxiv.org/abs/2203.11171
    title: Self-Consistency Improves Chain of Thought Reasoning in Language Models — Wang et al.
    verifiedOn: 2026-08-22
---

The paper starts from a limitation rather than a technique: language models "are
still confined to token-level, left-to-right decision-making processes during
inference", so "they can fall short in tasks that require exploration, strategic
lookahead, or where initial decisions play a pivotal role."[[cite:tot-paper]]

Tree of Thoughts "generalizes over the popular Chain of Thought approach to
prompting language models, and enables exploration over coherent units of text
(thoughts) that serve as intermediate steps toward problem
solving."[[cite:tot-paper]]

## What "thought" means here

Not a token and not a whole answer: a coherent intermediate step, large enough
to be evaluated as good or bad on its own. That granularity is what makes search
possible, because you cannot meaningfully score half a sentence and you learn
nothing from scoring only the finished answer.

## The loop

1. Generate several candidate next thoughts from the current state.
2. Have the model evaluate how promising each one looks.
3. Expand the promising ones; abandon the rest.
4. Backtrack when a branch stops looking viable.

This is classical search — breadth-first, depth-first, whatever fits — with the
[model](model) supplying both the move generator and the evaluation function.
The paper describes it as allowing models "to perform deliberate decision making
by considering multiple different reasoning paths."[[cite:tot-paper]]

## Why backtracking is the whole point

[Chain-of-thought prompting](chain-of-thought-prompting) cannot undo. Once a
step is written it is in the context, and everything after is conditioned on it
— including everything after a mistake.

[Self-consistency](self-consistency) works around this by running independent
chains and voting, which recovers from a bad start only by having started
elsewhere.[[cite:self-consistency-paper]] Tree of thoughts recovers *within* an
attempt, by returning to an earlier branch. That is a stronger property and a
more expensive one.

## What it costs

A great deal. Every node needs generation and evaluation, and the tree grows
quickly — this is the most expensive technique on these pages by a wide margin.

It earns that on problems where the search space is real and a wrong early
commitment is fatal: puzzles, planning, constrained writing. On ordinary
question answering it spends a great deal to arrive where a single chain
already was.
