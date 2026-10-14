---
name: show-me
description: Show a point visually with the smallest view that makes it clear (pseudocode, a diff, a call tree, a file tree, a table, a scenario, an HTML mockup). Use when the user says "show me", when prose would leave the reader picturing a shape in their head, or when another skill needs the forms for a question or a PR summary.
---

# Show me

Make a point visually: pick the **smallest view** that shows what the reader must see, place it beside the short text it supports, and keep only the calls, files, states and boundaries the point turns on. One point usually needs one form; two at most. Done when the reader can see the shape without picturing it.

Diagrams are box-and-line text with box-drawing glyphs, because a terminal renders markdown as plain text; Mermaid stays a code block there.

## Scenario

A concrete case that forces a boundary to be stated: an edge case, a race, a failure. State the setup and what happens (or ask what should).

```
A customer cancels at 09:59; the nightly batch had already picked the order at 09:58.
What does the customer see at 10:00?
```

## Table

Several options across several axes. Options as rows, the criteria that decide as columns; three or four columns at most.

```
| Option      | Latency | Ops cost | Reversible |
| ----------- | ------- | -------- | ---------- |
| Polling     | seconds | none     | yes        |
| Webhook     | instant | endpoint | yes        |
| Stream      | instant | broker   | no         |
```

## Pseudocode

Logic, an algorithm, a state machine. One short block per option, or one block with the open line marked.

```text
on(save)
  if content is unchanged
    return cached result   ← keep, or always write?
  write new content
  return fresh result
```

## Diff

The change is the point and the surrounding shape already exists. Match the diff to the topic: code, pseudocode, a tree, a file layout.

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
-  navigateToSession
+  navigateToSession
+    subscribeToEvents
```

## Call tree or sequence

Runtime control flow: who calls whom, in what order. Indentation for a call tree; a box-and-line chart when more than two parties exchange messages.

```text
┌──────┐  choose command  ┌────┐  expanded prompt  ┌────────┐
│ User │─────────────────▶│ UI │──────────────────▶│ Daemon │
└──────┘                  └────┘◀──────────────────└────────┘
                                   stream result
```

## Component tree

UI structure, with the state hooks and module boundaries the point turns on.

```tsx
<SessionPage> (apps/example/src/routes/session.tsx)
  useSessionEvents()
  <SessionToolbar>
    <RunSkillButton> (packages/ui)
```

## File tree

Where responsibility lives: a module split, a broad refactor. Shallow, one comment per entry.

```text
src/
├── commands/       # parses user actions
├── sessions/       # owns session state
└── transport/      # sends API requests
```

## Full block

A copyable target shape: an interface, a type, a schema, a command signature. Use it when most of the block is new or when omitting context would hide ownership or order.

```ts
function expandSkill(command: string): string {
  const skillName = command.slice(1)
  return `use the ${skillName} skill`
}
```

## Mockup

A visual UI, a layout, a state comparison too dense for text. Write one focused HTML file with the product's colours, type and components, real labels, desktop and mobile; open it, and keep the point itself in the message with the path. An ASCII sketch in the message is enough when the point is placement rather than look.

```
open path/to/show-me-<topic>.html
```
