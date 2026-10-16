# retro

Uma **retrospectiva** do ciclo por trás de um PR mergeado, julgando o ambiente do agente em vez do código, e propondo para cada achado uma edição no arquivo que é dono dele.

**Invocação:** manual (`/retro <número ou URL>`, ou sem argumento para o PR nomeado no último commit de squash merge em `main`).

## A ideia

Onde `review` julgou o código, `retro` julga o **ambiente** em que as sessões trabalharam: os guardrails e arquivos de steering do repositório, as fontes de padrões, as ferramentas e a informação ao alcance do agente. Todo achado é uma edição proposta nesse ambiente, para que o próximo ciclo rode com menos variância. O código fica de fora, porque o PR está mergeado e já foi revisado.

Quatro regras valem pela sessão: `writing-for-agents` é carregada antes do primeiro achado, já que todo destino é um documento que um agente lê; todo achado se apoia em evidência citada de uma fonte primária, porque chutes sedimentam em arquivos de steering; construir um check vem antes de escrever uma regra, e apagar vem antes de acrescentar, porque uma instrução nova é o último recurso; e o usuário escolhe, com o destino de cada escolha decidindo o que acontece em seguida.

## O que faz

1. **Reunir as fontes primárias.** O PR (corpo, commits, os três lugares onde uma revisão cai), a task e a spec que ele nomeia, as transcrições das sessões de `implement` e `review` (encontradas com grep em `~/.claude/projects/` e `~/.codex/sessions/`, incluindo as transcrições dos sub-agentes), e o ambiente: arquivos de steering, fontes de padrões, comandos de verificação e CI. As transcrições são lidas pelo seu percurso (chamadas de ferramenta, erros, tentativas, chutes), não pelo texto.
2. **Caçar candidatos** nas sete categorias da retro original de Matt Pocock: navegação, verificações automatizadas, padrões de código, arquivos de steering, economia de ferramentas, no-ops, acesso a informação. Cada categoria diz quando usá-la.
3. **Apresentar** os candidatos em ordem de severidade, cada um com evidência, destino e edição, e encerrar o turno.
4. **Escrever as escolhas cujo destino é fora do projeto** (uma task ou spec em `docs/`, o `AGENTS.md` global), editadas com `writing-for-agents`, no repositório por trás do symlink. Commit e PR ficam com o usuário.
5. **Cortar em tasks as escolhas cujo destino é dentro do projeto**, executando o processo da skill `tasks`, porque toda mudança no projeto passa por `implement` e um PR revisado.

## Arquivos

- `SKILL.md`: o processo, o formato de apresentação, as sete categorias e a referência sobre onde cada tipo de achado mora.
