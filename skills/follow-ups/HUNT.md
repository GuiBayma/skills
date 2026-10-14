# Hunting one PR

The brief of a hunter sub-agent dispatched by `follow-ups`: how to read one merged PR for **deferred** points and the shape to return them in. Every hunter reads by this file, so the hunts differ by the PR, never by the rules.

## What to read

The PR's whole conversation, from the three places a review lands, plus its body, its commit messages, and the markers its diff added:

```sh
gh pr view <number> --json number,url,title,body,headRefName
gh pr view <number> --comments
gh api --paginate repos/{owner}/{repo}/pulls/<number>/reviews
gh api --paginate repos/{owner}/{repo}/pulls/<number>/comments
gh api --paginate repos/{owner}/{repo}/pulls/<number>/commits --jq '.[] | .sha[:7] + " " + .commit.message'
gh pr diff <number> | grep -nE '^\+.*(TODO|FIXME|HACK|XXX)'
```

Then the task file and the spec, because a point is deferred relative to a scope, and those two are the scope.

## What counts

A point is **deferred** when it was raised as valid and postponed rather than done: the reviewer flagged it and the implementer kept the code with an answer such as "beyond this task", "another task", "a follow-up", "fora do escopo", "não cabe aqui"; the implementer flagged it unprompted (in the PR body, a comment, a commit message, or a marker in the diff) as something the task did not cover; a verification item was ticked with a caveat. Postponement is the signal, whoever raised the point.

A point is **refuted** when the answer argued against the point itself (the reviewer was wrong, the behaviour is intended, the standard does not apply) and the reviewer let it stand. Refuted points are settled and stay out. A point changed in a later commit of the same PR was done and stays out. A point the spec lists under **Out of Scope** is still returned, marked as such, because the user decides whether an exclusion still holds now that the feature is finished.

## Shape

Return every candidate in this shape, under 150 words each, and "none" when the PR deferred nothing. A point the implementer raised and postponed in one statement (a PR body line, a commit message, a marker in the diff) is its own deferral: quote it once under **Raised**, write "same statement" under **Deferred**, and locate it by what it is (a comment or review URL, the PR body, a commit sha, a diff path and line).

```markdown
### <title: the point in one line>

- **Raised:** "<quote>" (<reviewer | implementer>, <where>)
- **Deferred:** "<quote of the answer that postponed it>" (<who>, <where>) | same statement
- **Why it was out of scope:** <the task or spec line the deferral leaned on, quoted, or "none given">
- **Where it applies:** <the modules, docs, or contracts named in the exchange, as the PR saw them>
- **Out of Scope in the spec:** yes, "<spec line>" | no
```
