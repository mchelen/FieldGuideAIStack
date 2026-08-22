---
title: Open Source AI
aka: [OSAID, Open Source AI Definition]
tags: [licensing, openness, standard]
zoom: 2
summary: A defined term, not a vibe — under OSI's Open Source AI Definition 1.0
  a system qualifies only if data information, training code, and parameters are
  all released under open terms.
fieldMark: Test it against the four freedoms and the three components. Almost
  every model marketed as "open source" fails on data information, which is the
  component nobody ships.
relations:
  - type: distinguished-from
    target: model
sources:
  - url: https://opensource.org/ai/open-source-ai-definition
    title: The Open Source AI Definition – 1.0 — Open Source Initiative
    verifiedOn: 2026-08-22
    note: >-
      Read directly. The page returns HTTP 403 to some automated fetchers;
      retrieved with a browser user-agent.
---

The Open Source Initiative publishes an explicit definition, currently at
version 1.0, and it is stricter than common usage. Under it, an Open Source AI
is a system made available under terms granting four freedoms:

- **Use** the system for any purpose, without asking permission.
- **Study** how it works and inspect its components.
- **Modify** it for any purpose, including to change its output.
- **Share** it, with or without modifications, for any purpose.

Crucially, the definition states that "the requirements are the same, whether
applied to a system, a model, weights and parameters, or other structural
elements" — so you cannot satisfy it by opening one layer and closing the rest.

## The three required components

Exercising those freedoms requires "the preferred form to make modifications",
which the definition spells out as all three of:

| Component | What must be released |
| --- | --- |
| **Data Information** | Enough detail that a skilled person could build a substantially equivalent system: complete description of all training data (including unshareable data), provenance, scope, how it was obtained and selected, labeling procedures, and processing and filtering methodology; plus listings of publicly available and third-party-obtainable data and where to get each. Under OSI-approved terms. |
| **Code** | The complete source used to train *and* run the system — data processing and filtering, training arguments and settings, validation and testing, tokenizers, hyperparameter search, inference code, model architecture. Under OSI-approved licenses. |
| **Parameters** | The weights and other configuration settings, under OSI-approved terms. Possibly including intermediate checkpoints and final optimizer state. |

## The compromise, and the loophole it closes

Data Information is not the dataset. The definition requires a sufficient
*description* rather than shipping the corpus — a concession to the fact that
training data is routinely encumbered by copyright, contract, and privacy law.

But it is still the component that most "open source" model releases omit
entirely, and the definition explicitly closes the escape route: "Open Source
models" and "Open Source weights" must include the data information and code
used to derive those parameters. A weights-only release does not qualify,
whatever the download page calls it. See [open weights](open-weights) for what
those releases actually are.
