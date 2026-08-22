---
title: Token
kind: concept
aka:
  - subword
  - piece
canonical:
  status: de-facto
  term: Token
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
  note: >-
    No standards body defines it. Every major vendor and framework uses the same
    word for the same thing, which is as settled as this vocabulary gets.
tags: [core, artifact]
zoom: 1
summary: The atomic unit a model reads and emits — usually a word fragment
  rather than a word, and the unit every limit and every bill is counted in.
fieldMark: If a number in a product page has no unit — 200K, 1M, $3 per million
  — it is almost certainly tokens. Tokens are the currency of the whole stack.
useCase:
  scenario: >-
    A support tool works fine in English and starts truncating conversations
    when it launches in Japanese, with no code change in between.
  detail: >-
    Tokenizers are fitted to their training data, and text in a
    less-represented script fragments into more pieces per character. The same
    sentence can cost two or three times as many tokens in one language as in
    another, so a budget set in characters — or in "messages" — silently means
    something different per locale. Counting in the unit the model actually
    charges in is the fix.
relations:
  - type: consumed-by
    target: model
    note: The model's entire input and output are sequences of these.
  - type: part-of
    target: context-window
    note: The window is a token count, which is why it moves with language and format.
examples:
  - name: tiktoken
    vendor: OpenAI
    url: https://pypi.org/project/tiktoken/
    note: The tokenizer used by OpenAI's models, published as a Python package.
    verifiedOn: 2026-08-22
  - name: Hugging Face Tokenizers
    vendor: Hugging Face
    url: https://huggingface.co/docs/tokenizers/index
    note: The library most open-weight models ship their tokenizer for.
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: bpe-paper
    url: https://arxiv.org/abs/1508.07909
    title: Neural Machine Translation of Rare Words with Subword Units — Sennrich, Haddow and Birch
    verifiedOn: 2026-08-22
    note: >-
      Submitted 31 August 2015. The paper that put byte-pair encoding into
      neural language modelling; most tokenizers in use today are descendants.
  - id: hf-tokenizers
    url: https://huggingface.co/docs/tokenizers/index
    title: Tokenizers — Hugging Face documentation
    verifiedOn: 2026-08-22
  - id: tiktoken
    url: https://pypi.org/project/tiktoken/
    title: tiktoken — Python Package Index
    verifiedOn: 2026-08-22
---

A token is, in Google's phrasing, "the atomic unit that the model is training on
and making predictions on."[[cite:google-glossary]] Everything a
[model](model) does happens one token at a time.

The word is doing less work than it looks. A token is not a word. Google's
glossary gives the example directly: a model using subwords "might view the word
'dogs' as two tokens (the root word 'dog' and the plural suffix
's')."[[cite:google-glossary]] Punctuation, spaces and line breaks are tokens
too.

## Why fragments rather than words

A fixed vocabulary of whole words cannot cover an open-ended language — every
name, typo and neologism falls outside it. The 2015 subword-units paper solved
this by encoding rare and unknown words as sequences of smaller pieces, making
"open-vocabulary translation" possible with a vocabulary of fixed
size.[[cite:bpe-paper]] That trade — a vocabulary of tens of thousands of
fragments instead of millions of words — is why modern models can spell a word
they have never seen.

## Where you meet tokens in practice

- **Limits.** The [context window](context-window) is measured in them.
- **Price.** Inference is billed per million input and output tokens.
- **Latency.** Output tokens are produced serially, so a long answer takes
  proportionally longer than a short one regardless of how hard the question was.
- **Failure.** Truncation, mid-word cut-offs and "maximum length exceeded" are
  all token-boundary events.

## The counting trap

Because the mapping from text to tokens is learned rather than defined, no rule
of thumb survives contact with real input. Code, JSON, non-Latin scripts and
long identifiers all tokenize worse than English prose. The only reliable count
comes from running the model's own [tokenizer](tokenizer) over the actual text,
which is why vendors publish theirs.[[cite:hf-tokenizers]]
