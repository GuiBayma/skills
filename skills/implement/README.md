# implement

Implementa uma **task** escrita por `tasks`, com testes primeiro, por meio de um PR que o usuário revisa até o merge.

**Invocação:** manual (`/implement docs/features/<feature-name>/tasks/<NN>-<slug>.md`, ou `docs/tasks/<slug>.md` para uma task avulsa). Uma task por sessão.

## O que faz

A task e a spec que ela nomeia são o objetivo; o caminho até ele é do agente, sob quatro regras permanentes: toda mudança de código passa por `tdd`, `codebase-design` é carregada sempre que uma interface ou um seam está em questão, o glossário e os ADRs do projeto são respeitados, e um PR é um ponto de espera, nunca o fim.

1. **Carregar a task.** Lê a task e depois a spec. Toda task na linha Blocked by precisa estar `done`, ou a skill para. Marca o Status como `in-progress` e explora o repositório, porque tasks nomeiam módulos e interfaces, nunca arquivos.
2. **Criar o branch.** `<feature-name>/<NN>-<slug>` para uma task de feature, para que todo PR de uma feature seja encontrado pelo prefixo; `<slug>` para uma avulsa. Trabalho operacional que não toca nada versionado (uma migração executada, um segredo rotacionado) pula o branch e o PR.
3. **Implementar**, uma fatia por vez, cada fatia verde antes da próxima. O red observado em cada fatia é guardado como o "antes" do PR.
4. **Verificar.** Cada item em Verification só é marcado depois de observado valendo.
5. **Abrir o PR** com o corpo de `PR.md`, confirmar o registro dos checks esperados e aguardar a CI com `gh pr checks --watch --fail-fast`. Se ainda não houver checks, tenta novamente por até dois minutos; se continuarem ausentes, informa a CI como não confirmada. Quando não houver CI configurada ou os filtros excluírem a mudança, informa que não se aplica, com o motivo. Repete a verificação após cada push na revisão. Registra a URL do PR no arquivo da task (para que `follow-ups` a encontre depois) e encerra o turno.
6. **Loop de revisão.** O usuário volta com uma de duas mensagens:
   - *Responder a revisão*: lê todos os pontos dos três lugares onde uma revisão cai (comentários do PR, reviews, comentários de review), age sobre cada um válido via `tdd`, faz push e reescreve o corpo do PR para o novo head com `gh pr edit --body-file`. As Evidências mostram o Antes e o Depois desse head, com cada SHA identificado e sem rodadas anteriores: a revisão lê o corpo como o estado presente, e o histórico fica no comentário de resposta. Depois, posta esse comentário respondendo ponto a ponto. Repete até a aprovação.
   - *Aprovado*: squash merge, apaga o branch, sincroniza `main`, marca a task como `done`.

Termina quando todo item de Verification vale, o Status da task é `done`, e, quando algo versionado mudou, o PR está mergeado, seu branch apagado, e o `main` local igual a `origin/main`.

## Arquivos

- `SKILL.md`: o processo e as regras permanentes.
- `PR.md`: o template do corpo do PR (Summary, Evidence, Merge Danger). Mudanças de comportamento com lógica testável mostram red e green; documentação mostra o texto antes e depois com as verificações feitas; refatorações que preservam comportamento mostram a suíte existente verde antes e depois. `review` confere os PRs contra ele.
