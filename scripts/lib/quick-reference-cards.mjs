/**
 * The quick reference cards, as data.
 *
 * Nothing here is layout. Each card names a `kind` -- one of the body layouts in
 * quick-reference-view.mjs -- and every `id` is a node in src/content/nodes/,
 * checked by the generator, so a renamed page breaks the build rather than
 * quietly leaving a stale term in an image already on someone else's timeline.
 *
 * `slug` is the filename. The first card keeps the bare `quick-reference` name
 * it has always had, because that PNG is the site's Open Graph card and may
 * already be linked from elsewhere.
 *
 * The captions are written for a diagram -- shorter and blunter than the page
 * summaries -- but they must say what the page says. Where a caption is sharper
 * than the summary it is usually lifted from that page's field mark.
 */

/** Card 1 — the layered stack. The one every other card assumes. */
const stack = {
  slug: 'quick-reference',
  kind: 'stack',
  title: 'The AI stack, top to bottom',
  sub: 'One request, and every layer it passes through.',
  bracket: {
    id: 'agent',
    label: 'Agent',
    note: 'a model driven in a loop by a harness, with tools',
    from: 2,
    to: 4,
  },
  loop: { id: 'agentic-loop', label: 'Agentic loop', note: 'repeat until done', from: 4, to: 2 },
  rows: [
    {
      id: 'surface',
      name: 'Surface',
      kicker: 'where you meet it',
      tag: 'one engine, several faces',
      body: 'Terminal, IDE, desktop app, chat window. The front end — not the engine underneath.',
    },
    {
      id: 'harness',
      name: 'Harness',
      kicker: 'the program around the model',
      tag: 'where the product lives',
      body: 'Assembles the context, calls the model, executes the tools the model asks for, and decides what happens next.',
      sub: [
        { id: 'prompt-engineering', t: 'Prompt engineering', d: 'Change behaviour by changing what you send. No training involved.' },
        { id: 'context-engineering', t: 'Context engineering', d: 'What goes in the window, what gets dropped, what gets fetched again.' },
        { id: 'retrieval-augmented-generation', t: 'Retrieval (RAG)', d: 'Fetch the document at question time so the answer rests on it.' },
        { id: 'tool-use', t: 'Tool use', d: 'The model asks for a function. Your code decides whether to run it.' },
        { id: 'approval-mode', t: 'Approval mode', d: 'Which actions need a human before they land.' },
      ],
    },
    {
      id: 'inference-api',
      name: 'Inference API',
      kicker: 'the call itself',
      tag: 'stateless',
      body: 'Stateless HTTP. The whole conversation is re-sent every time, and the server keeps nothing between calls.',
    },
    {
      id: 'model',
      name: 'Model',
      kicker: 'the trained artifact',
      tag: 'a file, not a service',
      body: 'An architecture plus learned weights, mapping input tokens to output token probabilities. No memory, no tools, cannot act.',
      sub: [
        { id: 'token', t: 'Token', d: 'The unit it reads, emits, and is billed in. A word fragment, not a word.' },
        { id: 'context-window', t: 'Context window', d: 'A per-call ceiling on what it can attend to. Not a memory.' },
      ],
    },
  ],
  footer: [
    {
      head: 'Who is involved',
      items: [
        { id: 'model-provider', t: 'Model provider', d: 'Trains it, owns the weights, sets the licence.' },
        { id: 'model-host', t: 'Model host', d: 'Runs someone else’s model and sells access.' },
      ],
    },
    {
      head: 'What goes wrong',
      items: [
        { id: 'hallucination', t: 'Hallucination', d: 'Confident, plausible, wrong — and indistinguishable from correct output, because truth is not a quantity the model computes.' },
      ],
    },
    {
      head: 'How you know',
      items: [
        { id: 'evaluation', t: 'Evaluation', d: 'A repeatable test. The only thing that turns “it seems better” into a claim someone else can check.' },
      ],
    },
  ],
  takeaway:
    'Almost everything people attribute to “the AI” — that it remembers, searches, runs code, asks permission — belongs to the harness, not the model.',
};

