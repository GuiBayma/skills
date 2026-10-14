# HTML report format

The architectural review is one self-contained HTML file: Tailwind from its CDN for layout, Mermaid from its CDN for graph-shaped diagrams, hand-built divs and inline SVG for the editorial ones (mass diagrams, cross-sections). Mix the two, because a report drawn entirely in Mermaid reads as generic. Done when every candidate has its card, the header and the top recommendation are in place, and the only scripts are the two CDN imports.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## Header

Repo name, date, and a compact legend: solid box = module, dashed line = seam, red arrow = leakage, thick dark box = deep module. The candidates start right after the legend.

## Candidate card

One `<article>` per candidate, the diagram as its centrepiece:

- **Title**: names the deepening ("Collapse the Order intake pipeline").
- **Badge row**: recommendation strength (`Strong` emerald, `Worth exploring` amber, `Speculative` slate) and the dependency category (`in-process`, `local-substitutable`, `remote but owned`, `true external`).
- **Files**: monospaced list, `font-mono text-sm`.
- **Before / After diagram**: two columns, side by side, from the patterns below.
- **Problem**, then **Solution**: one sentence each, as the skill defines them.
- **Wins**: bullets of six words or fewer, each naming the gain in a glossary term: "locality: bugs concentrate in one module", "leverage: one interface, N call sites", "interface shrinks; implementation absorbs the wrappers", "delete 4 shallow wrappers".
- **ADR callout** when there is one: one line in an amber-tinted box.

A diagram that needs a paragraph to be understood gets redrawn rather than explained.

## Diagram patterns

Pick the pattern that fits each candidate and vary them across the report, because the variety is what makes each shape legible.

### Mermaid graph

The workhorse for dependencies and call flow: a `flowchart` when the point is "X calls Y calls Z, and look at the mess", a sequence diagram for "before: six round-trips; after: one". Wrap it in a Tailwind card so it belongs to the page, and style with `classDef` so leakage edges are red and the deep module dark.

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### Hand-built boxes and arrows

Modules as bordered `<div>`s, arrows as inline SVG `<line>` or `<path>` positioned absolutely over a relative container. The pattern for an "after" that shows one thick-bordered deep module with greyed-out internals, a weight Mermaid's layout cannot render.

### Cross-section

Horizontal bands (`h-12 border-l-4`) stacked to show the layers a call passes through. Before: six thin layers each doing nothing. After: one thick band labelled with the consolidated responsibility.

### Mass diagram

Two rectangles per module, one for interface surface and one for implementation. Before: the interface rectangle nearly as tall as the implementation (shallow). After: a short interface over a tall implementation (deep).

### Call-graph collapse

Before: a tree of calls as nested boxes. After: the tree collapsed into one box, the now-internal calls faded inside it.

## Style

- Editorial rather than dashboard: generous whitespace, serif headings optional (`font-serif` sits well with stone and slate).
- One accent colour (emerald or indigo), red for leakage, amber for warnings.
- Diagrams about 320px tall, so before and after sit side by side without scrolling.
- Module labels inside diagrams in `text-xs uppercase tracking-wider`, so they read as schematic rather than as UI.
- Static page: the Tailwind CDN and the Mermaid import are the only scripts.

## Top recommendation

One larger card: the candidate's name, one sentence on why, an anchor link to its card.
