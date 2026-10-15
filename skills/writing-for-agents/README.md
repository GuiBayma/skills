# writing-for-agents

Uma referência para escrever qualquer documento que um agente consome: uma skill, um `AGENTS.md` ou `CLAUDE.md`, ou um doc alcançado por um ponteiro em um deles. O empacotamento muda; a escrita não.

**Invocação:** automática. Dispara ao criar ou editar uma skill ou um arquivo de steering. `retro` a carrega antes do primeiro achado, porque todo destino de achado é um documento que um agente lê. As skills deste repositório são revisadas com ela.

## O objetivo

Cortar **variância**: a dispersão entre execuções no processo que o agente segue, mais do que no resultado que produz. Uma revisão com esta skill está completa quando toda alavanca foi conferida contra o documento e cada achado virou uma edição ou uma decisão explícita de manter.

## As alavancas

- **Ponteiros de contexto.** Uma referência mantida em contexto que nomeia material fora dele e codifica quando alcançá-lo (a description de uma skill, uma linha em `AGENTS.md`). Sua redação decide quando o agente alcança o material. Palavra-guia na frente, um gatilho por ramo, cortar a identidade que o corpo já carrega.
- **As duas cargas.** Carga de contexto é o que material sempre carregado custa ao agente a cada turno. Carga cognitiva é o que o humano paga para saber quais documentos existem. A segunda é o preço da agência humana, gasta onde o julgamento importa.
- **Hierarquia de informação.** Passos no arquivo, depois referência no arquivo, depois referência revelada atrás de um ponteiro. **Divulgação progressiva** é o movimento para baixo nessa escada para o topo ficar legível; **colocalização** mantém definição, regras e ressalvas de um conceito sob um mesmo título. Orçamentos: `SKILL.md` abaixo de 500 linhas, description abaixo de 1.024 caracteres, `CLAUDE.md` abaixo de 200 linhas. Propósito, saída, critério de conclusão e instruções permanentes ficam perto do topo, porque a compactação guarda só a primeira parte de uma skill.
- **Razões e enforcement.** Colocar a razão ao lado da instrução para o agente generalizar; mover para um hook ou verificação determinística a regra que precisa valer sempre.
- **Passos e critérios de conclusão.** Prescrever comandos exatos onde variação quebra as coisas; descrever o resultado onde vários caminhos valem. Todo passo termina em um critério claro (dá para distinguir pronto de não pronto, o que defende contra a **conclusão prematura**) e exigente (força trabalho de campo).
- **Quando dividir.** Por sequência só quando o critério é irredutivelmente vago e a pressa foi observada; por invocação conforme `SKILL-MECHANICS.md`.
- **Palavras-guia.** Um conceito compacto que o modelo já carrega (*fog of war*, *tracer bullet*, *red*), repetido como token, ancora uma região de comportamento a baixo custo. **Negação** é o modo de falha ao lado: uma proibição arrasta o comportamento proibido para o contexto, então declare o alvo positivo.
- **Poda.** Fonte única de verdade; tratar o ambiente como fonte também, cacheando só o que o agente não encontra olhando; conferir a relevância de cada linha, contra o **sedimento**; caçar **no-ops**, instruções que o modelo já obedece por padrão, e apagar a frase inteira.

## Arquivos

- `SKILL.md`: as alavancas.
- `SKILL-MECHANICS.md`: frontmatter, a escolha entre invocação automática e manual, portabilidade entre Claude Code e Codex (`agents/openai.yaml`), e skills roteadoras.
