---
title: The licence question
order: 6
summary: A supplier proposes an "open source" model, and Tomas reads the licence
  — finding a user-count threshold, a policy incorporated by reference, and a
  term that is not open source at all.
cast:
  - name: Tomas Kelly
    role: Safety and compliance officer
  - name: Ama Osei
    role: Engineering lead
concepts:
  - open-weights
  - open-source-ai
  - community-license
  - acceptable-use-policy
  - permissive-license
outcome: >-
  Halcyon uses the model, under terms it can describe accurately. The phrase
  "open source" no longer appears in any internal document about it, which
  Tomas considers the durable outcome.
---

A supplier offered to build Halcyon a fleet-maintenance assistant on "an open
source model, so there's no lock-in." Tomas, who has read enough contracts to be
suspicious of a phrase doing that much work, asked to see the licence.

## What open actually meant here

The weights were downloadable. That is [open weights](open-weights), and it is a
real and substantial thing — you can hold the file, run it anywhere, and
[fine-tune](fine-tuning) it.

It is not the same as [open source AI](open-source-ai), and the licence was a
[community licence](community-license): the vendor's own terms, not approved by
anyone, containing three clauses that no open source licence could.

## The three clauses

**Attribution.** A notice file must travel with any distribution. Unremarkable,
and the only one Tomas had expected.

**An [acceptable use policy](acceptable-use-policy), incorporated by
reference.** This is the one that made Tomas put down the coffee. The
restrictions on use are not in the licence; the licence points at a web page,
and that page can change without the licence changing. For a dependency at the
centre of a system, the set of permitted uses is not fixed at the moment you
download the file.

**A user-count threshold.** Above a stated number of monthly active users,
separate terms apply. Halcyon has two million passenger journeys a year and
nothing close to that user count, so the clause will never bind — but Tomas's
observation was sharper than that: *the clauses that bind are the ones that bind
at success.*

## Why none of it is open source

Not a judgment about whether the terms are reasonable. They are, mostly. The
Open Source Definition does not permit discrimination between licensees by size
or against fields of endeavour, and those two clauses do exactly that.

A [permissive licence](permissive-license) — the MIT-and-Apache family — asks
for a notice and a warranty disclaimer and nothing about what you build. That is
what "no lock-in" would mean. It is not what was on offer, and it very rarely
is.

## What they did

Used the model. It suited the task, the terms were survivable, and the supplier
was not being deceptive so much as repeating a phrase the whole industry
repeats.

What changed is the language. Halcyon's internal documents now say
"downloadable weights under the vendor's community licence", with a link to the
use policy and a note to re-read it annually. Tomas's summary:

> We did not get a worse deal than we thought. We got the deal we thought, and
> now we can describe it.
