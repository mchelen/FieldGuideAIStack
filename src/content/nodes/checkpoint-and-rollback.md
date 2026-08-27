---
title: Checkpoint and rollback
kind: concept
aka:
  - rewind
  - restore point
canonical:
  status: de-facto
  term: Checkpoint
  body: Anthropic, in the [Claude Code](claude-code) glossary
  url: https://code.claude.com/docs/en/glossary
  title: Glossary — Claude Code documentation
  verifiedOn: 2026-08-22
  note: >-
    The word collides with the training sense — a saved snapshot of a model's
    parameters — and the two have nothing to do with each other. This guide
    titles the page "checkpoint and rollback" for that reason; vendors say
    "checkpoint" and rely on context.
tags: [agentic, safety]
zoom: 3
summary: Restoring an agent's work to an earlier point after a bad step —
  snapshots of files and conversation taken as the session runs.
fieldMark: Ask what it does not cover. Checkpointing typically tracks the
  agent's own edits and not changes made by commands it ran, which is exactly
  where a destructive step is most likely to have happened.
useCase:
  scenario: >-
    An agent takes a wrong approach four prompts ago and everything since has
    built on it.
  detail: >-
    Undoing the edits by hand is tedious and misses things; more importantly,
    the conversation still contains the wrong approach and will keep informing
    the next step. Rewinding both the files and the transcript to the point
    before the mistake removes it from the context as well as from the disk,
    which is the part a manual revert cannot do.
relations:
  - type: part-of
    target: session
    note: Restore points are saved with the conversation and travel with it.
  - type: distinguished-from
    target: checkpoint
    note: >-
      No relation to a model checkpoint. One is a restore point in a session;
      the other is a snapshot of trained parameters.
examples:
  - name: Claude Code checkpointing
    vendor: Anthropic
    url: https://code.claude.com/docs/en/checkpointing
    note: >-
      Captures state before each user prompt; `/rewind` restores code,
      conversation, or both. Does not track changes made through the Bash tool.
    verifiedOn: 2026-08-22
sources:
  - id: claude-code-glossary
    url: https://code.claude.com/docs/en/glossary
    title: Glossary — Claude Code documentation
    verifiedOn: 2026-08-22
    quote: >-
      A restore point created at each prompt you send.
  - id: claude-code-checkpointing
    url: https://code.claude.com/docs/en/checkpointing
    title: Checkpointing — Claude Code documentation
    verifiedOn: 2026-08-22
---

A checkpoint is "a restore point created at each prompt you send", with the
[harness](harness) snapshotting "files before every edit so a checkpoint can revert
them."[[cite:claude-code-glossary]]

The rewind action offers a choice worth noticing: restore "code, conversation,
or both."[[cite:claude-code-glossary]]

## Why restoring the conversation matters as much as the files

Reverting the edits undoes what the agent did. It does not undo what the agent
*believes*, because the transcript still contains the reasoning that led to the
wrong approach — and on the next [turn](turn) that reasoning is read back as
context and acted on again.

This is the specific way agentic work differs from ordinary undo. The state to
roll back is not only on disk. [Short-term memory](short-term-memory) is the
transcript, so rewinding it is how you make the agent stop believing something.

## What it does not cover

Anthropic is explicit about the boundaries: checkpoints are "separate from git
and don't track changes made through the Bash tool", [subagent](sub-agent) edits are not
restored, and external changes are not
tracked.[[cite:claude-code-checkpointing]] They are also "not a replacement for
version control."[[cite:claude-code-checkpointing]]

The gap is worth dwelling on, because it is the opposite of intuitive. Direct
file edits — the reversible, low-risk operation — are covered. Anything the
agent did by running a [command](command-execution) — the operation most likely
to be destructive — is not.

So checkpointing protects against the agent being *wrong*, not against it being
*dangerous*. For the second, the answers are a [sandbox](sandbox), a
[permission model](permission-model), and version control.

## The name collision

A [checkpoint](checkpoint) in training is a saved set of
[parameters](parameter). A checkpoint here is a restore point in a
[session](session). Same word, unrelated meanings, and both are common enough in
this guide's subject matter to be worth separating deliberately.
