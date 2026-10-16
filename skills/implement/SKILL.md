---
name: implement
description: Implement one task file written by the tasks skill, test-first, through a PR reviewed by the user until it is merged.
disable-model-invocation: true
---

# Implement

Implement one **task**: the file the user passed with the invocation (`/implement docs/features/<feature-name>/tasks/<NN>-<slug>.md`, or `docs/tasks/<slug>.md` for a stand-alone task). The task, and the spec it names, are the goal; the path to it is yours to choose. Done when every item under the task's **Verification** holds, the task's Status is `done`, and, when the work changed anything under version control, the PR is merged, its branch deleted, and local `main` matches `origin/main`.

Standing instructions for the whole session:

- Every change to code goes through the `tdd` skill (load it before the first change). Keep the red you observed: it is the PR's **before**.
- Load the `codebase-design` skill whenever the shape of an interface or the placement of a seam is in question, so what you build is a deep module at a seam the tests can cross.
- Work in the project's glossary vocabulary and respect the ADRs in the area; load the `domain-modeling` skill for where they live.
- The user reviews every PR, so a PR is a **wait point**, never the end: the skill ends after the merge.

## Process

1. **Load the task.** Read the task file in full, then the spec on its **Spec** line when it has one. Open each task on its **Blocked by** line and check its Status is `done`; a blocker still open stops you here, with the user told which one, because the task was cut assuming its blockers' work is in place. Set the task's Status to `in-progress`. Explore the repo until you know the current state of the code the task touches, because the task names modules and interfaces, never files, and the file layout is yours to find.

2. **Branch**, when the work will change anything under version control. A feature task's branch is `<feature-name>/<NN>-<slug>`, carrying its feature as a prefix so every PR of a feature is found by that prefix (`gh pr list --search "head:<feature-name>/"`); a stand-alone task's branch is its `<slug>`:

   ```sh
   git switch main && git pull --ff-only && git switch -c <branch>
   ```

   Operational work (a migration run, a secret rotated, a dashboard configured) that touches nothing versioned skips the branch and the PR: do it, then go to step 4.

3. **Implement** under the standing instructions above, one slice at a time, every slice green before the next.

4. **Verify.** Tick each item under the task's **Verification** only once you observed it holding. For operational work, record how each item was observed, set the Status to `done`, and stop here.

5. **Open the PR.** Commit, push, and open the PR with the body in [PR.md](./PR.md):

   ```sh
   git push -u origin <branch>
   gh pr create --title "<title>" --body-file <file>
   ```

   Report the CI result you observed for this head (`gh pr checks <number> --watch --fail-fast` waits for it), and again after every push in step 6: a failed check goes back through the fix-and-verify loop, and checks still absent are reported as absent, never as passed, because the user merges on that report.

   Record the PR in the task file, as a `**PR:** <url>` line after the Status line, because the task lives outside version control and `follow-ups` reaches every PR of a feature from its tasks rather than by searching. End the turn with the PR URL. The review is the user's and always happens; the user's next message says which branch of step 6 to take.

6. **Review loop.** The user returns with one of two messages:

   - **Address the review.** Read every point the review raised, from all three places a review lands, because the user may have used any of them:

     ```sh
     gh pr view <number> --comments
     gh api --paginate repos/{owner}/{repo}/pulls/<number>/reviews
     gh api --paginate repos/{owner}/{repo}/pulls/<number>/comments
     ```

     Judge every point, nits included: act on each one you find valid (through `tdd` when it changes code) and push the commit. Update the PR body so it describes the new head (`gh pr edit <number> --body-file <file>`), because `review` reads the body as the present state. Then post one comment on the PR answering the review point by point, each with whether it was changed and why, or why it was kept, because the user decides the next round from that comment alone. Post it even when every point was kept. End the turn with the comment posted: the user decides again, and step 6 repeats until approval.

   - **Approved.** Merge with squash, delete the branch, and sync `main`:

     ```sh
     gh pr merge <number> --squash --delete-branch
     git switch main && git pull --ff-only
     ```

     Set the task's Status to `done`.
