# PR body

The body of every PR opened by `implement`. Skip preambles and keep prose brief; write in the project's glossary vocabulary and in its documentation language, headings included, keeping the sections in this order so `review` finds each one.

```markdown
**Task:** `<path to the task file>`

## Summary

<the smallest view that makes the change clear: a diff, a call tree, a file tree, pseudocode>

## Evidence

- **Before:** <the failing test run, screenshot, or prior state appropriate to the change>
  **After:** <the same test passing, screenshot, or verified new state>

## Merge Danger

**Door:** <one-way or two-way>

<optional: why>

**Blast Radius:** <one-word description>

<optional: what the merge can reach>
```

## Task

The path of the task file as the user passed it, because the task lives outside version control, so nothing else in the PR says what the change was meant to deliver.

## Summary

Load the `show-me` skill and pick the form that shows what changed: a diff when the surrounding shape already exists, a tree or pseudocode when most of it is new. Place each visual beside the short text it supports.

## Evidence

Show before and after with evidence appropriate to the change:

- **Behaviour changes with testable logic:** the **Before** is a test observed red during `tdd`, and the **After** is the same test green. Keep new regression tests in the diff; an existing test that reproduces the problem can be cited by path and name without editing it. Console output or a temporary probe (a CI run made to fail, then reverted) complements that test. Screenshots rank first for visual changes when the environment can take them; they complement tests for any logic changed.
- **Configuration and CI wiring** (a build script, a workflow step, an ignore list): the **Before** is the command observed failing (a missing target, a red lint, a temporary probe made to fail and then reverted), and the **After** is the same command green.
- **Documentation-only changes:** quote the problematic guidance and its replacement, and record how links, examples, and consistency with related instructions were checked.
- **Behaviour-preserving refactors:** identify the existing tests covering the affected interface and show the relevant suite green before and after. A refactor that also fixes or adds behaviour supplies red-to-green evidence for that part.

Keep the red output you saw at the time, because it cannot be reproduced once the code is green.

## Merge Danger

A **two-way door** can be walked back (a revert restores the previous state); a **one-way door** cannot (a destructive migration, data rewritten, a contract consumers already depend on). The **blast radius** is what the merge can reach beyond the diff: consumers of a changed interface, layout shift, mobile, a shared schema. Consider every possibility and name the ones that are real.
