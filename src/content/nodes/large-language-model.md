---
title: Large language model
kind: concept
aka:
  - LLM
  - language model
canonical:
  status: de-facto
  term: Large language model
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    Universally used and nowhere defined precisely. Google's own entry concedes
    the vagueness — "at a minimum" a language model with very many parameters,
    "more informally" any transformer-based one. There is no threshold.
tags: [core, artifact]
zoom: 1
summary: A language model with a very large parameter count — in practice, the
  kind of model this whole guide is about, and the term the public uses for it.
fieldMark: The word "large" has no threshold behind it and never did. Treat LLM
  as a category label, not a spec, and look at the parameter count if you need
  a number.
useCase:
  scenario: >-
    Someone asks whether your product "uses an LLM" and expects that to settle
    what it can do.
  detail: >-
    It does not settle anything. The term covers a 7-billion-parameter model
    running on a laptop and a frontier model behind a metered API, which differ
    in cost by orders of magnitude and in capability by more than that. What
    determines the answer is which model, at what context length, driven by
    what harness — three questions the acronym hides.
relations:
  - type: kind-of
    target: model
    note: A model whose input and output are language, at scale.
  - type: consumes
    target: transformer
    note: >-
      Google's informal definition is circular with the architecture: in
      practice, LLM means a transformer-based language model.
examples:
  - name: GPT-3
    vendor: OpenAI
    url: https://arxiv.org/abs/2005.14165
    note: 175 billion parameters; the model that made the category public.
    verifiedOn: 2026-08-22
  - name: Mistral 7B
    vendor: Mistral AI
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    note: >-
      Its own model card calls it a "Large Language Model" at 7 billion
      parameters — twenty-five times smaller than GPT-3 and the same category.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      At a minimum, a language model having a very high number of parameters.
  - id: hf-mistral
    url: https://huggingface.co/mistralai/Mistral-7B-v0.1
    title: mistralai/Mistral-7B-v0.1 — Hugging Face
    verifiedOn: 2026-08-22
  - id: gpt3-paper
    url: https://arxiv.org/abs/2005.14165
    title: Language Models are Few-Shot Learners — Brown et al.
    verifiedOn: 2026-08-22
    quote: >-
      Here we show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches.
  - id: wikipedia-llm
    url: https://en.wikipedia.org/wiki/Large_language_model
    title: Large language model — Wikipedia
    verifiedOn: 2026-08-22
    quote: >-
      Training [ edit ] See also: Fine-tuning (machine learning) and Post-training of large language models An LLM is a type of foundation model (large X model) trained on language.
---

Google's glossary is refreshingly candid about how loose this term is: "at a
minimum, a language model having a very high number of
[parameters](parameter)", and "more informally, any
[Transformer](transformer)-based language model, such as Gemini or
GPT."[[cite:google-glossary]] Two definitions, neither with a number in it.

## Why there is no threshold, and why that is fine

Any line drawn in parameters would have moved several times since 2020. GPT-3's
175 billion was extraordinary at the time.[[cite:gpt3-paper]] Mistral 7B calls
itself a large language model at one twenty-fifth of that
size,[[cite:hf-mistral]] and is not wrong to — it does the same kind of thing.

"Large" is doing sociological work rather than quantitative work: it separates
models trained on broad corpora to do open-ended language tasks from the small
task-specific classifiers that preceded them. Once you know what class of thing
is meant, the count tells you the rest.

## What it does, exactly

It predicts the next [token](token) given the tokens so far. Repeatedly. That is
the whole mechanism, and everything else — answering questions, writing code,
refusing a request — is that mechanism under a prompt and a round of
post-training.

Keeping this in view explains most of the surprising behaviour. A model that
[hallucinates](hallucination) is not malfunctioning; it is doing exactly what it
does, with no separate faculty for checking whether the plausible continuation
happens to be true.

## LLM, chatbot, and assistant are three different things

The [model](model) predicts tokens. A chat product adds a [harness](harness)
that keeps conversation state, renders markdown, and calls tools. An assistant
adds a [system prompt](system-prompt), a persona and a policy. All three get
called "an LLM" in casual use, which is where most confusion about what these
systems can do begins.[[cite:wikipedia-llm]]