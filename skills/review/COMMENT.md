# Review comment

The one comment `review` posts on the PR. Both headings always appear; a number belongs to one finding within its axis, so the `implement` session can answer "Standards 2" or "Spec 1" by name. The **Summary** ranks within each axis and never across them, because picking one winner across axes is the merge the separation exists to prevent.

```markdown
## Standards

1. **hard** | **judgement** — `<file>:<line>`: <what is wrong>. Standard: <source as a path the implementing session can open: repo-relative for repo files, absolute for house standards and smells> — "<the rule, quoted>". Fix: <what to do>.

_No findings._ (when the axis is clean)
_Metric report unavailable for <check/package>: <reason>._ (one line per collection limitation, alongside findings or "No findings"; not a numbered finding)

## Spec

1. **missing** | **partial** | **creep** | **wrong** — `<file>:<line>`: <what is wrong>. Spec: "<quoted line>" (<task file or SPEC.md>). Fix: <what to do>.

_No findings._ (when the axis is clean)
_No spec available: <reason>._ (when the Spec sub-agent was skipped)

## Summary

Standards: <n> findings; worst: <one line, or none>.
Spec: <n> findings; worst: <one line, or none>.
```
