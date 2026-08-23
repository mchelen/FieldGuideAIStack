---
title: Nine thousand pages
order: 3
summary: Britt wants the fleet manuals searchable, and discovers that the hard
  part is not the model but what happens to a paragraph when you cut it out of
  its document.
cast:
  - name: Britt Sørensen
    role: Chief engineer, fleet
  - name: Ama Osei
    role: Engineering lead
concepts:
  - chunking
  - embedding
  - semantic-search
  - reranking
  - vector-database
  - context-window
outcome: >-
  Retrieval works, after two rebuilds that had nothing to do with the model.
  Britt's rule of thumb — if a paragraph would not make sense read aloud on its
  own, it will not work as a chunk — is now written on the whiteboard in the
  yard office.
---

Britt has eleven vessels and about nine thousand pages of manufacturer
documentation, most of it scanned, all of it searchable only by filename. The
question that starts this is not sophisticated: *which torque setting applies to
the port gearbox on the Kittiwake?*

## The first attempt found nothing useful

Ama built the obvious thing over two afternoons. Split the documents into
chunks, [embed](embedding) each one, store the vectors, and at question time
find the nearest matches by [semantic search](semantic-search).

It returned plausible pages and rarely the right one. Britt's verdict after a
week was that it was worse than the filenames, because the filenames at least
did not pretend.

## What was wrong with the chunks

The splitter cut every 800 characters. So a chunk read:

> The value is 240 Nm for the standard configuration and 265 Nm where the
> auxiliary cooling loop is fitted.

Which value, on what, for which vessel? The document knew. Its heading said so
four pages earlier. The chunk did not.

This is [chunking](chunking)'s central problem and it is not a tuning issue:
small chunks retrieve precisely and lose their context; large chunks keep their
context and retrieve imprecisely, because one [embedding](embedding) averaging
several topics is close to none of them. There is no size that avoids the
trade.

## Two rebuilds

**Split on structure, not length.** Section boundaries carry meaning that a
character count does not, and the manuals — being manufacturer documentation —
have good headings.

**Put the context back.** Each chunk now carries a line naming the vessel class,
the system and the section it came from, prepended before embedding. This is the
move Anthropic documented as contextual retrieval, and it is the one that made
the difference.

## The last stage was the cheapest

Ama added [reranking](reranking) almost as an afterthought: retrieve thirty
candidates, score them against the actual question, pass the best five.

It improved answers *and* reduced cost, which nothing else in the project did.
Fewer, better passages is simply a better prompt — padding a
[context window](context-window) with marginal material makes answers worse as
well as more expensive.

## What Britt tells people

> If a paragraph would not make sense read aloud on its own, it will not work as
> a chunk.

That is not how the literature phrases it. It is the same finding.

The [vector database](vector-database), incidentally, turned out to be a table
in the database they already ran. Nine thousand pages is a few tens of thousands
of chunks, which is small enough that the index was never the hard part — a fact
that would have saved a fortnight if anyone had said it at the start.
