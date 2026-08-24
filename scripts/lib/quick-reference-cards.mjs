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
        { id: 'autonomy-level', t: 'Autonomy level', d: 'Set per action class, not per product: free on reads, gated on writes, forbidden on a short list.' },
      ],
    },
    {
      head: 'When the run gets long',
      items: [
        { id: 'compaction', t: 'Compaction', d: 'Older turns swapped for a summary so the run keeps fitting. Lossy on purpose — the original wording is gone.' },
      ],
    },
    {
      head: 'What outlives it',
      items: [
        { id: 'long-term-memory', t: 'Long-term memory', d: 'A session ends and takes its window with it. What survives is files the harness writes and reads back — not a faculty of the model.' },
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


/** Card 5 — the same vocabulary as card 1, drawn as the graph it forms. */
const map = {
  slug: 'quick-reference-map',
  kind: 'map',
  title: 'What is connected to what',
  sub: 'The stack card’s vocabulary, drawn as relations rather than layers. Every line is declared on a node page.',
  lanes: [
    {
      head: 'Where you are',
      items: [
        { id: 'surface', t: 'Surface', note: 'the window you typed in' },
        { id: 'agent', t: 'Agent', note: 'the whole assembly' },
        { id: 'agentic-loop', t: 'Agentic loop', note: 'what makes it an agent' },
      ],
    },
    {
      head: 'The program around it',
      items: [
        { id: 'harness', t: 'Harness', note: 'where the product lives' },
        { id: 'prompt-engineering', t: 'Prompt engineering' },
        { id: 'context-engineering', t: 'Context engineering' },
        { id: 'retrieval-augmented-generation', t: 'Retrieval (RAG)' },
        { id: 'tool-use', t: 'Tool use' },
        { id: 'approval-mode', t: 'Approval mode' },
      ],
    },
    {
      head: 'The call, and who serves it',
      items: [
        { id: 'inference-api', t: 'Inference API', note: 'stateless HTTP' },
        { id: 'model-provider', t: 'Model provider', note: 'trains it' },
        { id: 'model-host', t: 'Model host', note: 'runs someone else’s' },
      ],
    },
    {
      head: 'The trained artifact',
      items: [
        { id: 'model', t: 'Model', note: 'weights, not a service' },
        { id: 'context-window', t: 'Context window' },
        { id: 'token', t: 'Token' },
        { id: 'hallucination', t: 'Hallucination' },
      ],
    },
  ],
  footer: [
    {
      head: 'Read the dashed green lines first',
      items: [
        { id: 'model', t: 'Model ↔ harness', d: 'The confusions are the point of the guide. Nearly every wrong claim about “the AI” is one of these two mistaken for the other.' },
      ],
    },
    {
      head: 'The arrows are directional',
      items: [
        { id: 'harness', t: 'Consumes', d: 'A harness consumes an inference API, not the reverse. Which way the verb runs is usually the whole disagreement.' },
      ],
    },
    {
      head: 'Nothing here is drawn by hand',
      items: [
        { id: 'agent', t: 'Declared once', d: 'Each relation is written on one page and the inverse derived, so the two sides can never disagree — and deleting one deletes this line.' },
      ],
    },
  ],
  takeaway:
    'A vocabulary is not a list. These terms are worth learning as a shape, because almost every question about “the AI” turns out to be a question about which arrow you are standing on.',
};


/** Card 6 — the numbers people quote, and what each one is worth. */
const evaluation = {
  slug: 'quick-reference-evaluation',
  kind: 'pairs',
  title: 'How you know it got better',
  sub: 'The four claims you will be shown, and the question each one is hiding.',
  columns: { left: 'What you will be told', right: 'What to ask about it' },
  rows: [
    {
      risk: {
        id: 'benchmark',
        t: 'It scores 87 on the benchmark',
        d: 'A benchmark is shared, which is the point of it — and being shared makes it a target that models get optimised against rather than measured by.',
        also: [{ id: 'leaderboard', t: 'Leaderboard' }],
      },
      control: {
        id: 'data-contamination',
        t: 'Was the test set in the training data?',
        d: 'Test data leaking into training inflates the score without improving anything, and it is now the normal condition rather than an accident. Ask when the set was published relative to the cutoff.',
      },
    },
    {
      risk: {
        id: 'leaderboard',
        t: 'It is top of the leaderboard',
        d: 'The most-read artifact in the field, and one that stops measuring the thing it ranks once enough people are optimising for the rank.',
      },
      control: {
        id: 'evaluation',
        t: 'Does it win on your task?',
        d: 'A public ranking answers a question somebody else asked. The only test that settles your decision is one built from your own inputs and run repeatably.',
        also: [{ id: 'regression-testing', t: 'Regression testing' }],
      },
    },
    {
      risk: {
        id: 'llm-as-a-judge',
        t: 'A model scored the output as better',
        d: 'Cheap enough to run on everything, which is why it is everywhere — and carrying biases that the paper naming the technique documented in detail.',
        also: [{ id: 'autorater-evaluation', t: 'Autorater evaluation' }],
      },
      control: {
        id: 'factuality',
        t: 'Was the judge checked against people?',
        d: 'A scorer is itself a model with an error rate. Ask what it was calibrated on, and whether anyone has measured how often it agrees with a human on this kind of output.',
        also: [{ id: 'citation-precision-and-recall', t: 'Citation precision and recall' }],
      },
    },
    {
      risk: {
        id: 'regression-testing',
        t: 'The fix works — we tried it',
        d: 'Trying it once is not a result when the same input does not reliably produce the same output. Nothing here regresses loudly; it regresses on the case nobody re-ran.',
      },
      control: {
        id: 'tracing',
        t: 'Can you see what it actually did?',
        d: 'Record the run step by step. Without a trace, “why did it do that” has no answer, and a fix cannot be shown to have addressed the cause rather than the symptom.',
        also: [{ id: 'red-teaming', t: 'Red teaming' }],
      },
    },
  ],
  footer: [
    {
      head: 'The word doing the work',
      items: [
        { id: 'evaluation', t: 'Evaluation', d: 'A repeatable test. Repeatable is the whole of it: a number nobody else can reproduce is an anecdote with a decimal point.' },
      ],
    },
    {
      head: 'What a score cannot tell you',
      items: [
        { id: 'factuality', t: 'Factuality', d: 'Whether the output is true, as distinct from whether it sounds right — a property to aim at, not a number to report.' },
      ],
    },
    {
      head: 'Finding failures on purpose',
      items: [
        { id: 'red-teaming', t: 'Red teaming', d: 'Deliberately trying to make it misbehave, rather than checking that it behaves. The two produce very different reports.' },
      ],
    },
  ],
  takeaway:
    'Every number here was produced by someone who chose the test. The question is never “what did it score” but “on what, against whom, and could I run it again”.',
};

/** Card 7 — the rungs people mean by "open", in the order they tell you less. */
const openness = {
  slug: 'quick-reference-openness',
  kind: 'stack',
  title: 'What “open” actually means',
  sub: 'Four different claims that all get called open, and what each one does and does not give you.',
  bracket: {
    id: 'open-weights',
    label: 'Called “open”',
    note: 'all three of these ship under the word, and none of them is the defined term',
    from: 1,
    to: 3,
  },
  rows: [
    {
      id: 'open-weights',
      name: 'Open weights',
      kicker: 'you can download and run it',
      tag: 'about access, not licence',
      body: 'The parameters are yours to fetch and serve. It says nothing about what the licence permits, and nothing about whether you could rebuild the model.',
    },
    {
      name: 'The licence',
      kicker: 'what you may do with it',
      tag: 'read it, do not assume it',
      body: 'Three different shapes ship under the same word, and which one you have decides whether the weights you downloaded are usable for what you had in mind.',
      sub: [
        { id: 'permissive-license', t: 'Permissive', d: 'Reuse with minimal conditions — attribution, a warranty disclaimer, nothing about derivatives.' },
        { id: 'copyleft', t: 'Copyleft', d: 'Derivatives must carry the same terms. Freedom enforced downstream, not merely granted.' },
        { id: 'community-license', t: 'Community licence', d: 'A vendor’s own terms: downloadable weights with conditions open source licences do not allow.' },
      ],
    },
    {
      id: 'acceptable-use-policy',
      name: 'Acceptable use policy',
      kicker: 'what you may not do with it',
      tag: 'moves without the licence moving',
      body: 'Usually incorporated into the licence by reference — so the terms constraining your use can change while the licence you agreed to stays word for word the same.',
    },
    {
      id: 'open-source-ai',
      name: 'Open source AI',
      kicker: 'the defined term',
      tag: 'a definition, not a vibe',
      body: 'Under OSI’s Open Source AI Definition 1.0 a system qualifies only with data information, training code and parameters. Most things called open source AI do not clear it.',
    },
  ],
  footer: [
    {
      head: 'What should ship with the model',
      items: [
        { id: 'model-card', t: 'Model card', d: 'What it is, what it was meant for, how it was evaluated, and where it should not be used.' },
      ],
    },
    {
      head: 'Where it came from',
      items: [
        { id: 'provenance', t: 'Provenance', d: 'Evidence about a model, dataset or piece of content, attached to the artifact rather than asserted about it.' },
      ],
    },
    {
      head: 'Marking the output',
      items: [
        { id: 'watermarking', t: 'Watermarking', d: 'Identification embedded in the generated content itself, rather than attached alongside it as metadata.' },
      ],
    },
  ],
  takeaway:
    '“Open” is four separate claims wearing one word. Downloadable is not licensed, licensed is not unrestricted, and none of the three is open source.',
};

/** Card 8 — the bill, from the unit up to the only number that matters. */
const cost = {
  slug: 'quick-reference-cost',
  kind: 'stack',
  title: 'What you actually pay for',
  sub: 'From the unit on the price page to the number that decides whether it was worth running.',
  bracket: {
    id: 'token-billing',
    label: 'Token billing',
    note: 'charged by consumption, not by seat — so the bill scales with how much the thing is used',
    from: 1,
    to: 4,
  },
  rows: [
    {
      id: 'token',
      name: 'Token',
      kicker: 'the unit everything is counted in',
      tag: 'a word fragment',
      body: 'Everything downstream is denominated in these: the price, the window, the rate limits. Not words, and not characters.',
    },
    {
      id: 'token-pricing',
      name: 'Token pricing',
      kicker: 'three rates, not one',
      tag: 'output costs the most',
      body: 'Input and output are charged at different rates, and cached input cheaper again — which is where most of the saving available to you actually is.',
    },
    {
      name: 'The levers',
      kicker: 'what changes the rate you pay',
      tag: 'each trades something away',
      body: 'Three ways to pay less for the same work, each giving up something in exchange — repetition, timing, or commitment.',
      sub: [
        { id: 'prompt-caching', t: 'Prompt caching', d: 'A repeated prefix processed once rather than on every call.' },
        { id: 'batch-inference', t: 'Batch inference', d: 'Roughly half price for giving up any promise about when.' },
        { id: 'provisioned-throughput', t: 'Provisioned throughput', d: 'Guaranteed capacity by the hour: a variable cost made fixed, in both directions.' },
      ],
    },
    {
      id: 'cost-per-task',
      name: 'Cost per task',
      kicker: 'what one finished job cost',
      tag: 'not the price of a call',
      body: 'Retries, tool calls and the runs that failed, counted against the jobs that completed. An agent making forty calls to finish once is priced by the finish, not by the call.',
    },
  ],
  footer: [
    {
      head: 'What you are sold',
      items: [
        { id: 'subscription-tier', t: 'Subscription tier', d: 'The packaging that decides which capabilities you get at all — and the usual reason two people describe the same product differently.' },
      ],
    },
    {
      head: 'Where it stops',
      items: [
        { id: 'usage-limit', t: 'Usage limit', d: 'The ceiling a plan puts on consumption over a period. A rate limit shapes traffic; this one stops it.' },
      ],
    },
    {
      head: 'Not paying per token at all',
      items: [
        { id: 'self-hosting', t: 'Self-hosting', d: 'Run it on infrastructure you control — a hardware decision before it is a software one.' },
        { id: 'on-device-inference', t: 'On-device inference', d: 'The user’s own phone or laptop, so nothing is sent anywhere.' },
      ],
    },
  ],
  takeaway:
    'Per-token prices compare models. Cost per task compares decisions — and the two can point in opposite directions, because the cheaper model is often the one that needs more attempts.',
};

export const CARDS = [stack, loop, context, risks, map, evaluation, openness, cost];
