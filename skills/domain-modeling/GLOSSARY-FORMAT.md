# GLOSSARY.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When several words name one concept, pick the best and list the others under `_Avoid_`, so the glossary settles the argument instead of recording it.
- **Keep definitions tight.** One or two sentences saying what the term IS; what it does belongs in the code.
- **Terms only.** Include the concepts specific to this context's domain. General programming concepts (timeouts, error types, utility patterns) and implementation decisions belong in the code or an ADR, so the glossary stays a glossary and never a spec or scratch pad.
- **Group under subheadings** when natural clusters emerge; a single cohesive area reads fine as a flat list.

## Multi-context repos

A `GLOSSARY-MAP.md` at the repo root lists the contexts, where each lives, and how they relate:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/GLOSSARY.md) — receives and tracks customer orders
- [Billing](./src/billing/GLOSSARY.md) — generates invoices and processes payments
- [Fulfillment](./src/fulfillment/GLOSSARY.md) — manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```
