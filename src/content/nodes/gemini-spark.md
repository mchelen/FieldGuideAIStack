---
title: Gemini Spark
kind: product
vendor: Google
aka: [Spark]
tags: [product, agent]
zoom: 1
summary: Google's always-on personal agent — runs in the cloud after you close
  the laptop, and acts through Chrome using your logged-in accounts.
fieldMark: Spark is the one that can genuinely act as you. It is the only
  product here documented as using your saved passwords and logged-in sessions.
relations:
  - type: variant-of
    target: gemini-app
  - type: bundles
    target: browser-automation
    note: Credentialed — uses logged-in accounts and saved passwords, with permission.
  - type: bundles
    target: background-execution
  - type: bundles
    target: approval-mode
    note: Approval required for payments and other sensitive transactions.
  - type: bundles
    target: connector
  - type: distinguished-from
    target: chatgpt-work
examples:
  - name: Gemini Spark
    vendor: Google
    url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    note: >-
      Personal agent with Chrome browsing integration that can use logged-in
      accounts and saved passwords with permission, for web errands such as
      scheduling viewings or researching and starting flight bookings. Includes
      prompt-injection protections and requires approval for payments.
    verifiedOn: 2026-08-22
sources:
  - id: google-gemini-spark
    url: https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-july-2026/
    title: Gemini Spark, new Chrome browsing integration — Google
    verifiedOn: 2026-08-22
---

Spark is the most aggressive product in this comparison, and the difference is
one word: **credentials.**

Google's announcement describes Spark using "your logged-in accounts and saved
passwords" with permission, to handle errands like scheduling apartment viewings
or researching flights and starting a booking. Set against
[ChatGPT Work](chatgpt-work), whose cloud browser explicitly "can't accept
credentials, use a password manager or saved form entries, sign in to a website,
or complete payments", these are opposite answers to the same design question.

Neither is wrong. They are different points on a trade-off between reach and
blast radius, and knowing which one you are holding matters more than any
benchmark.

## What follows from that choice

Because Spark acts as you, it needs defences the sandboxed alternatives do not:
Google's announcement pairs the capability with prompt-injection protections and
keeps user approval for payments and other sensitive transactions.

[Prompt injection](browser-automation) is the specific worry. An agent reading a
web page while holding your session cookies can be instructed by that page. A
sandboxed browser with no credentials has far less to lose.

## Always-on

Spark runs on Google's cloud infrastructure and keeps going after you close your
laptop or lock your phone — [background execution](background-execution) as the
product's central premise rather than a feature. It was announced at Google I/O
in May 2026, initially on the AI Ultra tier in the US, and has since expanded to
AI Pro subscribers across more than 160 additional countries.
