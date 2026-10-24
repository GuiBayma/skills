---
name: design
description: Turn a feature spec's UI into an approved design on a Design canvas, every screen × state × breakpoint an artboard with a stable ID, refined in comment rounds with the user, then exported as a golden snapshot under docs/features/<feature-name>/design/ that tasks, implement and review compare against.
disable-model-invocation: true
---

# Design

Turn the UI of one **spec** (the file passed with the invocation, `/design docs/features/<feature-name>/SPEC.md`) into a **golden**: the approved design that the feature's tasks are built and checked against. You research how better apps solved the same screens, build every screen, state and breakpoint as an artboard on a canvas of the Design Artifact type, refine it with the user in comment **rounds**, and export it. Done when the user approved the design, every state the spec names has an artboard, the snapshot is on disk by [SNAPSHOT.md](./SNAPSHOT.md) with one PNG per ID and a motion row per state transition, and only then the spec diff was approved and written.

Standing instructions for the whole session:

- **Code is the source of truth.** The golden is a contract for building, valid until the feature's last task merges; after that the app is the truth and the snapshot is history. Identity files (tokens, fonts) go onto the canvas byte for byte from the project, never retyped; the one change allowed is in a stylesheet that references other files (a font sheet), whose references become the `/_blob/` URLs of those files, uploaded first, because a relative path resolves on neither the canvas nor the snapshot. A Design System artifact the project names is derived from its code, and the code wins any divergence.
- **The design decides the look and which states a screen shows; the spec decides behaviour.** A behaviour change raised in a comment (a new limit, a new rule) goes back to the spec at approval; a visual one lives only in the design.
- **Borrow solutions, never looks.** A reference app supplies the pattern (how a flow is laid out, what a state shows, where motion helps); the project's identity supplies the face.
- **The project supplies the specifics.** Its `AGENTS.md` (or `CLAUDE.md`) names one document with the answers [PROJECT.md](./PROJECT.md) lists: identity, breakpoints, references, principle skills, base and states. A missing answer: ask the user once and propose its lines for that document (and the pointer line for `AGENTS.md` when the document is new), because the next run needs it too.
- **Sub-agents carry the heavy reading** (reference images, rendered artboards), because this session lasts the whole comment loop and its context has to survive it.
- Follow the Design type's own instructions for the canvas files; they arrive when the canvas is created. Where they forbid rendering or checking without the user's request, this skill is that request: the critique in step 6 and the export in step 9 render on purpose.

## IDs

Every artboard carries one **ID** as its board `title`: `<screen>--<state>@<breakpoint>`, kebab-case, in the spec's glossary vocabulary (`upload--erro-arquivo-grande@mobile`). The ID is the handle the spec, the tasks, the tests and the PNGs share, so it never changes once approved. A breakpoint whose layout differs (a menu that becomes a drawer) is its own ID, never the same artboard resized. A state that differs from another of its screen's states in one detail gets a **partial** artboard showing only the region that changes, still with its full ID, and declares its **base** (the ID of the whole screen it derives from, at the same breakpoint, itself never partial) and its **region** (what the partial shows, named as the user would: the photo field, the error banner). The pair goes into `partials.md` at export, because a partial PNG is only comparable against the app beside its base.

## Process

