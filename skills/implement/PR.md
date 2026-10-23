# PR body

The body of every PR opened by `implement`. Skip preambles and keep prose brief; write in the project's glossary vocabulary and in its documentation language, headings included, keeping the sections in this order so `review` finds each one.

```markdown
**Task:** `<path to the task file>`

## Summary

<the smallest view that makes the change clear: a diff, a call tree, a file tree, pseudocode>

## Evidence

**Seams:** <each seam under test, with what it catches and what it misses>

<one slot per category the change falls into, from the list under Evidence below; drop the others>

- **Before:** <the failing test run, the command observed failing, or a screenshot>
  **After:** <the same test or command green, or the new screenshot>
- **Refactor:** `<path of each test file covering the affected interface>`: <the test names>, green before and after
- **Documentation:** before "<the problematic guidance, quoted>"; after "<its replacement, quoted>"; checked: <how links, examples, and consistency with related instructions were checked>
- **Design:** one line per ID on the task's Design line: `<ID>`: `<test that reaches it>`, golden `png/<ID>.png`, app screenshot `<where it is published>`, <matches, or the accepted divergence and why>; motion: <each row checked, and how>

## Merge Danger

**Door:** <one-way or two-way>

<optional: why>

**Blast Radius:** <every surface the merge reaches>

<optional: what the merge can reach>
```

## Task

The path of the task file as the user passed it, because the task lives outside version control, so nothing else in the PR says what the change was meant to deliver.

## Summary

Load the `show-me` skill and pick the form that shows what changed: a diff when the surrounding shape already exists, a tree or pseudocode when most of it is new. Place each visual beside the short text it supports.

## Evidence

List the seams `tdd` chose, each with what it catches and what it misses, because the user saw none of them before the code was written and weighs them here, against the tests that cross them. Keep the line whenever a test carries the evidence, new or already present (an existing test that reproduces the problem, the suite that covers a refactor), and drop it only when no test does (documentation, configuration).

Fill one slot for every category below that the change falls into, because a mixed change (configuration plus refactor) needs each part's evidence. A slot is done when every placeholder in it is replaced by a path, a name or a quote; a summary in its place leaves the slot empty:

- **Behaviour changes with testable logic:** the **Before** is a test observed red during `tdd`, and the **After** is the same test green. Keep new regression tests in the diff; an existing test that reproduces the problem can be cited by path and name without editing it. Console output or a temporary probe (a CI run made to fail, then reverted) complements that test. Screenshots rank first for visual changes when the environment can take them; they complement tests for any logic changed.
- **Configuration and CI wiring** (a build script, a workflow step, an ignore list): the **Before** is the command observed failing (a missing target, a red lint, a temporary probe made to fail and then reverted), and the **After** is the same command green.
- **Documentation changes:** the Documentation slot, one per passage changed.
- **UI against a golden** (the task's Design line names IDs; `None` is no golden): the Design slot. The golden lives outside version control, so name its PNG by path and publish the app's screenshot where the repo's docs say test screenshots go (a CI artifact); `review` compares the pair and cannot run the tests, so a repo with no such place stops you before the PR, with the user told and a task proposed to publish them.
- **Behaviour-preserving refactors:** the Refactor slot. A refactor that also fixes or adds behaviour supplies red-to-green evidence for that part.

Keep the red output you saw at the time, because it cannot be reproduced once the code is green.

## Merge Danger

A **two-way door** can be walked back (a revert restores the previous state); a **one-way door** cannot (a destructive migration, data rewritten, a contract consumers already depend on). The **blast radius** is what the merge can reach beyond the diff: consumers of a changed interface, layout shift, mobile, a shared schema. Consider every possibility and name the ones that are real.
