# Design it twice

Explore alternative interfaces for a module being designed or deepened, with parallel sub-agents. After Ousterhout's "Design It Twice": the first idea is rarely the best, and radically different alternatives are what make the comparison informative. Uses the vocabulary in [SKILL.md](SKILL.md). Done when the user has seen every design, the comparison, and your recommendation.

## 1. Frame the problem space

Write a user-facing explanation of the problem space for the module:

- the constraints any new interface must satisfy;
- the dependencies it relies on, each with its category from [DEEPENING.md](DEEPENING.md);
- a rough illustrative code sketch that grounds the constraints: a way to make them concrete, not a proposal.

Show it to the user and proceed at once to step 2: the user reads and thinks while the sub-agents work.

## 2. Dispatch the sub-agents

Dispatch three or more sub-agents in parallel, each to produce a **radically different** interface for the module. Each gets its own technical brief (file paths, coupling details, dependency categories, what sits behind the seam), separate from the user-facing explanation, and a distinct design constraint:

- Minimise the interface: one to three entry points, maximum leverage per entry point.
- Maximise flexibility: many use cases and room for extension.
- Optimise for the most common caller: the default case is trivial.
- When a dependency crosses a seam: design around ports and adapters.

Put the SKILL.md vocabulary and the project's domain glossary (the `domain-modeling` skill says where it lives) in every brief, so each design names things consistently with the architecture language and the domain language.

Each sub-agent returns:

1. the interface: types, methods, params, plus invariants, ordering, error modes;
2. a usage example showing how callers use it;
3. what the implementation hides behind the seam;
4. dependency strategy and adapters;
5. trade-offs: where leverage is high and where it is thin.

## 3. Present and compare

Present the designs one at a time so the user can absorb each, then compare them in prose by **depth** (leverage at the interface), **locality** (where change concentrates) and **seam placement**. Close with your own recommendation: the strongest design and why, or a hybrid when elements from different designs combine well. Be opinionated: the user wants a strong read.
