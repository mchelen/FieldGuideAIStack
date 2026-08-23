---
title: Connector
kind: concept
canonical:
  status: contested
  note: >-
    No standards body defines the word. Each vendor uses its own, and one has
    changed it: what Anthropic and Google both call a connection to an outside
    service, OpenAI renamed from "connectors" to "apps" in December 2025. The
    standardised part is the mechanism underneath, not the label — the Model
    Context Protocol specifies how a client and a server exchange tools and
    data, and Anthropic's connectors are documented as built on it.
  url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
  title: Model Context Protocol — Architecture overview
  verifiedOn: 2026-08-22
aka:
  - integration
  - plugin
  - term: Connectors
    usedBy: Anthropic (Claude)
    url: https://claude.com/docs/connectors/overview
    verifiedOn: 2026-08-22
    note: Documented as powered by MCP, with prebuilt integrations and a Connectors Directory.
  - term: Connected Apps
    usedBy: Google (Gemini)
    url: https://support.google.com/gemini/answer/13695044
    verifiedOn: 2026-08-22
    note: Google also uses "Workspace apps" for its own services and "integrations" for third-party ones in the Workspace side panel.
  - term: Apps
    usedBy: OpenAI (ChatGPT)
    url: https://help.openai.com/en/articles/11487775-connectors-in-chatgpt
    verifiedOn: 2026-08-22
    note: Renamed from "connectors" in December 2025. The help article's URL slug still reads connectors-in-chatgpt.
tags: [capability, interface, product-anatomy]
zoom: 2
summary: A packaged link between an assistant and an outside service, so it can
  read from and act in tools you already use.
fieldMark: Connectors are configured per account and listed in a settings panel.
  If you had to authorise it once and it now "just works", it is a connector.
useCase:
  scenario: >-
    You ask an assistant "what did the team decide about the pricing change?"
    and it answers from the actual thread, rather than asking you to paste it.
  detail: >-
    Answering needs the assistant to search your mail, open the right thread and
    read it. A connector is what makes those three actions exist as callable
    tools, already authenticated against your account, so the model can ask for
    them by name. Without one, the same question requires you to find the thread
    and paste it in — which is the difference between an assistant that reaches
    your work and one you feed.
relations:
  - type: implemented-by
    target: mcp
    note: MCP is the open protocol several vendors' connectors are built on.
  - type: consumed-by
    target: harness
examples:
  - name: Gmail
    vendor: Available across Anthropic, OpenAI and Google
    url: https://claude.com/docs/connectors/overview
    note: >-
      Listed among Anthropic's first-party prebuilt integrations alongside
      Google Drive, Google Calendar, GitHub, Slack and Microsoft 365. Google
      lists Gmail among Gemini's Connected Apps.
    verifiedOn: 2026-08-22
  - name: GitHub
    vendor: Available across Anthropic and OpenAI
    url: https://claude.com/docs/connectors/overview
    note: >-
      One of Anthropic's prebuilt integrations. The archetypal read-and-act
      connector: search code, read files, open issues.
    verifiedOn: 2026-08-22
  - name: Connectors Directory
    vendor: Anthropic
    url: https://claude.com/docs/connectors/overview
    note: >-
      An open catalog of MCP servers from Anthropic and third parties, carrying
      verification labels that distinguish vendor-checked connectors from
      community ones.
    verifiedOn: 2026-08-22
sources:
  - id: anthropic-connectors-overview
    url: https://claude.com/docs/connectors/overview
    title: Connectors overview — Anthropic
    verifiedOn: 2026-08-22
  - id: google-use-manage
    url: https://support.google.com/gemini/answer/13695044
    title: Use & manage Connected Apps in Gemini — Google
    verifiedOn: 2026-08-22
  - id: openai-apps-in
    url: https://help.openai.com/en/articles/11487775-connectors-in-chatgpt
    title: Apps in ChatGPT — OpenAI Help Center
    verifiedOn: 2026-08-22
    note: >-
      Not read directly. help.openai.com returns HTTP 403 to automated clients
      including a browser user-agent, so the rename from "connectors" to "apps"
      is taken from the search index summary of this page rather than from the
      page itself. Worth a human confirming.
  - id: mcp-model-context
    url: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
    title: Model Context Protocol — Architecture overview
    verifiedOn: 2026-08-22
  - id: openai-chatgpt-work
    url: https://learn.chatgpt.com/docs/enterprise/chatgpt-work-overview
    title: ChatGPT Work overview — OpenAI
    verifiedOn: 2026-08-22
  - id: google-gemini-app
    url: https://gemini.google/overview/
    title: Gemini app overview — Google
    verifiedOn: 2026-08-22
---

A connector is the product-level packaging of [tool use](tool-use). The model
still just asks to call a function; the connector is what makes that function
exist, authenticated, without you writing code.

Cowork's documentation describes connecting Claude to tools and data sources
"using MCP", alongside skills and plugins, managed from a Customize panel and
synced from your account at session start.[[cite:anthropic-connectors-overview]] [ChatGPT Work](chatgpt-work) describes connected
apps under admin-controlled permissions.[[cite:openai-chatgpt-work]] Gemini describes extensions into
Workspace, Maps, YouTube and others.[[cite:google-gemini-app]]

The same shape, three vocabularies.

## Why the scoping detail matters

Connectors are attached to an *account*, not to a machine, and the boundary is
sharper than it looks. Anthropic's documentation notes that Cowork loads the
connectors, skills and plugins enabled for your claude.ai account and
deliberately does **not** read the [Claude Code](claude-code) CLI's `~/.claude` directory —
so a skill that exists only on your machine is invisible to Cowork until you
add it in Customize.[[cite:anthropic-connectors-overview]]

Two products from one vendor, sharing an engine, with different extension
scopes. That is exactly the kind of detail a spec sheet flattens and a field
guide should not.
