# PR body

The body of every PR opened by `implement`. Skip preambles and keep prose brief; write in the project's glossary vocabulary.

```markdown
**Task:** `<path to the task file>`

## Summary

<the smallest view that makes the change clear: a diff, a call tree, a file tree, pseudocode>

## Evidence

- **Before:** <the red: the failing test run, output, or screenshot>
  **After:** <the green: the same test passing, output, or screenshot>

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

The change works, shown as before and after. Screenshots rank first when the change is visual and the environment can take them; execution evidence (the exact test observed red during `tdd`, then green; console output) comes next. Keep the red output you saw at the time, because it cannot be reproduced once the code is green.

## Merge Danger

A **two-way door** can be walked back (a revert restores the previous state); a **one-way door** cannot (a destructive migration, data rewritten, a contract consumers already depend on). The **blast radius** is what the merge can reach beyond the diff: consumers of a changed interface, layout shift, mobile, a shared schema. Consider every possibility and name the ones that are real.
