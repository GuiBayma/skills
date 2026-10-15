# retro

Uma **retrospectiva** do ciclo inteiro por trás de um PR mergeado, julgando o processo em vez do código, e propondo para cada achado uma edição no arquivo que é dono dele.

**Invocação:** manual (`/retro <número ou URL>`, ou sem argumento para o PR nomeado no último commit de squash merge em `main`).

## A ideia

Onde `review` julgou o código, `retro` julga tudo em volta: a spec e a task de que o ciclo foi cortado, as sessões de `implement` e `review` que o trabalharam, os guardrails e arquivos de steering do repositório, e as próprias skills. Todo achado é uma edição proposta no **ambiente** do agente, para que o próximo ciclo rode com menos variância. O código fica de fora, porque o PR está mergeado e já foi revisado.

Três regras valem pela sessão: `writing-for-agents` é carregada antes do primeiro achado, já que todo destino é um documento que um agente lê; todo achado se apoia em evidência citada de uma fonte primária, porque chutes sedimentam em arquivos de steering; e o usuário escolhe, com o destino de cada escolha decidindo o que acontece em seguida.

## O que faz

1. **Reunir as fontes primárias.** O PR (corpo, commits, os três lugares onde uma revisão cai), a task e a spec que ele nomeia, as transcrições das sessões de `implement` e `review` (encontradas com grep em `~/.claude/projects/` e `~/.codex/sessions/`, incluindo as transcrições dos sub-agentes), e o ambiente: arquivos de steering, fontes de padrões, comandos de verificação, CI, e as skills que o ciclo rodou. As transcrições são lidas pelo seu percurso (chamadas de ferramenta, erros, tentativas, chutes), não pelo texto.
2. **Caçar candidatos** em todas as categorias: spec e task, skills, navegação, verificações automatizadas, padrões de código, arquivos de steering, economia de ferramentas, acesso a informação. Cada categoria nomeia seu destino e quando usá-la.
3. **Apresentar** os candidatos em ordem de severidade, cada um com evidência, destino e edição, e encerrar o turno.
4. **Escrever as escolhas cujo destino é fora do projeto** (uma task ou spec em `docs/`, uma skill, o `AGENTS.md` global), editadas com `writing-for-agents`, no repositório por trás do symlink. Commit e PR ficam com o usuário.
5. **Cortar em tasks as escolhas cujo destino é dentro do projeto**, executando o processo da skill `tasks`, porque toda mudança no projeto passa por `implement` e um PR revisado.

## Arquivos

- `SKILL.md`: o processo, o formato de apresentação e as oito categorias.
