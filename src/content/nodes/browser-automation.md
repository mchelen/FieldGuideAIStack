---
title: Browser Automation
aka: [computer use, web agent, browser control]
canonical:
  status: de-facto
  term: Browser use
  body: Anthropic, which ships a browser use tool distinct from its computer use tool
  url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
  title: Computer use tool — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    The term predates AI entirely, from test automation. What is specific here
    is the split Anthropic draws: "for tasks that stay inside webpages, the
    browser use tool is the closer fit", where computer use drives a whole
    desktop. Acting on the page and acting on the screen are different
    capabilities with different costs.
tags: [capability, product-anatomy]
zoom: 2
summary: The agent drives a real web browser — clicking, typing, navigating,
  filling forms — instead of calling an API.
fieldMark: The tell is credentials. Ask whether it can use your logged-in
  sessions and saved passwords. That single question separates a sandboxed
  cloud browser from an agent acting as you.
useCase:
  scenario: >-
    A [workflow](workflow) depends on a web application with no API.
  detail: >-
    Driving the browser is the fallback, and it works on things nothing else
    can reach. The question worth asking first is about credentials: whether
    the agent uses your logged-in sessions and saved passwords, or a sandboxed
    browser with none. That single distinction separates a bounded capability
    from an agent acting as you, and vendors document it inconsistently.
flow:
  scenario: >-
    An agent asked to book a flight, on a site with no API, using a browser
    that may or may not be logged in as you.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        ask for a flight booked on a site with no API
    - actor: A task
      where: a person, not a system
      does: >-
        "find and book the cheapest flight on Tuesday"
    - node: browser-automation
      where: a bounded environment
      does: >-
        drives a real browser, because there is no API
      self: true
    - node: tool-use
      where: wherever the product runs
      does: >-
        each click and keystroke is a tool call
    - node: indirect-prompt-injection
      where: the open web
      does: >-
        and every page it reads is untrusted input
  returns: >-
    Whether it is logged in as you is the whole security question
relations:
  - type: consumed-by
    target: harness
  - type: distinguished-from
    target: tool-use
    note: Tool use calls a defined function; this drives an interface built for humans.
sources:
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/docs/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
  - id: google-gemini-spark
    url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    title: Gemini Spark, new Chrome browsing integration — Google
    verifiedOn: 2026-08-22
  - id: anthropic-cowork-overview
    url: https://claude.com/docs/cowork/overview
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
| [Cowork](claude-cowork) with Claude in Chrome | Pairs with Claude in Chrome to "automate your tasks on any website" |

An uncredentialed cloud browser can research. A credentialed one can act as you.
Those are different risk profiles wearing the same feature name, which is
exactly why Google's own announcement pairs the capability with prompt-injection
protections and approval for sensitive transactions like payments.

## Why it is not [tool use](tool-use)

Tool use invokes a function whose schema the model was given. Browser automation
drives an interface built for human eyes, inferring what to click from a
rendered page. The failure modes differ accordingly: a tool call fails loudly on
a schema mismatch, a browser agent quietly clicks the wrong button.
