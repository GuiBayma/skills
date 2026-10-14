# Prototype

A prototype is **throwaway code that answers a question**: the question a wayfinder **prototype** ticket asks. The question decides the shape.

## Pick a branch

Identify which question the ticket is asking, from its body, the surrounding code, or by asking the user:

- **"Does this logic or state model feel right?"** → [PROTOTYPE-LOGIC.md](./PROTOTYPE-LOGIC.md). Build a single shareable HTML file (free-play buttons plus tabbed guided walkthroughs) that pushes the state machine through cases hard to reason about on paper, and that a non-developer can drive.
- **"What should this look like?"** → [PROTOTYPE-UI.md](./PROTOTYPE-UI.md). Generate several radically different UI variations on a single route, switchable through a URL search param and a floating bottom bar.

The two branches produce very different artifacts, so getting this wrong wastes the whole prototype. When the question is genuinely ambiguous and the user is not reachable, default to the branch that matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and marked as such.** Put the prototype close to where the real thing will live (next to the module or page it prototypes for) so the context is obvious, and name it so a casual reader sees it is a prototype. A throwaway UI route follows the routing convention the project already has.
2. **Trivial to run.** A UI prototype starts from one command in the project's task runner (`pnpm <name>`, `python <path>`, `bun <path>`). A logic demo is one HTML file the user double-clicks. Either way, starting it takes no thought.
3. **State lives in memory.** Persistence is what the prototype is checking, never something it depends on. When the question is explicitly about a database, hit a scratch DB or a local file with a clear "PROTOTYPE, wipe me" name.
4. **Skip the polish.** Only the error handling that keeps it runnable, no tests, no abstractions: the point is to learn something fast.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), render the full relevant state so the user sees what changed.
6. **Capture it when done.** Commit the prototype to a throwaway branch `prototype/<NN>-<slug>` named after the ticket, push it, and open no PR: it is a primary source, never merged. Record in the ticket's Resolution the verdict, the question it settled, the branch, and the decision-rich snippet when one encodes the decision better than prose (a reducer, a state machine, a schema, a type shape), because the `feature` skill inlines such snippets into the spec. `main` stays untouched: the feature that carries the decision builds it properly.
