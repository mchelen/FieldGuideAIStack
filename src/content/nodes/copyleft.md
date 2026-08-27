---
title: Copyleft
kind: concept
aka:
  - reciprocal license
  - share-alike
canonical:
  status: standard
  term: Copyleft
  body: Established free-software licensing practice, dating to the GNU project
  url: https://en.wikipedia.org/wiki/Copyleft
  title: Copyleft — Wikipedia
  verifiedOn: 2026-08-22
  note: >-
    Settled vocabulary with decades of case history in software. Applying it to
    model weights raises unresolved questions — what counts as a derivative of
    a set of weights is not something the licences were drafted to answer.
tags: [openness]
zoom: 3
summary: A licence requiring derivatives to carry the same terms — freedom
  enforced downstream rather than merely granted.
fieldMark: Copyleft is a condition on distribution, not on use. Running
  copyleft software privately triggers nothing; shipping something built on it
  is what brings the obligation.
useCase:
  scenario: >-
    A team wants to know whether building on a copyleft-licensed component
    forces them to publish their own code.
  detail: >-
    The trigger is distribution, not use — internal use imposes nothing. What
    distribution requires depends on the licence's scope: some reach only the
    modified files, some reach the whole combined work, and some reach across a
    network boundary. Reading which flavour applies is the entire question, and
    the differences between them are larger than the shared label suggests.
flow:
  scenario: >-
    A licence that follows the work downstream, applied to an artifact
    nobody agreed was software.
  path:
    - actor: A derivative
      where: your machine
      does: >-
        something built from a licensed thing
    - node: copyleft
      where: a contract, not a computer
      does: >-
        requires the derivative to carry the same terms
      self: true
    - node: permissive-license
      where: a contract, not a computer
      does: >-
        the alternative, which requires almost nothing
    - node: open-source-ai
      where: a contract, not a computer
      does: >-
        and the argument about what a derivative even is for weights
  returns: >-
    "Derivative work" was written for code, not for weights
relations:
  - type: consumed-by
    target: open-source-ai
    note: >-
      The reciprocity model open source was built on, and the one model licences
      have largely declined to adopt.
examples:
  - name: Copyleft
    url: https://en.wikipedia.org/wiki/Copyleft
    note: >-
      "Granting certain freedoms over copies of copyrighted works with the
      requirement that the same rights be preserved in derivative works."
    verifiedOn: 2026-08-22
  - name: OSI Approved Licenses
    url: https://opensource.org/licenses
    note: >-
      Copyleft licences such as the GPL family are approved open source
      licences, alongside permissive ones.
    verifiedOn: 2026-08-22
sources:
  - id: wikipedia-copyleft
    url: https://en.wikipedia.org/wiki/Copyleft
    title: Copyleft — Wikipedia
    verifiedOn: 2026-08-22
  - id: osi-licenses
    url: https://opensource.org/licenses
    title: OSI Approved Licenses — Open Source Initiative
    verifiedOn: 2026-08-22
---

Copyleft is "the legal technique of granting certain freedoms over copies of
copyrighted works with the requirement that the same rights be preserved in
derivative works", where freedoms means "the use of the work for any purpose,
and the ability to modify, copy, share, and redistribute the
work."[[cite:wikipedia-copyleft]]

Copyleft licences "are considered protective or reciprocal (in contrast with
permissive free software licenses)."[[cite:wikipedia-copyleft]] The whole
mechanism is that the grant carries a condition attached to passing it on.

## Why the condition exists

A [permissive licence](permissive-license) grants freedom and does not defend
it: a downstream party may take the work, improve it, and release the
improvements under any terms they like, including none.

Copyleft closes that path. The freedoms travel with the work, which is a
deliberate use of copyright against its usual purpose — hence the name.

Both are open source by OSI's reckoning;[[cite:osi-licenses]] they disagree
about what freedom requires rather than about whether to grant it.

## The trigger is distribution

Copyleft obligations attach when you distribute, not when you use. Internal use,
however extensive, imposes nothing — which is the single most misunderstood
point about these licences and the source of most misplaced caution.

What distribution then requires varies more than the shared label suggests. Some
copyleft licences reach only the files you modified, some reach the whole
combined work, and some extend the trigger to providing the software over a
network. The differences are substantial and the label is not enough to reason
from.

## Why weights complicate it

Copyleft depends on "derivative work" being a tractable question, and for source
code, decades of practice have made it roughly so.

For model weights it is not. Is a [fine-tune](fine-tuning) a derivative? A
[LoRA adapter](parameter-efficient-fine-tuning), which contains none of the
original numbers? A model [distilled](distillation) from another's outputs? A
dataset generated by it? None of these have settled answers, and the licences in
use were not drafted with them in mind.

## Why model releases mostly avoid it

Almost no significant model ships under copyleft. Releases cluster at
[permissive](permissive-license) terms or at a vendor's own
[community licence](community-license), and the reciprocity model that shaped
open-source software has had little uptake in
[open weights](open-weights) — an outcome worth noticing, since it means the
ecosystem's improvements are not required to flow back.
