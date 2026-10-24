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
├── motion.md              # the motion sheet (MOTION.md)
├── partials.md            # each partial ID with its base ID and region, when any
├── divergences.md         # divergences accepted during implementation, when any
└── divergences/<ID>--<region>.png  # the app's screenshot behind each region row
```

## Lifecycle

The snapshot is valid from approval until the feature's last task merges. After that the app is the truth: the next `design` that touches these screens starts from the app's screenshots, and this snapshot is history.

Two changes reach it in between, both decided by the user when `implement` finds an artboard it cannot build as drawn:

- **A small divergence accepted**, recorded by `implement` with the reason in its PR, so later tasks compare against what was built. `divergences.md` is a table `| ID | Region | Reason | PR |`:
  - in a task whose scope for the ID is `full`, the app's screenshot replaces `png/<ID>.png`, because the whole screen is built. The ID's region rows and their screenshots go, replaced by one row with region `full`, because the accepted screenshot already holds each of them, and the `full` row is what tells a later render of the whole golden to leave that PNG alone (a render that recreated it would resurrect a design the user overruled). A partial ID is promoted to a whole one: its row leaves `partials.md`, since its PNG now shows the whole screen and the old base no longer applies. An ID that is the base of partials keeps that role, and those partials now compare the rest of the screen against the accepted screenshot;
  - in a task whose scope is a region, `png/<ID>.png` stays, because the rest of the screen is still to be built from it. The divergence goes into `divergences.md` with the app's screenshot at `divergences/<ID>--<region>.png`, and every later comparison of that ID judges that region against the recorded screenshot and the rest against the golden;
  - in a motion row (the animation cannot be built as the sheet says, and the user accepts what was built), the row in `motion.md` is rewritten with the values built, and `divergences.md` gets a row with region `motion: <trigger>` and no screenshot, because the sheet is what `review` checks the code against and a row left as designed would fail every later check. The artboard on the canvas keeps the old motion and is history for that row, so its feel is reported as accepted instead of watched (MOTION.md, Checking the code).
- **A design divergence**: `/design <spec> <ID>…` makes those IDs pending (their `png/<ID>.png`, their rows in `divergences.md` and those rows' screenshots are deleted), and with them every partial whose base they are (`partials.md`), because a partial is comparable only beside its base and `tasks` and `implement` read a PNG's presence as approved. It reopens them on the canvas, and re-exports only their files: their artboards and assets, their PNGs rendered by ID, and their rows of `motion.md` and `partials.md`. Every other ID keeps what it has, so a PNG an earlier divergence replaced stays as it is, and an ID that a full divergence promoted stays out of `partials.md` even though its partial artboard is still on the canvas.

## Exporting

With the Artifact tool, on the approved canvas:

1. Read `project/canvas.json` and every `project/*.dc.html` it lists (`read` with `paths`), plus `artifact-type/dc-runtime.js`. Save them under `canvas/`, the runtime as `support.js`.
2. Download the assets into `canvas/assets/`: list the ids the canvas references (`grep -rhoE '/_blob/[0-9a-f]{32}' canvas/ | sort -u`) and read each one by one (`read` with `path` set to the id: an id in `paths` is refused); the tool names each file `<id>.<ext>`, which is what the render serves. Then render: each failure naming a `/_blob/<id>` is an asset still missing (a font a stylesheet just downloaded points to), so read it and render again until the render passes. A failure naming a relative path (`img/hero.png`, `fonts/x.woff2`) is a reference that neither `/_blob/` nor a file of `canvas/` resolves: fix that file on the canvas (SKILL.md, Code is the source of truth) and export again.
3. Check: one `png/<ID>.png` per board in `canvas.json`. A reopening renders only its IDs.
4. Write `motion.md` from the sheet built in the rounds, and `partials.md` as a table `| ID | Base | Region |`, one row per partial artboard. Every base must be an ID with its own full PNG, so the export is incomplete until it is. A reopening rewrites only the rows of its IDs in both files, because the other rows record decisions made since approval (a promotion, a divergence) that the canvas does not know.

## Rendering

The render is the project's command, named in its design document ([PROJECT.md](./PROJECT.md), Golden render), because it drives the project's browser tooling and writes into the project's docs, and so is tested with the project's own rigour. The skill fixes only its contract; `design` runs it from the project root, and the critique sub-agent runs it on a scratch copy of the canvas. A project without the command stops `design` at step 1, because every round would end in an export that cannot finish.

Given a design directory and, optionally, IDs:

- **Serves `canvas/` as the canvas did**: `/_blob/<id>` resolves to `assets/<id>.<ext>`, a relative path to a file of `canvas/`, and the artboard opens at its board's `w` × `h` from `canvas.json`, the whole page when its `expand` is `fill`.
- **Writes `png/<ID>.png`** (the board's `title`) for every board, or only for the IDs given. An ID not on the canvas is refused. An ID with a `full` row in `divergences.md` is skipped unless named, because its PNG is an accepted screenshot of the app, not a render.
- **Leaves no PNG for an artboard that failed**, its old one deleted, names the artboard and the cause, and exits with an error: a script error, a request that failed or came back 4xx or 5xx, a font or image served but not decoded, a page that never settles within a short timeout. Rendering nothing is an error too. The reason is one in every case: an incomplete or stale golden would pass for an approved one, since `tasks` and `implement` read "every ID has its PNG" as approved.
- **Opens an artboard live**, the same serving without the screenshot, so motion can be watched beside the app (MOTION.md, Feel).

A golden without its PNGs is no golden: the spec stays `Pending` until every ID has one.

## Comparing the app with the golden

An ID's browser test brings the app to that state at that breakpoint and saves a screenshot of the whole screen. Put it beside `png/<ID>.png`, with any region of that ID in `divergences.md` judged against its recorded screenshot instead (a `full` row means the PNG already is the accepted screenshot). A partial ID (a row in `partials.md`) is compared in two parts: its region against `png/<ID>.png`, and the rest of the screen against `png/<base>.png` (with the base's own divergences); its `full` scope means both parts. Then compare as a designer would: layout, hierarchy, spacing, colour, type, the content each region shows. The golden is intent, never pixels: its components are hand-made HTML, so a difference of rendering (anti-aliasing, a pixel of padding the real component carries) is no finding, and a difference a user would notice is.
