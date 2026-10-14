---
name: retro
description: Retrospective on the cycle behind one merged PR (spec, task, implement and review sessions, repo guardrails, steering files, and the skills themselves), proposing for each finding an edit in the file that owns it.
disable-model-invocation: true
---

# Retro

Hold a **retrospective** on the cycle behind one merged **PR**: the one the user passed with the invocation (`/retro <number or URL>`), or the PR named in the latest commit on `main` when none was passed (after a squash merge its subject ends in `(#<number>)`). Where `review` judged the code, this skill judges the **process**: the spec and task the cycle was cut from, the `implement` and `review` sessions that worked it, the repo's guardrails and steering files, and the skills themselves. Every finding is a proposed edit to the agent's **environment**, so the next cycle runs with less variance; the code stays out, because the PR is merged and the review already covered it. Done when the candidates were presented to the user, ordered by severity, each with the evidence it rests on, the file that owns the fix (its **home**), and the edit; the user picked; and every picked candidate is written in its home (outside the project) or cut into a task by the `tasks` skill (inside it), or the user picked none.

Standing instructions for the whole session:

- Load the `writing-for-agents` skill before the first finding, because every home is a document an agent reads, and its levers (no-ops, negation, duplication, context pointers, completion criteria) are the vocabulary the findings are written in.
- Every finding rests on **evidence** quoted from a primary source: a turn in a session, a line in the task, a comment on the PR. An improvement with no evidence behind it is a guess, and guesses sediment into steering files.
- The user picks; a candidate not picked is discarded. A picked candidate's home decides what happens to it. Outside the project's version control (the task or spec under `docs/`, a skill, the global `AGENTS.md`) you edit it now, in the repo behind the symlink (`readlink -f`), where the user commits it. Inside it, it becomes a task, because every change to the project goes through `implement` and a reviewed PR.

## Process

1. **Gather the primary sources.**

   - The PR, as the hub: body, commits, and the review rounds from the three places a review lands:

     ```sh
     gh pr view <number> --json number,url,title,body,headRefName,mergedAt,commits
     gh pr view <number> --comments
     gh api --paginate repos/{owner}/{repo}/pulls/<number>/reviews
     gh api --paginate repos/{owner}/{repo}/pulls/<number>/comments
     ```

   - The task on the PR body's **Task** line, then the spec on its **Spec** line, read in full, because together they were the implementer's whole context.
   - The sessions: `implement` and `review` each ran in a session of its own, and their transcripts carry what the PR does not show (the exploration, the retries, the commands that failed). Find them by searching the transcripts for the task path, the branch name, or the PR number; the user names the session when the search is ambiguous:

     ```sh
     grep -rl "<task path, headRefName, or PR number>" ~/.claude/projects/ ~/.codex/sessions/
     ```

     A Claude Code session at `<session>.jsonl` keeps the transcripts of the sub-agents it dispatched in `<session>/subagents/`: read them with it, because `review` delegates each axis to a sub-agent and `tasks` the adversarial cut, so their searches, retries and errors are there and only the report reaches the main transcript.

     Read a transcript for its course rather than its text: the tool calls and their errors, the searches, the retries, the turns where the agent asked or guessed.

   - The environment: the steering files (`AGENTS.md` or `CLAUDE.md` in the repo, and the global one at `~/.claude/CLAUDE.md`), the standards sources `review` reads in its step 3, the repo's check commands and CI, and the skills the cycle ran (`feature`, `tasks`, `implement`, `review`, `tdd`, and whatever they loaded), read from the siblings of this skill's directory.

2. **Hunt candidates** in every category below, each checked against every source, because a category skipped is a class of finding missed.

3. **Present** the candidates, ordered by severity, in this shape, and end the turn so the user picks:

   ```markdown
   1. **<category>** — <what went wrong, in one line>.
      Evidence: "<quoted turn, line, or comment>" (<source>).
      Home: `<file>`. Edit: <the change, or the check to build>.
   ```

4. **Write the picks whose home is outside the project**, each edited with `writing-for-agents`, and say what changed in each file. The commit and the PR in the skills repo stay with the user.

5. **Cut the picks whose home is inside the project into tasks.** The `tasks` skill is user-invoked, so reach it by path: read `../tasks/SKILL.md` from the siblings of this skill's directory and run its process, with the picked candidates (each with its evidence, home, and edit) as the source, because they are the whole brief and the session that implements the task has only the task file. Skip this step when no pick lives inside the project.

## Categories

- **Spec and task**: the task and spec were the implementer's whole context, so a defect in them surfaces only when a session hits it. Look for a decision the task left implicit that the session guessed or asked about; a contradiction between task and spec, or between two tasks of one feature; a verification item no one could observe; a blocking edge wrong (the task started on code not yet there, or waited on nothing); a task too large for one PR (many review rounds, or a `missing` or `creep` finding in the review's Spec axis). Home: the task or spec itself while later tasks of the feature still read it; the `feature` or `tasks` skill (`CUTTING.md`) when the template or the cutting rules let the defect through. _Use when_ the session stalled, asked, or guessed on something the task should have carried, or the review's Spec axis had findings.
- **Skills**: a step skipped, misread, or ended early (**premature completion**); a command in the skill that failed; a sub-agent brief that came back off-target; an instruction the session obeyed by default (a **no-op**). Home: the skill, edited with `writing-for-agents`: the fix is a sharper completion criterion, a reason beside the instruction, a leading word, or a deletion, before it is a new rule. _Use when_ the session departed from its skill, or followed it to a bad place.
- **Navigation**: how easily did the session find the right files? Hidden dependencies between files, a convention no config confesses, a module the task named that took many searches to locate. Home: a **navigation pointer** in the repo's `AGENTS.md` or in a doc it points at. _Use when_ the session took many turns to find one piece of information.
- **Automated checks**: a mistake the session made that lint, types, tests, or a filesystem linter could have caught. Read the repo's own check command first (its `package.json` or build-tool `lint`, `check`, `test` scripts, its CI workflow), so a check that exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its checks) is itself a finding, because an unchecked repo is a standing missed opportunity. _Use when_ a check could have caught the mistake, or the repo has no guardrail at all.
- **Coding standards**: should `review` gain a rule, or lose or sharpen one? Standards belong to the review, because the `implement` session runs under the most **context pressure** (exploration, code, debugging) while the review receives a diff and its sources. Classify the breach first: a **mechanical** one (a syntactic pattern, a banned API, an import shape, a file-location rule) gets a deterministic check (a linter rule, a pre-commit hook, a CI job, whichever the repo's guardrail makes cheapest); a **judgement call** (cross-file consistency, "matches the surrounding style") goes in a standards source `review` reads. _Use when_ the review missed a mistake, or the user caught one the review had in reach.
- **Steering files**: the repo's and the global `AGENTS.md`, pushed into every session's context. Instructions that belong in a standards source or a check, lines that changed no behaviour (no-ops), stale layers (sediment), a file past 200 lines. _Use when_ a steering file is large, or a line in it was ignored or already the default.
- **Tool economy**: expensive tool calls that a cheaper one replaces, a CLI or MCP whose output is token-heavy, the same file read many times. Home: a navigation pointer, a wrapper script, a narrower command in the skill. _Use when_ a session spent many tokens on one lookup.
- **Information access**: a crucial piece of information the session could not reach: dev-server logs, a third-party dashboard, a staging database, a design file. Home: a tee of the logs, read-only access, a doc that caches the lookup. _Use when_ the session guessed where it could have looked.
