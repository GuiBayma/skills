# Question forms

The shapes a grilling question can take. Pick the smallest view that shows what each answer would mean, place it beside the short text it supports, and keep only the calls, files, states and boundaries the decision turns on. One question usually needs one form; two at most.

Diagrams are box-and-line text with box-drawing glyphs, because a terminal renders markdown as plain text; Mermaid stays a code block there.

## Prose with options

A judgement call or trade-off with no structural shape: scope, priority, naming, policy. Each option on its own line with the cost it carries.

```
Who owns retries when the webhook delivery fails?

A. The sender: retries with backoff, gives up after N attempts.
B. The receiver: acknowledges fast, replays from its own queue.
```

## Scenario

A concrete case that forces a boundary to be stated: an edge case, a race, a failure. State the setup and ask what should happen; the user answers with behaviour, which settles the rule.

```
A customer cancels at 09:59; the nightly batch had already picked the order at 09:58.
What does the customer see at 10:00?
```

## Table

A choice with several axes. Options as rows, the criteria that decide as columns; three or four columns at most.

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

The change is the question and the surrounding shape already exists. Match the diff to the topic: code, pseudocode, a tree, a file layout.

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

UI structure, with the state hooks and module boundaries the decision turns on.

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

A visual UI, a layout, a state comparison too dense for text. Write one focused HTML file with the product's colours, type and components, real labels, desktop and mobile; open it, and put the question itself in the message with the path. An ASCII sketch in the message is enough when the question is about placement rather than look.

```
open path/to/grill-<decision>.html
```
