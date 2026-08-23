---
title: Where the model actually runs
order: 2
summary: Tomas asks a compliance question that nobody can answer, and Halcyon
  discovers that three different companies are involved in every model call
  they make.
cast:
  - name: Tomas Kelly
    role: Safety and compliance officer
  - name: Ama Osei
    role: Engineering lead
concepts:
  - model-provider
  - model-host
  - hyperscaler
  - inference-api
  - self-hosting
outcome: >-
  Halcyon stayed on a hosted model and can now name, in one paragraph, who
  trained it, who serves it, whose hardware it runs on and which terms apply.
  Tomas describes this as the first honest answer they have had.
---

Tomas's question was short: *when a passenger types their booking reference into
the help box, where does that text go?*

Ama's first answer — "to the model" — did not survive contact with the second
question, which was *whose model, on whose computer, under what agreement?*

## Three roles, routinely held by different companies

The confusion is structural rather than anyone's fault. There are at least three
parties and they are all described, in their own marketing, as AI companies.

- The **[model provider](model-provider)** trained the weights, owns them, sets
  the licence and the acceptable use policy. They are whoever could retrain the
  model — not necessarily whoever sent the invoice.
- The **[model host](model-host)** runs it and sells access, usually under its
  own API, billing and identity system. A host's catalogue often spans competing
  labs, which is the giveaway.
- The **[hyperscaler](hyperscaler)** owns the accelerators underneath. Very
  often the same company as the host, and very often not the provider.

Halcyon's arrangement, once Ama wrote it down, involved a provider they had
never contracted with directly, a host they had, and a cloud region they had
chosen in a dropdown eighteen months earlier for unrelated reasons.

## Why the answer matters more than it sounds

Tomas is not asking out of curiosity. Four questions depend on it, and each
resolves to a different party:

- Who can change the terms of use? *The provider, through the licence.*
- Whose outage takes the help box down? *The host's, or the hyperscaler's.*
- Where is the data processed? *The hyperscaler's region.*
- Who is accountable if the model says something defamatory about a competitor?
  *A question their insurer had opinions about.*

## They looked at running it themselves

[Self-hosting](self-hosting) came up, as it does, and Ama costed it honestly.

The software is free and mature. The hardware is not, and the decisive figure
was not the purchase price but the utilisation: Halcyon's help box is busy for
about four hours a day and idle for twenty. A rented accelerator costs the same
in both. A hosted [inference API](inference-api) costs nothing when nobody is
asking.

The conversation ended where it usually should: self-hosting is the answer when
a requirement removes the hosted option, and Halcyon does not have that
requirement — the passenger data in question is a booking reference and a
question about a sailing.

## What changed

Nothing technical. Halcyon still calls a hosted model through the same endpoint.

What changed is that Tomas has a paragraph naming the four parties, the region,
the terms and the retention policy, and Ama has a note in the repository saying
which of those is a dropdown somebody could change without noticing. That
paragraph is what a compliance answer actually looks like, and they did not have
one before.
