---
title: Function calling
kind: concept
aka:
  - tool calling
  - structured tool call
canonical:
  status: contested
  body: Anthropic, which treats it as the alternative name for tool use
  url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
  title: Tool use with Claude — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Anthropic's own phrasing is "tool use (also called function calling)", and
    the two are used interchangeably. This guide keeps them apart deliberately:
    tool use is the capability, function calling is the request-and-response
    shape that implements it. Nobody else draws that line, so read the term in
    context.
tags: [interfaces, structure]
zoom: 2
summary: The API shape that lets a model request a named function with
  arguments — a structured block in the response rather than text you parse.
fieldMark: The model does not call anything. It emits a block saying which
  function it would like called; your code decides whether to run it, which is
  where every permission control lives.
useCase:
  scenario: >-
    An assistant needs to look up an order, and the model has no database.
  detail: >-
    Rather than the model inventing an answer, it returns a structured request —
    the function name and the arguments — that your application executes against
    the real database, returning the result for the model to use. The whole
    value is that the boundary is explicit: the model chooses, your code
    decides, and the two steps can be logged, gated and refused separately.
flow:
  scenario: >-
    A model that has to ask for something to be run, in a format a program
    can parse without guessing.
  path:
    - actor: A request
      where: a person, not a system
      does: >-
        needs an action, not a sentence
    - node: function-calling
      where: the provider's servers
      does: >-
        the API shape: a named function, with typed arguments
      self: true
    - node: structured-output
      where: the provider's servers
      does: >-
        which is what makes the request parseable at all
    - node: tool-use
      where: wherever the product runs
      does: >-
        the general behaviour this is one vendor's name for
  returns: >-
    The model still only emits text. This is text with a schema.
relations:
  - type: part-of
    target: tool-use
    note: >-
      The wire contract. Tool use is the capability; this is the shape the
      request and response take.
  - type: consumed-by
    target: agentic-loop
    note: One iteration is usually a call emitted, executed, and returned.
examples:
  - name: Claude tool use
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
    note: >-
      "Pass a tool with an input_schema, then execute the call when Claude
      returns a tool_use block."
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-tool-use
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
    title: Tool use with Claude — Claude Platform documentation
    verifiedOn: 2026-08-22
    quote: >-
      See where tools execute, when Claude calls them, and which tool fits your task.  Copy page  Tool use (also called function calling) lets Claude call functions that you define or that Anthropic provides.
---

"Tool use (also called function calling) lets Claude call functions that you
define or that Anthropic provides. Claude determines when to call a tool based
on the user's request and the tool's description. It then returns a structured
call that your application executes."[[cite:anthropic-tool-use]]

Read the last clause carefully, because the name misleads. The model does not
call anything. It emits a block naming a function and its arguments, and
something else decides whether that happens.

## The round trip

Anthropic describes it in one line: "pass a tool with an `input_schema`, then
execute the call when Claude returns a `tool_use`
block."[[cite:anthropic-tool-use]] Four steps:

1. You send tool definitions — name, description, JSON schema for the arguments.
2. The model responds with `stop_reason: "tool_use"` and one or more `tool_use`
   blocks.[[cite:anthropic-tool-use]]
3. Your code executes whatever it decides to execute.
4. You send the result back as a `tool_result`, and the model continues.

Where the code runs is the distinction Anthropic draws: "client tools … run in
your application", while server tools run on the vendor's
infrastructure.[[cite:anthropic-tool-use]] The first kind is where an
[agent](agent) touches your systems.

## Why the structured shape matters

Before it, a [harness](harness) had to ask the model to emit something parseable
and hope. Prompted formats broke on stray prose, on a model explaining what it
was about to do, and on any deviation from the example.

A typed block removes that entire class of failure and, more importantly, makes
the decision point explicit. Step 3 is where an
[approval mode](approval-mode) intervenes, where an [allowlist](permission-model) applies, and where
a [hook](hook) fires. None of it would be possible if the model's intent
arrived as prose.

## Where the naming came from

"Function calling" is the older term, from an era when the mental model was
exposing an application's own functions. "Tool use" won as the framing widened
to include search, [code execution](command-execution) and whole toolsets that
are not functions in any sense.

Both are current. This guide files the capability under
[tool use](tool-use) and this page under the contract, because the two questions
— *can it act* and *how is the request shaped* — have different answers and
different consequences.
