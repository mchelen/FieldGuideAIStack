---
title: Model Host
aka: [inference provider, model serving platform, model gateway]
tags: [core, org, infrastructure]
zoom: 1
summary: A service that runs someone else's model on its own hardware and sells
  you access to it, usually under its own API, billing, and identity system.
fieldMark: A host offers models from several different providers side by side
  behind one endpoint. If the catalogue spans competing labs, you are looking at
  a host.
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
  - url: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
    title: What is Amazon Bedrock? — AWS documentation
    verifiedOn: 2026-08-22
  - url: https://platform.claude.com/docs/en/api/overview
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
