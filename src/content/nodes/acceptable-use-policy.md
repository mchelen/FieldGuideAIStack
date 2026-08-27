---
title: Acceptable use policy
kind: concept
aka:
  - AUP
  - usage policy
canonical:
  status: de-facto
  term: Acceptable Use Policy
  body: Standard commercial terms vocabulary; incorporated by reference into model licences
  url: https://www.anthropic.com/legal/aup
  title: Usage Policy — Anthropic
  verifiedOn: 2026-08-22
  note: >-
    Ordinary contract vocabulary. What is worth recording is the mechanism:
    model licences incorporate the policy by reference, so the constraints on
    use sit at a URL the licensor can edit without amending the licence.
tags: [openness]
zoom: 3
summary: Terms constraining what a model may be used for — usually
  incorporated into a licence by reference, and therefore changeable without
  the licence changing.
fieldMark: An AUP is a live document, not a signed one. Check when it was last
  revised and whether anything you depend on is now on the list.
useCase:
  scenario: >-
    A product depends on a licensed model and someone asks whether the use case
    is still permitted.
  detail: >-
    The licence probably does not say — it points at a policy, and the policy is
    the thing that answers. Because it is incorporated by reference, the answer
    can change without any notice that a licence has been amended, which makes
    "read it once at adoption" insufficient for anything long-lived. This is a
    genuine dependency, and treating it like one means checking it on a
    schedule.
flow:
  scenario: >-
    A contract term that decides what a deployment may be used for,
    incorporated by reference into a licence nobody read.
  path:
    - actor: A use
      where: a person, not a system
      does: >-
        something someone wants to build
    - node: acceptable-use-policy
      where: a contract, not a computer
      does: >-
        the vendor's list of what may not be done
      self: true
    - node: community-license
      where: a contract, not a computer
      does: >-
        which incorporates it by reference, and can change
    - node: guardrails
      where: the provider's servers
      does: >-
        the enforcement, which is a different thing from the rule
  returns: >-
    A rule you agreed to; enforcement is separate
relations:
  - type: consumed-by
    target: community-license
    note: >-
      Incorporated by reference, which is what makes the licence's constraints
      a moving target.
  - type: distinguished-from
    target: guardrails
    note: >-
      A policy states what is not allowed. A guardrail is a mechanism that
      stops it. Neither substitutes for the other.
examples:
  - name: Llama Acceptable Use Policy
    vendor: Meta
    url: https://huggingface.co/meta-llama/Llama-3.1-8B
    note: >-
      The Llama 3.1 Community License incorporates it by reference, making
      adherence a licence condition.
    verifiedOn: 2026-08-22
  - name: Anthropic Usage Policy
    vendor: Anthropic
    url: https://www.anthropic.com/legal/aup
    note: A hosted provider's equivalent, applying to API and product use.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-aup
    url: https://www.anthropic.com/legal/aup
    title: Usage Policy — Anthropic
    verifiedOn: 2026-08-22
  - id: hf-llama
    url: https://huggingface.co/meta-llama/Llama-3.1-8B
    title: meta-llama/Llama-3.1-8B — Hugging Face
    verifiedOn: 2026-08-22
    quote: >-
      If you access or use Llama 3.1, you agree to this Acceptable Use Policy (“Policy”).
  - id: osi-licenses
    url: https://opensource.org/licenses
    title: OSI Approved Licenses — Open Source Initiative
    verifiedOn: 2026-08-22
---

An acceptable use policy lists what a model may not be used for. Every
[model provider](model-provider) publishes one for its hosted
service,[[cite:anthropic-aup]] and — the part that matters more — model licences
for downloadable weights incorporate one too.

## Incorporation by reference is the mechanism

The Llama 3.1 Community License requires that use "adhere to the Acceptable Use
Policy for the Llama Materials …, which is hereby incorporated by reference into
this Agreement."[[cite:hf-llama]]

Two consequences follow, and both are easy to miss:

- **Violating the policy is a licence breach**, not merely a terms-of-service
  matter. The remedy is the loss of the licence.
- **The policy can change without the licence changing.** It lives at a URL the
  licensor controls, so the set of things you may do with weights already on
  your disk is not fixed at the moment you downloaded them.

For a hosted API that is unremarkable — the provider can change terms and you
can leave. For [open weights](open-weights), it is stranger: the artifact is
yours and the permission attached to it is not static.

## Why an AUP disqualifies a licence from being open source

The Open Source Definition, which OSI-approved licences must
meet,[[cite:osi-licenses]] does not permit discrimination against fields of
endeavour. A policy enumerating forbidden uses is exactly that, however
reasonable the individual entries.

This is the clearest single reason a
[community licence](community-license) is not an open source licence, and it
does not depend on any judgment about whether the restrictions are wise.

## Policy is not enforcement

An AUP states what is not allowed. It does not stop anything — that is what
[guardrails](guardrails), a [permission model](permission-model) and, for hosted
services, the provider's own monitoring are for.

For downloaded weights there is no enforcement at all beyond the legal one,
which is the honest position: the restriction is a contractual term with a
contractual remedy, not a property of the model.
