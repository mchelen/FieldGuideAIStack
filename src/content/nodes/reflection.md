---
title: Reflection
kind: concept
aka:
  - self-critique
  - evaluator-optimizer
canonical:
  status: de-facto
  term: Reflection
  body: Google, in the Machine Learning Glossary
  url: https://developers.google.com/machine-learning/glossary
  title: Machine Learning Glossary — Google for Developers
  verifiedOn: 2026-08-22
tags: [agentic, technique]
zoom: 2
summary: An agent examining its own output before passing it on — the same
  model in a critical rather than a generative posture.
fieldMark: Reflection on its own is a model grading its own homework. It works
  because the critical pass is a different prompt, not because the model gained
  a faculty — and it works far better when the critique has something external
  to check against.
useCase:
  scenario: >-
    A draft is competent and misses two requirements from the original brief.
  detail: >-
    Asking the same model to check the draft against the brief catches them
    surprisingly often, because reviewing and generating are different tasks and
    the review has the draft in front of it. Anthropic's evaluator-optimizer
    pattern formalises this into a loop, and notes the two conditions for it
    being worth building: responses can be demonstrably improved when a human
    articulates feedback, and the model can produce that kind of feedback
    itself.
relations:
  - type: part-of
    target: agentic-loop
    note: A step inserted between producing an output and using it.
  - type: distinguished-from
    target: verification-loop
    note: >-
      Reflection judges the output by reading it. Verification runs it and reads
      what happened, which is evidence rather than opinion.
examples:
  - name: Reflexion
    url: https://arxiv.org/abs/2303.11366
    note: >-
      Reinforces agents "not by updating weights, but instead through
      linguistic feedback" kept in an episodic memory buffer.
    verifiedOn: 2026-08-22
  - name: Evaluator-optimizer
    vendor: Anthropic
    url: https://www.anthropic.com/engineering/building-effective-agents
    note: "One LLM call generates a response while another provides evaluation and feedback in a loop."
    verifiedOn: 2026-08-22
sources:
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
  - id: reflexion-paper
    url: https://arxiv.org/abs/2303.11366
    title: "Reflexion: Language Agents with Verbal Reinforcement Learning — Shinn et al."
    verifiedOn: 2026-08-22
    note: Submitted 20 March 2023, last revised 10 October 2023.
  - id: anthropic-agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents — Anthropic
    verifiedOn: 2026-08-22
---

Reflection is "a strategy for improving the quality of an agentic workflow by
examining (reflecting on) a step's output before passing that output to the next
step", and Google notes that "the examiner is often the same LLM that generated
the response."[[cite:google-glossary]]

Which raises the obvious objection, and Google raises it too: "how could the
same LLM that generated a response be a fair judge of its own response?"

## The answer, and its limits

Google's answer is that "the 'trick' is to put the LLM in a critical
(reflective) mindset", by analogy with "a writer who uses a creative mindset to
write a first draft and then switches to a critical mindset to edit
it."[[cite:google-glossary]]

That is more than a metaphor. Generating and reviewing are different tasks with
different prompts, and the review has an artifact in front of it that the
generation did not. A model asked "does this draft meet these five
requirements?" is doing a checkable job, not re-running the one it just did.

The limits follow from the same fact. The critique is generated text with the
same failure modes as any other, and a model that lacked the knowledge to get it
right will lack the knowledge to notice.

## Reflexion: keeping the critique

The Reflexion framework extends this by making the reflections persist. It
reinforces language agents "not by updating weights, but instead through
linguistic feedback" — agents "verbally reflect on task feedback signals, then
maintain their own reflective text in an episodic memory buffer to induce better
decision-making in subsequent trials."[[cite:reflexion-paper]]

Learning that lives in the [context window](context-window) rather than in the
[parameters](parameter), which makes it cheap, inspectable, and gone when the
buffer is.

## The productised form

Anthropic's evaluator-optimizer [workflow](workflow) is this pattern with the roles split
across calls: "one LLM call generates a response while another provides
evaluation and feedback in a loop."[[cite:anthropic-agents]]

Their two signs of good fit are worth applying before building it: "that LLM
responses can be demonstrably improved when a human articulates their feedback;
and second, that the LLM can provide such feedback."[[cite:anthropic-agents]] If
a human's critique would not help, a model's will not either.

## What makes it much stronger

[Grounding](grounding) the critique in something external. A model reviewing its own code is
reflection; a model reading the test failure its code produced is a
[verification loop](verification-loop), and the second is worth considerably
more because the feedback did not come from the model.
