---
name: tdd
description: Test-driven development, the red → green loop. Use when the user wants a feature built or a bug fixed test-first, says "TDD" or "red-green-refactor", or wants tests that survive refactors because they cross the interface.
---

# Test-driven development

Build in the **red → green** loop, one **slice** at a time, every test at a confirmed **seam**. Standing instructions for the whole session, applied on every cycle. Done when every slice was observed red before it went green, every test sits at a confirmed seam, and no test matches an anti-pattern below.

Tests verify behaviour through the interface, never implementation details: the code can change entirely and the tests stay. A good test reads like a specification ("user can checkout with valid cart" says exactly which capability exists) and survives refactors because it never reaches inside. Name tests and interfaces in the project's glossary vocabulary and respect the ADRs in the area you touch; load the `domain-modeling` skill for where they live.

## Seams: where tests go

A **seam** is where a module's interface lives: the place where behaviour is observed without reaching inside. It is the `codebase-design` term; load that skill when the shape of the interface or the placement of the seam is itself in question. Tests live at seams.

**Test only at confirmed seams.** Before the first test, list the seams under test, each with a one-line note on what it catches and what it misses, and confirm them with the user, because you cannot test everything, and agreeing the seams up front is how the effort lands on the critical paths and the complex logic instead of every edge case. Seams already recorded in the source you work from (a feature spec's Testing Decisions, a task file) count as confirmed: use them without asking again.

## The loop

Each cycle is one **vertical slice**: one seam, one test, one minimal implementation, each test a **tracer bullet** that responds to what the last cycle taught you. Tests written in bulk ahead of the implementation (**horizontal slicing**) verify imagined behaviour: they test the shape of things, go insensitive to real changes, and commit you to a test structure before the implementation is understood.

1. **Red.** Write one test and run it. Red is observed, never assumed: read the failure and check it is the behaviour the test names going missing, because a test that fails for another reason (a typo, a wrong import) or that never ran red can pass by construction once the code exists. For a bug, the red is a test that reproduces it at the seam, and that test stays as the regression guard.
2. **Green.** Write only enough code to turn the test green, leaving behaviour no test demands yet for the slice that will demand it. Run the test, then the suite: green means this test passes and nothing else broke.

## Anti-patterns

Each one as code, beside its good counterpart, is in [tests.md](tests.md): read it when a test's shape is in doubt.

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behaviour has not changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values come from an independent source of truth: a known-good literal, a worked example, the spec.

When a test needs a stand-in for a dependency, read [mocking.md](mocking.md): doubles belong only at the seams where the code leaves the process (a third-party service, or your own service across a network), and those seams are shaped for it.
