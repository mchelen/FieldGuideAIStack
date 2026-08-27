---
title: Leaderboard
kind: concept
aka:
  - arena
  - model ranking
canonical:
  status: de-facto
  term: Leaderboard
  body: Ordinary usage; the arena form is described in Chiang et al. (2024)
  url: https://arxiv.org/abs/2403.04132
  title: "Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference — Chiang et al."
  verifiedOn: 2026-08-22
  note: >-
    No glossary defines it because there is nothing technical to define. What
    is worth recording is that it names two different things — a ranking on a
    fixed benchmark, and a ranking from live pairwise human votes — which
    behave differently under pressure.
tags: [evaluation, core]
zoom: 2
summary: A public ranking of models — the most-read artifact in the field, and
  a measure that stops measuring once enough people are optimising for it.
fieldMark: Check what produced the ranking. A fixed benchmark can be trained
  on; a live human-preference arena cannot, but rewards being agreeable and
  well-formatted more than being right.
useCase:
  scenario: >-
    A model tops a leaderboard and disappoints on your task.
  detail: >-
    Both facts can be true without anything being wrong. A leaderboard
    aggregates one distribution of prompts — often short, general and
    conversational — into one number. Your task is longer, narrower and
    specific. The ranking is real evidence about the thing it measured, and
    almost none about yours, which is why every serious adoption decision ends
    at your own eval set regardless of what the ranking said.
flow:
  scenario: >-
    A public ranking that changed this week, and a procurement decision that
    should probably not turn on it.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        read a ranking that moved this week
    - node: benchmark
      where: your evaluation harness
      does: >-
        a shared test, so scores are comparable
    - node: leaderboard
      where: the open web
      does: >-
        the ranking published from those scores
      self: true
    - node: data-contamination
      where: a training cluster
      does: >-
        and the reason a score can rise with nothing improving
  returns: >-
    Shared, published, and therefore optimised against
relations:
  - type: consumes
    target: benchmark
    note: A ranking is a benchmark plus an ordering and an audience.
examples:
  - name: Chatbot Arena
    url: https://arxiv.org/abs/2403.04132
    note: >-
      Crowdsourced pairwise comparison, "amassing over 240K votes" by the time
      the paper was written.
    verifiedOn: 2026-08-22
  - name: HELM
    url: https://crfm.stanford.edu/helm/
    note: >-
      The multi-metric alternative — several scores across several scenarios
      rather than one ordering.
    verifiedOn: 2026-08-22
sources:
  - id: arena-paper
    url: https://arxiv.org/abs/2403.04132
    title: "Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference — Chiang et al."
    verifiedOn: 2026-08-22
    quote: >-
      Because of its unique value and openness, Chatbot Arena has emerged as one of the most referenced LLM leaderboards, widely cited by leading LLM developers and companies.
    note: Submitted 7 March 2024.
  - id: helm-site
    url: https://crfm.stanford.edu/helm/
    title: HELM — Stanford Center for Research on Foundation Models
    verifiedOn: 2026-08-22
  - id: judge-paper
    url: https://arxiv.org/abs/2306.05685
    title: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena — Zheng et al.
    verifiedOn: 2026-08-22
---

Two things get called a leaderboard, and they fail differently.

A **benchmark leaderboard** ranks models by score on a fixed dataset. Its
weakness is that the dataset is fixed and public, so it can leak into training
and be optimised against.

An **arena** ranks models by live human preference. Chatbot Arena "employs a
pairwise comparison approach and leverages input from a diverse user base
through crowdsourcing", and had "amassed over 240K votes" at the time of
writing.[[cite:arena-paper]]

## Why the arena form was invented

Because [benchmarks](benchmark) were measuring the wrong thing for chat
assistants. The judge paper puts it directly: existing benchmarks were
inadequate "in measuring human preferences."[[cite:judge-paper]]

An arena's questions come from users, are never fixed, and cannot be trained on
in advance. The paper reports confirming "that the crowdsourced questions are
sufficiently diverse and discriminating."[[cite:arena-paper]]

## What an arena rewards instead

Not accuracy. Whatever a person prefers on reading two answers for a few
seconds — which favours formatting, confidence, length and agreeableness, the
same pressures that produce sycophancy under
[RLHF](reinforcement-learning-from-human-feedback).

That is not a flaw in the method. It is what "human preference" means, and it is
a genuinely useful thing to measure. It is simply not the same as being right,
and a ranking that measures preference should not be read as a ranking of
correctness.

## Goodhart, at speed

A leaderboard is a measure that has become a target for every organisation in
the field simultaneously, with money attached. Whatever it rewards will be
optimised for, and the optimisation will outrun the measure's ability to
discriminate.

This is not cynicism about anyone's conduct — it is the ordinary consequence of
publishing a shared measure. HELM's multi-metric design is one response:
several scores across several scenarios resist collapsing into a single thing to
climb.[[cite:helm-site]]

## How to use one

As a shortlist, and never as a decision. A leaderboard is good at telling you
which four models are worth trying and bad at telling you which one to use — a
question only your own [evaluation](evaluation) answers.
