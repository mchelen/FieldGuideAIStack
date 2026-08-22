---
title: Gemini
kind: product
vendor: Google
aka: [Gemini app]
tags: [product, assistant]
zoom: 1
summary: Google's multimodal assistant across mobile, web, macOS and Chrome,
  with Canvas, Deep Research, Gems and Workspace extensions.
fieldMark: Gemini's distinguishing move is reach into Google's own services.
  Where the other assistants connect outward to third-party tools, Gemini starts
  already inside Gmail, Docs and Maps.
relations:
  - type: bundles
    target: connector
    note: Extensions into Workspace, Maps, YouTube and other Google services.
  - type: has-variant
    target: gemini-spark
  - type: distinguished-from
    target: chatgpt
examples:
  - name: Gemini
    vendor: Google
    url: https://gemini.google/overview/
    note: >-
      Interface to a multimodal model handling text, audio and images, on mobile
      and web with Gemini for macOS and Chrome integration. Includes Canvas for
      collaborative editing, Deep Research, Gems for custom instructions, and
      extensions into Workspace, Maps and YouTube.
    verifiedOn: 2026-08-22
sources:
  - id: google-gemini-app
    url: https://gemini.google/overview/
    title: Gemini app overview — Google
    verifiedOn: 2026-08-22
---

Gemini is Google's assistant layer, and its structural advantage is that the
services it needs to reach are Google's own. Where [ChatGPT](chatgpt) and
[Claude](claude-app) integrate outward through [connectors](connector), Gemini's
Workspace, Maps and YouTube extensions are first-party.

Documented capabilities include Canvas for collaborative writing and editing,
Deep Research for long-form investigation, and Gems for saved custom
instructions — the same idea Anthropic packages as skills.

## Assistant, not agent

The base app is conversational. The autonomous behaviour — running unattended,
acting on your accounts — belongs to [Gemini Spark](gemini-spark), which is a
separate tier rather than a mode you toggle.

That makes Google's packaging a third variant. Anthropic sells separate named
products; OpenAI sells modes inside one product; Google gates the agent behind a
[subscription tier](subscription-tier).
