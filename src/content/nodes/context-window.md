---
title: Context Window
aka: [context length, context limit]
tags: [capability, constraint]
zoom: 2
summary: The maximum number of tokens a model can attend to in a single call —
  system prompt, conversation, tool results and its own output, all together.
fieldMark: It is a per-call ceiling, not a budget that refills. If someone
  describes it as "how much the AI remembers", they are describing a harness
  feature and using the wrong word.
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
