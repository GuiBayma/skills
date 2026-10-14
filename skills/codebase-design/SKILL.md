---
name: codebase-design
description: Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, deepen a cluster of shallow modules, decide where a seam goes, make code testable through its interface, design an interface several ways (design it twice), or when another skill needs the deep-module vocabulary.
---

# Codebase design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Depth buys **leverage** for callers and **locality** for maintainers. Standing instruction: wherever code is designed or restructured, say it in the glossary terms below, because one vocabulary across prompts, docs, code and the skills that load this one is what lets every reader mean the same thing. A design is settled in this skill's terms when every module named passes the deletion test, every seam has two adapters or none, and every test crosses the interface instead of reaching past it.

## Glossary

Each entry names the canonical term and the common words it replaces, so a reader's word maps onto one term instead of forking the language.

**Module**: anything with an interface and an implementation, exactly one of each. Deliberately scale-agnostic: a function, class, package, or tier-spanning slice. Replaces: unit, component, service.

**Interface**: everything a caller must know to use the module correctly: the type signature, plus invariants, ordering constraints, error modes, required configuration, and performance characteristics. Replaces: API, signature, and the language's `interface` keyword, which name only the type-level surface.

**Implementation**: what is inside a module, its body of code. Distinct from adapter: a thing can be a small adapter with a large implementation (a Postgres repo) or a large adapter with a small implementation (an in-memory fake). Reach for "adapter" when the seam is the topic, "implementation" otherwise.

**Depth**: leverage at the interface: how much behaviour a caller or test can exercise per unit of interface they have to learn. A module is **deep** when a lot of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation. Measure depth as leverage rather than as Ousterhout's ratio of implementation lines to interface lines, because the ratio rewards padding the implementation.

**Seam** (Michael Feathers): a place where you can alter behaviour without editing in that place; the location at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. Replaces: boundary, which DDD already uses for bounded context.

**Port**: an interface at a seam, written so that adapters can satisfy it; the Ports & Adapters name for the interface, used when the seam is the topic.

**Adapter**: a concrete thing that satisfies a port at a seam. Names the role (what slot it fills), never the substance (what is inside).

**Leverage**: what callers get from depth: more capability per unit of interface learned. One implementation pays back across N call sites and M tests.

**Locality**: what maintainers get from depth: change, bugs, knowledge, and verification concentrate in one place instead of spreading across callers. Fix once, fixed everywhere.

## Principles

- **Depth lives at the interface.** A deep module can be internally composed of small, mockable, swappable parts; they are simply not part of the interface. A module can have **internal seams** (private to its implementation, used by its own tests) as well as the **external seam** at its interface. Keep internal seams out of the interface even when tests use them, because every exposed seam is interface the caller must learn.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.** Callers and tests cross the same seam, so tests assert on outcomes observable through the interface and survive internal refactors. A test that must change when the implementation changes, or a wish to test past the interface, says the module is the wrong shape.
- **One adapter means a hypothetical seam; two adapters means a real one.** Introduce a seam, and the port behind it, only when something varies across it, typically production and test. A single-adapter seam is indirection: it costs interface and buys nothing.

## Shrinking an interface

When designing an interface, ask: can I reduce the number of methods, simplify the parameters, hide more complexity inside? Two moves do most of the work, because anything a caller must supply, know, or clean up is interface:

- **Take as parameters the dependencies that vary at this seam** (`processOrder(order, paymentGateway)`: production and test need different gateways) rather than constructing them inside the module. A constructed dependency that varies is a hidden fact the caller must know, and a test can reach it only by crossing past the interface. A dependency that has a local stand-in and never varies for callers (a database with an in-memory or embedded double) stays behind an internal seam, swapped there by the module's own tests, because exposing it would be a single-adapter seam.
- **Return results** (`calculateDiscount(cart): Discount`) rather than mutating what was passed in. A returned value is observable at the interface; a side effect has to be inspected somewhere else.

## Going deeper

- **Deepening a cluster of shallow modules**, given its dependencies: [DEEPENING.md](DEEPENING.md) classifies the dependencies, which decides how the deepened module is tested across its seam, and says what to do with the old tests.
- **Designing an interface several ways** before committing: [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md) runs parallel sub-agents, each under a different constraint, and compares the results on depth, locality, and seam placement.
