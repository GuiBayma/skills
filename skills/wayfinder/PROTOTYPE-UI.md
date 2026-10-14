# UI prototype

Generate **several radically different UI variations** on a single route, switchable from a floating bottom bar. The user flips between variants in the browser, picks one (or steals bits from each), then throws the rest away.

A question about logic or state rather than looks takes the other branch: [PROTOTYPE-LOGIC.md](./PROTOTYPE-LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between three vague mockups in their head.

## Two sub-shapes: strongly prefer sub-shape A

A UI prototype is much easier to judge when it is **butting up against the rest of the app**: real header, real sidebar, real data, real density. A throwaway route on its own is a vacuum where every variant looks fine. Default to sub-shape A whenever there is a plausible existing page to host the variants, and reach for sub-shape B only when the prototype genuinely has no nearby home.

### Sub-shape A: adjustment to an existing page (preferred)

The route already exists. Variants render **on the same route**, gated by a `?variant=` URL search param. The existing data fetching, params, and auth all stay; only the rendering swaps.

Something that has no page yet but *would naturally live inside one* (a new section of the dashboard, a new card on the settings screen, a new step in an existing flow) is still sub-shape A: mount the variants inside the host page.

### Sub-shape B: a new page (last resort)

For the thing that genuinely has no existing page to live inside (an entirely new top-level surface, or a flow that cannot be embedded anywhere sensible).

Create a **throwaway route** following the routing convention the project already uses, named so it is obviously a prototype (the word `prototype` in the path or filename), with the same `?variant=` pattern.

Before committing to sub-shape B, sanity-check: is there really no existing page this could be embedded in? An empty route hides design problems a populated one would expose.

In both sub-shapes the floating bottom bar is identical.

## Process

### 1. State the question and pick N

Default to **3 variants**. More than 5 stops being radically different and starts being noise, so cap there.

Write the plan in one line, in the prototype's location or a top-of-file comment:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

This works whether the user is here to push back or not.

### 2. Generate radically different variants

Draft each variant. Hold each one to:

- The page's purpose and the data it has access to.
- The project's component library and styling system (Tailwind, shadcn, MUI, plain CSS, whatever it is).
- A clear exported component name, such as `VariantA`, `VariantB`, `VariantC`.

Variants are **structurally different**: different layout, different information hierarchy, different primary affordance. Three slightly-tweaked card grids is wallpaper, not a prototype. When two drafts come out too similar, redo one under an explicit constraint ("no card grid").

### 3. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code, adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

For sub-shape A (existing page): keep all the existing data fetching above the switcher; only the rendered subtree changes per variant.

For sub-shape B (new page): the throwaway route under `/prototype/<name>` mounts the same switcher.

### 4. Build the floating switcher

A small fixed-position bar at the bottom-centre of the screen with three pieces:

- **Left arrow**: cycles to the previous variant (wraps around).
- **Variant label**: the current variant key and, when the variant exports a name, that name too, such as `B (Sidebar layout)`.
- **Right arrow**: cycles forward (wraps around).

Behaviour:

- Clicking an arrow updates the URL search param through the framework's router (`router.replace` on Next, `navigate` on React Router) so the variant is shareable and reload-stable.
- Keyboard: `←` and `→` also cycle, except while an `<input>`, `<textarea>`, or `[contenteditable]` is focused.
- Visually distinct from the page (a high-contrast pill with a subtle shadow) so it is obviously not part of the design being evaluated.
- Hidden in production builds: gate on `process.env.NODE_ENV !== 'production'` or the equivalent, so a stray prototype merge cannot ship the bar to users.

Put the switcher in a single shared component so both sub-shapes reuse it, located wherever shared UI lives in the project.

### 5. Hand it over

Surface the URL and the `?variant=` keys. The user will flip through whenever they get to it. The interesting feedback is usually **"I want the header from B with the sidebar from C"**, which is the actual design they want.

### 6. Capture the answer and the prototype

Once a variant has won, capture the answer (which variant and why) and the prototype as [PROTOTYPE.md](./PROTOTYPE.md) rule 6 says: the full set of variants and the switcher go to the throwaway branch as the primary source, and `main` stays untouched. The feature that carries the decision rewrites the winner properly, because variant code was written under prototype constraints (no tests, minimal error handling).

## Keeping it a prototype

- **Variants disagree about structure.** A change of colour or copy is a tweak; a real variant moves the layout, the hierarchy, or the primary affordance.
- **Share small pieces, own the layout.** A shared `<Header>` is fine; a shared `<Layout>` defeats the point, so each variant is free to throw the layout out.
- **Read-only, or stubbed.** A variant that needs to mutate points at a stub, because the question is "what should this look like", not "does the backend work".
