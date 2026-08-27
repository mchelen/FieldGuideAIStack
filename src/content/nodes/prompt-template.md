---
title: Prompt template
kind: concept
aka:
  - prompt scaffold
  - parameterised prompt
canonical:
  status: none
  note: >-
    No surveyed glossary carries it and no vendor specifies a format. Every
    framework invents its own placeholder syntax, which is a reasonable signal
    that this is a software pattern rather than a concept about models.
tags: [context, technique]
zoom: 3
summary: A reusable prompt with slots for variable content — the unit prompts
  become once more than one person has to maintain them.
fieldMark: The moment a prompt has a slot, it has an injection surface. What
  goes in the slot is untrusted the instant any of it comes from a user or a
  document.
useCase:
  scenario: >-
    The same classification prompt is pasted into four services and three of
    them are a revision behind.
  detail: >-
    A template makes the prompt one artifact with one version, filled with
    different content at each call site. That is ordinary software hygiene, and
    it is what makes [evaluation](evaluation) possible at all — you cannot measure whether a
    change helped if every caller is running a different prompt. The discipline
    that follows is the point: version it, test it, and change it in one place.
flow:
  scenario: >-
    A prompt that used to live in three source files and now lives in one,
    with a history.
  path:
    - actor: A prompt
      where: your machine
      does: >-
        copied into three places, and drifting
    - node: prompt-template
      where: your machine
      does: >-
        one reusable text with slots for what varies
      self: true
    - node: prompt-engineering
      where: your machine
      does: >-
        versioned, evaluated, and reviewed like code
    - node: prompt-injection
      where: wherever the product runs
      does: >-
        and a slot is exactly where untrusted text arrives
  returns: >-
    A file with a diff beats a string in three places
relations:
  - type: kind-of
    target: prompt-engineering
    note: The engineering half — making a prompt a maintained artifact.
  - type: consumed-by
    target: prompt-injection
    note: >-
      Every slot is a place where text the operator did not write enters a
      prompt the model treats as instructions.
examples:
  - name: Prompt Chaining
    url: https://www.promptingguide.ai/techniques/prompt_chaining
    note: >-
      Chained pipelines are where templates become unavoidable — each stage is
      a template filled from the previous stage's output.
    verifiedOn: 2026-08-22
sources:
  - id: promptguide-chaining
    url: https://www.promptingguide.ai/techniques/prompt_chaining
    title: Prompt Chaining — Prompt Engineering Guide
    verifiedOn: 2026-08-22
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

A prompt is "any text entered as input to a
[large language model](large-language-model) to condition
the model to behave in a certain way."[[cite:google-glossary]] A template is
that text with holes in it — the fixed instructions kept, the variable content
supplied per call.

Nothing about the model knows this happened. By the time the request is sent,
the template and its fillings are one undifferentiated string.

## Why the pattern appears immediately

The instant a prompt is used in more than one place, copies drift. A template
makes it a single artifact that can be:

- **Versioned** — a change is a diff, with a history.
- **Tested** — the same template run over an evaluation set, before and after.
- **Reviewed** — a prompt in a repository is a prompt somebody read.
- **Changed once** — rather than in every caller that pasted it.

[Prompt chaining](prompt-chaining) makes this unavoidable: each stage is a
template filled from the previous stage's
output.[[cite:promptguide-chaining]]

## Why every framework's syntax is different

Because there is nothing to standardise against. The model accepts a string;
whether the slots were marked with braces, dollars, XML tags or a templating
language is entirely a decision on your side of the API.

That is worth knowing before adopting a framework for this reason alone. The
template mechanism is the easy part.

## The security shape

A slot is a way in. Content arriving in one — a user's message, a
retrieved document, a tool result — becomes part of a prompt the
[model](model) reads as a single stream, and it cannot tell the operator's words
from the filling.

This is [prompt injection](prompt-injection) stated in terms of templates, and
it is why the analogy with SQL injection only goes so far. Parameterised queries
work because the database parses structure separately from values; nothing here
does that, so there is no equivalent to reach for. Structural cues — putting
untrusted content inside tags and saying what it is — help the model and
guarantee nothing.
