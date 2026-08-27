---
title: Foundation model
kind: concept
aka:
  - base model
  - pretrained model
canonical:
  status: de-facto
  term: Foundation model
  body: Stanford Center for Research on Foundation Models, which coined it in 2021
  url: https://arxiv.org/abs/2108.07258
  title: On the Opportunities and Risks of Foundation Models — Bommasani et al.
  verifiedOn: 2026-08-22
  note: >-
    Unusually well-attributed for this vocabulary: the report states outright
    that it is naming the category. Google's glossary carries the same sense.
tags: [core, artifact]
zoom: 2
summary: A very large model pre-trained on broad data, general enough to answer
  a wide range of requests and to serve as the base other models are adapted
  from.
fieldMark: Ask what it was built for. If the honest answer is "not any one
  thing", it is a foundation model. A model trained to do a specific job is
  not one, however large it is.
useCase:
  scenario: >-
    A company wants a model that writes in its house voice and does not want to
    train a model from scratch.
  detail: >-
    It starts from a foundation model and adapts it — [fine-tuning](fine-tuning) on its own
    documents, or more often just describing the voice in a [system prompt](system-prompt). The
    expensive, general work of learning language was already done and paid for
    by someone else. This is the property the name is pointing at: the model is
    a foundation, and the adaptation is small compared to what it rests on.
flow:
  scenario: >-
    One expensive training run, and a dozen products that are all the same
    model underneath.
  path:
    - node: pretraining
      does: >-
        the run that costs almost all of the money
    - node: foundation-model
      does: >-
        what comes out: general, and not yet aimed at anything
      self: true
    - node: large-language-model
      does: >-
        the kind of it this guide is mostly about
    - node: model
      does: >-
        the artifact, before anyone has decided what it is for
  returns: >-
    Adapted many times, trained once
relations:
  - type: kind-of
    target: model
    note: A model general enough to be adapted, rather than one trained for a task.
  - type: distinguished-from
    target: large-language-model
    note: >-
      Overlapping, not identical. An image or audio model can be a foundation
      model; a small task-specific language model is an LLM by nobody's
      definition but is not a foundation for anything.
examples:
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: >-
      One of the three models the Stanford report named as examples of the
      category.
    verifiedOn: 2026-08-22
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: >-
      Published as a base model with open weights, explicitly as something to
      fine-tune from.
    verifiedOn: 2026-08-22
sources:
  - id: crfm-report
    url: https://arxiv.org/abs/2108.07258
    title: On the Opportunities and Risks of Foundation Models — Bommasani et al.
    verifiedOn: 2026-08-22
    quote: >-
      We call these models foundation models to underscore their critically central yet incomplete character.
    note: >-
      Submitted 16 August 2021 by the Stanford Center for Research on
      Foundation Models. Coins the term.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: crfm-site
    url: https://crfm.stanford.edu/
    title: Stanford Center for Research on Foundation Models
    verifiedOn: 2026-08-22
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
---

The term was coined deliberately, and the report that coined it says so: models
"trained on broad data at scale and are adaptable to a wide range of downstream
tasks … We call these models foundation models to underscore their critically
central yet incomplete character."[[cite:crfm-report]] The word was chosen to
carry both halves — central, and incomplete.

Google's glossary gives the working definition: "a very large [pre-trained
model](pretrained-model) trained on an enormous and diverse training set", able
to "respond well to a wide range of requests" and to "serve as a base model for
additional fine-tuning or other customization."[[cite:google-glossary]]

## Why the category needed a name

Before it, the field described models by task — a translation model, a
classifier, a summariser. The models the report was describing had no task. They
were trained on undifferentiated text and turned out to be usable for work
nobody trained them for, which the GPT-3 paper had demonstrated the year
before.[[cite:gpt3-paper]]

That is a genuinely different kind of artefact, and calling it "a [language
model](large-language-model)" undersold what had changed.

## Homogenisation: the argument the name was making

The report is not a product announcement. Its central warning is that
"homogenization provides powerful leverage but demands caution, as the defects of
the foundation model are inherited by all the adapted models
downstream."[[cite:crfm-report]]

When a hundred applications sit on one base [model](model), they share its
blind spots, its biases and its failure modes. A flaw fixed in one application
is still present in the other ninety-nine, and a flaw in the base is present in
all hundred at once. Concentration is the point of the design and the risk of it
in equal measure — which is why the report's title puts opportunities and risks
side by side.[[cite:crfm-site]]

## Base model versus the thing you actually use

A raw foundation model continues text; it does not answer questions, follow
instructions or decline requests. Those behaviours come from [post-training](post-training). The
model a product exposes has usually been instruction-tuned on top of the
foundation, which is why open-weight releases often ship in pairs — a base
version to build on, and an instruct version to use.
