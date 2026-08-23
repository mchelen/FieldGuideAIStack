---
title: The sailing that did not exist
order: 1
summary: A support assistant confidently invents a Tuesday crossing, and Halcyon
  learns the difference between an answer that sounds right and one that is.
cast:
  - name: Dev Raman
    role: Customer operations manager
concepts:
  - hallucination
  - grounding
  - retrieval-augmented-generation
  - factuality
  - evaluation
outcome: >-
  The assistant now answers timetable questions only from the timetable, and
  says it does not know when the retrieval comes back empty. The rate of wrong
  answers did not go to zero; it became measurable, which was the actual win.
---

Dev's team spends most of its day answering the same forty questions. The
obvious idea — put a model behind the website's help box — worked well enough in
a demo to get approved, and was live within a month.

Six weeks later a passenger arrives at the terminal for the 14:20 Tuesday
sailing to Skerry. There is no 14:20 Tuesday sailing to Skerry. There has not
been one since the summer timetable ended.

## Nothing malfunctioned

This is the part Dev found hardest to explain upstairs. The assistant was not
broken, had not crashed, and produced no error. It was asked about a Tuesday
crossing and produced the most plausible continuation of that
question — a departure time in the right format, on a route that exists, phrased
exactly like every correct answer it had ever given.

[Hallucination](hallucination) is not a malfunction to be patched out. A
[model](model) produces likely text, and truth is not among the quantities it
computes. A fluent falsehood and a fluent fact are, to the mechanism producing
them, the same kind of object.

The specific tell, in hindsight, was **confident precision about a checkable
fact**. Vagueness would have been a model hedging. "14:20" was not.

## What they had actually built

Nothing was ever connected to the timetable. Somebody had pasted a summary of
the routes into the [system prompt](system-prompt) during the pilot, and by
autumn that summary was three timetables out of date and nobody remembered it
was there.

So the assistant was answering from memory — partly from a stale paragraph,
partly from whatever it had absorbed about ferry timetables in general during
[pretraining](pretraining). Neither source was the timetable.

## The fix, and the part that surprised them

The fix was [grounding](grounding): fetch the actual sailings for the route and
date, put them in the prompt, and answer from those.
[Retrieval-augmented generation](retrieval-augmented-generation) is the usual
name for the pattern, and Halcyon's version is about as simple as it gets —
there are four routes and one timetable, so there is no
[vector database](vector-database) anywhere in it.

What surprised Dev was that grounding alone did not settle it. Ama asked the
question that mattered: *what does it do when the lookup returns nothing?*

The first version answered anyway. A grounded system that falls back to memory
when retrieval misses is indistinguishable, on the questions where retrieval
worked, from one that does not — and the questions where retrieval misses are
exactly the ones nobody tested.

## What they check now

Dev keeps sixty saved questions with the right answers, including a dozen where
the correct response is "I don't know". That set is an
[evaluation](evaluation), and it runs on every prompt change.

The number it produces is not [factuality](factuality) — Google's own glossary
says factuality is a concept rather than a metric — but it is a proxy Dev can
name, which is more than the previous arrangement offered. The previous
arrangement was that somebody would eventually turn up at a terminal.
