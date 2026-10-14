---
name: wayfinder
description: Plan work too big for one session, or whose way to the destination is unclear, as a map of decision tickets at docs/maps/<slug>/ resolved one per session, then a roadmap of features carried through the feature, tasks and implement skills until the destination is reached.
disable-model-invocation: true
---

# Wayfinder

A loose idea has arrived, too big for one session and wrapped in **fog**: the way from here to the **destination** is not visible yet. Wayfinding finds that way instead of charging at the destination. This skill charts a **map** at `docs/maps/<slug>/MAP.md` with its **decision tickets** under `docs/maps/<slug>/tickets/` (questions whose resolution is a decision, never slices of a build), resolves them one per session until the way is clear, then draws the **roadmap** at `docs/maps/<slug>/ROADMAP.md`: the sequence of features that walks the way, each carried through the `feature`, `tasks` and `implement` skills in turn. Done when the last task of the last feature on the roadmap is `done`.

Standing instructions for every session on a map:

- **Plan, don't do.** A ticket produces a decision; the building belongs to the features on the roadmap. The pull to just build it is the signal that the way is clear enough to roadmap, so answer it by sharpening the decision, and let the feature carry the work.
- **One step per session**: one ticket resolved, or the roadmap drawn, or one feature opened, because each is sized to fill a session and a second step would run on a map the first one changed. Research tickets are the exception: sub-agents resolve them in parallel.
- **Refer by name.** Every ticket and feature has a title. Narration and the map use the title with its link riding inside, because a wall of numbers is illegible.
- The map is an **index**, never a store: a decision lives in exactly one place, its ticket's Resolution. The map gists it in one line and links.
- Keep `docs/maps/` out of version control: add it to `.gitignore` when it is not there yet, because the map is working notes, like `docs/features/`.
- Other sessions may be working other tickets of the same map at the same time, so claim a ticket before any work and reread a file right before editing it.

## The map

`docs/maps/<slug>/MAP.md` is the whole effort at low resolution, loaded once per session. Open tickets are found by listing `tickets/`, never listed in the map.

```markdown
# <Map title>

**Status:** open

## Destination

<what reaching the end of this map looks like: the state of the product or codebase this effort is finding its way to. One or two lines; every session orients to it before choosing a step.>

## Notes

<domain; skills every session should load; standing preferences for this effort>

## Decisions so far

<!-- the index: one line per closed ticket, enough to judge relevance; the detail is in the ticket -->

- [<closed ticket title>](tickets/<NN>-<slug>.md): <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you cannot ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

The roadmap, once drawn, is linked from a `**Roadmap:** [ROADMAP.md](ROADMAP.md)` line after the Status line.

### Tickets

Each ticket is a file at `docs/maps/<slug>/tickets/<NN>-<slug>.md`, numbered from `01` in creation order, so the number never changes. Its body is one question, sized to one session:

```markdown
# <NN>: <Ticket title>

**Type:** grilling | research | prototype | task

**Blocked by:** the numbers and titles of the tickets that gate this one, or "None"

**Status:** open

## Question

<the decision or investigation this ticket resolves>
```

- **Claim** a ticket by setting its Status to `claimed`, first, before any work, so concurrent sessions skip it. An open ticket is unclaimed.
- A ticket is **unblocked** when every ticket on its Blocked by line is `closed`. The **frontier** is the open, unblocked tickets: the edge of the known. Walk it in number order.
- **Close** a ticket by appending a `## Resolution` section holding the answer and setting its Status to `closed`. Assets made while resolving it (a research note, a prototype branch) are linked from the Resolution, never pasted in.

## Ticket types

Every ticket is either **HITL** (human in the loop, worked with a human who speaks for themselves) or **AFK**, driven by the agent alone. A HITL ticket resolves only through that live exchange: the human's side of it is theirs, so a session that answers its own questions has not resolved the ticket.

- **Grilling** (HITL): conversation, the default type. Load the `grilling` and `domain-modeling` skills and grill the decision to the bottom.
- **Research** (AFK): reading documentation, third-party APIs, or local knowledge bases to surface a fact a decision waits on. Resolved by a sub-agent given exactly two things: the ticket's path and the path to [RESEARCH.md](./RESEARCH.md). Use when knowledge outside the working directory is required.
- **Prototype** (HITL): raise the fidelity of the discussion with a cheap, concrete artifact to react to, by [PROTOTYPE.md](./PROTOTYPE.md). Use when "how should it look" or "how should it behave" is the question.
- **Task** (HITL or AFK): manual work a decision is blocked on, with nothing to decide, prototype, or research: signing up for a service so its API can be judged, provisioning access, moving data so its shape can be seen. The one type that does rather than decides; it earns its place by unblocking a decision. The agent drives it alone where it can (AFK); otherwise it hands the human a precise checklist (HITL). The Resolution records what was done and the facts later tickets depend on (where credentials live, new URLs, row counts).

## Fog of war

