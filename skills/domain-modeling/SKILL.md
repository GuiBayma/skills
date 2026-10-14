---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to settle the ubiquitous language (a glossary term, a bounded context), record an architectural decision (ADR), or another skill needs the domain model kept current.
---

# Domain modeling

Standing instructions for building the project's domain model while you design: challenge terms, invent scenarios, and write the glossary and decisions down the moment they crystallise. The skill is done for a session when every term resolved in conversation is in the glossary and every decision meeting the ADR bar was offered as an ADR.

## Where the model lives

Most repos hold a single bounded context: `GLOSSARY.md` at the repo root, decisions in `docs/adr/`. A `GLOSSARY-MAP.md` at the root means multiple contexts: it points to each context's `GLOSSARY.md`, each context keeps its own `docs/adr/` beside its glossary, and the root `docs/adr/` holds system-wide decisions.

Before challenging anything, read the glossary for the context at hand (through the map when there is one) and the ADRs in the area you are touching; infer the context from the topic and ask when it is unclear. Create files lazily, when the first term or decision is ready to write: a missing file means nothing is settled yet, so the skill still applies.

## Standing instructions

### Challenge against the glossary

When a term the user uses conflicts with the glossary, call it out immediately: "Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?" The glossary is the single source of truth for the language; a conflict left standing forks it.

### Sharpen fuzzy language

When the user uses a vague or overloaded term, propose a precise canonical one: "You're saying 'account'. Do you mean the Customer or the User? Those are different things."

### Stress-test with scenarios

When domain relationships are under discussion, invent concrete edge-case scenarios that force the boundaries between concepts to be stated precisely.

### Cross-reference with code

When the user states how something works, check whether the code agrees, and surface any contradiction: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Write the glossary inline

Update `GLOSSARY.md` the moment a term is resolved, in the format in [GLOSSARY-FORMAT.md](./GLOSSARY-FORMAT.md). A term settled in conversation and left for later is lost at compaction or session end.

### Offer an ADR when the bar is met

Offer to record a decision as an ADR when all three hold:

1. **Hard to reverse**: changing your mind later costs something real. An easy reversal gets reversed, not recorded.
2. **Surprising without context**: a future reader would look at the code and wonder why. An unsurprising choice raises no question to answer.
3. **A real trade-off**: there were genuine alternatives and specific reasons picked one. The obvious path needs no record beyond having been taken.

Write it in the format in [ADR-FORMAT.md](./ADR-FORMAT.md), which also lists the kinds of decision that typically meet the bar.