/** Card 2 — one pass of the loop. The stack layout, read as time rather than depth. */
const loop = {
  slug: 'quick-reference-agentic-loop',
  kind: 'stack',
  title: 'The agentic loop',
  sub: 'What happens between your message and the answer, however many passes that takes.',
  bracket: { id: 'turn', label: 'One turn', note: 'your message, to the agent finishing', from: 1, to: 4 },
  loop: { id: 'agentic-loop', label: 'Until done', note: 'or the budget runs out', from: 4, to: 1 },
  rows: [
    {
      id: 'context-engineering',
      name: 'Assemble',
      kicker: 'the harness builds the request',
      tag: 'from scratch, every pass',
      body: 'System prompt, conversation so far, every tool definition, anything retrieved — sent whole, because the API kept nothing from last time.',
      sub: [
        { id: 'system-prompt', t: 'System prompt', d: 'Standing instructions the user never sees. Most of what makes two products differ.' },
        { id: 'short-term-memory', t: 'The conversation', d: 'There is nowhere else for it to live. “Remembering” means it is still in the window.' },
      ],
    },
    {
      id: 'model',
      name: 'Propose',
      kicker: 'the model’s only move',
      tag: 'it cannot act',
      body: 'Out comes either an answer or a structured request to run a named function with arguments. Emitting the request is the whole of what the model does.',
      sub: [
        { id: 'tool-use', t: 'Tool use', d: 'Two halves in the transcript: a request from the model, a result from something else.' },
        { id: 'context-window', t: 'Context window', d: 'A ceiling on the request and the reply together. Per call, and it does not refill.' },
      ],
    },
    {
      id: 'permission-model',
      name: 'Check',
      kicker: 'before anything lands',
      tag: 'this is the “autonomous” step',
      body: 'The harness decides whether the action is allowed: silently, by policy, or by asking you. Where that rule lives is what makes it advice or a mechanism.',
      sub: [
        { id: 'approval-mode', t: 'Approval mode', d: 'Which actions need your say-so: all of them, the risky ones, or none.' },
        { id: 'human-in-the-loop', t: 'Human in the loop', d: 'A person in the path. The tenth prompt in a row is approved unread.' },
        { id: 'sandbox', t: 'Sandbox', d: 'Holds even when the prompt and the harness are both talked around.' },
      ],
    },
    {
      id: 'verification-loop',
      name: 'Act, and take the result',
      kicker: 'feedback from outside the model',
      tag: 'then round again',
      body: 'The tool runs and its output goes back into the context — a test failure, an HTTP status, a compiler error. Facts it cannot talk its way around.',
    },
  ],
  footer: [
    {
      head: 'What decides how far it goes',
      items: [
        { id: 'autonomy-level', t: 'Autonomy level', d: 'Set per action class, not per product — usually free on reads, gated on writes, forbidden on a short list.' },
      ],
    },
    {
      head: 'When the run gets long',
      items: [
        { id: 'compaction', t: 'Compaction', d: 'Older turns swapped for a summary so the run keeps fitting. Lossy on purpose: what mattered only in the original wording is gone.' },
      ],
    },
    {
      head: 'What outlives it',
      items: [
        { id: 'session', t: 'Session', d: 'One run, and everything scoped to it. A new session is a new window.' },
        { id: 'long-term-memory', t: 'Long-term memory', d: 'Files the harness writes and reads back. Not a faculty of the model.' },
      ],
    },
  ],
  takeaway:
    'The loop is the product. A model call answers once; everything you recognise as an agent is this cycle, plus the rules about when it may act.',
};

/** Card 3 — the window, by what occupies it. Ordered by how little of it you control. */
const context = {
  slug: 'quick-reference-context-window',
  kind: 'stack',
  title: 'What fills the context window',
  sub: 'Every call re-sends the whole thing, and all of it competes for one ceiling.',
  bracket: {
    id: 'context-window',
    label: 'The window',
    note: 'a per-call ceiling on all of it together — not a budget that refills',
    from: 1,
    to: 4,
  },
  rows: [
    {
      id: 'system-prompt',
      name: 'System prompt',
      kicker: 'the vendor’s standing instructions',
      tag: 'you never see it',
      body: 'Role, rules and format, sent ahead of the conversation on every request. It is the part of the product you cannot read or edit.',
    },
    {
      id: 'tool-use',
      name: 'Tool definitions',
      kicker: 'what it is allowed to ask for',
      tag: 'charged whether used or not',
      body: 'Every function’s name, description and arguments. They are part of the prompt, so a large toolset is a standing cost on the window.',
    },
    {
      id: 'short-term-memory',
      name: 'The conversation',
      kicker: 'there is nowhere else for it to live',
      tag: 'grows every turn',
      body: 'Not a store the agent writes to — the transcript, re-sent whole. This is the part that runs you out of room.',
      sub: [
        { id: 'compaction', t: 'Compaction', d: 'Older turns replaced by a summary so a long run keeps fitting.' },
        { id: 'session', t: 'Session', d: 'Ends, and takes the window with it. A fresh one often beats arguing.' },
      ],
    },
    {
      id: 'retrieval-augmented-generation',
      name: 'Retrieved material',
      kicker: 'fetched at question time',
      tag: 'the point is grounding',
      body: 'Documents pulled in for this question, so the answer rests on them rather than on what the model absorbed in training.',
      sub: [
        { id: 'chunking', t: 'Chunking', d: 'Documents split small enough to retrieve a piece rather than the whole.' },
        { id: 'semantic-search', t: 'Semantic search', d: 'Retrieval by meaning rather than by matching words.' },
        { id: 'reranking', t: 'Reranking', d: 'A second pass that reorders hits before any of them cost tokens.' },
        { id: 'grounding', t: 'Grounding', d: 'Answering from the retrieved source instead of from memory.' },
      ],
    },
  ],
  footer: [
    {
      head: 'The unit it is measured in',
      items: [
        { id: 'token', t: 'Token', d: 'A word fragment. The window, the bill and the rate limits are all counted in these, not in words.' },
      ],
    },
    {
      head: 'The work of deciding',
      items: [
        { id: 'context-engineering', t: 'Context engineering', d: 'What goes in, what gets dropped, what gets fetched again — most of what people call prompt engineering is this.' },
      ],
    },
    {
      head: 'What it is not',
      items: [
        { id: 'long-term-memory', t: 'Long-term memory', d: 'State across sessions is a directory the harness reads back into the window. The window itself remembers nothing.' },
      ],
    },
  ],
  takeaway:
    'Nothing in the window persists. Every call re-sends all of it, the ceiling applies to the whole, and what looks like memory is a file something re-read for you.',
};

