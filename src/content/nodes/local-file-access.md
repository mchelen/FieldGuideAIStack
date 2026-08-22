---
title: Local File Access
aka: [filesystem access, works on your computer]
tags: [capability, product-anatomy]
zoom: 2
summary: Whether the agent can read and write files on your own machine, rather
  than only files you upload into a chat window.
fieldMark: Look for the words "upload" and "download". If they appear, you are
  in a cloud sandbox. Direct local access is a desktop-app capability, and it is
  usually gated on a folder you explicitly grant.
relations:
  - type: consumed-by
    target: harness
  - type: distinguished-from
    target: browser-automation
sources:
  - url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
  - url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

This is the sharpest dividing line between a chat product and an agentic one,
and it splits along surface rather than brand.

Cowork's documentation describes Claude reading and writing local files
"without requiring manual uploads or downloads." [ChatGPT Work](chatgpt-work)'s documentation
describes the opposite arrangement on the web: it "operates in isolated cloud
environments and cannot directly access local files or apps," so "users must
upload files or use connected applications" — while the desktop app version can
reach local resources.

Both vendors therefore ship both models. Which one you get depends on which
[surface](surface) you opened.

## What "access" is usually scoped to

Local access is not all-or-nothing. Anthropic's Cowork support documentation
describes access limited to folders you explicitly grant through the desktop
app, with code and commands running inside an isolated environment on
Anthropic's servers rather than directly on your machine.

That combination — local files in, execution elsewhere — is a common shape, and
it is worth checking for specifically. "It works on my files" and "it runs code
on my computer" are different claims.
