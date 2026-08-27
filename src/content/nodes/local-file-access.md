---
title: Local File Access
aka: [filesystem access, works on your computer]
canonical:
  status: none
  note: >-
    No standard term. Vendors describe it obliquely — "works with your files",
    "connect a folder" — and the distinction that matters, between your disk
    and a cloud sandbox you upload into, is rarely stated plainly. Named here
    so products can be compared on it.
tags: [capability, product-anatomy]
zoom: 2
summary: Whether the agent can read and write files on your own machine, rather
  than only files you upload into a chat window.
fieldMark: Look for the words "upload" and "download". If they appear, you are
  in a cloud sandbox. Direct local access is a desktop-app capability, and it is
  usually gated on a folder you explicitly grant.
useCase:
  scenario: >-
    A product says it works with your documents, and you need to know whether
    they leave your machine.
  detail: >-
    The vocabulary gives it away more reliably than the marketing does: if the
    interface says upload and download, the files are going to a cloud sandbox.
    Direct local access is a desktop-app capability, usually gated on a folder
    you explicitly grant. The difference decides where the data lives, what a
    sandbox can bound, and whether the answer to a compliance question is yes.
flow:
  scenario: >-
    An assistant asked to reconcile two spreadsheets that live on your disk,
    in a product that may never see them.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        ask it to reconcile two spreadsheets you have open
    - actor: Two files
      where: your machine
      does: >-
        on your machine, not uploaded anywhere
    - node: local-file-access
      where: your machine
      does: >-
        the agent reads and writes them where they are
      self: true
    - node: command-execution
      where: your machine
      does: >-
        and can run things against them in place
    - node: harness
      where: your machine
      does: >-
        all of it on this side of the model, which sees only text
  returns: >-
    Splits along surface, not brand — the web version cannot
relations:
  - type: consumed-by
    target: harness
  - type: distinguished-from
    target: browser-automation
sources:
  - id: anthropic-cowork-overview
    url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/docs/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

This is the sharpest dividing line between a chat product and an agentic one,
and it splits along surface rather than brand.

[Cowork](claude-cowork)'s documentation describes Claude reading and writing local files "without
requiring manual uploads or downloads." [ChatGPT Work](chatgpt-work)'s
documentation describes the opposite arrangement on the web: it "operates in
isolated cloud environments and cannot directly access local files or apps," so
"users must upload files or use connected applications" — while the desktop app
version can reach local resources.

Both vendors therefore ship both models. Which one you get depends on which
[surface](surface) you opened.

## What "access" is usually scoped to

Local access is not all-or-nothing. Anthropic's Cowork support documentation
describes access limited to folders you explicitly grant through the desktop
app, with code and commands running inside an [isolated environment](sandbox) on
Anthropic's servers rather than directly on your machine.

That combination — local files in, execution elsewhere — is a common shape, and
it is worth checking for specifically. "It works on my files" and "it runs code
on my computer" are different claims.
