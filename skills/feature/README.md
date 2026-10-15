# feature

Consolida a conversa atual em uma **spec de feature** em `docs/features/<feature-name>/SPEC.md`: um artefato que carrega o problema e a solução já discutidos.

**Invocação:** manual (`/feature`). É o passo entre uma conversa de design (em geral uma sessão de `grilling`, ou a escolha feita em `improve-codebase-architecture`) e o corte do trabalho em tasks com `tasks`.

## O que faz

1. Explora o repositório até conhecer o estado atual do código que a feature toca, escrevendo no vocabulário do glossário do projeto e respeitando seus ADRs (via `domain-modeling`).
2. Esboça os **seams** em que a feature será testada, nos termos de `codebase-design`. Seams existentes têm preferência sobre novos, e o seam mais alto disponível é o escolhido, porque todo seam é interface que quem chama e os testes precisam aprender.
3. Nomeia a feature em kebab-case e escreve a spec a partir do template.

A spec tem forma fixa: Problem Statement, Solution, User Stories (uma lista numerada longa), Implementation Decisions, Testing Decisions, Out of Scope, Further Notes. As decisões nomeiam módulos e interfaces em vez de caminhos de arquivo ou trechos de código, porque esses envelhecem rápido. A única exceção é um trecho vindo de um protótipo que codifica uma decisão com mais precisão do que a prosa (uma máquina de estados, um schema, o formato de um tipo).

Termina quando a spec está em disco, toda decisão alcançada na conversa está nela, e todo seam que ela nomeia foi pesado contra os seams que a base de código já tem.

## Onde vive

`docs/features/` é anotação de trabalho, não parte da base de código: a skill o adiciona ao `.gitignore` quando ainda não está lá. A spec é a fonte de que `tasks` corta, o contexto que `implement` e `review` leem, e a âncora de onde `follow-ups` caça depois que todas as tasks estão prontas.

## Arquivos

- `SKILL.md`: o processo e o template da spec.
