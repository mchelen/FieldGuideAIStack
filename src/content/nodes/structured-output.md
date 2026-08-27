---
title: Structured output
kind: concept
aka:
  - JSON mode
  - constrained decoding
  - schema-constrained output
canonical:
  status: de-facto
  term: Structured outputs
  body: Anthropic, where it is a request parameter backed by constrained decoding
  url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
  title: Structured outputs — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Named similarly across vendors — structured outputs, JSON mode, response
    format. What differs is whether the schema is guaranteed or merely
    requested, which is the only distinction that matters and is not always
    stated on the page.
tags: [interfaces, capability]
zoom: 2
summary: Forcing model output to conform to a schema — enforced during
  decoding, so invalid output is not possible rather than merely unlikely.
fieldMark: Ask whether it is guaranteed or encouraged. A prompt asking for JSON
  produces JSON almost always; constrained decoding produces it always, and the
  difference is the retry logic you do or do not have to write.
useCase:
  scenario: >-
    An extraction pipeline fails once every few hundred calls on malformed JSON.
  detail: >-
    Prompting for a format gets it right nearly every time, and "nearly" is what
    the error handling exists for — a stray sentence of [preamble](system-prompt), a trailing
    comma, a missing field. Constrained decoding removes the failure by
    construction: the sampler cannot emit a token that would violate the schema.
    The retries, the parse guards and the repair prompts all become unnecessary
    rather than more reliable.
flow:
  scenario: >-
    Output that has to parse as JSON every time, in a system that generates
    one token at a time.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        need the answer to parse, every single time
    - actor: A schema
      where: wherever the product runs
      does: >-
        what the calling program is able to accept
    - node: inference-api
      where: on the wire
      does: >-
        carries it alongside the messages
    - node: structured-output
      where: inside one model call
      does: >-
        invalid tokens are excluded during decoding, not after
      self: true
    - node: function-calling
      where: inside one model call
      does: >-
        which is this, applied to naming a function and its arguments
  returns: >-
    Valid shape guaranteed. Correct content, not at all.
relations:
  - type: part-of
    target: inference-api
    note: A request-level parameter, set per call.
  - type: distinguished-from
    target: function-calling
    note: >-
      Both constrain shape. One asks the model for a call to make; the other
      asks it for data to return.
examples:
  - name: Claude structured outputs
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
    note: >-
      `output_config.format` with a JSON schema; also strict tool use, which
      guarantees schema validation on tool names and inputs.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-structured
    url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
    title: Structured outputs — Claude Platform documentation
    verifiedOn: 2026-08-22
    quote: >-
      See the following code examples for the updated API shape.  Why use structured outputs Without structured outputs, Claude can generate malformed JSON responses or invalid tool inputs that break your applications.
---

The problem is stated as a list of things that happen without it: "parsing
errors from invalid JSON syntax, missing required fields, inconsistent data
types, schema violations requiring error handling and
retries."[[cite:anthropic-structured]]

Every one of those is a *sometimes*. That is what makes them expensive — they
survive testing and appear in production at a low rate, which is the worst
possible frequency for a bug.

## How the guarantee is made

Not by prompting harder. "Structured outputs guarantee schema-compliant
responses through **constrained decoding**", with the result that output is
"always valid: no more `JSON.parse()` errors", "type safe: guaranteed field
types and required fields", and "reliable: no retries needed for schema
violations."[[cite:anthropic-structured]]

Constrained decoding works at the sampling step. At each position, tokens that
would make the output violate the schema are excluded from the distribution
before a [token](token) is chosen. The model cannot produce invalid output
because invalid output is unreachable, not because it was asked nicely.

This is a rare thing in this guide: an actual guarantee, rather than a strong
tendency.

## What it does not guarantee

The schema, not the content. A response can be perfectly valid JSON with the
right field types and entirely wrong values — [hallucination](hallucination)
constrained into a well-formed shape is still hallucination.

Structured output solves parsing. It does not touch
[factuality](factuality), and treating a schema-valid response as a verified one
is a mistake the guarantee actively invites.

## Two related mechanisms

Anthropic documents them side by side: JSON outputs, which "control Claude's
response format", and strict [tool use](tool-use), which guarantees "schema
validation on tool names and inputs" — usable "independently or together in the
same request."[[cite:anthropic-structured]]

The second matters for [agents](agent). A
[function call](function-calling) with a malformed argument is a failed step in
a loop, and strict validation removes that failure the same way.
