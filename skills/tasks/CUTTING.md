# Cutting rules

The rules for cutting a brief into tasks, and the file each task is written to. Any agent cutting a brief (the main agent and the adversarial sub-agent alike) cuts by this file, so the two cuts differ by judgement, never by rules.

## Slicing

- Each task is a **tracer bullet**: a narrow but complete path through every layer the work crosses (schema, API, UI, tests), vertical rather than a horizontal slice of one layer, so a finished task is demoable or verifiable on its own.
- Each task fits one fresh session and one PR: a session starting from the task file alone, with no memory of this conversation, can finish it and leave every check green. When the work is operational and touches nothing versioned, the PR bound drops and the session bound stays.
- Prefactoring comes first, in its own tasks, so each later slice lands on code already shaped for it.
- Each task declares its **blocking edges**: the tasks that must complete before it can start, and only those. An edge that is merely convenient ordering is not a gate; a task with no blockers can start immediately.
- Every decision in the brief is carried by some task; the cut is complete when none is left behind.

**Wide refactors are the exception to vertical slicing.** A wide refactor is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the codebase, so a single edit breaks thousands of call sites and no vertical slice can land green. Sequence it as **expand–contract**. Expand: add the new form beside the old so nothing breaks. Migrate: move call sites over in batches sized by blast radius (per package, per directory), each batch its own task blocked by the expand, green batch to batch because the old form still exists. Contract: delete the old form once no caller remains, in a task blocked by every migrate batch. A batch that cannot land green on its own is cut at the wrong boundary: widen it until it does, because every task leaves every check green, with no exception for refactors.

## Writing a task

Write what the task delivers from the user's perspective, never a layer-by-layer implementation list. Name modules and interfaces rather than file paths or code snippets, because paths and snippets go stale fast. Exception: when a prototype produced a snippet that encodes a decision more precisely than prose can (a state machine, a reducer, a schema, a type shape), inline it trimmed to the decision-rich parts and note that it came from a prototype. Write each verification item as an observable behaviour of the deliverable, never an edit to a doc or a named harness, and leave where its test lives and what the docs record to the repo's own docs, because the implementing session follows them, ticks every item, and edits a doc to tick one even when the doc already says it.

The task file is the whole context of the session that works it, so the **Context** section carries every decision from the brief that the task depends on; a feature task names its spec in the **Spec** line and carries in Context only what the spec leaves implicit.

When the spec names a **golden** (its `## Design` section, written by the `design` skill), every ID it lists is checked by every task that changes what that state shows, each on its **Design** line with its scope:

- `(full)`: the whole artboard (for a partial ID, its region plus the rest of its base, as `SNAPSHOT.md` compares it). Exactly one task per ID carries it, the last one to change that state, and it is blocked by every other task that lists the ID, because only then can the whole screen match.
- `(region: <what>)`: only the part this task delivers (the filter bar, the empty-state message), which must match its part of `png/<ID>.png`, while the rest of the screen may still differ.

An ID mapped to one story and touched by one task is simply `(full)` on that task. Each listed ID adds a Verification item (the app at that state and breakpoint matches `png/<ID>.png` in the task's scope, compared as [SNAPSHOT.md](../design/SNAPSHOT.md) says), and the motion rows of its IDs add one more, so a task that changes a screen is never done by tests alone and never escapes the comparison by sharing a screen.

A task is worked in a fresh session pointed at its file; that session sets Status to `in-progress` when it starts, records the PR it opens on a **PR** line after the Status line, and sets Status to `done` when every verification item holds.

## Task template

```markdown
# <NN>: <Task title>

**Delivers:** the end-to-end behaviour or operational outcome this task makes real, from the user's perspective.

**Blocked by:** the numbers (or slugs, for stand-alone tasks) and titles of the tasks that gate this one, or "None (can start immediately)".

**Spec:** `docs/features/<feature-name>/SPEC.md`

**Design:** the IDs from the spec's golden this task changes, each with its scope (`<screen>--<state>@<breakpoint>` (full), `<screen>--<state>@<breakpoint>` (region: <what>), …), or "None"

**Status:** ready

## Context

The decisions from the brief this task depends on.

## Verification

- [ ] An observable condition that holds when the task is done
- [ ] Another one
```

Stand-alone tasks drop the `<NN>: ` prefix from the title and the **Spec** and **Design** lines, because they have no spec.
