---
title: Prompt engineering
kind: concept
aka:
  - prompt design
  - prompting
canonical:
  status: de-facto
  term: Prompt engineering
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google records "prompt design" as a synonym. The "engineering" label is
    contested in practice — the work is largely empirical — but no alternative
    has displaced it.
tags: [context, technique]
zoom: 1
summary: Changing what a model does by changing what you send it, without
  touching the weights — the cheapest and most reversible lever in the stack.
fieldMark: If the change survives deleting the prompt, it was training. If it
  disappears, it was prompting. That test settles most arguments about where a
  behaviour came from.
useCase:
  scenario: >-
    A model's output is nearly right and a team is discussing a fine-tuning run.
  detail: >-
    Prompting is the first thing to exhaust, because it costs an afternoon
    rather than a training budget, and because a prompt is a string in version
    control that anyone can read, change and revert. Fine-tuning produces an
    artifact that must be evaluated, hosted and re-made every time the base
    model moves. Reach for it when the prompt needed to get the behaviour is
    long enough to be expensive on every call, or when instructions keep failing
    to enforce consistency — not before.
relations:
  - type: consumes
    target: context-window
    note: Everything prompting does happens inside it, and competes for the same space.
  - type: distinguished-from
    target: fine-tuning
    note: >-
      Prompting changes the input; fine-tuning changes the weights. The first is
      free to undo and the second is not.
examples:
  - name: Prompt engineering guide
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
    note: Vendor guidance on clarity, examples, XML structuring and agentic prompts.
    verifiedOn: 2026-08-22
  - name: Prompt Engineering Guide
    url: https://www.promptingguide.ai/techniques/prompt_chaining
    note: A community reference cataloguing the named techniques and their sources.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      The art of creating prompts that elicit the desired responses from a large language model.
  - id: anthropic-prompting
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
    title: Prompting best practices — Claude Platform documentation
    verifiedOn: 2026-08-22
  - id: promptguide-chaining
    url: https://www.promptingguide.ai/techniques/prompt_chaining
    title: Prompt Chaining — Prompt Engineering Guide
    verifiedOn: 2026-08-22
---

Prompt engineering is "the art of creating prompts that elicit the desired
responses from a [large language model](large-language-model)", and Google's glossary is careful to add
that "humans perform prompt engineering."[[cite:google-glossary]]

A prompt is "any text entered as input to a large language model to condition
the model to behave in a certain way", and it "can be as short as a phrase or
arbitrarily long — for example, the entire text of a
novel."[[cite:google-glossary]]

## Why it works at all

A [model](model) is a fixed function. It has no settings, no memory and no
configuration; the only thing that varies between one call and the next is the
text you send.

So the prompt is not merely how you ask the question. It is the entire interface
to whatever behaviour the model is capable of. Everything a product does to make
a model act like an assistant, a code reviewer or a translator arrives through
the same channel a user's question does — which is also, exactly, why
[prompt injection](prompt-injection) is a structural problem rather than a bug.

## What it depends on

Google lists the factors, and the first two are worth sitting with: "the dataset
used to pre-train and possibly fine-tune the large language model" and "the
[temperature](temperature) and other decoding parameters that the model uses to
generate responses."[[cite:google-glossary]]

Both mean the same uncomfortable thing. A prompt is tuned against a specific
model at specific settings, and a prompt that works well against one model is
evidence about that model rather than a general technique. Prompts do not port
cleanly, and a model upgrade is a reason to re-test them.

## The named techniques

Most of what is written about prompting reduces to a handful of moves, each with
a page here: [zero-shot](zero-shot-prompting) and
[few-shot](few-shot-prompting) prompting,
[chain-of-thought](chain-of-thought-prompting),
[prompt chaining](prompt-chaining),
[self-consistency](self-consistency),
[tree of thoughts](tree-of-thoughts) and
[meta-prompting](meta-prompting).[[cite:promptguide-chaining]]

The [system prompt](system-prompt) is where most of them are deployed in a real
product.[[cite:anthropic-prompting]]

## Why "engineering" is arguable

There is no theory that predicts which wording works. Practitioners try things,
measure, and keep what scores better — which is closer to empirical tuning than
to engineering, and is why the field's advice ages so quickly.

What makes it work anyway is the measuring. Prompting without an evaluation set
is guessing with extra steps, and the difference between the two is the only
part of the discipline that has stayed true across model generations.
