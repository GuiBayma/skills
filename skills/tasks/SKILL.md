---
name: tasks
description: Break the current conversation, a plan, or a feature spec into tasks, each sized for one fresh session and one PR, written as files under docs/features/<feature-name>/tasks/ or docs/tasks/, after an adversarial cut by a sub-agent that never sees yours.
disable-model-invocation: true
---

# Tasks

Break a source (the current conversation, a plan, or a feature spec) into **tasks**: tracer-bullet slices, each a deliverable a fresh session can finish and that fits one PR, each declaring the tasks that **block** it. A task may be operational (a migration run, a secret rotated, a dashboard configured) and touch nothing under version control; the deliverable is still observable. Done when the approved tasks are on disk, one file per task in the template of [CUTTING.md](./CUTTING.md), every decision in the source is carried by some task and no task's Context or Verification contradicts its spec, and the **delta** against the adversarial cut was shown to the user.

Read [CUTTING.md](./CUTTING.md) before drafting: it holds the cutting rules and the task template, and it is the single source both you and the adversarial sub-agent cut by.

## Where the tasks live

- **Feature tasks**: when the source is a spec at `docs/features/<feature-name>/SPEC.md`, write `docs/features/<feature-name>/tasks/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first).
- **Stand-alone tasks**: otherwise write `docs/tasks/<slug>.md`.

In both cases, check `.gitignore` and add the directory (`docs/features/` or `docs/tasks/`) when it is not there yet, because tasks are working notes, never part of the codebase, and a spec written by hand has no skill guarding its directory.

## Process

1. **Gather the source.** Work from the conversation. When the user passes a reference (a spec path, a plan file, an issue URL), read its full body. The source is fixed from here on: both cuts are made from it.

   A spec whose `## Design` section is `Pending` stops you here, with the user pointed at `/design <spec>`, because a screen cut into tasks before its golden exists gets built from guesses. A spec whose section names a golden carries its IDs into the cut by [CUTTING.md](./CUTTING.md).

2. **Explore the repo** until you know the current state of the code the work touches. Write tasks in the project's glossary vocabulary and respect the ADRs in that area; load the `domain-modeling` skill for where they live. Look for **prefactoring**: changes that make the implementation easy, cut as their own tasks that come first ("make the change easy, then make the easy change").

3. **Fix the brief** when the source is not a file. Write a brief carrying the problem, the decisions reached, and the constraints, in the source's own words. A brief states _what_ and _why_; sequence and slicing belong to the cuts, so a brief that already hints at them has leaked yours. When the source is a file, the file is the brief.

4. **Draft your cut** by [CUTTING.md](./CUTTING.md).

5. **Dispatch the adversarial cut.** Send a sub-agent exactly two things: the brief (the file path, or the brief text) and the path to `CUTTING.md`. Ask it to explore the repo, cut the brief into tasks by that file, and return the list as title, blocked by, what it delivers, writing nothing to disk. The sub-agent's value is independence: a cut made without yours in view surfaces what yours assumed. Keep steps 6 and 7 waiting until it returns.

6. **Reconcile.** Diff the two cuts: tasks only one has, slices the two draw differently, edges one declares and the other omits. Absorb what improves yours, and record the **delta**: what changed and what you discarded, with the reason for each, because the user needs the delta to trust the cut without reading both.

7. **Review with the user.** Present the cut as a numbered list, each task with title, blocked by, and what it delivers, followed by the delta. Ask whether the granularity is right, whether each edge is a genuine gate, and whether any task should merge or split. Iterate until the user approves.

8. **Write the files** in the location above, one per task, in the template of [CUTTING.md](./CUTTING.md). Leave any source issue or spec untouched.

Work proceeds along the **frontier**: any task whose blockers are all done can start, and a task with no blockers can start now.
