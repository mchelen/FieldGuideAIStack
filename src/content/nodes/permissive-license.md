---
title: Permissive license
kind: concept
aka:
  - BSD-style license
  - MIT-style license
canonical:
  status: standard
  term: Permissive software license
  body: Established in free-software licensing; OSI approves the licences that qualify
  url: https://opensource.org/licenses
  title: OSI Approved Licenses — Open Source Initiative
  verifiedOn: 2026-08-22
  note: >-
    Long-settled vocabulary. What is new is that it is now being applied to
    model weights, where the artifact being licensed is not software and the
    licence's assumptions do not all carry over.
tags: [openness]
zoom: 3
summary: A licence allowing reuse with minimal conditions — usually attribution
  and a warranty disclaimer, and nothing about what you do with derivatives.
fieldMark: The test is what happens downstream. Under a permissive licence your
  changes can be closed; under copyleft they cannot. Everything else is detail.
useCase:
  scenario: >-
    A company wants to build on an open-weight model and not publish what it
    builds.
  detail: >-
    A permissive licence allows that outright — attribution and a disclaimer are
    typically the whole obligation. Copyleft would require the derivative to
    carry the same terms, and a vendor community licence adds conditions of its
    own. Which of the three a model ships under decides whether a
    commercialisation plan is viable, and it is a licence question rather than a
    technical one.
flow:
  scenario: >-
    A licence with almost no conditions, written for source code, applied to
    a set of weights.
  path:
    - actor: You
      where: a person, not a system
      does: >-
        read a licence written for code, attached to weights
    - actor: A licence file
      where: your machine
      does: >-
        beside the weights, and short
    - node: permissive-license
      where: a contract, not a computer
      does: >-
        reuse with minimal conditions — attribution, no warranty
      self: true
    - node: copyleft
      where: a contract, not a computer
      does: >-
        the other axis, where derivatives must carry the same terms
    - node: open-weights
      where: a contract, not a computer
      does: >-
        which is a claim about availability, not about either
  returns: >-
    Written for source, and weights are not source
relations:
  - type: distinguished-from
    target: copyleft
    note: >-
      The whole difference is downstream: copyleft requires derivatives to carry
      the same terms, permissive does not.
  - type: consumed-by
    target: open-weights
    note: >-
      The most favourable terms weights are commonly released under, and much
      rarer than the phrase "open source AI" implies.
examples:
  - name: OSI Approved Licenses
    url: https://opensource.org/licenses
    note: >-
      "Open source licenses are licenses that comply with the Open Source
      Definition — in brief, they allow software to be freely used, modified,
      and shared."
    verifiedOn: 2026-08-22
  - name: Permissive software license
    url: https://en.wikipedia.org/wiki/Permissive_software_license
    note: >-
      "Carries only minimal requirements on how the software can be used,
      modified, and redistributed"; MIT, BSD and Apache are the examples.
    verifiedOn: 2026-08-22
sources:
  - id: osi-licenses
    url: https://opensource.org/licenses
    title: OSI Approved Licenses — Open Source Initiative
    verifiedOn: 2026-08-22
    quote: >-
      To be approved by the Open Source Initiative (also known as the OSI) a license must go through the Open Source Initiative's license review process.
  - id: wikipedia-permissive
    url: https://en.wikipedia.org/wiki/Permissive_software_license
    title: Permissive software license — Wikipedia
    verifiedOn: 2026-08-22
    quote: >-
      Permissive licenses (BSD, MIT, X11, Apache, Zope) are generally compatible and interoperable with most other licenses
---

A permissive licence "instead of copyleft protections, carries only minimal
requirements on how the software can be used, modified, and redistributed,
usually including a warranty disclaimer." MIT, the BSD licences and Apache are
the standard examples, and MIT is the most widely used free-software licence
overall.[[cite:wikipedia-permissive]]

The obligations are typically two: keep the copyright notice, and accept that
there is no warranty. Nothing about what you build, whether you publish it, or
what terms you put on it.

## Where it sits

OSI's framing is the reference point: "open source licenses are licenses that
comply with the Open Source Definition — in brief, they allow software to be
freely used, modified, and shared", and a licence earns the label by going
"through the Open Source Initiative's license review
process."[[cite:osi-licenses]]

Permissive and [copyleft](copyleft) licences are both open source. They differ
on one axis — what downstream users owe — and that axis decides most commercial
questions.

## Applying it to weights is not straightforward

A permissive licence was written for source code, where the licensed thing, the
modifiable thing and the distributable thing are the same artifact. Model
[weights](open-weights) are none of those in the same way: the training data is
not included, the "source" in any meaningful sense is a corpus and a training
run nobody is shipping, and modification means
[fine-tuning](fine-tuning) rather than editing.

So a permissively-licensed model is permissive about the file you downloaded.
Whether that constitutes [open source AI](open-source-ai) is precisely the
argument the OSI's separate AI definition exists to settle.

## Why it matters commercially

Because it is the only one of the three common arrangements with no conditions
attached to what you do next. A [community licence](community-license) may cap
your user count or restrict use categories; copyleft may require you to publish.
A permissive licence asks for a notice.

That makes it the terms to look for and the terms least often granted — the
phrase "open source AI" in marketing almost never means this.
