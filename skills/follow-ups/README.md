# follow-ups

Depois que a última task de uma feature termina, caça os pontos que foram **adiados** ao longo dos seus PRs, verifica cada um contra `main`, e faz a triagem com o usuário em novas tasks ou descartes.

**Invocação:** manual (`/follow-ups docs/features/<feature-name>/SPEC.md`). Roda uma vez por feature, depois que `implement` mergeou todas as tasks. Tasks avulsas não têm feature e portanto não têm follow-ups.

## O problema que resolve

Durante o ciclo de uma feature, revisores e implementadores levantam pontos que são adiados como "fora desta task", em vez de refutados pelo mérito. Esses pontos são trabalho válido sem task que os carregue. Quando a feature termina, eles se perdem, a menos que alguém os cace. Esta skill é essa caça. Ela nunca julga o código em si: os PRs estão mergeados e revisados, e a caça é por trabalho deixado por fazer.

## O que faz

1. **Fixar a feature.** Lê a spec e todas as tasks sob o diretório `tasks/`. Qualquer task que não esteja `done` interrompe a skill. Coleta o PR de cada task pela linha PR, com fallback para busca por prefixo de branch nas tasks implementadas antes de essa linha existir.
2. **Um caçador por PR**, em paralelo. Cada sub-agente lê a conversa de um PR como `HUNT.md` prescreve e devolve candidatos, cada um com a citação que o levantou e a citação que o adiou. Candidato sem citação é chute.
3. **Fundir as caças.** O mesmo ponto adiado em vários PRs vira um único candidato com todas as origens, porque o usuário triagem pontos, não menções.
4. **Um verificador por candidato**, em paralelo, em `main`. O ponto foi levantado contra o head de um PR que PRs posteriores podem ter mudado; um candidato cujo chão sumiu é descarte.
5. **Triagem e apresentação.** Todo candidato recebe um veredito (**task** ou **discard**) com a razão, a evidência, o chão em `main`, e a menor mudança que o fecharia. Uma exclusão que a spec fez em Out of Scope é apresentada como descarte com a linha da spec citada, para que o usuário possa anulá-la conscientemente.
6. **Cortar as escolhas em tasks** executando o processo da skill `tasks`, alcançada por caminho, já que `tasks` é de invocação manual.

A decisão é sempre do usuário: um candidato não escolhido é descartado, seja qual for o veredito.

## Arquivos

- `SKILL.md`: o processo e o formato de apresentação.
- `HUNT.md`: o briefing de cada sub-agente caçador, incluindo como ler um PR e a forma de um candidato.
