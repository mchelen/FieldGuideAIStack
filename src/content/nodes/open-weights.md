---
title: Open Weights
aka: [weights-available, open-weight model]
tags: [licensing, openness, artifact]
zoom: 2
summary: A model whose parameters you can download and run yourself — which
  says nothing about whether the license is open, or whether you could rebuild
  the model from scratch.
fieldMark: If the download page has a bespoke license named after the model
  ("Community License", "Research License"), it is an open-weights release, not
  an open source one. Genuinely open licenses have names you already know.
relations:
  - type: kind-of
    target: model
  - type: distinguished-from
    target: open-source-ai
    note: Open weights is one of the three components OSAID requires, not the whole bar.
examples:
  - name: Llama 4 Community License
    vendor: Meta
    url: https://developer.meta.com/ai/llama4/license/
    note: >-
      Weights are downloadable, but the license requires organizations above
      700 million monthly active users to request a separate license from Meta,
      requires prominent "Built with Llama" attribution, requires derivative
      model names to begin with "Llama", and incorporates an Acceptable Use
      Policy by reference.
    verifiedOn: 2026-08-22
sources:
  - url: https://developer.meta.com/ai/llama4/license/
    title: Llama 4 Community License Agreement — Meta
    verifiedOn: 2026-08-22
    note: >-
      Read directly. Reached via redirect from llama.com/llama4/license/;
      returns HTTP 400 to scripted clients, so the link check reports it as
      blocked rather than broken.
  - url: https://opensource.org/ai/open-source-ai-definition
    title: The Open Source AI Definition – 1.0 — Open Source Initiative
    verifiedOn: 2026-08-22
    note: >-
      Read directly. The page returns HTTP 403 to some automated fetchers;
      retrieved with a browser user-agent.
---

"Open weights" is a claim about **availability**, not about **rights**. The
parameter files exist somewhere you can download them and run inference on your
own hardware. Everything else — what you may do with them, whether you could
reproduce them, whether you can see how they were made — is a separate question
with a separate answer.

This is the distinction the charter of this guide was written for: two releases
described identically in a headline can differ completely in what they permit.

## The two independent axes

|  | Weights downloadable | Weights not downloadable |
| --- | --- | --- |
| **Terms are open** | Rare — the OSAID bar | n/a |
| **Terms are restricted** | Most "open" models | Frontier API models |

A model can be freely downloadable under a license that forbids your specific
use, and that is a normal, common outcome — not a contradiction.

## What restrictions actually look like

Meta's Llama 4 Community License is the load-bearing example because its
restrictions are concrete and easy to check:

- **A scale ceiling.** Organizations with more than 700 million monthly active
  users in the preceding calendar month must request a separate license from
  Meta rather than relying on the community license.
- **Compelled attribution.** Distributors must prominently display "Built with
  Llama", and any model trained or improved on Llama materials must have a name
  beginning with "Llama".
- **An incorporated use policy.** A separate Acceptable Use Policy binds by
  reference, so the license text alone does not tell you what is prohibited.

Each of these is a field-identifiable mark. A downstream user with 800 million
users, or one that wants to name its fine-tune something else, has a real legal
constraint — which is exactly what "open source" is supposed to rule out.

## Why the vocabulary is worth defending

Under [OSAID 1.0](open-source-ai), an open-weights release without data
information and training code does not qualify as Open Source AI regardless of
how permissive its terms are. Calling it "open source" is not a rounding error;
it collapses the one distinction that tells you whether you could ever
independently rebuild or audit the thing.
