---
title: Inference API
aka: [completions API, messages API, model endpoint]
canonical:
  status: none
  note: >-
    No surveyed glossary carries the term, and no two vendors name the endpoint
    the same way — Messages API, completions API, generate. "Inference API" is
    the generic description this guide uses because the vendor names are not
    interchangeable and the shape underneath them is.
tags: [interface, infrastructure]
zoom: 2
summary: The HTTP contract for calling a model — you post messages plus
  configuration, you get tokens back, and the server keeps nothing.
fieldMark: Look for statelessness. If the whole conversation has to be re-sent
  on every call, it is a raw inference API. If you send only the new message,
  something is storing state for you and it is not the model.
useCase:
  scenario: >-
    A conversation seems to be remembered, and you want to know where.
  detail: >-
    Not in the API. It is stateless: every call re-sends the entire history,
    and the server keeps nothing between requests. Whatever remembers is on
    your side of the boundary, which explains why cost grows with conversation
    length, why prompt caching exists, and why "the model remembered" is
    almost always a claim about a harness.
relations:
  - type: consumed-by
    target: harness
examples:
  - name: Claude Messages API
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/api/overview
    note: >-
      POST /v1/messages on the RESTful Claude API at api.anthropic.com;
      requests carry x-api-key or a bearer token plus an anthropic-version
      header. Request size limit 32 MB.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-claude-api
    url: https://platform.claude.com/docs/en/api/overview
    title: Claude API overview — Anthropic
    verifiedOn: 2026-08-22
---

The inference API is the seam between the [model](model) and everything built on
it. Understanding its shape explains several things that otherwise seem magical.

A request typically carries:

- **messages** — the full conversation so far, every time.
- **model** — which weights to run.
- **tools** — schemas the model may ask you to invoke. See [tool use](tool-use).
- **sampling parameters** — temperature, max tokens, stop sequences.

The response carries generated tokens, a stop reason, and a usage count.

## Statelessness is the load-bearing property

The server does not remember your last call. Every turn re-sends the entire
history, which is why:

- long conversations cost more per turn than short ones,
- the [context window](context-window) is a hard ceiling on conversation length,
- [prompt caching](prompt-caching) exists as a distinct billed feature,
- "memory" is always a [harness](harness) feature, never a model one.

## Beyond raw inference

Providers increasingly ship higher-level endpoints alongside the raw one —
Anthropic's API documents batch processing, token counting, file management, and
beta agent/session endpoints that run stateful sessions in managed sandboxes.
These are convenience layers over the same underlying inference; the statelessness
still holds at the bottom.
