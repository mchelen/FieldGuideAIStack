---
title: Model Host
aka: [inference provider, model serving platform, model gateway]
canonical:
  status: none
  note: >-
    No settled term. AWS describes Bedrock as "a fully managed service" and
    others say inference provider, model gateway or serving platform. The role
    is distinct from the model provider and worth naming, whatever the name.
tags: [core, org, infrastructure]
zoom: 1
summary: A service that runs someone else's model on its own hardware and sells
  you access to it, usually under its own API, billing, and identity system.
fieldMark: A host offers models from several different providers side by side
  behind one endpoint. If the catalogue spans competing labs, you are looking at
  a host.
useCase:
  scenario: >-
    Your organisation already buys cloud from one vendor and wants models
    through the same contract.
  detail: >-
    A host serves several providers' models behind one API, one bill and one
    identity system, which is real operational value and the main reason hosts
    exist. What it changes is that the party who can alter terms, regions or
    availability is now further from the model than it appears — and the
    [latency](latency) you measure is a property of that deployment rather than of the
    model.
flow:
  scenario: >-
    The same open-weights model bought from two vendors, with different
    latency, different terms, and the same weights.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        buy the same open model from two vendors
    - node: model-provider
      where: a training cluster
      does: >-
        trained the weights and licensed them for others to run
    - node: model-host
      where: the host's own hardware
      does: >-
        runs them on its own hardware, under its own contract
      self: true
    - node: accelerator
      where: the host's own hardware
      does: >-
        the GPUs that deployment actually sits on
    - node: inference-api
      where: the provider's servers
      does: >-
        what you call — the host's endpoint, not the provider's
  returns: >-
    Latency and availability are properties of the deployment
relations:
  - type: hosts
    target: model
  - type: implements
    target: inference-api
examples:
  - name: Amazon Bedrock
    vendor: AWS
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
    note: >-
      Fully managed service providing access to 100+ foundation models from
      providers including Amazon, Anthropic, DeepSeek, Moonshot AI, MiniMax,
      OpenAI, and xAI, integrated with AWS billing and IAM.
    verifiedOn: 2026-08-22
sources:
  - id: aws-what-is
    url: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
    title: What is Amazon Bedrock? — AWS documentation
    verifiedOn: 2026-08-22
  - id: anthropic-claude-api
    url: https://platform.claude.com/docs/en/api/overview
    title: Claude API overview — Anthropic (cloud platform comparison)
    verifiedOn: 2026-08-22
---

A host answers a different question than a [provider](model-provider): not
*who made this model*, but *whose machines is it running on and who bills me*.

The catalogue is the giveaway. Amazon Bedrock's documented model list spans
Amazon, Anthropic, DeepSeek, Moonshot AI, MiniMax, OpenAI, and xAI — companies
that compete with each other. No provider serves a rival's weights; a host
serves everyone's.

## What you actually get from a host

- **One endpoint, many models** — swap `modelId` rather than rewriting a client.
- **Their IAM and billing** — the reason enterprises route through a host at all.
- **Their regions and data policy** — often the compliance-deciding factor.
- **Their API shape** — Bedrock, for instance, documents several request
  formats against `bedrock-runtime`, including provider-native ones.

## The catch

Feature parity lags. Anthropic's own documentation distinguishes
*Anthropic-operated* platforms from *partner-operated* ones and notes that
feature availability and timing vary by platform, with different request size
limits per route. A model being "available on" a host does not mean every
capability came with it — which is exactly the kind of claim this guide asks you
to check against a dated source rather than assume.

## Where the line blurs

Some organizations are both. A provider serving its own weights is acting as
provider *and* host. The terms describe roles, not companies.
