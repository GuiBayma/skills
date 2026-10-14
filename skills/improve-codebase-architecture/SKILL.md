---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through the one the user picks.
disable-model-invocation: true
---

# Improve codebase architecture

Surface architectural friction and propose **deepening opportunities**: refactors that turn a cluster of shallow modules into one deep module, for testability and navigability. Load the `codebase-design` skill first, because its glossary (module, interface, depth, seam, adapter, leverage, locality) and principles (the deletion test, the interface is the test surface, two adapters or no seam) are the language of every candidate, and the `domain-modeling` skill for where the project's glossary and ADRs live. Done when the report is on disk and open, the user picked a candidate, and the grilling over it reached a shared understanding; the `feature` skill consolidates that understanding into a spec from there.

## Process

### 1. Explore

**Scope before you scan.** Deepening a module pays off by making the next changes to it cheaper, so the parts of the codebase that keep changing carry the most weight:

- A direction the user named (a module, a subsystem, a pain point) is the scope.
- Otherwise find the **hot spots**, the paths that keep coming up in recent history, and let them pull your attention first; scattered changes with no hot spot widen the net to the whole codebase.

  ```sh
  git log -n 300 --format= --name-only | grep . | sort | uniq -c | sort -rn | head -30
  ```

Read the glossary and the ADRs for the area in scope before reading code, because the glossary names the seams and the ADRs record decisions a candidate must respect.

Then dispatch a sub-agent to walk the scope, briefed with the `codebase-design` vocabulary, and note where understanding the code produces **friction**:

- One concept understood only by bouncing between many small modules.
- A **shallow** module: interface nearly as complex as its implementation.
- Pure functions extracted for testability while the bugs hide in how they are called (no **locality**).
- Coupled modules leaking across their seam.
- Code untested, or testable only past its interface.

Apply the **deletion test** to every suspected shallow module: a candidate is a cluster whose deletion would concentrate complexity in one place, because a deletion that merely moves it is a rename, not a deepening.

### 2. Present the candidates as an HTML report

Write one self-contained HTML file to the OS temp directory, so the repo stays untouched: `$TMPDIR` (falling back to `/tmp`, or `%TEMP%` on Windows), at `<tmpdir>/architecture-review-<timestamp>.html`, a fresh file per run. Open it (`open` on macOS, `xdg-open` on Linux, `start` on Windows) and tell the user the absolute path.

Each candidate is a card whose **before/after diagram** carries the weight; prose is sparse and in glossary terms. [HTML-REPORT.md](HTML-REPORT.md) has the scaffold, the card, the diagram patterns and the style. A card carries:

- **Files**: the modules involved.
- **Problem**: the friction, in one sentence.
- **Solution**: what changes, in one sentence, naming the deepening rather than its interface, because the interface is designed with the user in step 3 and an interface proposed here pre-empts that conversation for a candidate they may not pick.
- **Wins**: the gain in terms of locality, leverage and how tests improve.
- **Dependency category** of what sits behind the new seam, from `DEEPENING.md` in the `codebase-design` skill, because the category decides how the deepened module is tested.
- **Recommendation strength**: `Strong`, `Worth exploring` or `Speculative`.
- **ADR callout** when the candidate contradicts an ADR: name the ADR and why the friction is worth reopening it. A candidate an ADR forbids earns a card only when the friction is strong enough to reopen the decision; the rest stay out, because the ADR already settled them.

Name the domain in the glossary's terms ("the Order intake module", for a glossary that defines Order) and the architecture in the `codebase-design` terms.

End the report with a **Top recommendation**: the candidate you would tackle first and why. Then end the turn asking the user which candidate to explore.

### 3. Grill the pick

Load the `grilling` skill and walk the design tree of the picked candidate with the user: constraints, dependencies, the shape of the deepened module, what sits behind the seam, which tests survive. Two references in the `codebase-design` skill carry the shape of the answers: `DEEPENING.md` for the dependency categories and the test strategy each prescribes, and `DESIGN-IT-TWICE.md` when the user wants the deepened module's interface designed several ways.

The `domain-modeling` skill's standing instructions apply as decisions crystallise (a deepened module named after a concept the glossary lacks gets its entry; a fuzzy term gets sharpened in place). One trigger is specific to this skill: when the user rejects the candidate for a load-bearing reason, offer an ADR so the next architecture review does not re-suggest it. The reason has to be one a future explorer would need, since "not now" and the self-evident need no record.
