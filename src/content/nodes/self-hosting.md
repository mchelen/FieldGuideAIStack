---
title: Self-hosting
kind: concept
aka:
  - on-premises inference
  - running your own model
canonical:
  status: none
  note: >-
    No surveyed glossary carries it for models; the term is borrowed from
    general software hosting and used without modification. What is specific
    here is that the artifact being hosted is a set of weights whose licence
    may restrict what you do with it.
tags: [serving, infrastructure]
zoom: 2
summary: Running the model on infrastructure you control — the alternative to
  calling somebody's inference API, and a hardware decision before a software
  one.
fieldMark: Ask what the workload actually needs. Self-hosting wins on privacy,
  [latency](latency) floor and unit cost at high steady volume, and loses on almost
  everything else at low or spiky volume.
useCase:
  scenario: >-
    A regulated workload cannot send text to a third party under any
    arrangement.
  detail: >-
    That single constraint settles the question, and everything else becomes an
    engineering problem: which model fits the hardware, how much memory the KV
    cache needs at expected concurrency, who is on call. This is the honest
    shape of most self-hosting decisions — a requirement that removes the hosted
    option, rather than a cost comparison that favours running it yourself.
flow:
  scenario: >-
    Running the weights yourself, on hardware you control, and taking on
    everything a host was doing for you.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        decide to run the weights yourself
    - node: model-host
      where: the host's own hardware
      does: >-
        the alternative — someone else's hardware and contract
    - node: self-hosting
      where: your machine
      does: >-
        your infrastructure, your operations, your capacity planning
      self: true
    - node: accelerator
      where: your machine
      does: >-
        which you now have to size, buy and keep busy
    - node: on-device-inference
      where: your machine
      does: >-
        the same argument, at the scale of one device
  returns: >-
    Wins on privacy and steady-volume cost, loses on nearly everything else
relations:
  - type: distinguished-from
    target: model-host
    note: >-
      The same job, done by you. A [model host](model-host) rents you capacity; self-hosting
      means you own the capacity and the operations.
  - type: consumes
    target: accelerator
    note: >-
      The binding constraint, and the reason this is a hardware decision before
      it is a software one.
examples:
  - name: vLLM
    url: https://docs.vllm.ai/en/latest/
    note: >-
      "A fast and easy-to-use library for LLM inference and serving", developed
      at UC Berkeley and now maintained by a broad open-source community.
    verifiedOn: 2026-08-22
sources:
  - id: vllm-docs
    url: https://docs.vllm.ai/en/latest/
    title: vLLM documentation
    verifiedOn: 2026-08-22
  - id: vllm-paper
    url: https://arxiv.org/abs/2309.06180
    title: Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al.
    verifiedOn: 2026-08-22
---

Self-hosting means the [weights](open-weights) run on hardware you control. The
software to do it is mature and free — vLLM describes itself as "a fast and
easy-to-use library for LLM inference and serving", maintained by "many dozens
of academic institutions and companies from over 2000
contributors."[[cite:vllm-docs]]

The software is not the hard part. The hardware is.

## What decides feasibility

**Memory capacity** first, because it is pass or fail: the
[parameters](parameter) must fit, and so must the
[KV cache](kv-cache) for every concurrent request — which the vLLM paper
identifies as the thing that actually limits batch size, being "huge" and
growing "dynamically."[[cite:vllm-paper]]

**Memory bandwidth** second, because it sets
[throughput](throughput) per request.

[Quantization](quantization) is what moves a model from the second category into
the first, and it is why local hosting is accessible to people without
server-grade equipment at all.

## The honest case for it

- **Data never leaves.** The only argument that is decisive rather than
  comparative, and the reason most real self-hosting projects exist.
- **No dependency on a vendor** being reachable, in business, or willing to
  keep serving the version you tested against.
- **Version stability.** A hosted model can change under you; a
  [checkpoint](checkpoint) on your disk cannot.
- **Unit cost at high steady volume**, where a rented [accelerator](accelerator) is busy rather
  than idle.

## The honest case against

Utilisation. A hosted [inference API](inference-api) charges per
[token](token) and costs nothing when idle; an accelerator you own costs the
same whether or not anyone is using it. Spiky or low volume therefore favours
renting by a wide margin, and the crossover is further out than most estimates
assume.

Then there is everything that is not the model: capacity planning, upgrades,
monitoring, someone on call. Serving is a production system, and the comparison
that only counts hardware against per-[token pricing](token-pricing) is not
comparing the same things.

## What it does not buy

Freedom from the licence. A [community licence](community-license) applies to
weights you host yourself exactly as it does anywhere else — including the
[acceptable use policy](acceptable-use-policy) it incorporates by reference.
Self-hosting changes who operates the model, not what you are permitted to do
with it.
