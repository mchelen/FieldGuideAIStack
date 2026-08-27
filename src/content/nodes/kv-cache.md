---
title: KV cache
kind: concept
aka:
  - key-value cache
  - attention cache
canonical:
  status: de-facto
  term: KV cache
  body: Kwon et al., "Efficient Memory Management for [Large Language Model](large-language-model) Serving with PagedAttention" (2023), and universal in serving practice
  url: https://arxiv.org/abs/2309.06180
  title: Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al.
  verifiedOn: 2026-08-22
tags: [runtime, structure]
zoom: 3
summary: The saved attention state for every token already processed, which is
  what makes generating the next token cheap — and what fills the accelerator's
  memory.
fieldMark: The KV cache, not the weights, is usually what limits how many
  requests a deployment can serve at once. It grows with every token of every
  live conversation.
useCase:
  scenario: >-
    A self-hosted deployment runs comfortably on short prompts and starts
    refusing requests when users paste long documents.
  detail: >-
    The weights did not change size; the cache did. Each concurrent request
    holds attention state proportional to its token count, and long prompts
    consume it many times faster. Capacity planning for model serving is mostly
    cache planning, and the number to compute is not how big the model is but
    how many tokens will be live at once.
flow:
  scenario: >-
    Generating the two-thousandth token of a reply without redoing the work
    for the previous 1,999.
  path:
    - node: attention
      does: >-
        relates every position to every other, which is quadratic
    - node: kv-cache
      does: >-
        keeps the state for positions already processed
      self: true
    - node: accelerator
      does: >-
        it lives in GPU memory, competing with the weights for room
    - node: prompt-caching
      does: >-
        and surviving past the end of a request is what that feature is
  returns: >-
    Per request, and it grows with every token generated
relations:
  - type: part-of
    target: attention
    note: Stores the keys and values attention has already computed, so they are not recomputed.
  - type: consumes
    target: accelerator
    note: It lives in [accelerator](accelerator) memory alongside the weights, and competes with them for it.
examples:
  - name: PagedAttention and vLLM
    url: https://arxiv.org/abs/2309.06180
    note: >-
      Applies operating-system paging to the cache, achieving "near-zero waste
      in KV cache memory" and 2–4× the throughput at the same latency.
    verifiedOn: 2026-08-22
sources:
  - id: vllm-paper
    url: https://arxiv.org/abs/2309.06180
    title: Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al.
    verifiedOn: 2026-08-22
    quote: >-
      However, existing systems struggle because the key-value cache (KV cache) memory for each request is huge and grows and shrinks dynamically.
    note: Submitted 12 September 2023. Introduces PagedAttention and vLLM.
  - id: anthropic-caching
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    title: Prompt caching — Claude Platform documentation
    verifiedOn: 2026-08-22
    note: >-
      States that "KV (key-value) cache representations and cryptographic
      hashes of cached content are held in memory only and are not stored at
      rest."
---

[Attention](attention) relates every position to every other. Generating token
*n+1* would therefore mean recomputing the attention state for all *n* tokens
that came before — every time, for every new token.

The KV cache is the obvious optimisation and an essential one: keep the keys and
values already computed, and each new token only has to compute its own. It
turns generation from quadratic work per token into linear.

## Why it is the binding constraint on serving

Because it is not free. The vLLM paper describes the problem it creates: the
cache "for each request is huge and grows and shrinks dynamically", and when
managed inefficiently "can be significantly wasted by fragmentation and
redundant duplication, limiting the batch size."[[cite:vllm-paper]]

Two properties make it awkward in a way model weights are not. It is
**per-request**, so ten concurrent conversations need ten caches. And it is
**unpredictable**, since nobody knows in advance how long a response will run.

Weights are a fixed cost paid once at load. The cache is a variable cost that
scales with live traffic, and it is what actually runs out.

## PagedAttention, and why an operating-systems idea fixed it

The insight was that this is a virtual-memory problem. PagedAttention is "an
attention algorithm inspired by the classical virtual memory and paging
techniques in operating systems", and the system built on it achieves
"near-zero waste in KV cache memory" plus "flexible sharing of KV cache within
and across requests."[[cite:vllm-paper]]

The reported result — "2-4× [improvement in] the throughput of popular LLMs …
with the same level of latency"[[cite:vllm-paper]] — came from allocating memory
better, with the model untouched.

## The cache you are billed for

[Prompt caching](prompt-caching) is this cache, kept between requests rather
than within one. Anthropic's documentation is explicit about what is retained:
"KV (key-value) cache representations and cryptographic hashes of cached content
are held in memory only and are not stored at
rest."[[cite:anthropic-caching]]

Same mechanism, sold as a feature — because the expensive part of a repeated
prompt is exactly the state this holds.
