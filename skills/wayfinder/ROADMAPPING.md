# Roadmapping

The roadmap phase of a wayfinder map, reached from [SKILL.md](./SKILL.md) once the way is clear: drawing `docs/maps/<slug>/ROADMAP.md`, opening each feature, revising the roadmap when later decisions land, and closing the map. Each of the first three is one session's step.

A **feature** on the roadmap is one spec's worth of work: a user-facing increment the `feature` skill consolidates from one conversation and the `tasks` skill cuts into a handful of PR-sized tasks. Cut features as tracer bullets, each crossing every layer it needs so it is demoable when it lands, rather than as layers. One feature is in flight at a time; a feature is **finished** when every task under its `docs/features/<feature-name>/tasks/` is `done`, including tasks the `follow-ups` skill cut from it.

## Drawing the roadmap

1. **Zoom every closed ticket.** Read each Resolution in full, because the map only gists them and the roadmap must carry every decision.
2. **Cut the decisions into features.** Sequence by dependency first (what later features stand on goes first) and by risk second (what would most reshape the plan if it failed goes early). The cut is complete when every line of Decisions so far is carried by some feature; a decision no feature carries is a gap in the cut, or a line that belongs under Out of scope.
3. **Review with the user.** Present the sequence as a numbered list, each feature with its title, what it delivers, the decisions it carries, and why it sits where it does. Ask whether each feature is one spec's worth, whether the order is forced or merely convenient, and whether any feature should merge or split. Iterate until the user approves.
4. **Write `ROADMAP.md`** in the template below, and add the `**Roadmap:**` line to `MAP.md` after its Status line.

## Opening a feature

Open the first feature with status `planned` when the previous one is finished (or there is none).

1. **Load the context.** Read the feature's entry, the full Resolution of every ticket it carries, and the spec of the previous feature for the state it left, because the new spec is written against that state.
2. **Set the entry's status to `in-progress`.**
3. **Bring the feature into the conversation.** Lay out for the user what the feature delivers and each decision it carries, then load the `grilling` skill and grill what the tickets left for the spec to settle: the detail a decision at map resolution leaves open. Decisions reached here reshape nothing on the map; they belong to the spec.
4. **Hand off.** Tell the user the conversation is ready for the `feature` skill, which consolidates it into `docs/features/<feature-name>/SPEC.md`; `tasks` and `implement` follow from there. Once the spec is on disk, record its path on the entry's Spec line.

## Revising the roadmap

A ticket closed after the roadmap was drawn is a decision the roadmap was made without. Reread the roadmap against it:

- Features `done` or `in-progress` stay as they are. When the decision changes the one in flight, the change goes into its spec and through the `tasks` skill, because its tasks are the contract its sessions work from.
- Features `planned` are open to change: add, split, reorder, or drop them so every decision is carried once more.
- Log the revision under Revisions, naming the ticket that caused it, so a reader can tell why the sequence moved.

Review the revised sequence with the user as in Drawing, step 3.

## Closing the map

When every feature on the roadmap is `done`, set the map's Status to `done`. The map stays on disk as the record of the route.

## Roadmap template

```markdown
# Roadmap: <Map title>

One feature in flight at a time, in this order. The next opens when the previous has every task done.

## Features

1. **<Feature title>** (status: planned | in-progress | done)
   - Delivers: <what the user can do once it lands>
   - Carries: [<ticket title>](tickets/<NN>-<slug>.md), [<ticket title>](tickets/<NN>-<slug>.md)
   - Why here: <the dependency or risk that places it at this point>
   - Spec: `docs/features/<feature-name>/SPEC.md` (once written)

## Revisions

- <date>: <what changed and why, naming the ticket that caused it>
```
