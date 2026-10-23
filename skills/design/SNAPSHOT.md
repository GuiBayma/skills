# Snapshot

The golden on disk: what `design` exports at approval and what `tasks`, `implement` and `review` read. It lives beside the spec, outside version control like the rest of `docs/features/`, and is readable by any agent with a file tool, because the canvas needs Claude's Artifact tool and the sessions that implement may not have it.

```text
docs/features/<feature-name>/design/
├── canvas/
│   ├── canvas.json        # the canvas index: boards, titles (the IDs), sizes
│   ├── *.dc.html          # one file per artboard, as approved
│   ├── support.js         # the Design runtime the artboards load
│   └── assets/<id>.<ext>  # every uploaded asset, by its id
├── png/<ID>.png           # one image per ID, rendered from canvas/
└── motion.md              # the motion sheet (MOTION.md)
```

## Lifecycle

The snapshot is valid from approval until the feature's last task merges. After that the app is the truth: the next `design` that touches these screens starts from the app's screenshots, and this snapshot is history.

Two changes reach it in between, both decided by the user when `implement` finds an artboard it cannot build as drawn:

- **A small divergence accepted**: `implement` replaces `png/<ID>.png` with the app's screenshot of that ID and records the reason in its PR, so later tasks compare against what was built.
- **A design divergence**: `/design <spec> <ID>…` reopens those IDs on the canvas and re-exports only their files: their artboards and assets, and their PNGs rendered by ID, so a PNG an earlier divergence replaced stays as it is.

## Exporting

With the Artifact tool, on the approved canvas:

1. Read `project/canvas.json` and every `project/*.dc.html` it lists (`read` with `paths`), plus `artifact-type/dc-runtime.js`. Save them under `canvas/`, the runtime as `support.js`.
2. Read each asset the artboards reference (every `/_blob/<id>` in them) one by one (`read` with `path` set to the id: an id in `paths` is refused), into `canvas/assets/`; the tool names each file `<id>.<ext>`, which is what the renderer serves.
3. Render the PNGs, then check the count: one `png/<ID>.png` per board in `canvas.json`. A reopening renders only its IDs.
4. Write `motion.md` from the sheet built in the rounds.

## Rendering and viewing

[`render.mjs`](./render.mjs) serves `canvas/` locally and drives the project's Playwright, so run it from the project root (resolve the script's path from this skill's directory):

```sh
node <skill-dir>/render.mjs docs/features/<feature-name>/design          # png/<ID>.png for every board
node <skill-dir>/render.mjs docs/features/<feature-name>/design <ID>…    # only those IDs; an ID not on the canvas is refused
node <skill-dir>/render.mjs --serve docs/features/<feature-name>/design  # a URL per ID, to watch motion live
```

An artboard with a script error or a resource that did not load (an asset missing from `assets/`, a font that failed) gets no PNG, and the script names it and exits with an error, because an incomplete golden would pass for an approved one: fix the export and render again. A project without Playwright: the script says so and exits; ask the user to install it, or export without PNGs and tell the user the golden has no images to compare against.

## Comparing the app with the golden

An ID's browser test brings the app to that state at that breakpoint and saves a screenshot. Put it beside `png/<ID>.png` and compare as a designer would: layout, hierarchy, spacing, colour, type, the content each region shows. The golden is intent, never pixels: its components are hand-made HTML, so a difference of rendering (anti-aliasing, a pixel of padding the real component carries) is no finding, and a difference a user would notice is.
