---
title: Command Execution
aka: [shell access, code execution, running commands]
tags: [capability, product-anatomy]
zoom: 2
summary: The agent can run programs — tests, builds, installs, scripts — rather
  than only producing text describing what to run.
fieldMark: The question is not whether it runs commands but *where*. On your
  machine, or in a sandbox somewhere else? Almost every vendor documents the
  first part and buries the second.
relations:
  - type: consumed-by
    target: harness
  - type: distinguished-from
    target: local-file-access
    note: Editing a file and running the file are separate powers, granted separately.
sources:
  - id: anthropic-claude-code
    url: https://code.claude.com/docs/en/overview
    title: Claude Code overview — Anthropic
    verifiedOn: 2026-08-22
  - id: anthropic-get-started
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    title: Get started with Claude Cowork — Anthropic Help Center
    verifiedOn: 2026-08-22
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/codex/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
---

This is the capability that separates an assistant that *describes* work from
one that *does* it, and it is a bigger jump than
[local file access](local-file-access).

An agent that can edit files but not run them is a very good text editor. It
cannot tell whether its change compiles, whether the test passes, or whether the
program still starts. An agent that can run commands closes its own feedback
loop: write, run, read the error, fix, run again. Nearly everything people find
impressive about coding agents is that loop, not the writing.

## Where it runs is the whole question

"Can it run commands?" has a yes/no answer that hides the part that matters.

| | Where the command runs |
| --- | --- |
| [Claude Code](claude-code) | Your machine, in your working directory |
| [Claude Cowork](claude-cowork) | An isolated environment on Anthropic's servers |
| [ChatGPT Work](chatgpt-work) | An isolated cloud environment, with configurable network access |
| [OpenAI Codex](openai-codex) | Locally via the CLI, remotely via Codex cloud |

Anthropic's Cowork documentation is unusually direct about this: code and
commands "run inside [an] isolated environment" on Anthropic's servers, while
local *files* are read from folders you grant. So Cowork reads your disk and
executes elsewhere — two capabilities most product pages present as one.

## Why the distinction has teeth

- **Your toolchain, or theirs.** A sandbox has whatever the vendor installed.
  Your machine has your Node version, your credentials, your database.
- **Blast radius.** A destructive command in a container costs a container. The
  same command in your home directory costs your home directory. This is why
  [approval modes](approval-mode) exist, and why they matter more as execution
  moves closer to you.
- **What "it can't do that" means.** A failure may be a missing capability or a
  missing package in someone else's sandbox, and those have different fixes.

If you take one habit from this page: when a product says it runs code, ask
where, and do not accept the product name as the answer.
