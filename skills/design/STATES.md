# States

How the matrix of IDs is built, and what a rendered artboard looks like when it fails. Step 2 builds the matrix with the first two sections; the critique in step 6 judges artboards with the last one. Adapted from Emil Kowalski's `break-ui` skill (MIT, [emilkowalski/skills](https://github.com/emilkowalski/skills)).

## Value inventory

Before any state, list every value each screen shows: a name, a price, a photo, a list, a date, a status. For each, its **source** (which field, which endpoint, typed by whom), its **limit** (max length, max count, range) or "unbounded", and whether it can be absent. States hidden from the spec surface here: an optional field is an absent state, an unbounded list is a huge state, a user-typed name is a long-text state.

## State catalog

Cross each screen with the states below, and keep every one the inventory makes plausible. Each kept state is an ID; a state that only changes one region is a partial artboard.

- **Data volume**: empty, one, many, huge (the unbounded list at its worst). Empty is a designed screen with a next step, never a blank.
- **Lifecycle**: loading (its skeleton matching the final layout), loaded, refreshing over stale data.
- **Failure**: the request failed, partial data (some fields missing), a validation error on each field that has one, offline when the app can be used offline.
- **Permission and identity**: no permission for an action, the current user among the listed ones.
- **Mixed**: every status at once in one list, because statuses drawn one per screen hide how they look together.
- **Content stress**: the longest plausible text in each user-typed or translated field (names with accents and particles, "de la Cruz", "Conceição"), the largest number with its separators (`1.234.567,89`), plural forms (`1 peça`, `2 peças`), a missing image.
- **Environment**: each breakpoint the project declares, plus the narrowest width it supports; touch, where an action that appears only on hover is unreachable; dark mode and 200% zoom, when the project supports them.

Mock data stays plausible: values a real user would produce, in the project's language, failures spread across the rows of a list rather than piled onto one, domains under `example.com`.

## Failure signatures

What the critique looks for in each rendered artboard, against its ID:

- **Broken**: text clipped with no way to read it whole; an action pushed off screen or under another element; a state the user cannot leave; an action reachable only by hover on a touch breakpoint; a number, amount or date truncated (anything the user compares is never truncated).
- **Ugly**: an avatar or photo squashed out of its ratio; a badge or button wrapping its label; numbers in a column without tabular figures; a skeleton whose shape differs from the loaded screen; spacing or colour off the project's tokens.
- **Fragile**: holds with the mock data, breaks with a plausible value from the inventory (one more word, one more digit, one more item).

For each user-typed field, the artboard settles **truncate, wrap or clamp**, and the critique checks the choice is visible.

Then the wayfinding questions, per screen: where am I, where can I go, what is here, how do I get out. A screen that leaves one unanswered is Broken.
