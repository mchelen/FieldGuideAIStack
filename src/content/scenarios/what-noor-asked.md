---
title: What Noor asked
order: 5
summary: The finance director declines to approve a budget quoted in tokens, and
  the resulting arithmetic changes how the help box is built.
cast:
  - name: Noor Haddad
    role: Finance director
  - name: Ama Osei
    role: Engineering lead
concepts:
  - token-billing
  - token-pricing
  - cost-per-task
  - prompt-caching
  - batch-inference
  - effort-level
outcome: >-
  Cost per answered question fell by roughly four-fifths, none of it from
  negotiating a rate. Noor now gets a monthly figure per answered question and
  has stopped asking about tokens, which was the point.
---

Ama's budget request said the help box would cost about $3 per million input
tokens. Noor's reply was one sentence: *how much is that per question?*

Nobody knew. The estimate had been built from the price list, and the price list
answers a different question than the one being asked.

## The unit mismatch

[Token billing](token-billing) charges by consumption, which is genuinely how
the cost is incurred — an accelerator is expensive and a request uses a
measurable amount of it. But nothing Halcyon does is a token. Halcyon answers
questions.

Getting from one unit to the other is [cost per task](cost-per-task), and the
first honest measurement came in at roughly **eleven times** Ama's estimate.

## Where the factor of eleven came from

Four things the price list does not mention:

- **The system prompt.** About 4,000 tokens of instructions, tone and route
  facts, paid on **every single call**.
- **Retrieval.** The timetable extract and any matched manual sections, added to
  every relevant question.
- **Conversation.** The [inference API](inference-api) is stateless, so a
  five-turn conversation re-sends turns one to four each time.
- **Failures.** Questions the assistant could not answer still cost, and those
  were about one in seven.

None of these is exotic. All of them are invisible if you multiply an average
prompt length by a call count.

## What actually reduced it

In order of how much they saved, which is not the order anyone expected:

**[Prompt caching](prompt-caching), by a distance.** The system prompt and route
facts are identical on every call by construction. A cache read costs a tenth of
base input, so the largest single line item became the smallest. Ama had to move
the timestamp out of the top of the prompt first — a changing character near the
front invalidates everything after it, silently.

**Routing to a smaller model.** Most of the forty common questions are not hard.
The spread between model tiers is an order of magnitude, and a smaller model
answers "what time is the last sailing" exactly as well.

**[Effort level](effort-level) down** on the same easy path, which is the same
decision made inside one model rather than between two.

**[Batch inference](batch-inference)** for the overnight work — summarising the
day's unanswered questions for Dev — at half price, because nobody is waiting.

## What Noor gets now

A figure per answered question, monthly, next to the call centre's cost per
answered call. Those two numbers are comparable, which is the whole reason the
project has a budget.

Ama's note on the wiki is blunter than the finance report:

> Nearly all of this was decided while writing prompts and loops, not while
> negotiating with a vendor. Cost is an engineering property now.