The map is deliberately incomplete: chart only what you can see. Beyond the live tickets lies the **fog of war**: decisions and investigations you can tell are coming but cannot pin down yet, because they hang on questions still open. Resolving a ticket clears the fog ahead of it, graduating whatever is now specifiable into fresh tickets, until no tickets remain and the fog is gone.

**Not yet specified** holds that dim view: the suspected question, the area to revisit. Everything there is in scope, just too blurry to ticket. Write it as loosely or as fully as the view allows; it doubles as a signpost for whoever reads where the effort is headed.

**Fog or ticket?** The test is whether you can state the question precisely now, not whether you can answer it now. A sharp question is a ticket, even when it is blocked. A blurry one stays fog, coarser than a ticket: one patch may graduate into several tickets, or none, once the frontier reaches it.

## Out of scope

Fog only gathers toward the destination. Work beyond it is **out of scope**: consciously ruled out of this effort, and listed in its own section so it never graduates. It returns only if the destination is redrawn, as a fresh map.

When an existing ticket turns out to sit past the destination, close it with a Resolution saying so and leave one line under Out of scope with the gist and the reason, linking the ticket. Decisions so far records the route walked; a scope boundary is not a step on it.

## The roadmap

When no ticket is open and Not yet specified is empty, the way is clear and the next step is the roadmap: `docs/maps/<slug>/ROADMAP.md`, the sequenced list of features that carries the decisions to the destination, drawn in its own session by [ROADMAPPING.md](./ROADMAPPING.md). From there each feature is opened in turn, one in flight at a time, and worked through the `feature`, `tasks` and `implement` skills.

The roadmap is a living artifact: implementing a feature surfaces new fog, new fog becomes tickets, and every ticket closed after the roadmap was drawn sends the roadmap back under review. The map ends when the last task of the last feature is `done`, never when the roadmap is written.

## Invocation

### Chart the map

The user invokes with a loose idea.

1. **Name the destination.** Load the `grilling` and `domain-modeling` skills and pin down the state this map is finding its way to. The destination fixes the scope, so it is settled first.
2. **Map the frontier.** Grill again, **breadth-first**: fan out across the whole space rather than deep on any one thread, surfacing the open decisions and the first steps takeable now. If this surfaces no fog (the way is already clear and the whole journey fits one feature), say so and point the user at the `feature` skill instead: a map earns its keep only on fog.
3. **Create the map** with Destination and Notes filled in, Decisions so far empty, and the fog sketched into Not yet specified. Pick the slug in kebab-case.
4. **Create the tickets you can specify now**, each with its Type and Blocked by, so the frontier and the blocked are told apart. Everything you cannot yet specify stays as fog.
5. **Dispatch one research sub-agent per unblocked research ticket**, claiming each first, all in parallel, and wait for them. A blocked research ticket waits for its blocker, because the decision it hangs on shapes the question (which vendor's API to read). Record each answer as the ticket's Resolution, close it, and append its line to Decisions so far: the dispatching session writes the map, because several researchers run at once and the map is one file.
6. Stop: charting is one session's work, and every other ticket is HITL.

### Work through the map

The user invokes with a map (`/wayfinder docs/maps/<slug>/MAP.md`), optionally naming a ticket or bringing a question implementation surfaced. Without a ticket, you pick the step, not the user.

1. **Load the map**, and the roadmap when the map links one. Read the low-res view, not every ticket body. When the roadmap has a feature `in-progress`, check its tasks and set the entry to `done` once every task is `done`, because `implement` updates only the task.
2. **Fold in what the user brought.** A sharp question becomes a ticket; a blurry one goes into Not yet specified. Adding tickets or fog is part of any step, never a step of its own.
3. **Choose the step**, in this order:
   - A frontier ticket (the one the user named, else the lowest-numbered): **claim it** and resolve it as its Type says. Read the Type line, because the body never states the type. Zoom as needed: read the full body of any related ticket on demand, and load whichever skills the map's Notes name.
   - Every ticket `closed`, no fog, no roadmap yet: **draw the roadmap** by [ROADMAPPING.md](./ROADMAPPING.md).
   - Every ticket `closed`, and one of them is named by no Carries line and no Revisions entry of the roadmap: **revise the roadmap** by [ROADMAPPING.md](./ROADMAPPING.md).
   - A ticket `claimed` by another session, or a feature `in-progress`: report where it stands and stop, because the roadmap is drawn on every resolution and a feature's tasks are worked through `implement`, not here.
   - A roadmap exists and the previous feature is finished: **open the next feature** by [ROADMAPPING.md](./ROADMAPPING.md).
   - Every feature on the roadmap is `done`: **close the map** by [ROADMAPPING.md](./ROADMAPPING.md).
4. **Record a ticket's resolution**: append the Resolution, set the Status to `closed`, and append one line to Decisions so far.
5. **Advance the frontier.** Create the tickets the answer surfaced, and graduate any fog it made specifiable, clearing each graduated patch from Not yet specified so it lives only as its ticket. When the answer shows a ticket sits beyond the destination, rule it out of scope. When the decision invalidates other tickets, update or delete them.
