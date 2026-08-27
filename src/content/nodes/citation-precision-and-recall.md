---
title: Citation precision and recall
kind: concept
aka:
  - citation quality
  - attribution evaluation
canonical:
  status: de-facto
  term: Citation quality
  body: Gao et al. (2023), whose ALCE benchmark defined the precision and recall pair for citations
  url: https://arxiv.org/abs/2305.14627
  title: Enabling Large Language Models to Generate Text with Citations — Gao et al.
  verifiedOn: 2026-08-22
  note: >-
    Precision and recall are standard classification metrics; the contribution
    here is applying them to citations, where recall asks whether claims are
    cited and precision asks whether the citations support them.
tags: [evaluation, technique]
zoom: 3
summary: Whether cited sources actually support the claim, and whether claims
  that need a citation have one — two failures that look identical on the page.
fieldMark: A citation that does not support its sentence is worse than none,
  because it borrows credibility it has not earned. Checking a sample by hand
  is the only way to find out.
useCase:
  scenario: >-
    A generated report is full of references and one of them does not say what
    the sentence claims.
  detail: >-
    Nothing on the page distinguishes that reference from the good ones — a
    citation looks equally authoritative whether or not it supports the claim.
    The two questions have to be asked separately: do the citations support what
    they are attached to (precision), and does everything needing support have a
    citation (recall). A system can score well on one and badly on the other,
    and the reader cannot tell either way.
flow:
  scenario: >-
    An answer with three citations, one of which does not support the
    sentence it is attached to.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        check whether a citation says what it is cited for
    - actor: An answer
      where: what the reader sees
      does: >-
        with sources attached to some of its claims
    - node: citation-precision-and-recall
      where: your evaluation harness
      does: >-
        do the cited sources support the claim, and is anything uncited
      self: true
    - node: grounding
      where: your infrastructure
      does: >-
        the design that made citation possible at all
    - node: evaluation
      where: your evaluation harness
      does: >-
        and the measurement, over a fixed set
  returns: >-
    A citation that does not support the claim is worse than none
relations:
  - type: kind-of
    target: evaluation
    note: A pair of metrics, and one of the few places factuality becomes measurable.
  - type: consumes
    target: grounding
    note: What it measures — whether the output is actually tied to its sources.
examples:
  - name: ALCE
    url: https://arxiv.org/abs/2305.14627
    note: >-
      "The first benchmark for Automatic LLMs' Citation Evaluation", with
      metrics along fluency, correctness and citation quality.
    verifiedOn: 2026-08-22
sources:
  - id: alce-paper
    url: https://arxiv.org/abs/2305.14627
    title: Enabling Large Language Models to Generate Text with Citations — Gao et al.
    verifiedOn: 2026-08-22
    quote: >-
      We develop automatic metrics along three dimensions -- fluency, correctness, and citation quality -- and demonstrate their strong correlation with human judgements.
    note: Submitted 24 May 2023, last revised 31 October 2023.
  - id: google-glossary
    url: https://developers.google.com/machine-learning/glossary
    title: Machine Learning Glossary — Google for Developers
    verifiedOn: 2026-08-22
---

The motivation is the familiar one: outputs "are prone to hallucination", and
the goal is "to allow LLMs to generate text with citations, improving their
factual correctness and verifiability."[[cite:alce-paper]]

Verifiability is the word that matters. A citation does not make a claim true;
it makes the claim *checkable*, which is a weaker and much more achievable
property.

## Two questions, not one

Borrowing the classification metrics, which Google's glossary defines in their
original sense:[[cite:google-glossary]]

- **Precision** — of the citations present, how many support the claim they are
  attached to. Low precision means references that do not say what the sentence
  says.
- **Recall** — of the claims that need support, how many have a citation. Low
  recall means unsourced assertions sitting among sourced ones.

They fail independently, and a system can be excellent at one and poor at the
other. A page with one carefully-supported citation and forty unsupported
sentences has high precision and terrible recall; a page where every sentence
carries a vaguely-relevant reference has the reverse.

## Why the failures are invisible

Both look like a well-referenced document. A citation renders identically
whether or not the source supports the sentence, and an uncited claim sitting
between two cited ones inherits their apparent authority.

That is what makes this worth measuring rather than eyeballing. ALCE is "the
first benchmark for Automatic LLMs' Citation Evaluation", developing "automatic
metrics along three dimensions — fluency, correctness, and citation
quality."[[cite:alce-paper]] The paper notes that existing work "mainly relies on
commercial search engines and human evaluation, making it challenging to
reproduce and compare different modeling
approaches."[[cite:alce-paper]]

## Where it makes factuality measurable

[Factuality](factuality) is, in Google's words, a concept rather than a
metric.[[cite:google-glossary]] Citation quality is one of the few places it
becomes a number, because the question changes from "is this true" — which
needs the world — to "does the cited passage say this", which needs only the
passage.

Which is also why [grounding](grounding) and citation [evaluation](evaluation) belong
together: grounding is the design, and this is the check that the design held.

## The practical version

Sample a dozen citations and read them against their sentences. It is dull, it
takes twenty minutes, and it finds the problem or establishes that there is not
one — which no amount of reading the output as a whole will do.
