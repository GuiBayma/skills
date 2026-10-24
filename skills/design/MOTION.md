# Motion

Where a design animates, and the **motion sheet** that records it. `design` decides the motion with the gates and writes the sheet; `implement` and `review` check the code against the sheet. The gates are adapted from Emil Kowalski's animation skills (MIT, [emilkowalski/skills](https://github.com/emilkowalski/skills)); the values (curves, durations, springs) are the project's, from its tokens and the motion principle skill its `AGENTS.md` names.

## The gates

Every state transition in the matrix (loading to loaded, empty to filled, closed to open, a step to the next) is a **candidate**. It becomes motion only by passing all four gates, in order; most candidates fail, and a screen with none is a fine result.

1. **Frequency.** How often the user sees it. An action seen a hundred times a day gets none; tens of times a day, only motion the user barely notices; occasionally, standard motion; rarely or once (onboarding, a first success), the place where delight is spent. An action started from the keyboard gets none.
2. **Purpose**, named from this list or the candidate fails: feedback (the press was received), spatial consistency (where it came from, where it went), state indication (something changed), preventing a jarring change (content that would jump), explanation (how a thing works), delight (rare actions only).
3. **Function.** Data the user is reading or acting on stays still: motion never delays or moves it for style.
4. **Budget.** A few animations per screen at most, so each one carries meaning; past that, keep the ones with the strongest purpose.

## The motion sheet

`motion.md` in the snapshot: one table, one row per candidate, the survivors with their values and the rejected ones with the gate that stopped them, because a missing animation then reads as a decision, never a defect.

```markdown
| ID | Trigger | Frequency | Purpose | What moves | From → to | Duration | Easing | Origin | Interrupt / exit | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `upload--enviando@mobile` | tap on Enviar | occasional | feedback | progress bar | `scaleX(0)` → `scaleX(1)` | 200ms | `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`) | left edge | retargets; fades out on done | opacity only |
| `lista--carregada@desktop` | data arrives | tens/day | (rejected: frequency) | | | | | | | |
```

- **What moves** uses the standard name for the pattern (crossfade, stagger, shared element, origin-aware popover), because the name carries the behaviour to whoever implements it.
- **Duration and Easing** hold the resolved value with the token beside it, because the implementing session may run without the project's tokens in view and must not guess a curve.
- **Interrupt / exit** says what happens when the trigger repeats mid-animation and how the element leaves (the way it entered, unless the row says otherwise).
- **Reduced motion** is the variant under `prefers-reduced-motion`: gentler, usually opacity only, never a broken state.

## Checking the code

For each row of the sheet the task cites:

- **Values**: the duration, easing, properties and origin in the code match the row, read from the code and, in the ID's browser test, from the element's running animations (`element.getAnimations()`, `getComputedStyle`).
- **Reduced motion**: the same test under reduced motion (Playwright's `reducedMotion: 'reduce'`) shows the row's variant.
- **Rejected rows**: the code adds no motion there.
- **Accepted divergence**: a row that `divergences.md` lists under `motion:` is checked by its values as rewritten; its feel is reported as accepted, because the canvas artboard still shows the motion as designed.
- **Feel**: what the values cannot show (a crossfade's smoothness, a spring's settle) is judged by watching the golden's artboard live (the project's live view, [SNAPSHOT.md](./SNAPSHOT.md) under Rendering) beside the app, and reported as checked by eye.

When the project names a motion principle skill, its review rules apply on top of these checks.
