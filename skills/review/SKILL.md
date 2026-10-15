---
name: review
description: Review the PR opened by the implement skill along two axes, Standards and Spec, and publish the review as one comment on the PR.
disable-model-invocation: true
---

# Review

Review one **PR**: the one the user passed with the invocation (`/review <number or URL>`), or the PR of the current branch when none was passed. The PR was opened by a session running the `implement` skill, and that session answers the review; this one is a fresh pair of eyes that reviews along two **axes** and publishes what it finds. Done when the review is posted as one comment on the PR in the format of [COMMENT.md](./COMMENT.md), with both axes present even when an axis has no findings, and the turn ends with the comment's URL.

- **Standards**: does the diff follow this repo's documented standards and the house standards below?
- **Spec**: does the diff deliver what the task, and the spec behind it, asked for, and nothing else?

Standing instructions for the whole session:

- The comment is the only output: the branch, the working tree and the task files stay as you found them, because the `implement` session owns every change to them.
- Every finding is actionable from the comment alone: the file and line or hunk, the standard or spec line it rests on, and the fix, because the `implement` session acts on it without you in the loop.
- Review the PR as it stands at its head, with its history in view: earlier rounds may have happened, each by a session that is gone, and the `implement` session answered each one point by point. A point it refuted, with its reason on the PR, is **settled** and stays out of this review unless a later commit changed the ground under it; a point it reported as changed is checked against the diff, because the claim is the implementer's and the check is yours; a point never answered is still open.
- Each axis runs in its own **sub-agent**, in parallel, and their reports stay separate in the comment, because a change can pass one axis and fail the other (code that follows every standard and builds the wrong thing; code that does what the task asked and breaks the conventions) and merging the reports lets one axis mask the other.

## Process