1. **Load the spec and the base.** Read the spec in full and its `## Design` section:
   - `Pending`: a new design, the whole process below.
   - A golden, and the user named IDs with the invocation (`/design <spec> <ID>…`): a **reopening**, usually because `implement` found an artboard it cannot build. First make the reopened IDs pending as [SNAPSHOT.md](./SNAPSHOT.md) says under Lifecycle (their PNG, their rows in `divergences.md` and those rows' screenshots, and the same for every partial whose base they are), because an ID without its PNG is pending for `tasks` and `implement` until the export renders it again, and an old image or an accepted divergence would outrank the new design. Then work on the same canvas, only those IDs and the states they drag in, through steps 6 to 9; the export replaces only their files, and the spec changes only where those IDs changed it.
   - Anything else (`No UI`, `Waived`, a golden with no IDs named): stop, with the user told what it says.

   Read the project document ([PROJECT.md](./PROJECT.md)). A project with no Golden render command stops you here, with the user told, because every round would end in an export that cannot finish. List the screens the spec touches, and for each one fix its **base**:
   - a screen the app already has: screenshots of the app today, taken by its ID tests where they exist (they are code, so they are the truth), else by running the app as the project says;
   - a screen another feature is still building (its snapshot exists, its last task is not merged): that snapshot;
   - a new screen: none.

2. **Build the matrix** by [STATES.md](./STATES.md): the inventory of values each screen shows, then the states they force, crossed with the project's breakpoints, one ID per cell. Done when every value has a source and a limit (or "unbounded") and every state the spec names, plus every catalog state that applies, has an ID.

3. **Research.** When the project names a reference source, check its tools are in this session; a missing tool stops you here with the user asked to turn it on (a connector is switched by the user, never by you). Dispatch one sub-agent per flow or screen, in parallel, each given the spec path, its rows of the matrix, and the source. Each returns text and links, never images: for each screen, two to four patterns from reference apps, the problem each solves, what to borrow, what to leave (the look), and where motion helped. With no reference source, research by web search and your own knowledge, and tell the user the research was shallower.

4. **Decide the motion** by [MOTION.md](./MOTION.md): every state transition in the matrix passes the gates, and each survivor gets a row of the motion sheet, each rejected one a row saying which gate stopped it.

5. **Build the canvas.** Create one canvas of the Design type titled after the feature, upload the identity files as assets and link them from every artboard, then lay it out:
   - one row per screen, its base first (the app today, as images), then its states, one page per breakpoint;
   - a sticky beside each row naming the patterns used, each with its reference link and what was borrowed from it;
   - where the research left the direction genuinely open, two or three **variants** side by side, each named for its axis (`direta`, `guiada`), never "A/B", titled `<ID>~<variant>`;
   - every animated ID marked `is_interactive`, its motion live in the HTML.

6. **Critique before every round.** Dispatch a sub-agent that never saw you build: give it the canvas folder, [SNAPSHOT.md](./SNAPSHOT.md) to render the artboards on a scratch copy with the project's command, the failure signatures in [STATES.md](./STATES.md), and the principle skills the project names. It returns each finding against an ID, marked **Broken** (a state unreadable or unreachable, text clipped with no way to read it), **Ugly** (works, looks wrong) or **Fragile** (holds now, breaks with plausible data). Fix every Broken before the round; carry the rest into the round message.

7. **Run the round.** Republish, label the version `Round <N>`, and send the user one message: the link; the **decisions for you** (each variant group and each open question, with your recommendation); what held up. Then wait. The user comments on the canvas and says the round is ready (`rodada pronta`, in whatever words): read every comment (the `ArtifactComments` tool), answer each in its own thread with what changed or the question it raises, apply the changes, and go back to step 6. The loop ends when the user approves (`aprovado`), accepted only when every ID of the matrix has an artboard and no variant group is still open; otherwise answer with what is missing. On approval, each variant group collapses to its winner, retitled with the plain ID.

8. **Export the snapshot** by [SNAPSHOT.md](./SNAPSHOT.md). Done when every ID of the matrix has its `png/<ID>.png` and every state transition in the matrix has a row in `motion.md`, kept or rejected. The two checks are separate, because a PNG is a state and a motion row is a transition between states, so their counts never need to agree. An export that cannot finish (an asset that will not download, an artboard that fails to render) stops you here with the spec still `Pending`, because `tasks` cuts any spec that names a golden and every task would then compare against images that do not exist.

9. **Update the spec.** Show the user, in the terminal, the diff of the spec: the behaviour changes the rounds produced, and the `## Design` section rewritten as below. Write it only after the user's OK, because the spec feeds `tasks` and an error there spreads to every task. End the turn with the snapshot path, the number of IDs (each with its PNG) and the number of motion rows.

   ```markdown
   ## Design

   Golden: [design/](design/) (approved <date>, round <N>, <canvas link>)

   - `<ID>`, `<ID>`: user story <n>
   ```

   Every ID appears on some line, each line naming the requirement its artboards make visible, because `tasks` gives each task the IDs of the stories it carries, and every task that changes a state checks its ID.
