# design

Transforma a UI de uma spec de feature em um **gabarito** (o _golden_ da skill): o design aprovado contra o qual as tasks da feature são construídas e conferidas. As telas são desenhadas num canvas do tipo Design dos Artifacts do Claude, refinadas com você em rodadas de comentários e exportadas para `docs/features/<feature-name>/design/`.

**Invocação:** manual (`/design docs/features/<feature-name>/SPEC.md`), em uma sessão nova do Claude Code, entre a `feature` e a `tasks`, quando a spec tem UI. Com IDs depois da spec (`/design <spec> <ID>…`), reabre só esses artboards, em geral porque a `implement` encontrou um que não dá para construir como foi desenhado. Não roda no Codex, porque depende da ferramenta Artifact. O gabarito exportado, por outro lado, é lido por qualquer agente.

## Princípios

- **O código é a fonte da verdade.** O gabarito é um contrato que vale até o merge da última task da feature. Depois disso, a verdade é o app. Tokens e fontes entram no canvas byte a byte, vindos do projeto.
- **O design decide a aparência e quais estados a tela mostra; a spec decide o comportamento.** Uma mudança de comportamento que surgir nos comentários volta para a spec na aprovação.
- **Copiar soluções, não a cara.** Os apps de referência dão o padrão, e a identidade do projeto dá a cara.
- **A skill é genérica; o projeto especializa.** O `AGENTS.md` do projeto indica a identidade visual, os breakpoints, a fonte de referências (no meu caso, o Mobbin), como subir o app e as skills de princípios visuais e de movimento.

## O que faz

1. **Carrega a spec e a base.** Para uma tela que já existe, a base são screenshots do app de hoje. Para uma tela que outra feature ainda está construindo, a base é o snapshot dela. Uma tela nova não tem base.
2. **Monta a matriz** (`STATES.md`): primeiro o inventário dos valores que cada tela exibe, depois os estados que eles forçam, cruzados com os breakpoints. Cada célula vira um **ID** estável, `<tela>--<estado>@<breakpoint>`.
3. **Pesquisa referências** com sub-agentes em paralelo, um por fluxo, que devolvem texto e links, nunca imagens.
4. **Decide o movimento** (`MOTION.md`). Cada transição de estado passa por quatro filtros (frequência, propósito, função e orçamento) e vira uma linha da ficha de movimento, inclusive as que foram rejeitadas.
5. **Monta o canvas**: uma linha por tela, com a base, os estados e um post-it de referências. Onde a direção está aberta, as variantes ficam lado a lado.
6. **Autocrítica** antes de cada rodada, feita por um sub-agente que não acompanhou a construção. Ele classifica o que encontra como Broken, Ugly ou Fragile.
7. **Rodadas.** Você comenta no canvas e diz `rodada pronta`. O agente responde cada thread, aplica as mudanças e republica como `Round N`. O `aprovado` só vale com a matriz completa e as variantes decididas.
8. **Atualiza a spec** por um diff mostrado no terminal, gravado só depois do seu OK. O diff inclui a seção `## Design`, que liga cada ID a uma user story.
9. **Exporta o snapshot** (`SNAPSHOT.md`): o canvas com runtime e assets, um PNG por ID e a ficha de movimento.

## Arquivos

- `SKILL.md`: o processo.
- `STATES.md`: o inventário de valores, o catálogo de estados e os sinais de falha usados na autocrítica.
- `MOTION.md`: os filtros de animação, o formato da ficha de movimento e como o código é conferido contra ela (lido também por `implement` e `review`).
- `SNAPSHOT.md`: o formato do gabarito em disco, seu ciclo de vida, o export e a comparação com o app (lido também por `tasks`, `implement` e `review`).
- `render.mjs`: renderiza um PNG por ID (todos ou só os IDs dados), ou serve o canvas para ver as animações, usando o Playwright do projeto. Recusa um artboard com erro de script ou recurso que não carregou, sem salvar o PNG dele.
- `render.test.mjs`: testes do `render.mjs`; rode `node --test <dir-da-skill>/render.test.mjs` de um projeto que tenha o Playwright.

## Créditos

O catálogo de estados e os filtros de animação são adaptados das skills de [Emil Kowalski](https://github.com/emilkowalski/skills) (MIT).
