---
title: Background Execution
aka: [asynchronous agent, long-running task, cloud persistence]
tags: [capability, product-anatomy]
zoom: 2
summary: The work continues after you look away — running in the vendor's cloud
  rather than in the window you have open.
fieldMark: Ask what happens when you close the laptop. If the answer is "it
  keeps going", the session lives on the vendor's infrastructure, not yours.
relations:
  - type: consumed-by
    target: harness
  - type: distinguished-from
    target: agent
    note: Autonomy across turns is not the same as surviving without you.
sources:
  - id: anthropic-get-started
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    title: Get started with Claude Cowork — Anthropic Help Center
    verifiedOn: 2026-08-22
  - id: google-gemini-spark
    url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    title: Gemini Spark, new Chrome browsing integration — Google
    verifiedOn: 2026-08-22
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

An [agent](agent) loops without you for many turns. Background execution is a
stronger claim: the loop survives you leaving.

Anthropic's Cowork documentation describes sessions that run in the cloud and
continue while you are offline. [Gemini Spark](gemini-spark) is described as running on Google's
cloud infrastructure "even after you close your laptop or lock your phone." Both
are the same architectural move — the session is not your window, it is a
process somewhere else that your window happens to be attached to.

## What it changes

- **Trust window.** You are approving actions you will not watch. This is why
  products with background execution ship [approval modes](approval-mode)
  rather than a single confirm-everything prompt.
- **Failure discovery.** A crashed foreground task is obvious. A crashed
  background one is discovered later, which puts weight on notifications and
  run history.
- **Scheduling.** Once a session outlives the window, running it on a recurring
  schedule is a small step, and products with this capability tend to grow one.

## The distinction people miss

"Runs for hours" and "runs while you are away" are separate claims. A long task
in a foreground window still dies when the window does. Read the sentence
carefully — vendors describe both as working "in the background".
