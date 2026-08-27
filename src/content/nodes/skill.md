---
title: Skill
kind: concept
aka:
  - agent skill
  - packaged instructions
canonical:
  status: de-facto
  term: Skill
  body: Anthropic, in the Claude Code glossary, which cites the Agent Skills open standard
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    Anthropic describes skills as following "the Agent Skills open standard",
    which makes this one of the few applied-stack terms with a specification
    behind it rather than a product convention alone.
tags: [agentic, structure]
zoom: 2
summary: Packaged instructions that teach an agent a repeatable procedure —
  loaded when relevant rather than carried in the prompt.
fieldMark: The distinguishing property is that the body loads on demand. That
  is what separates a skill from a paragraph in a project instructions file,
  which is paid for on every single call.
useCase:
  scenario: >-
    The same six-step release checklist gets pasted into chat every fortnight.
  detail: >-
    Written as a skill it becomes one file the agent loads when the task comes
    up, versioned with the repository and reviewable like any other artifact.
    The reason not to put it in the always-loaded instructions file is
    economics: a procedure needed twice a month would otherwise occupy the
    context window on every call for the rest of the month.
flow:
  scenario: >-
    A procedure your team does the same way every time, taught to an agent
    once rather than pasted in each time.
  path:
    - actor: A procedure
      does: >-
        repeatable, and specific to how you work
    - node: skill
      does: >-
        packaged instructions, loaded when they are relevant
      self: true
    - node: context-window
      does: >-
        so it occupies space only when it is needed
    - node: agent
      does: >-
        which now follows it without being reminded
  returns: >-
    Loaded on relevance, not pasted on every call
relations:
  - type: consumed-by
    target: agent
    note: Loaded into the agent's context when the task looks relevant.
  - type: consumes
    target: context-window
    note: >-
      On demand rather than always — which is the point, since window space is
      the resource being conserved.
examples:
  - name: Claude Code skills
    vendor: Anthropic
    url: https://code.claude.com/docs/en/skills
    note: >-
      "Create a SKILL.md file with instructions, and Claude adds it to its
      toolkit"; invoked automatically when relevant or directly as
      `/skill-name`.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A SKILL.md file containing instructions, knowledge, or a workflow that Claude adds to its toolkit.
  - id: claude-code-skills
    url: https://code.claude.com/docs/en/skills
    title: Skills — Claude Code documentation
    verifiedOn: 2026-08-22
---

A skill is "a `SKILL.md` file containing instructions, knowledge, or a workflow
that Claude adds to its toolkit", loaded "automatically when relevant" or
invoked directly.[[cite:claude-code-glossary]]

Anthropic's guidance on when to write one is unusually concrete: "when you keep
pasting the same instructions, checklist, or multi-step procedure into chat, or
when a section of CLAUDE.md has grown into a procedure rather than a
fact."[[cite:claude-code-skills]]

## Loading on demand is the mechanism

The line that matters: "unlike CLAUDE.md content, a skill's body loads only when
it's used, so long reference material" does not sit in every
prompt.[[cite:claude-code-skills]]

A project instructions file is paid for on every call — it is part of the prefix,
counted against the [context window](context-window) whether or not this task
needs it. A skill is an index entry that expands when relevant.

That makes skills a [context engineering](context-engineering) construct as much
as a convenience one. The right test for where something belongs is not how
important it is but how often it applies.

## A standard, unusually

Anthropic notes that "skills follow the Agent Skills open standard", with
[Claude Code](claude-code) extending it "with invocation control and subagent
execution."[[cite:claude-code-glossary]]

Most of the vocabulary in this area is product convention. A published format
means a procedure written once can travel between tools, which is what makes
skills worth investing in rather than a per-vendor lock-in.

## Skill, tool, hook — three ways to extend

- A **[tool](tool-use)** gives the agent a new capability, invoked at the
  model's discretion.
- A **[hook](hook)** runs deterministically at a lifecycle point, whatever the
  model wants.
- A **skill** gives the agent knowledge of a procedure, loaded when relevant.

They are not alternatives so much as different answers to "what is missing":
ability, guarantee, or know-how.
