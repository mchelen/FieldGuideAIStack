---
title: Browser Automation
aka: [computer use, web agent, browser control]
tags: [capability, product-anatomy]
zoom: 2
summary: The agent drives a real web browser — clicking, typing, navigating,
  filling forms — instead of calling an API.
fieldMark: The tell is credentials. Ask whether it can use your logged-in
  sessions and saved passwords. That single question separates a sandboxed
  cloud browser from an agent acting as you.
relations:
  - type: consumed-by
    target: harness
  - type: distinguished-from
    target: tool-use
    note: Tool use calls a defined function; this drives an interface built for humans.
sources:
  - url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
  - url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    title: Gemini Spark, new Chrome browsing integration — Google
    verifiedOn: 2026-08-22
  - url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
---

Browser automation exists because most of the world has no API. If a service can
only be operated through a web page, an agent that cannot use a web page cannot
reach it.

The capability sounds uniform across vendors and is not. The variable that
matters is **whose session the browser is in**.

| | Credentialed |
| --- | --- |
| [ChatGPT Work](chatgpt-work)'s cloud browser | No — documented as unable to "accept credentials, use a password manager or saved form entries, sign in to a website, or complete payments" |
| [Gemini Spark](gemini-spark) in Chrome | Yes — documented as able to use "your logged-in accounts and saved passwords" with permission |
| Cowork with Claude in Chrome | Pairs with Claude in Chrome to "automate your tasks on any website" |

An uncredentialed cloud browser can research. A credentialed one can act as you.
Those are different risk profiles wearing the same feature name, which is
exactly why Google's own announcement pairs the capability with prompt-injection
protections and approval for sensitive transactions like payments.

## Why it is not [tool use](tool-use)

Tool use invokes a function whose schema the model was given. Browser automation
drives an interface built for human eyes, inferring what to click from a
rendered page. The failure modes differ accordingly: a tool call fails loudly on
a schema mismatch, a browser agent quietly clicks the wrong button.
