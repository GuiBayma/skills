---
name: feature
description: Consolidate the current conversation into a feature spec at docs/features/<feature-name>/SPEC.md, synthesising the problem and the solution already discussed.
disable-model-invocation: true
---

# Feature

Consolidate the current conversation and your understanding of the codebase into a **spec**: one artifact that carries the problem and its solution, written to `docs/features/<feature-name>/SPEC.md`. Done when the spec is on disk in the template below, every decision reached in the conversation is recorded in it, and every seam it names was weighed against the seams the codebase already has.

## Process

1. Explore the repo until you know the current state of the code the feature touches. Write the spec in the project's glossary vocabulary and respect the ADRs in that area; load the `domain-modeling` skill for where the glossary and ADRs live.

2. Sketch the seams at which the feature will be tested, in the vocabulary of the `codebase-design` skill (load it). Prefer existing seams to new ones and take the highest seam available; a new seam, when one is needed, goes at the highest point you can place it. Fewer seams across the codebase is better, and one is ideal, because every seam is interface that callers and tests must learn.

3. Name the feature in kebab-case and write the spec to `docs/features/<feature-name>/SPEC.md` using the template below. The directory stays out of version control, so add `docs/features/` to `.gitignore` when it is not there yet.

## Spec template

```markdown
## Problem Statement

The problem the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories, extensive enough to cover every aspect of the feature. Each one in the form:

1. As an <actor>, I want a <feature>, so that <benefit>

Example: As a mobile bank customer, I want to see the balance on my accounts, so that I can make better informed decisions about my spending.

## Implementation Decisions

The implementation decisions that were made:

- The modules that will be built or modified
- The interfaces of those modules that will change
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Name modules and interfaces rather than file paths or code snippets, because paths and snippets go stale fast. Exception: when a prototype produced a snippet that encodes a decision more precisely than prose can (a state machine, a reducer, a schema, a type shape), inline it within the relevant decision, trimmed to the decision-rich parts, and note that it came from a prototype.

## Testing Decisions

The testing decisions that were made:

- What makes a good test here: external behaviour observed through the interface, never implementation details
- Which modules will be tested
- Prior art for the tests: similar tests already in the codebase

## Out of Scope

What this spec deliberately leaves out.

## Further Notes

Anything else worth recording about the feature.
```
