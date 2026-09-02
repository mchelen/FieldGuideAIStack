---
title: Claude
kind: product
vendor: Anthropic
aka: [Claude chat, claude.ai, Claude app]
tags: [assistant]
zoom: 1
summary: Anthropic's conversational assistant — you ask, it answers, one turn at
  a time, with files you upload rather than files it reaches.
fieldMark: If the interaction is a conversation and the work product is the
  reply itself, you are in Claude. When it starts producing files you did not
  paste in, you have crossed into Cowork.
relations:
  - type: bundles
    target: connector
  - type: distinguished-from
    target: claude-cowork
    note: Chat answers; Cowork executes multi-step work autonomously.
examples:
  - name: Claude
    vendor: Anthropic
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    note: >-
      Documented alongside Cowork as the single-turn conversational mode:
      conversation-based sessions, files supplied by manual upload and
      download, and text responses as the output.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-get-started
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    title: Get started with Claude Cowork — Anthropic Help Center
    verifiedOn: 2026-08-22
---

Claude is the baseline the other two Anthropic products are defined against, and
Anthropic's own help documentation draws the contrast directly: chat is
single-turn responses, conversation-based sessions, manual file upload and
download, and text output.

That is not a limitation so much as a different job. Most questions want an
answer, not a deliverable.

## What it does bundle

[Connectors](connector) are the exception — they are account-level, so an
assistant that never touches your disk can still read your calendar or your
issue tracker. This is why "can it access my data" and "can it access my files"
are separate questions with separate answers.

## Where the line falls

Everything that distinguishes [Cowork](claude-cowork) and
[Claude Code](claude-code) — [local file access](local-file-access),
[command execution](command-execution), [sub-agents](sub-agent),
[background execution](background-execution),
[approval modes](approval-mode) — is absent here. Claude is a
[model](model) behind a chat [surface](surface), with the loop closed by you
rather than by a [harness](harness).

The two that matter most are the first two, and they are separate. Claude can
write you a script; it cannot save that script to your disk, and it cannot run
it. Claude Code can do both. That gap — describing work versus doing it — is
the single largest difference between the two products, and it is worth more
than any comparison of the models underneath, which are the same models.
