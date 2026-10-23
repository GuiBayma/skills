# Project

What a project supplies to this skill, and the one document that holds it. The skill is generic: the process, the IDs, the snapshot and the motion sheet are the same everywhere; the look, the widths, the reference source and the way to reach a state come from the project. Step 1 reads this document before anything else; a missing answer is asked of the user once and written here, because the next run needs it too.

The project keeps the answers in one document, pointed at from its `AGENTS.md` (or `CLAUDE.md`) by one line:

```markdown
- Screen design (skill `design`): `docs/design/screen-design.md`.
```

The document has one section per pointer below. Paths and names here are examples; the project's own go in its document.

## Identity

The files that go onto the canvas byte for byte, and the documents that state the visual rules the artboards follow.

```markdown
## Identity

Tokens: `packages/ui/src/tokens.css`. Fonts: `packages/ui/src/font-face.css` and the files under `packages/ui/src/fonts/`.
Visual rules: the documents in this folder (palette, type and spacing, button hierarchy, the app shell).
```

## Breakpoints

Each width the app lays out differently, named as the IDs will name it, with the artboard width that stands for it. A breakpoint whose layout differs is its own ID, so this list sizes the matrix.

```markdown
## Breakpoints

One cut at `(min-width: 48rem)` (`app/src/layout.ts`): `mobile` below it, 390 px artboards; `desktop` from it, 1280 px artboards.
```

## References

Where step 3 borrows patterns from: a connector and its tools, a folder of captures, or none. A connector is switched on by the user, so the document says how.

```markdown
## References

A design-reference connector, tools `mcp__<connector>__*`; when they are missing from the session, ask the user to turn it on.
```

## Principles

The skills, when any, whose rules the critique applies on top of this skill's failure signatures and motion gates: one for the visual side, one for motion.

```markdown
## Principles

Visual: the skill `<visual-skill>`. Motion: the skill `<motion-skill>`. Without them, the rules in this folder are enough.
```

## Base and states

How the agent sees a screen as the app shows it today, and how `implement` later proves an ID: the browser tests that bring the app to a state at a breakpoint and save its screenshot, and the place those screenshots are published for `review` (a CI artifact). A project without them says so, because the base then comes from running the app by hand and `implement` cannot complete its per-ID verification until they exist.

```markdown
## Base and states

Browser tests by ID: `e2e/screens/<ID>.spec.ts`, run with `npm run e2e`, screenshots published as the `screens` CI artifact.
Running the app locally: the "Run locally" section of the root `README.md`.
```
