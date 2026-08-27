---
title: Project trust
kind: concept
aka:
  - workspace trust
  - folder trust
canonical:
  status: de-facto
  term: Project trust
  body: Anthropic, in the Claude Code glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    The pattern predates agents — editors have asked whether to trust a
    workspace for years, for the same reason. What changed is how much a
    repository's configuration can now cause to happen.
tags: [agentic, safety]
zoom: 3
summary: Whether an agent may act on a codebase it has not been vetted
  against — because a repository can supply configuration, not only code.
fieldMark: The question is not whether the code is safe to read. It is whether
  the repository's own settings, rules and hooks are safe to load, which is a
  much stronger thing to grant.
useCase:
  scenario: >-
    You clone a repository to look at it and open your agent in that directory.
  detail: >-
    Reading the code is harmless. Loading the repository's agent configuration
    is not necessarily: it can carry permission rules, tool sources and
    instructions that widen what runs without asking. Trust is the gate between
    those two things, which is why it is asked once per directory and why
    accepting it casually undoes work that a permission model did carefully.
flow:
  scenario: >-
    Opening an unfamiliar repository in an agent, where the repository
    itself can configure the agent.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        open an unfamiliar repository in an agent
    - actor: A repository
      where: your machine
      does: >-
        cloned, and not yet vetted by anyone
    - node: project-trust
      where: your machine
      does: >-
        until it is trusted, its configuration is held back
      self: true
    - node: sandbox
      where: a bounded environment
      does: >-
        and what does run, runs bounded
    - node: permission-model
      where: your infrastructure
      does: >-
        the wider policy this is one gate in
  returns: >-
    A repo can carry instructions, which is the whole point
relations:
  - type: part-of
    target: permission-model
    note: The gate before a repository's own configuration is allowed to apply.
  - type: distinguished-from
    target: sandbox
    note: >-
      Trust decides what configuration loads. A sandbox decides what may happen
      once it has. Neither substitutes for the other.
examples:
  - name: Claude Code project trust
    vendor: Anthropic
    url: https://code.claude.com/docs/en/glossary
    note: >-
      "A dialog accepting a directory before Claude Code loads its
      configuration", saved per project directory.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A dialog accepting a directory before Claude Code loads its configuration.
  - id: claude-code-security
    url: https://code.claude.com/docs/en/security
    title: Security — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      We encourage either writing your own MCP servers or using MCP servers from providers that you trust.
---
Project trust is "a dialog accepting a directory before [Claude Code](claude-code) loads its configuration."[[cite:claude-code-glossary]] The word
*configuration* is the whole point.

Until a directory is trusted, the [harness](harness) "holds back some of the content its
repository supplies, such as project allow rules and marketplaces from
`.claude/settings.json`."[[cite:claude-code-glossary]] A repository does not
merely contain code to read; it contains settings that change what the agent may
do without asking.

## Why a repository is a trust boundary

A cloned repository is content from whoever wrote it. If its files can carry
permission rules, tool sources, instructions and
[hooks](hook), then opening it is closer to running a program than to reading
one.

That is the same structural problem as
[indirect prompt injection](indirect-prompt-injection), one layer down: the
system cannot tell a repository's legitimate configuration from a hostile one,
because both are just files in the expected place. The mitigation is not
detection but consent — ask a person once, per directory.

## Where the answer is remembered

"Acceptance is saved per project directory, except your home directory, where
trust is held for the current session only and the prompt reappears on each
launch."[[cite:claude-code-glossary]]

The home-directory exception is worth understanding rather than working around.
Trusting `~` would trust every directory beneath it at once, which is the whole
filesystem — so the grant deliberately does not persist. Anthropic's security
documentation recommends starting from a project subdirectory instead, "where
trust acceptance is saved per directory."[[cite:claude-code-security]]

## And where it does not apply

Trust verification "is disabled when running non-interactively", because there
is nobody to ask.[[cite:claude-code-security]] Non-interactive runs and
[scheduled tasks](scheduled-task) therefore need their boundary drawn somewhere
else — narrower permissions, or a [sandbox](sandbox).

## The relationship to everything else

Trust is the first gate, and the weakest in one specific sense: it is a single
yes at the start covering everything afterwards. A
[permission model](permission-model) constrains actions individually; a sandbox
constrains outcomes regardless of actions. Trust only decides whether the
repository gets a vote in how those two are configured.

Which makes it worth taking seriously precisely because it looks like a dialog
to dismiss.
