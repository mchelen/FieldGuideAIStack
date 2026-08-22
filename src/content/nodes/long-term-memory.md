---
title: Long-term memory
kind: concept
aka:
  - persistent memory
  - cross-session memory
canonical:
  status: de-facto
  term: Memory
  body: Anthropic, in the memory tool documentation, where it is a client-side file interface
  url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
  title: Memory tool — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Vendors call the feature "memory" without qualification; "long-term" is the
    contrast this guide draws to separate it from what a session holds. The
    implementation is consistently files rather than anything more exotic.
tags: [agentic, structure]
zoom: 2
summary: State that survives across sessions — in practice a directory of files
  the agent writes and reads back, not a faculty of the model.
fieldMark: >-
  Ask where it is stored and who can read it. Memory is files
  somewhere, and the interesting questions are all about that directory:
  whose, how large, and what happens when it is wrong.
useCase:
  scenario: >-
    An agent relearns the same three facts about a codebase at the start of
    every session.
  detail: >-
    Nothing carries between sessions unless something wrote it down. A memory
    directory lets the agent record what it learned — the build command, the
    test runner, the convention it got corrected on — and read it back later.
    The payoff is real and so is the failure mode: a wrong note is now a wrong
    note that gets loaded confidently for months.
relations:
  - type: kind-of
    target: memory
    note: The half that outlives the session.
  - type: distinguished-from
    target: short-term-memory
    note: >-
      The difference is not the agent's capability. It is whether the fact was
      written somewhere outside the conversation.
examples:
  - name: Memory tool
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
    note: >-
      Claude requests file operations under `/memories`; the application
      executes them against storage it controls.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-memory-tool
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
    title: Memory tool — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: reflexion-paper
    url: https://arxiv.org/abs/2303.11366
    title: "Reflexion: Language Agents with Verbal Reinforcement Learning — Shinn et al."
    verifiedOn: 2026-08-22
---

Anthropic's memory tool "lets Claude store and retrieve information across
conversations in a directory of memory files. Claude can create, read, update,
and delete files that persist between sessions, building up knowledge over time
without keeping everything in the [context
window](context-window)."[[cite:anthropic-memory-tool]]

Files. Not weights, not a database, not a faculty — a directory the agent reads
and writes with ordinary file operations.

## Why files, and why that is the right shape

Because it is inspectable, editable and deletable by a person. A memory you can
open in an editor is one you can correct; a memory encoded in
[parameters](parameter) would need a training run to change.

The Reflexion work made the same architectural choice for the same reason,
reinforcing agents "not by updating weights, but instead through linguistic
feedback" held in an episodic buffer.[[cite:reflexion-paper]] Learning as text
is cheap, reversible and legible.

## Just-in-time rather than pre-loaded

Anthropic describes the retrieval pattern: Claude "automatically checks its
memory directory before starting a task", then "stores what it learns in files
under `/memories` and reads them back in later
conversations."[[cite:anthropic-memory-tool]] Memory "supports just-in-time
context retrieval" rather than loading everything
up front.[[cite:anthropic-memory-tool]]

That is the same insight as [retrieval](retrieval-augmented-generation): an
index consulted on demand beats a corpus pasted into the window, because window
space spent on material this task does not need makes the answer worse as well
as more expensive.

## Where it is actually stored

The tool is client-side. "Claude only requests memory operations. Your
application executes each request against storage you control", and the
`/memories` path "is a prefix that your handler maps onto real storage, such as
a per-user directory or keys in a database."[[cite:anthropic-memory-tool]]

Which makes the interesting questions operational rather than technical: whose
directory, how large before it needs pruning, who else can read it, and what
happens when the agent writes something wrong.

## The failure that is specific to it

A mistaken short-term belief lasts one [session](session). A mistaken note in
long-term memory is loaded confidently at the start of every future one, and
because it arrives as established context rather than as a claim, it is unlikely
to be questioned.

Persistent memory is also a new surface for
[memory poisoning](memory-poisoning): content the agent read once, wrote down,
and now treats as its own knowledge.
