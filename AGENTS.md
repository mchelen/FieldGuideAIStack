# AGENTS.md

A field guide to the AI stack. Full brief: `CHARTER.md` — read it before
any new development work.

## Workflow
- Always open a pull request; merge automatically once CI and review checks pass.
- Never commit direct to main.

## Processing
- Push significant processing into tools and CI jobs, not tokens. Link checking,
  content validation, and graph integrity are scripts, not agent tasks.
- Reserve the model for judgment: wording, taxonomy calls, whether a
  distinction earns its own node.

## Content rules
- Every product or license claim needs a source URL and a `verifiedOn` date.
  Fetch it; never write one from memory.
- Content lives in the graph. Adding a concept is one new node file, never
  a new hand-written page.
