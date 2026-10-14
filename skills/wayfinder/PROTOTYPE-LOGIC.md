# Logic prototype

A single, self-contained HTML file (a **shareable demo**) that lets anyone drive a state model by clicking buttons. The shape for a question about **business logic, state transitions, or data shape**: the kind of thing that looks reasonable on paper but only feels wrong once pushed through real cases.

Because it is one file with nothing to install, you can hand it to a non-developer (a designer, a PM, a domain expert) and let them feel the model for themselves. So it speaks their language, not the code's.

## When this is the right shape

- "I'm not sure this state machine handles the edge case where X then Y."
- "Does this data model let me represent the case where..."
- "I want to feel out what the API should look like before writing it."
- Anything where someone wants to **press buttons and watch state change**.

A question of "what should this look like" takes the other branch: [PROTOTYPE-UI.md](./PROTOTYPE-UI.md).

## Process

### 1. State the question

Before writing code, write down what state model and what question you are prototyping: one paragraph, at the top of the demo, in a visible intro. A logic prototype that answers the wrong question is pure waste, so the question stays explicit and checkable later, whether the user is watching now or returning to it AFK.

### 2. Isolate the logic in a portable module

Put the actual logic (the bit answering the question) in a single `<script>` block written as a small, pure module that could be lifted out and dropped into the real codebase later. The page around it is throwaway; this module is not.

The right shape depends on the question:

- **A pure reducer**, `(state, action) => state`, when actions are discrete events and state is a single value.
- **A state machine**, explicit states and transitions, when "which actions are even legal right now" is part of the question.
- **A small set of pure functions** over a plain data type, when there is no implicit current state, just transformations.
- **A class or module with a clear method surface** when the logic genuinely owns ongoing internal state.

Pick the shape that fits the question, not the one easiest to wire to a page. Keep it pure: the page calls into it, and nothing flows the other direction (no DOM, no `document`, no button handlers inside it), because that is what lets the validated module lift into the real codebase on its own once the question is answered.

### 3. Build the shareable HTML file

One file, plain HTML/CSS/JS, everything inline, so it opens by double-click and survives being emailed around; a framework, bundler, or server defeats "shareable".

Write it for a non-developer. Every label is in **domain language**: buttons and state read like the business, not the reducer. Explain in plain words what is happening.

Lay it out with a clean hierarchy, top to bottom:

1. **Title and one-line explanation** of what this demo lets you explore (the question from step 1).
2. **Current state**: the full relevant state as a readable panel (labelled fields rather than a raw JSON dump), re-rendered after every click so the change is visible. Where it helps a non-developer follow, call out what just changed.
3. **Free-play buttons**: one button per action, always available, so anyone can poke at the model in any order. Each click dispatches its action and re-renders the state.
4. **Guided walkthroughs**: a set of **scenarios**, one per tab. Each tab holds a short plain-language description of the scenario (the situation it sets up and what to watch for) and, underneath, the ordered **buttons to press** for it. Each step is a real button: clicking it performs that action and moves to the next step. Starting a walkthrough resets to a known initial state so the scenario runs the same way every time.

Choose scenarios that demonstrate the awkward cases, the ones hard to reason about on paper: the happy path, a tricky edge case, an attempt at something that should be illegal.

Keep it beautiful but restrained: clean typography, generous spacing, one accent colour, so nothing competes with the state and the buttons.

### 4. Hand it over

Send them the file, or open it for them. They will click through the walkthroughs and free-play whenever they get to it. The interesting moments are "wait, that shouldn't be possible" or "huh, I assumed X would be different": those are the bugs in the _idea_, which is the whole point. When they want new actions or a new scenario, add them. Prototypes evolve.

### 5. Capture the answer and the prototype

Once the prototype has answered its question, capture both as [PROTOTYPE.md](./PROTOTYPE.md) rule 6 says. The logic-specific part: the validated reducer, machine, or function set is the decision-rich snippet for the Resolution, and the HTML shell rides along to the throwaway branch, where, being one self-contained file, it stays trivially re-runnable.

## Keeping it a prototype

- **One question.** The prototype answers the ticket's question and nothing more; "what if we wanted X later" is a new ticket.
- **In-memory state**, unless the question is specifically about persistence.
- **A thin shell over a pure module.** The module stays liftable only while the page is the sole side that knows about the DOM.
- **The module is the keeper; the shell is not.** The page is optimised for being clicked through by hand, so the real codebase receives the logic module and nothing of the shell.