1. **Pin the PR and collect standards evidence.** Resolve it and bring its head to disk in a **worktree** of its own, because the sub-agents need the code around the diff and the standards files, not only the hunks, and the clone's branch and working tree belong to the `implement` session:

   ```sh
   gh pr view <number> --json number,url,title,body,headRefName,headRefOid,baseRefName
   gh pr diff <number>
   git fetch origin <headRefName>
   git worktree add --detach "$(mktemp -d)" <headRefOid>
   ```

   An empty diff stops you here with the user told why. Keep the diff command, the PR body and the worktree path: every sub-agent gets all three, reads code in the worktree, and reads the task and spec (outside version control, so absent from the worktree) in this clone.

   **Read the standards sources.** In the worktree, read every file that documents how code is written here, starting from this list and searching `docs/` and `README.md` for more:

   - `AGENTS.md` or `CLAUDE.md`, at the root and in every directory the diff touches.
   - `GLOSSARY.md` for the context the diff touches (through `GLOSSARY-MAP.md` when it exists), because names in the diff use the canonical terms.
   - `docs/adr/` for the area touched (plus the root one when there is a map).
   - `CONTRIBUTING.md` and `CODING_STANDARDS.md` when present.

   Every PR opened by `implement` also answers to the **house standards**, whether or not the repo documents them, carried by the sibling skills beside this one (resolve their paths from this skill's directory and pass them absolute): `../tdd/SKILL.md`, `../tdd/tests.md` and `../tdd/mocking.md` (tests cross the interface, red observed before green, doubles only where the code leaves the process); `../codebase-design/SKILL.md` (deep modules, the deletion test, two adapters or no seam); `../implement/PR.md` (the PR body: Summary, Evidence appropriate to the change as defined there, Merge Danger). Add the smell baseline in [SMELLS.md](./SMELLS.md). The repo overrides: a documented repo standard wins over a house standard or a smell, and anything tooling already enforces is skipped, except for the documented metric attention ranges handled in the Standards brief.

   **Collect metric reports.** From those standards, identify every metric check or package covering files touched by the diff. For each, keep its documented attention ranges and failure thresholds, and locate its run and job through the PR checks:

   ```sh
   gh pr checks <number>
   gh run view <run-id> --json headSha,status,jobs,url
   ```

   Match each run's `headSha` to the pinned `headRefOid`, then read the documented report from its job log or artifact:

   ```sh
   gh run view <run-id> --job <job-id> --log
   gh run download <run-id> --name <artifact-name> --dir <temporary-directory>
   ```

   Use the source documented by the repo; a log is suitable when it contains the report's table. The job summary URL can cite the source, but `gh` does not retrieve its contents. Keep each report with its check or package, source URL and commit, so Standards can account for all touched files covered by a documented metric. A required report that is pending, missing, from another commit or inaccessible becomes a limitation for that check or package; pass available reports alongside those limitations. Collection is complete when each required report is either available for this head or accounted for by a limitation. A repo without a documented metric report needs no metric collection.

   Then read the PR's history from the three places a review lands, because earlier rounds, and the implementer's answers to them, decide what is settled:

   ```sh
   gh pr view <number> --comments
   gh api --paginate repos/{owner}/{repo}/pulls/<number>/reviews
   gh api --paginate repos/{owner}/{repo}/pulls/<number>/comments
   ```

   Write down the settled points (refuted with a reason) and the claimed ones (reported as changed), because every sub-agent gets that list too.

2. **Find the spec sources.** The task file is the primary spec and lives outside version control, so it exists only in this clone:

   1. The path on the PR body's **Task** line.
   2. Otherwise the task the branch names: `docs/features/<feature-name>/tasks/<NN>-<slug>.md` for a branch `<feature-name>/<NN>-<slug>`, or `docs/tasks/<headRefName>.md`.
   3. Otherwise a path the user passed, or the user asked where it is.

   Read the task in full, then the file on its **Spec** line when it has one. A task is one slice of its spec, so the spec supplies context and the task sets the scope. When the user says there is no task, the Spec sub-agent is skipped and the comment says so under `## Spec`.

3. **Dispatch both sub-agents** together, in parallel, each with the diff command, the PR body, the settled and claimed points, and the paths of its sources; Standards also gets each metric report with its check or package, URL, commit and documented ranges, plus every collection limitation from step 1. Wait for both. Each returns under 400 words, findings plus any metric collection limitations: settled points stay out, and a claimed point the diff does not bear out comes back as a finding.

   - **Standards brief**: read every source, then report each place the diff breaches a documented standard, citing the file and the rule, and each baseline smell, naming it and quoting the hunk. Mark each finding **hard** (a documented standard, repo or house, breached) or **judgement** (a smell or a metric in its documented attention range: always a heuristic). Check the PR body against `PR.md`: every section present, and the Evidence's before and after satisfy the category of change defined there and are traceable to the branch. A test it names exists there, new or already present; documentation evidence and refactor verification follow their respective criteria in `PR.md`. For each documented metric report, cross its entries with the diff by file and function (or the unit the report measures, using qualified names when available): report every touched function or unit whose value is in the repo's non-failing attention range as **judgement**, citing its value, the report URL, the repo standard and a concrete inspection or simplification to consider. A function is touched when its body or declaration changes, not merely another function in the same file. Apply the repo's exact range boundaries; values that fail the automated gate stay with CI, and other values outside the attention range stay out of metric findings. Return each collection limitation separately from findings using the Standards line in `COMMENT.md`, including when there are no findings.
   - **Spec brief**: read the task, then its spec, then report (a) what the task's **Delivers**, **Context** decisions and **Verification** items ask for that the diff leaves missing or partial, including a ticked item the diff does not make hold; (b) behaviour the diff adds that the task did not ask for, with the spec's **Out of Scope** as the sharpest test; (c) requirements that look implemented but whose implementation looks wrong; (d) the PR body's **Merge Danger** judged against the diff: a door or blast radius the diff contradicts. Mark each finding **missing**, **partial**, **creep** or **wrong**, and quote the task or spec line it rests on.

4. **Publish.** Write the comment in the format of [COMMENT.md](./COMMENT.md), each report under its own heading, verbatim or lightly cleaned, findings numbered within each axis and metric collection limitations retained as separate lines under Standards even when there are no findings, and post it:

   ```sh
   gh pr comment <number> --body-file <file>
   ```

   Remove the worktree (`git worktree remove <path>`) and end the turn with the comment URL. The user carries it to the `implement` session; the next review, when there is one, is a new session running this skill again.
