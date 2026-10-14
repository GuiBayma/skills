# Skill mechanics

The skill-specific branch of [`writing-for-agents`](SKILL.md): what changes when the document is a skill (frontmatter, the invocation choice, portability between Claude Code and Codex, and router skills). Everything else about writing it is the universal reference in `SKILL.md`.

## Invocation

Two choices, trading the two loads:

- A **model-invoked** skill keeps a `description`, so the agent can fire it autonomously, and other skills can reach it. You can still type its name: model-invocation always _includes_ user reach; a description only ever adds agent discovery, never removes the human's. The description is the skill's top-level context pointer, forced to stay loaded at all times: permanent context load in exchange for discoverability. A model-invoked skill whose content is all reference is also one home for shared reference: another skill can invoke it, so reference needed by several skills lives in one place. Mechanics: omit `disable-model-invocation`, and write a model-facing description carrying the trigger branches (the pointer-writing rules in `SKILL.md` apply in full).
- A **user-invoked** skill reserves invocation for an explicit request, spending cognitive load: you are the index that must remember it exists. In Claude Code, `disable-model-invocation: true` removes the description from the model's context: zero context load in Claude Code until invocation, in exchange for that cognitive load. The description becomes a human-facing one-line summary. Codex needs the policy described under Portability; description wording alone does not control invocation there.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and spend cognitive load on remembering when to request it.

Shared reference that two user-invoked skills both need belongs in a plain file outside the skill system: either skill can point at it without requiring implicit invocation of the other.

## Portability

The Agent Skills frontmatter has six portable fields: `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools` (experimental). Keep shared metadata within that set when targeting portable consumers, because Claude Code extensions do not carry the same meaning elsewhere.

For explicit invocation in both products, pair Claude Code's `disable-model-invocation: true` with `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. Codex stores its invocation policy and optional UI metadata (`interface`) there, because the Claude Code frontmatter flag is not its policy mechanism; see [Codex skill configuration](https://learn.chatgpt.com/docs/build-skills#optional-metadata).

Codex has no equivalent to Claude Code's human-only `description`: making the text a human summary does not hide it from the model or disable implicit invocation. Use the YAML policy for invocation and `interface` for UI wording, so presentation does not stand in for enforcement.

## Splitting by invocation

The invocation cut of splitting (the sequence cut lives in `SKILL.md`): split off a model-invoked skill when you have a distinct leading word that should trigger it on its own (a trigger word you actually use in your prompts), or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-invoked skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill**: one user-invoked skill that names the others and when to reach for each, so the human has one skill to remember instead of many. It names the next skill for the human to invoke explicitly, rather than invoking that skill itself.
