# wayfinder

Planeja trabalho grande demais para uma sessão, ou cujo caminho até o destino não está claro, como um **mapa** de tickets de decisão resolvidos um por sessão, e depois um **roadmap** de features levadas por `feature`, `tasks` e `implement` até o destino ser alcançado.

**Invocação:** manual. `/wayfinder` com uma ideia solta traça um mapa novo; `/wayfinder docs/maps/<slug>/MAP.md` trabalha um mapa existente, opcionalmente nomeando um ticket ou trazendo uma pergunta que a implementação levantou.

## A ideia

Uma ideia solta chega envolta em **névoa** (fog): o caminho daqui até o destino ainda não está visível. Wayfinding encontra o caminho em vez de avançar às cegas para o destino. O mapa é deliberadamente incompleto: só o que se enxerga é traçado, e resolver um ticket dissipa a névoa adiante dele. Um mapa só vale a pena com névoa; uma ideia que já cabe em uma feature é mandada para `feature`.

Regras permanentes: planejar, não fazer (um ticket produz uma decisão; a construção pertence às features do roadmap); um passo por sessão; referir-se a tickets pelo título; o mapa é um índice, nunca um depósito; `docs/maps/` fica fora do controle de versão; reivindicar um ticket antes de trabalhá-lo, porque outras sessões podem estar no mesmo mapa.

## Os artefatos

- **`MAP.md`**: o esforço inteiro em baixa resolução. Destination, Notes, Decisions so far (uma linha por ticket fechado, com link), Not yet specified (a névoa: perguntas em escopo mas vagas demais para virar ticket), Out of scope.
- **Tickets** em `tickets/<NN>-<slug>.md`: uma pergunta cada, com um Type, uma linha Blocked by e um Status (`open`, `claimed`, `closed`). Fechado ao receber uma Resolution. A **fronteira** é o conjunto de tickets abertos e desbloqueados.
- **`ROADMAP.md`**: a lista sequenciada de features que percorre o caminho, desenhada quando nenhum ticket está aberto e a névoa está vazia, e revisada sempre que um ticket fecha depois de ela ter sido desenhada.

## Tipos de ticket

| Tipo | Quem conduz | Use quando |
| --- | --- | --- |
| Grilling | Humano no circuito (padrão) | Uma decisão a ser grelhada até o fundo com `grilling` e `domain-modeling` |
| Research | Só o agente, via sub-agente com `RESEARCH.md` | Um fato fora do diretório de trabalho de que uma decisão depende |
| Prototype | Humano no circuito, por `PROTOTYPE.md` | A pergunta é "como deve parecer" ou "como deve se comportar" |
| Task | Qualquer um | Trabalho manual que bloqueia uma decisão, sem nada a decidir |

Névoa ou ticket? O teste é se a pergunta pode ser formulada com precisão agora, não se pode ser respondida agora.

## As duas invocações

**Traçar o mapa**: nomear o destino (grilling), mapear a fronteira em largura, criar o mapa e os tickets especificáveis agora, despachar sub-agentes de research para os tickets de research desbloqueados, e parar.

**Trabalhar o mapa**: carregar o mapa, incorporar o que o usuário trouxe, e dar o primeiro passo que se aplica: resolver um ticket da fronteira, afiar a névoa quando todo ticket está fechado e névoa resta, desenhar ou revisar o roadmap, abrir a próxima feature, ou fechar o mapa quando toda feature está `done`.

Termina quando a última task da última feature do roadmap está `done`.

## Arquivos

- `SKILL.md`: o mapa, os tickets, a névoa de guerra e as duas invocações.
- `ROADMAPPING.md`: desenhar, revisar e percorrer o roadmap, abrir features e fechar o mapa.
- `RESEARCH.md`: o briefing de um sub-agente de research.
- `PROTOTYPE.md`, `PROTOTYPE-UI.md`, `PROTOTYPE-LOGIC.md`: como elevar a fidelidade de uma discussão com um artefato barato para reagir, para UI e para lógica.
