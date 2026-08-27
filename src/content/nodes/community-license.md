---
title: Community license
kind: concept
aka:
  - custom model license
  - source-available license
canonical:
  status: contested
  body: Meta's Llama Community License is the most widely-used example; no body defines the category
  url: https://huggingface.co/meta-llama/Llama-3.1-8B
  title: meta-llama/Llama-3.1-8B — Hugging Face
  verifiedOn: 2026-08-22
  note: >-
    "Community license" is the vendors' word for their own bespoke terms. None
    is OSI-approved, and the category exists precisely because these licences
    carry conditions the Open Source Definition does not permit. Calling them
    open source is the contested part.
tags: [openness]
zoom: 2
summary: A vendor's own model licence — downloadable weights with conditions
  that open source licences do not allow.
fieldMark: Read the thresholds and the incorporated policies. A community
  licence usually caps something by scale and pulls in an acceptable use policy
  by reference, which means the terms can change without the licence changing.
useCase:
  scenario: >-
    A product built on downloadable weights becomes unexpectedly popular.
  detail: >-
    Under the Llama 3.1 Community License, crossing 700 million monthly active
    users triggers a requirement to request a separate licence from Meta. That
    is a term no open source licence could contain, and it is invisible until
    the day it applies. Whether it matters depends entirely on the ambition of
    the product — which is exactly why it should be read before rather than
    after.
flow:
  scenario: >-
    Downloadable weights under terms written by the vendor rather than by
    anyone in the licence-approval business.
  path:
    - actor: A download
      does: >-
        weights, with a licence file beside them
    - node: community-license
      does: >-
        the vendor's own terms, not an approved open-source licence
      self: true
    - node: acceptable-use-policy
      does: >-
        incorporated by reference, and changeable later
    - node: open-source-ai
      does: >-
        the definition these terms are usually written to miss
  returns: >-
    Downloadable is not the same as unrestricted
relations:
  - type: distinguished-from
    target: open-source-ai
    note: >-
      The central disagreement. These licences are widely marketed as open
      source and none meets the definition.
  - type: consumes
    target: acceptable-use-policy
    note: >-
      Typically incorporated by reference, so the terms can change without the
      licence being amended.
examples:
  - name: Llama 3.1 Community License
    vendor: Meta
    url: https://huggingface.co/meta-llama/Llama-3.1-8B
    note: >-
      Requires an attribution notice, incorporates an Acceptable Use Policy by
      reference, and adds commercial terms above 700 million monthly active
      users.
    verifiedOn: 2026-08-22
sources:
  - id: hf-llama
    url: https://huggingface.co/meta-llama/Llama-3.1-8B
    title: meta-llama/Llama-3.1-8B — Hugging Face
    verifiedOn: 2026-08-22
    note: >-
      Licence text read from the model card on this page, which reproduces the
      Llama 3.1 Community License in full.
  - id: osi-licenses
    url: https://opensource.org/licenses
    title: OSI Approved Licenses — Open Source Initiative
    verifiedOn: 2026-08-22
---

A community licence is a vendor's own terms for its own weights. The Llama 3.1
Community License is the widely-copied template, and reading its actual clauses
is more useful than any summary.

## Three conditions, in the licence's own words

**Attribution.** You "must retain in all copies of the Llama Materials that you
distribute the following attribution notice within a 'Notice' text file …
'Llama 3.1 is licensed under the Llama 3.1 Community License, Copyright © Meta
Platforms, Inc. All Rights Reserved.'"[[cite:hf-llama]]

**Use restrictions, by reference.** Your use "must comply with applicable laws
and regulations … and adhere to the Acceptable Use Policy for the Llama
Materials …, which is hereby incorporated by reference into this
Agreement."[[cite:hf-llama]]

**A scale threshold.** "If, on the Llama 3.1 version release date, the monthly
active users of the products or services made available by or for Licensee … is
greater than 700 million monthly active" users, separate terms
apply.[[cite:hf-llama]]

## Why none of this is open source

OSI-approved licences "comply with the Open Source Definition — in brief, they
allow software to be freely used, modified, and shared."[[cite:osi-licenses]]
*Freely* is the operative word, and each condition above is a restriction the
definition does not permit — most obviously the user-count threshold, which
discriminates between licensees by size, and the use restrictions, which
discriminate by field of endeavour.

That is not a criticism of the licences. It is an observation about the label:
these are **source-available** terms, generous ones by commercial standards, and
they are marketed as open source constantly. The gap is the reason
[open source AI](open-source-ai) needed a separate definition at all.

## The incorporation-by-reference problem

The [acceptable use policy](acceptable-use-policy) is pulled in by
reference,[[cite:hf-llama]] which means the restrictions on your use live at a
URL the licensor controls. The licence does not have to change for what you are
permitted to do to change.

For a dependency at the centre of a product, that is a materially different risk
from a static licence text, and it is the clause most often skimmed.

## What you do get

Real and substantial: the [weights](open-weights), the right to
[fine-tune](fine-tuning) and distribute derivatives, and commercial use without
a fee for almost everyone. For most projects the conditions never bind.

The reason to read them anyway is that the ones that do bind — scale thresholds,
use restrictions — bind precisely at success.
