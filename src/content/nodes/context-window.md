---
title: Context Window
aka: [context length, context limit]
canonical:
  status: de-facto
  term: Context window
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Used at two levels, consistently enough to be worth separating. Google
    defines the model property — "the number of tokens a model can process in a
    given prompt". Anthropic's [Claude Code](claude-code) glossary defines the harness's view:
    "the [working memory](short-term-memory) for a session", holding history, file contents and
    loaded skills, and points readers at the platform glossary "for the
    underlying model concept". This page covers the first; the second is
    context engineering.
tags: [capability, constraint]
zoom: 2
summary: The maximum number of tokens a model can attend to in a single call —
  system prompt, conversation, tool results and its own output, all together.
fieldMark: It is a per-call ceiling, not a budget that refills. If someone
  describes it as "how much the AI remembers", they are describing a harness
  feature and using the wrong word.
useCase:
  scenario: >-
    A vendor advertises a one-million-token context window and a long
    conversation still degrades.
  detail: >-
    The number is a ceiling, not a promise about quality. Anthropic's own
    [compaction](compaction) documentation notes that "as a conversation grows, response
    quality degrades" — relevant material buried among irrelevant material is
    harder to use than relevant material alone. A bigger window raises the
    limit and does not remove the need to decide what belongs inside it.
relations:
  - type: part-of
    target: model
    note: A property of the trained model, not of the API or the harness.
sources:
  - id: aws-what-is
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
    title: What is Amazon Bedrock? — AWS documentation
    verifiedOn: 2026-08-22
---

The context window is the hard limit on how much text goes into one
[inference API](inference-api) call. Because that API is stateless, the entire
conversation is re-sent every turn — so the window is simultaneously the limit
on prompt size, on conversation length, and on how much of a codebase an
[agent](agent) can hold at once.

Sizes are a headline spec and move quickly. AWS's Bedrock documentation, for
instance, records xAI's Grok 4.6 arriving with a 500K context window — the sort
of figure that is accurate on the date it was read and worth nothing undated.

## What the window is spent on

1. [System prompt](system-prompt) and tool schemas — paid on every single call.
2. Conversation history — grows monotonically without intervention.
3. Tool results — usually the largest and least predictable consumer.
4. The model's own output — reserved from the same budget.

## Why "[context engineering](context-engineering)" is a harness discipline

Since 3 dominates and 2 never shrinks on its own, the [harness](harness) has to
decide what to drop, summarize, or re-fetch. That work — not the model's raw
window size — is usually what determines whether a long agent run stays coherent.
A bigger window raises the ceiling; it does not remove the problem.
