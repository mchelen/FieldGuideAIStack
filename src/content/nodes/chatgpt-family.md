---
title: ChatGPT (product family)
kind: suite
vendor: OpenAI
aka: [ChatGPT ecosystem, OpenAI product family]
tags: [suite, product]
zoom: 1
summary: OpenAI's family — ChatGPT itself, the Work agentic mode, and Codex —
  sold as modes and surfaces within one product rather than separate ones.
fieldMark: OpenAI packages the family as modes inside [ChatGPT](chatgpt), so the product
  name tells you less than the mode does. "In ChatGPT" is not an answer to a
  capability question.
relations:
  - type: contains
    target: chatgpt
  - type: contains
    target: chatgpt-work
  - type: contains
    target: openai-codex
  - type: kind-of
    target: product-suite
sources:
  - id: openai-openai-codex
    url: https://learn.chatgpt.com/docs
    title: OpenAI Codex and ChatGPT documentation
    verifiedOn: 2026-08-22
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/docs/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

The same three-way split as Anthropic's, packaged differently. OpenAI presents
Chat, Work and Codex as modes and surfaces within ChatGPT rather than as
separate products, and its documentation states that
[ChatGPT Work](chatgpt-work) shares "core execution, isolation, and permission
mechanisms" with [Codex](openai-codex).

## What the packaging changes

Selling modes rather than products has a real consequence: **the product name
stops carrying capability information.** "We use ChatGPT" tells you almost
nothing — the same subscription spans a chat window that cannot touch your
files and an agent that runs shell commands in a cloud [sandbox](sandbox).

Anthropic's separate names make the boundary visible in conversation. OpenAI's
modes make it invisible, which is convenient for adoption and inconvenient for
anyone trying to write a policy about what is allowed.

## Where the sandboxes differ inside the family

Worth knowing because it is not uniform. On the web, Work "operates in isolated
cloud environments and cannot directly access local files or apps", while the
desktop app reaches local resources; Codex runs locally through its CLI and IDE
extension, and remotely in Codex cloud.

So the answer to "can it see my files" depends on mode *and*
[surface](surface), not on the family.
