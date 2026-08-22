---
title: Claude Cowork
kind: product
vendor: Anthropic
aka: [Cowork]
tags: [product, agent]
zoom: 1
summary: Claude Code's agentic engine presented inside Claude Desktop without a
  terminal — aimed at people who want the autonomy but not the command line.
fieldMark: Cowork is the one that produces spreadsheets and slide decks. If the
  deliverable is an .xlsx with working formulas rather than a code diff, you are
  looking at Cowork rather than Claude Code.
relations:
  - type: variant-of
    target: claude-code
    note: Documented as the same agentic architecture, without the terminal.
  - type: bundles
    target: local-file-access
    note: Desktop app only, and limited to folders you explicitly grant.
    support: partial
  - type: bundles
    target: command-execution
    note: Runs in an isolated environment on Anthropic's servers, not on your machine.
    support: partial
  - type: bundles
    target: browser-automation
    note: Via Claude in Chrome, paired with Cowork.
  - type: bundles
    target: sub-agent
  - type: bundles
    target: background-execution
  - type: bundles
    target: approval-mode
  - type: bundles
    target: connector
examples:
  - name: Claude Cowork
    vendor: Anthropic
    url: https://claude.com/docs/cowork/overview
    note: >-
      Agentic workspace using the same architecture as Claude Code, inside
      Claude Desktop. Reads and writes local files without manual upload,
      pairs with Claude in Chrome, coordinates sub-agents in parallel, and
      produces Excel, PowerPoint and formatted documents.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-cowork-overview
    url: https://claude.com/docs/cowork/overview
    title: Cowork overview — Anthropic
    verifiedOn: 2026-08-22
  - id: anthropic-get-started
    url: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
    title: Get started with Claude Cowork — Anthropic Help Center
    verifiedOn: 2026-08-22
---
Cowork is the clearest illustration in this guide of why [surface](surface) is
worth separating from engine. Anthropic's documentation states it plainly:
Cowork "uses the same agentic architecture that powers [Claude Code](claude-
code), accessible within Claude Desktop without opening the
terminal."[[cite:anthropic-cowork-overview]]

The engine did not change. The audience did.

## What it ships

- **[Local file access](local-file-access)** — reads and writes without manual
  upload or download, scoped to folders you grant through the desktop app.
- **[Browser automation](browser-automation)** — paired with Claude in Chrome to
  work on any website.
- **[Sub-agents](sub-agent)** — complex work split into parallel workstreams.
- **[Background execution](background-execution)** — sessions run in the cloud
  and continue while you are offline.
- **[Approval modes](approval-mode)** — manual, auto, or skip.
- **[Connectors](connector)**, skills and plugins, from your claude.ai account.

Requires a paid plan and, for local file and computer access, the desktop app on
macOS or Windows.[[cite:anthropic-get-started]]

## The detail most comparisons miss

Cowork loads the connectors, skills and plugins enabled for your **claude.ai
account**, and explicitly does not read the [Claude Code](claude-code) CLI's
`~/.claude` directory. Same engine, same vendor, different extension scope — so
a skill you wrote for the CLI does not simply appear here.

Execution is also not local: code and commands run in an [isolated
environment](sandbox) on Anthropic's servers, with your granted folders as the
input.[[cite:anthropic-get-started]] "Works on my files" and "runs code on my
machine" are separate claims, and only the first one holds.