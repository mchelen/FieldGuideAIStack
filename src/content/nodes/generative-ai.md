---
title: Generative AI
kind: concept
aka:
  - GenAI
  - generative models
canonical:
  status: contested
  body: Google, in the Machine Learning Glossary, which states outright that there is no formal definition
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Google calls it "an emerging transformative field with no formal
    definition" and records an active disagreement about whether earlier
    architectures qualify. The term is used constantly and defined nowhere
    binding.
tags: [core]
zoom: 1
summary: The umbrella term for models that produce content rather than classify
  it — text, images, audio, video — and the label under which most of this
  guide's subject matter is sold.
fieldMark: The word is doing marketing work as often as technical work. When it
  appears in a product description, ask which model, doing what — the term
  alone excludes almost nothing.
useCase:
  scenario: >-
    A policy or a procurement document says it applies to "generative AI".
  detail: >-
    The scope is genuinely unclear, and not because the drafter was careless.
    There is no formal definition to point at, and reasonable people disagree
    about whether older sequence models are inside it. A policy that names the
    capability it cares about — producing text that could be mistaken for a
    person's, or images of identifiable people — is enforceable in a way that
    one naming the category is not.
flow:
  scenario: >-
    A brief asking for three subject lines, handed to a category of system
    that did not exist commercially five years ago.
  path:
    - actor: A brief
      where: a person, not a system
      does: >-
        "write us three subject lines for this campaign"
    - node: generative-ai
      where: the provider's servers
      does: >-
        produces content rather than labelling content that exists
      self: true
    - node: large-language-model
      where: the provider's servers
      does: >-
        the kind of model doing it, for text
    - node: model
      where: the provider's servers
      does: >-
        underneath, a next-token predictor with no notion of correct
  returns: >-
    No right answer to compare against — which is why evaluating it is hard
relations:
  - type: contains
    target: large-language-model
    note: One family within it, and the one this guide is mostly about.
  - type: distinguished-from
    target: model
    note: >-
      Generative AI is a field and a marketing category. A model is an artifact.
      The two are used interchangeably and are not the same kind of thing.
examples:
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: Text generation at a scale that made the category commercially visible.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      An emerging transformative field with no formal definition.
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
    quote: >-
      Here we show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches.
---

Google's glossary is unusually direct: generative AI is "an emerging
transformative field with no formal definition." What it offers instead is a
rough consensus — that such models "can create ('generate') content that is all
of the following: complex, coherent,
original."[[cite:google-glossary]]

Three adjectives, none of them measurable. That is the state of the definition,
and it is worth knowing before treating the term as though it delimited
something.

## The disagreement is on the record

Google notes that earlier technologies — LSTMs and recurrent neural networks —
"can also generate original and coherent content", and that "some experts view
these earlier technologies as generative AI, while others feel that true
generative AI requires more complex output than those earlier technologies can
produce."[[cite:google-glossary]]

The boundary is drawn by judgment about output quality, not by any property of
the architecture. A category defined by how impressive its members are will
keep moving, and it has.

## What it does usefully separate

The contrast Google draws is with predictive machine
learning.[[cite:google-glossary]] A classifier answers a question you posed in
advance: is this spam, which of these five categories, what is the price. A
generative model produces an artifact you did not specify in advance.

That is a real difference, and it is the one that changed what these systems are
used for. It also explains why [evaluation](evaluation) is so much harder: there is no correct
answer to compare against.

## What falls inside

Text, by [large language models](large-language-model) — the case this guide is
mostly about.[[cite:gpt3-paper]] Also image generation, audio and music, video,
code and 3D. Google's entry lists most of these
explicitly.[[cite:google-glossary]]

They share a shape rather than an architecture, and the vocabulary in this
guide — [tokens](token), [context window](context-window),
[hallucination](hallucination) — comes from the text branch and transfers to the
others only partially.
