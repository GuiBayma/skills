---
name: retro
description: Retrospective on the cycle behind one merged PR, proposing improvements to the agent's environment (navigation pointers, automated checks, coding standards, steering files, tooling, information access) so future runs vary less.
disable-model-invocation: true
---

# Retro

Hold a **retrospective** on the cycle behind one merged **PR**: the one the user passed with the invocation (`/retro <number or URL>`), or the PR named in the latest commit on `main` when none was passed (after a squash merge its subject ends in `(#<number>)`). Where `review` judged the code, this skill judges the agent's **environment**: the repo's guardrails, steering files, standards, tooling and the information the sessions could reach. Every finding is a proposed edit to that environment, so the next cycle runs with less variance; the code stays out, because the PR is merged and the review already covered it. Done when the candidates were presented to the user, ordered by severity, each with the evidence it rests on, the file that owns the fix (its **home**), and the edit; the user picked; and every picked candidate is written in its home (outside the project) or cut into a task by the `tasks` skill (inside it), or the user picked none.

Standing instructions for the whole session:

- Load the `writing-for-agents` skill before the first finding, because every home is a document an agent reads.
- Every finding rests on **evidence** quoted from a primary source: a turn in a session, a line in the task, a comment on the PR. An improvement with no evidence behind it is a guess, and guesses sediment into steering files.
- Default to **building the check over writing the rule**, and to **deleting over adding**: a mistake caught by a linter, a hook or a CI job needs no prose, and a document that lost a line is easier to follow than one that gained a caveat. A new instruction is the last resort, and it earns its place only when neither a check nor a deletion covers the case.
- The user picks; a candidate not picked is discarded. A picked candidate's home decides what happens to it. Outside the project's version control (the task or spec under `docs/`, the global `AGENTS.md`) you edit it now, in the repo behind the symlink (`readlink -f`), where the user commits it. Inside it, it becomes a task, because every change to the project goes through `implement` and a reviewed PR.

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

   - The environment: the steering files (`AGENTS.md` or `CLAUDE.md` in the repo, and the global one at `~/.claude/CLAUDE.md`), the standards sources `review` reads, and the repo's check commands and CI.

2. **Hunt candidates** in every category below, each checked against every source, because a category skipped is a class of finding missed.

3. **Present** the candidates, ordered by severity, in this shape, and end the turn so the user picks:

   ```markdown
   1. **<category>** — <what went wrong, in one line>.
      Evidence: "<quoted turn, line, or comment>" (<source>).
      Home: `<file>`. Edit: <the change, or the check to build>.
   ```

4. **Write the picks whose home is outside the project**, each edited with `writing-for-agents`, and say what changed in each file. The commit and the PR stay with the user.

5. **Cut the picks whose home is inside the project into tasks.** The `tasks` skill is user-invoked, so reach it by path: read `../tasks/SKILL.md` from the siblings of this skill's directory and run its process, with the picked candidates (each with its evidence, home, and edit) as the source, because they are the whole brief and the session that implements the task has only the task file. Skip this step when no pick lives inside the project.

## Categories

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json` or build-tool `lint`, `check`, `test` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint, typecheck and test command) is itself a finding: an unchecked repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should `review` be given a new rule to enforce? Should an existing rule be removed or clarified? Classify the violation first: a **mechanical** one (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) gets a deterministic check, full stop: a custom rule in the repo's own linter, a new pre-commit hook, or a new CI job, whichever the repo's language and existing guardrail make cheapest. Reserve the standards sources `review` reads (`CODING_STANDARDS.md`, the repo's `AGENTS.md`) for genuine **judgement calls** (cross-file consistency, "matches the surrounding style", anything no guardrail could ever substitute for). _Use when_ the review failed to catch a mistake.
- **Steering files**: are there instructions in the repo's or the global `AGENTS.md` that should move to coding standards or to automated checks instead? _Use when_ a steering file is particularly large, in the repo or in the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLIs, MCPs) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that do not modify the agent's behaviour. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev-server logs, read-only access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

## Reference

### Implementation vs review

All work goes through two stages: implementation and review. The `implement` session has the most **context pressure**: it explores, writes code, and debugs failures. The `review` session has the least: it receives a diff, so no exploration is needed, and it rarely writes code. This means `review` is responsible for imposing coding standards, not `implement`.

### Homes

- `CLAUDE.md` / `AGENTS.md`: pushed into the context window of every agent working in the repo. Use them incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: read during review, not implementation. Add navigation pointers to docs folders if it grows past 1,000 lines.
- Docs: reference files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: docs whose description enters the agent's context, or user-invoked commands. A skill states the destination and the guardrails and leaves the path to the agent, so a finding about a skill is first a deletion or a sharper completion criterion, and a new step only when the session had no way to reach the destination without it.