/** Card 4 — failures beside the controls that address them. */
const risks = {
  slug: 'quick-reference-risks',
  kind: 'pairs',
  title: 'What goes wrong, and what stops it',
  sub: 'Four failure modes, and the control that actually addresses each one.',
  columns: { left: 'The failure', right: 'What actually addresses it' },
  rows: [
    {
      risk: {
        id: 'prompt-injection',
        t: 'Prompt injection',
        d: 'Text the system treats as instructions when it was only ever content. The dangerous form arrives in a page, a file or a repo the agent read — nobody typed it.',
        also: [{ id: 'indirect-prompt-injection', t: 'Indirect prompt injection' }, { id: 'jailbreak', t: 'Jailbreak' }],
      },
      control: {
        id: 'project-trust',
        t: 'Vet what may configure the agent',
        d: 'A repository supplies configuration, not only code. Decide whether an agent may act on one before it reads it, and check input and output outside the model, where the check cannot be argued with.',
        also: [{ id: 'guardrails', t: 'Guardrails' }],
      },
    },
    {
      risk: {
        id: 'hallucination',
        t: 'Hallucination',
        d: 'Plausible, confident and wrong, produced identically to correct output — because truth is not a quantity the model computes.',
        also: [{ id: 'ai-slop', t: 'AI slop' }],
      },
      control: {
        id: 'grounding',
        t: 'Answer from a source, then check the citation',
        d: 'Retrieve the document and answer from it rather than from what the model remembers — then verify the cited source supports the claim, and that claims needing one have it.',
        also: [{ id: 'citation-precision-and-recall', t: 'Citation precision and recall' }, { id: 'factuality', t: 'Factuality' }],
      },
    },
    {
      risk: {
        id: 'excessive-agency',
        t: 'Excessive agency',
        d: 'More permission, autonomy and reach than the task needs — and drift outside the intended scope while every individual action still looks permitted.',
        also: [{ id: 'rogue-agent', t: 'Rogue agent' }],
      },
      control: {
        id: 'permission-model',
        t: 'Say what is allowed, and enforce it below the prompt',
        d: 'Set the limit per action class and put it where it holds: a rule in the system prompt is advice, a rule in the harness is a mechanism.',
        also: [{ id: 'approval-mode', t: 'Approval mode' }, { id: 'autonomy-level', t: 'Autonomy level' }],
      },
    },
    {
      risk: {
        id: 'data-exfiltration',
        t: 'Exfiltration and tool misuse',
        d: 'Legitimate access and legitimate tools, used exactly as designed, to do something you did not want — which is what makes both hard to spot.',
        also: [{ id: 'tool-misuse', t: 'Tool misuse' }, { id: 'memory-poisoning', t: 'Memory poisoning' }],
      },
      control: {
        id: 'sandbox',
        t: 'Bound the blast radius, and keep a way back',
        d: 'Run commands where a bad step damages a copy, put a person in the path of what cannot be undone, and snapshot as you go so an hour is recoverable.',
        also: [{ id: 'human-in-the-loop', t: 'Human in the loop' }, { id: 'checkpoint-and-rollback', t: 'Checkpoint and rollback' }],
      },
    },
  ],
  footer: [
    {
      head: 'How you find them',
      items: [
        { id: 'red-teaming', t: 'Red teaming', d: 'Deliberately trying to make it misbehave, rather than checking that it behaves.' },
        { id: 'evaluation', t: 'Evaluation', d: 'A repeatable test, so a fix can be shown to have worked.' },
      ],
    },
    {
      head: 'What should travel with the artifact',
      items: [
        { id: 'provenance', t: 'Provenance', d: 'Evidence of where a model, dataset or piece of content came from — attached to the thing, not asserted about it.' },
      ],
    },
    {
      head: 'The pattern in all four',
      items: [
        { id: 'non-human-identity', t: 'Give it its own identity', d: 'An agent acting as you is indistinguishable from you in every log. Its own credentials are what make the other controls observable.' },
      ],
    },
  ],
  takeaway:
    'Every control here sits outside the model. A rule in the system prompt is advice; a rule in the harness is a mechanism; a rule in the sandbox holds even if the other two are talked around.',
};

export const CARDS = [stack, loop, context, risks];
