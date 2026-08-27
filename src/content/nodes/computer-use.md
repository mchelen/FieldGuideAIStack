---
title: Computer use
kind: concept
aka:
  - desktop control
  - GUI automation
canonical:
  status: de-facto
  term: Computer use
  body: Anthropic, in the computer use tool documentation
  url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
  title: Computer use tool — Claude Platform documentation
  verifiedOn: 2026-08-22
  note: >-
    Named similarly by other vendors — computer use, operator, agent mode — for
    the same capability. No standard exists; the tool definitions are
    vendor-specific and not interchangeable.
tags: [agentic, capability]
zoom: 2
summary: An agent driving a whole computer through screenshots, mouse and
  keyboard, rather than calling an application's API.
fieldMark: Computer use is the fallback for software with no API. It is slower,
  less reliable and more expensive than any API call, and it works on things
  nothing else can reach.
useCase:
  scenario: >-
    A [workflow](workflow) depends on a desktop application with no API and no automation
    interface.
  detail: >-
    Every other integration route is closed. Computer use takes a screenshot,
    decides where to click, clicks, and takes another — the same loop a person
    runs, at a fraction of the speed and with none of the peripheral vision.
    It is the right tool when the alternative is a human doing it by hand, and
    the wrong tool whenever an API exists.
flow:
  scenario: >-
    A desktop application with no API and no plans for one, and work that
    has to happen inside it anyway.
  path:
    - actor: A screen
      does: >-
        pixels, with no API behind them
    - node: computer-use
      does: >-
        the agent takes screenshots and moves a mouse
      self: true
    - node: tool-use
      does: >-
        each click is a tool call like any other
    - node: browser-automation
      does: >-
        the narrower case, where the surface is a browser
  returns: >-
    Anything a person can do, at a person's error rate
relations:
  - type: kind-of
    target: tool-use
    note: A toolset like any other, with screenshot and input members.
  - type: distinguished-from
    target: browser-automation
    note: >-
      Browser automation acts on the page. Computer use acts on the screen, and
      reaches applications a browser cannot.
examples:
  - name: Computer use tool
    vendor: Anthropic
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
    note: >-
      One toolset entry gives 17 member tools such as `screenshot`,
      `left_click`, `type` and `zoom`, executed in an environment you control.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-computer-use
    url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
    title: Computer use tool — Claude Platform documentation
    verifiedOn: 2026-08-22
---

Computer use gives a model "screenshot capabilities and mouse/keyboard control
for autonomous desktop interaction."[[cite:anthropic-computer-use]] Anthropic's
implementation is a client toolset: one entry in `tools` yields "17 member tools
such as `screenshot`, `left_click`, `type`, and `zoom`, and your application
runs every call in an environment you
control."[[cite:anthropic-computer-use]]

Note where execution happens. The model asks; the application acts. That is the
same client-side arrangement as the memory tool, and it is what makes a
[sandbox](sandbox) possible — the environment is yours to bound.

## Why it exists

Because most software has no API. Internal tools, legacy desktop applications,
vendor portals, anything behind a login with no documented interface — all of it
is unreachable by ordinary [tool use](tool-use) and all of it is operable by a
person with a mouse.

Computer use is the general fallback: if a human could do it on a screen, an
agent can attempt it.

## Why it is a last resort

Every property is worse than an API call:

- **Slow.** A screenshot per step, and the [model](model) has to read an image
  before deciding anything.
- **Expensive.** Images are [tokens](token), and there are many of them.
- **Brittle.** A moved button, a changed theme, an unexpected dialog. Nothing
  about the interface is a contract.
- **Unverifiable.** Success is judged by looking at a picture, which is a weak
  [verification loop](verification-loop) compared with a return code.

An API call is a structured request with a typed response. Computer use is
inference about pixels. When both are available the choice is not close.

## Browser use is usually the closer fit

Anthropic notes it directly: "for tasks that stay inside webpages, the browser
use tool is the closer fit: its member tools read and act on the page
itself."[[cite:anthropic-computer-use]]

[Browser automation](browser-automation) works with the page's structure rather
than its rendering, which makes it faster and considerably more robust. Computer
use is what remains when the target is not a web page at all.

## The risk it concentrates

An agent with mouse and keyboard control of a desktop has, functionally, the
permissions of whoever is logged in. Everything under
[excessive agency](excessive-agency) applies at maximum: there is no narrow
scope to grant, because the capability is "operate this computer".

This is the clearest case in the guide for isolation being the only real
control. The agent should be driving a machine that does not matter.
