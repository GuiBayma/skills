# Deepening

How to deepen a cluster of shallow modules, given its dependencies. Assumes the vocabulary and principles in [SKILL.md](SKILL.md). Done when the cluster sits behind one interface, every dependency has a category and the test strategy that category prescribes, and the old tests are gone.

## Dependency categories

Classify each dependency of the candidate cluster, because the category decides how the deepened module is tested across its seam.

1. **In-process**: pure computation, in-memory state, no I/O. Always deepenable: merge the modules and test through the new interface directly. No adapter needed.
2. **Local-substitutable**: dependencies with a local test stand-in (PGLite for Postgres, an in-memory filesystem). Deepenable when the stand-in exists: tests run the stand-in inside the suite. The seam is internal, so the module's external interface carries no port.
3. **Remote but owned**: your own services across a network (microservices, internal APIs). Define a port at the seam; the deep module owns the logic and the transport is injected as an adapter: HTTP, gRPC or a queue in production, in-memory in tests. Recommendation shape: "Define a port at the seam, implement an HTTP adapter for production and an in-memory adapter for testing, so the logic sits in one deep module even though it is deployed across a network."
4. **True external**: third-party services you do not control (Stripe, Twilio). The deepened module takes the dependency as an injected port; tests provide a mock adapter.

## Replace the tests

Write the new tests at the deepened module's interface, then delete the unit tests on the shallow modules it absorbed. Once interface tests exist, the old tests only pin the internal shape the deepening just dissolved: they fail on every refactor and catch no bug. Treat the deletion as part of the deepening, because tests left behind are the layer that makes the next refactor expensive.
