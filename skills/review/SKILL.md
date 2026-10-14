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

1. **Pin the PR.** Resolve it and bring its branch to disk, because the sub-agents need the code around the diff and the standards files, not only the hunks:

   ```sh
   gh pr view <number> --json number,url,title,body,headRefName,baseRefName   # no number: the current branch's PR
   gh pr checkout <number>
   gh pr diff <number>
   ```

   An empty diff, or a checkout refused by local changes, stops you here with the user told why. Keep the diff command and the PR body: every sub-agent gets both.

   Then read the PR's history from the three places a review lands, because earlier rounds, and the implementer's answers to them, decide what is settled:

   ```sh
   gh pr view <number> --comments
   gh api --paginate repos/{owner}/{repo}/pulls/<number>/reviews
   gh api --paginate repos/{owner}/{repo}/pulls/<number>/comments
   ```

   Write down the settled points (refuted with a reason) and the claimed ones (reported as changed), because every sub-agent gets that list too.

2. **Find the spec sources.** The task file is the primary spec and lives outside version control, so it exists only in this clone:

   1. The path on the PR body's **Task** line.
   2. Otherwise the task whose slug is the branch name: `docs/features/*/tasks/*-<headRefName>.md` or `docs/tasks/<headRefName>.md`.
   3. Otherwise a path the user passed, or the user asked where it is.

   Read the task in full, then the file on its **Spec** line when it has one. A task is one slice of its spec, so the spec supplies context and the task sets the scope. When the user says there is no task, the Spec sub-agent is skipped and the comment says so under `## Spec`.

3. **Find the standards sources.** Collect every file that documents how code is written here, starting from this list and searching `docs/` and `README.md` for more:

   - `AGENTS.md` or `CLAUDE.md`, at the root and in every directory the diff touches.
   - `GLOSSARY.md` for the context the diff touches (through `GLOSSARY-MAP.md` when it exists), because names in the diff use the canonical terms.
   - `docs/adr/` for the area touched (plus the root one when there is a map).
   - `CONTRIBUTING.md` and `CODING_STANDARDS.md` when present.

   Every PR opened by `implement` also answers to the **house standards**, whether or not the repo documents them, carried by the sibling skills beside this one (resolve their paths from this skill's directory and pass them absolute): `../tdd/SKILL.md`, `../tdd/tests.md` and `../tdd/mocking.md` (tests cross the interface, red observed before green, doubles only where the code leaves the process); `../codebase-design/SKILL.md` (deep modules, the deletion test, two adapters or no seam); `../implement/PR.md` (the PR body: Summary, Evidence whose red matches a test in the diff, Merge Danger). Add the smell baseline in [SMELLS.md](./SMELLS.md). The repo overrides: a documented repo standard wins over a house standard or a smell, and anything tooling already enforces is skipped.

4. **Dispatch both sub-agents** together, in parallel, each with the diff command, the PR body, the settled and claimed points, and the paths of its sources; wait for both. Each returns under 400 words, findings only: settled points stay out, and a claimed point the diff does not bear out comes back as a finding.

   - **Standards brief**: read every source, then report each place the diff breaches a documented standard, citing the file and the rule, and each baseline smell, naming it and quoting the hunk. Mark each finding **hard** (a documented standard, repo or house, breached) or **judgement** (a smell: always a heuristic). Check the PR body against `PR.md`: the Evidence names a red that the diff's tests make real.
   - **Spec brief**: read the task, then its spec, then report (a) what the task's **Delivers**, **Context** decisions and **Verification** items ask for that the diff leaves missing or partial, including a ticked item the diff does not make hold; (b) behaviour the diff adds that the task did not ask for, with the spec's **Out of Scope** as the sharpest test; (c) requirements that look implemented but whose implementation looks wrong; (d) the PR body's **Merge Danger** judged against the diff: a door or blast radius the diff contradicts. Mark each finding **missing**, **partial**, **creep** or **wrong**, and quote the task or spec line it rests on.

5. **Publish.** Write the comment in the format of [COMMENT.md](./COMMENT.md), each report under its own heading, verbatim or lightly cleaned, findings numbered within each axis, and post it:

   ```sh
   gh pr comment <number> --body-file <file>
   ```

   End the turn with the comment URL. The user carries it to the `implement` session; the next review, when there is one, is a new session running this skill again.
