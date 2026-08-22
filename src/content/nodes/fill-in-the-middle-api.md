---
title: Fill-in-the-middle API
kind: concept
aka:
  - infill endpoint
  - completion API
canonical:
  status: none
  note: >-
    No standard and no common shape. Some models expose it through special
    tokens in an ordinary completion call, others through a dedicated endpoint
    with prefix and suffix fields. The capability is settled; the interface is
    per-vendor and not portable.
tags: [interfaces, capability]
zoom: 3
summary: An endpoint shaped for completion inside existing text rather than
  after it — the API surface behind inline code completion.
fieldMark: A chat endpoint cannot do this properly. If a product offers inline
  completion, it is either using a fill-in-the-middle interface or pasting the
  surrounding code into a prompt and hoping.
useCase:
  scenario: >-
    An editor plugin needs a completion at the cursor that respects the fifty
    lines below it.
  detail: >-
    A chat request can describe the situation in prose — "here is the code
    before, here is the code after, write the middle" — and works less well than
    an interface built for it, because the model was trained on a specific
    arrangement of prefix, suffix and middle. Using the shape the model was
    trained on is the difference between a completion that fits and one that
    plausibly could have.
relations:
  - type: implements
    target: fill-in-the-middle
    note: The API surface for the capability the training transformation created.
  - type: part-of
    target: inference-api
    note: A separate endpoint or a distinct call shape, not a chat completion.
examples:
  - name: Code Llama infilling
    vendor: Hugging Face
    url: https://huggingface.co/docs/transformers/en/model_doc/code_llama
    note: >-
      A `<FILL_ME>` marker inside an ordinary prompt; the tokenizer handles
      prefix and suffix encoding.
    verifiedOn: 2026-08-22
sources:
  - id: hf-codellama
    url: https://huggingface.co/docs/transformers/en/model_doc/code_llama
    title: Code Llama — Hugging Face Transformers documentation
    verifiedOn: 2026-08-22
  - id: fim-paper
    url: https://arxiv.org/abs/2207.14255
    title: Efficient Training of Language Models to Fill in the Middle — Bavarian et al.
    verifiedOn: 2026-08-22
---

[Fill in the middle](fill-in-the-middle) is a training transformation. This page
is about the other half: how a caller asks for it.

There is no standard, which is why the term is recorded with no canonical form.
Two shapes are common.

## Special tokens in an ordinary call

The model's vocabulary carries markers for prefix, suffix and middle, and the
caller assembles them. Code Llama's interface is the readable version of this: a
`<FILL_ME>` marker placed in the prompt where the completion should go, with the
[tokenizer](tokenizer) handling the encoding.[[cite:hf-codellama]]

The documentation notes a detail that shows how specific this is: "the BOS
character is not used for infilling when encoding the prefix or suffix, but only
at the beginning of each prompt."[[cite:hf-codellama]] Get that wrong and the
output degrades quietly rather than erroring.

## A dedicated endpoint

Other vendors expose prefix and suffix as separate request fields, which is
cleaner to call and equally non-portable — the field names, the ordering and the
token handling differ per provider.

## Why a chat endpoint is not a substitute

You can describe the situation in prose. The model will produce something. But
it was trained on the specific arrangement the transformation
created — "moves a span of text from the middle of a document to its
end"[[cite:fim-paper]] — and the trained behaviour is reached by matching that
arrangement, not by explaining it.

The gap shows up as completions that ignore what follows the cursor, which is
exactly the failure fill-in-the-middle training was meant to remove.

## What this costs in practice

Portability. An editor plugin supporting several models carries a per-model
adapter for this, and there is no shim that abstracts it cleanly, because the
differences are in tokenization rather than in JSON field names.

It is one of the clearest places in the guide where a capability is well
understood and the interface to it is not standardised at all.
