---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea, one question at a time. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

# Grilling

Interview the user relentlessly until you reach a shared understanding, one question per turn. Map the work as a **design tree**: every decision branches into the decisions that hang off it. The session is done when the frontier is empty (every branch visited, nothing silently assumed) and the user confirms the shared understanding; acting on the plan starts after that confirmation.

Load the `domain-modeling` skill when the project has a glossary or ADRs, because terms settled here feed them.

## The frontier

The **frontier** is every decision whose prerequisites are already settled: the questions you can ask now without guessing at answers you have not heard. Ask exactly one question from it per turn, because each answer reshapes the tree: settled decisions push the frontier outward and unblock what depended on them, and a question drafted before that answer lands guesses at it. Recompute the frontier after every answer. Pick the question whose answer reshapes the most of the tree, usually the one nearest the root. A question whose answer depends on another still open waits its turn.

Finding **facts** is your job; **decisions** are the user's. When a frontier question needs a fact from the environment (filesystem, tools, docs), look it up or dispatch a sub-agent, and put only the decision to the user. A running exploration is an unsettled prerequisite: the questions downstream of it wait, and the rest of the frontier stays askable.

## Asking a question

Each question carries a title, a body, the options when the choice is closed, and your recommended answer with its reason. Choose the **form** of the body: the smallest view that shows what each answer would mean. Prose fits a judgement call; a visual form (a diff, a tree, a scenario, a mockup) fits a choice about shape, flow or structure, where prose would leave the user picturing the options in their head. Read [QUESTION-FORMS.md](./QUESTION-FORMS.md) before the first question for the forms and their shapes.

Present it in the message in this shape, or through a question tool when one is available and carries the form; either way, one question, then wait for the answer:

```
❓ **<question title>**

<question body in its chosen form, options included>

➡️ <your recommended answer and why>
```
