---
title: Tokenizer
kind: concept
aka:
  - subword segmenter
  - encoder
canonical:
  status: de-facto
  term: Tokenizer
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [artifact]
zoom: 2
summary: The program that turns raw input into the tokens a model can read, and
  the tokens back into text afterwards. It ships with the model and is not
  interchangeable.
fieldMark: It lives next to the weights as its own file — `tokenizer.json` or a
  vocabulary and merges pair. If a downloaded model produces gibberish, a
  mismatched tokenizer is the first thing to check.
useCase:
  scenario: >-
    You need to know whether a 40-page contract will fit in a model's [context
    window](context-window) before you pay to find out.
  detail: >-
    Run the model's own tokenizer over the document locally. It is a small,
    fast, dependency-light piece of software published alongside the weights,
    and it gives the exact number the API will charge for. Estimating from word
    or character counts instead is where budgeting for long-document work
    usually goes wrong, because the ratio is not constant across formats.
flow:
  scenario: >-
    A word count and a token count that disagree by 40%, on the same
    paragraph, in two different languages.
  path:
    - actor: Raw text
      where: a person, not a system
      does: >-
        characters, as typed
    - node: tokenizer
      where: inside one model call
      does: >-
        splits it into the fragments this model was trained on
      self: true
    - node: token
      where: inside one model call
      does: >-
        the units that go in, and come back out
    - node: model
      where: inside one model call
      does: >-
        which has never seen a character in its life
  returns: >-
    Different tokenizer, different count, same text
relations:
  - type: part-of
    target: model
    note: >-
      Trained with the weights and distributed with them. Swapping it for
      another model's tokenizer produces fluent nonsense, not an error.
  - type: distinguished-from
    target: token
    note: The tokenizer is the program; a token is what comes out of it.
examples:
  - name: SentencePiece
    vendor: Google
    url: https://arxiv.org/abs/1808.06226
    note: >-
      Trains subword models directly from raw sentences, so the same tokenizer
      works across languages with no word boundaries.
    verifiedOn: 2026-08-22
  - name: Hugging Face Tokenizers
    vendor: Hugging Face
    url: https://huggingface.co/docs/tokenizers/index
    verifiedOn: 2026-08-22
  - name: tiktoken
    vendor: OpenAI
    url: https://pypi.org/project/tiktoken/
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
    quote: >-
      A system or algorithm that translates a sequence of input data into tokens.
  - id: sentencepiece
    url: https://arxiv.org/abs/1808.06226
    title: >-
      SentencePiece: A simple and language independent subword tokenizer and
      detokenizer for Neural Text Processing — Kudo and Richardson
    verifiedOn: 2026-08-22
    note: Submitted 19 August 2018.
  - id: bpe-paper
    url: https://arxiv.org/abs/1508.07909
    title: Neural Machine Translation of Rare Words with Subword Units — Sennrich, Haddow and Birch
    verifiedOn: 2026-08-22
  - id: hf-tokenizers
    url: https://huggingface.co/docs/tokenizers/index
    title: Tokenizers — Hugging Face documentation
    verifiedOn: 2026-08-22
  - id: tiktoken
    url: https://pypi.org/project/tiktoken/
    title: tiktoken — Python Package Index
    verifiedOn: 2026-08-22
---

A tokenizer is "a system or algorithm that translates a sequence of input data
into [tokens](token)."[[cite:google-glossary]] It is the only part of a
[model](model) that is a piece of ordinary software rather than a pile of
learned numbers — and consequently the only part you can inspect, run and
reason about exactly.

## It is trained, not written

The vocabulary is fitted to a corpus: the [segmentation](chunking) algorithm learns which
character sequences occur often enough to deserve their own entry. The 2015
subword-units work established the approach that most current tokenizers
descend from.[[cite:bpe-paper]] SentencePiece went further and trained directly
on raw sentences, which made the same method work for languages that do not
separate words with spaces.[[cite:sentencepiece]]

This is why a tokenizer belongs to *one* model. Its vocabulary and the model's
input layer were fitted together; token 1042 means whatever the weights learned
it means.

## Multimodal input runs through it too

Google's glossary notes that a tokenizer for a multimodal system "must translate
each input type into the appropriate format" — text into subwords, images into
small patches — and then convert all of them into "a single unified embedding
space."[[cite:google-glossary]] The uniform token stream is what lets one
architecture accept pictures and prose through the same door.

## Why it explains odd model behaviour

Several persistent complaints are tokenizer artefacts rather than reasoning
failures:

- **Counting letters in a word.** The model never saw the letters; it saw two or
  three fragments.
- **Arithmetic on long numbers.** Digit grouping depends on how the number
  happened to segment.
- **Cost differences between languages.** A script under-represented in the
  training corpus fragments more finely, so the same meaning costs more tokens.
