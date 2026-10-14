---
name: follow-ups
description: After the last task of a feature is done, hunt the points deferred across its PRs (raised and postponed, never refuted), verify each against main, and triage them with the user into tasks or discards.
disable-model-invocation: true
---

# Follow-ups

Hunt the **follow-ups** of one finished feature: the one whose spec the user passed with the invocation (`/follow-ups docs/features/<feature-name>/SPEC.md`). A follow-up is a point that was **deferred** during the feature's cycle: raised in a PR (by the reviewer, or by the implementer about its own work) and postponed as beyond the task, rather than **refuted** on its merits. Deferred points are valid work with no task to carry them, so once the feature ends they are lost unless someone hunts them; this skill is that hunt. Stand-alone tasks have no feature and no follow-ups. Done when every candidate was presented to the user with its evidence, its ground on `main`, and a verdict (**task** or **discard**) with the reason; the user picked; and every pick is cut into tasks by the `tasks` skill, or the user picked none.

Standing instructions for the whole session:

- Every candidate rests on **evidence** quoted from the PR: the point as raised and the answer that deferred it. A candidate with no quote is a guess.
- Triage is yours, the decision is the user's: a candidate the user did not pick is discarded, whatever your verdict.
- The feature's PRs are merged and reviewed, so the code stays out of judgement; the hunt is for work left undone, never for defects in work done.

## Process

1. **Pin the feature.** Read the spec in full, then every task under its `tasks/` directory. A task whose Status is not `done` stops you here, with the user told which one, because a point deferred to a task still open is not a follow-up yet. Collect each task's PR from its **PR** line. A task with no PR line and no operational outcome was implemented before the line existed: find its PR by branch prefix and by the Task line in the body, and ask the user when both fail:

   ```sh
   gh pr list --state merged --search "head:<feature-name>/" --json number,url,headRefName,body
   gh pr list --state merged --limit 300 --json number,url,body \
     --jq '[.[] | select(.body | test("docs/features/<feature-name>/tasks/"))]'
   ```

2. **Dispatch one hunter per PR**, all in parallel, each with the PR number, the path of its task, the spec path, and the path to [HUNT.md](./HUNT.md); wait for all. Each reads the PR as `HUNT.md` says, plus the task and spec, and returns its candidates in the shape of `HUNT.md`, or an explicit "none". The hunt is one sub-agent per PR because the evidence lives in each PR's conversation, and a PR read in full by one agent is a PR read once.

3. **Merge the hunts.** One point is often raised in several PRs (deferred in task 03, deferred again in task 05): fold them into one candidate carrying every origin, because the user triages points, never mentions. Drop a candidate a later PR of the feature plainly delivered; keep the doubtful ones for step 4.

4. **Dispatch one verifier per candidate**, all in parallel, each with the candidate text and the repo's path on `main`; wait for all. Each returns whether the ground still stands (the code, doc, or contract the point was about, located as it is on `main` now) and where the point applies. Verification runs on `main` because the point was raised against a PR head that later PRs may have changed, and a candidate whose ground is gone is a discard, not a task.

5. **Triage and present.** Give every candidate a verdict with its reason, ordered with the tasks first, in this shape, and end the turn so the user picks:

   ```markdown
   1. **<title>** — verdict: **task** | **discard**, because <reason>.
      Raised: "<quote>" (<who>, PR #<n>). Deferred: "<quote>" (<who>, PR #<n>).
      Ground on main: <where it applies, or why it is gone>.
      Direction: <the smallest change that would close it>.
   ```

   A verdict of **task** needs the ground still standing, the point still valid against the spec's decisions, and an owner the spec does not already exclude under **Out of Scope**; an exclusion the spec made deliberately is presented as a discard with the spec line quoted, so the user can overrule it knowingly. A verdict of **discard** names which test failed.

6. **Cut the picks into tasks.** The `tasks` skill is user-invoked, so reach it by path: read `../tasks/SKILL.md` from the siblings of this skill's directory and run its process, with the picked candidates (each with its evidence, ground, and direction) as the source, because they are the whole brief and the session that implements the task has only the task file. Skip this step when the user picked none.
