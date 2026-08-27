---
title: AI bill of materials
kind: concept
aka:
  - AIBOM
  - ML-BOM
  - AI supply chain inventory
canonical:
  status: standard
  term: AI-BOM
  body: OWASP CycloneDX, which defines SBOM, ML-BOM and AI-BOM formats
  url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
  title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
  verifiedOn: 2026-08-22
  note: >-
    Extends the software bill of materials, which is established practice with
    published formats. The AI variant is newer and the component types it has
    to describe — models, datasets, prompts, tools — are less settled than
    package dependencies.
tags: [safety, orgs]
zoom: 3
summary: An inventory of the models, tools, datasets and servers a system
  depends on — the supply-chain question applied to AI components.
fieldMark: Ask what is in the inventory. A list of Python packages is an SBOM.
  If it does not name the models, the prompts and the [MCP](mcp) servers, it is not
  describing the AI system.
useCase:
  scenario: >-
    A vulnerability is announced in a widely-used MCP server and someone asks
    which of your systems use it.
  detail: >-
    Without an inventory the answer takes a week of grep and interviews, and is
    wrong. This is the same question the software world answered with SBOMs
    after Log4j, applied to a dependency graph that now includes models,
    prompts, tool definitions and third-party servers — none of which appear in
    a package manifest.
relations:
  - type: consumes
    target: provenance
    note: An inventory is only as useful as the evidence behind each entry.
  - type: consumed-by
    target: permission-model
    note: You cannot scope what an agent may reach without knowing what it depends on.
examples:
  - name: OWASP CycloneDX
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    note: >-
      "A globally adopted Bill of Materials standard … through structured SBOM,
      ML-BOM, and AI-BOM formats."
    verifiedOn: 2026-08-22
sources:
  - id: owasp-agentic-top
    url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    title: OWASP Top 10 for Agentic Applications 2026 — OWASP GenAI Security Project
    verifiedOn: 2026-08-22
    note: >-
      Appendix B describes the relationship between the Agentic Top 10 and
      OWASP CycloneDX.
---

"The OWASP CycloneDX project provides a globally adopted Bill of Materials (BOM)
standard that delivers visibility and provenance for software, hardware, and
machine-learning components across the supply chain. It defines how to identify
and exchange component data — including dependencies, versions, and provenance —
through structured SBOM, ML-BOM, and AI-BOM formats."[[cite:owasp-agentic-top]]

The idea is borrowed and the components are new. A package manifest does not
mention which [model](model) a system calls, which
[MCP servers](mcp-server) it connects to, which [skills](skill) it loads, or
what its [system prompt](system-prompt) says.

## The question it answers, and the one it does not

OWASP draws the line usefully: CycloneDX helps answer "what components and tools
are in my AI system?", while the Agentic Top 10 and its scoring framework
address "how can those components and autonomous agents behave, interact, or
fail in unsafe ways?"[[cite:owasp-agentic-top]]

An inventory is static. It tells you what is present and nothing about what it
does at runtime, which is why the two are described as complementary:
"CycloneDX establishes supply-chain transparency and provenance, and the Agentic
AI Top 10 introduces threat awareness, behavioral
assurance."[[cite:owasp-agentic-top]]

## What belongs in one for an [agentic system](agent)

- **Models** — which, what version, from whom, under what licence.
- **Datasets** — for anything fine-tuned, to whatever depth the
  [model card](model-card) discloses.
- **Tools and servers** — every [MCP server](mcp-server), its origin and its
  version.
- **Prompts and skills** — [system prompts](system-prompt) and
  [skills](skill) are executable content that changes behaviour, and they come
  from somewhere.
- **Credentials and scopes** — which [identity](non-human-identity) each
  component acts under.

The last three are the ones conventional tooling misses entirely, and they are
where an agentic supply chain differs from a software one.

## Why prompts count as supply chain

Because a repository can supply them. A [skill](skill) file, a project
instructions file or a tool description arrives with a checkout and changes what
the agent does — which is why [project trust](project-trust) exists, and why an
inventory that stops at packages is describing a different system from the one
running.

## Its limits

An inventory records what a publisher declared. Nothing verifies it, the same
way nothing verifies a [model card](model-card), and
[provenance](provenance) is the harder problem it depends on. Knowing the list
is still worth a great deal on the day a component turns out to be compromised.
