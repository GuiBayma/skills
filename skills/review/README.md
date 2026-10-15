# review

Revisa um PR aberto por `implement` em dois **eixos** independentes, Standards e Spec, e publica a revisão como um único comentário no PR.

**Invocação:** manual (`/review <número ou URL>`, ou sem argumento para o PR do branch atual). Roda em uma sessão própria, separada da sessão de `implement` que abriu o PR e vai responder a revisão.

## Os dois eixos

- **Standards**: o diff segue os padrões documentados do repositório e os padrões da casa?
- **Spec**: o diff entrega o que a task, e a spec por trás dela, pediram, e nada mais?

Cada eixo roda em seu próprio sub-agente, em paralelo, e os relatórios ficam separados no comentário, porque uma mudança pode passar em um eixo e falhar no outro, e fundi-los deixa um mascarar o outro.

## O que faz

1. **Fixar o PR.** Faz checkout do head em um worktree git desanexado, porque os sub-agentes precisam do código em volta do diff e o branch do clone pertence à sessão de `implement`. Quando o repo documenta um relatório de métrica do CI como padrão, localiza a execução pelos checks e lê a tabela no job summary, artefato ou log equivalente, conferindo o commit com o head. Guarda a fonte e as faixas documentadas para Standards; relatório indisponível vira limitação explícita. Lê o histórico do PR nos três lugares onde uma revisão cai, e anota os pontos **resolvidos** (refutados pelo implementador com razão, fora desta revisão a menos que o chão tenha mudado) e os **alegados** (reportados como alterados, a conferir contra o diff).
2. **Encontrar as fontes de spec.** A task na linha Task do corpo do PR, senão a task que o branch nomeia, senão o usuário. Depois a spec na linha Spec. Tasks vivem fora do controle de versão, então são lidas do clone, não do worktree.
3. **Encontrar as fontes de padrões.** `AGENTS.md`/`CLAUDE.md` na raiz e nos diretórios tocados, o glossário, os ADRs, `CONTRIBUTING.md`, mais os **padrões da casa** carregados pelas skills irmãs: `tdd`, `codebase-design` e o template de PR de `implement`, e a linha de base de smells em `SMELLS.md`. Um padrão documentado do repositório vence um padrão da casa; violações que o ferramental já impõe ficam com o CI; a faixa de atenção sem reprovação de uma métrica documentada continua como julgamento de Standards.
4. **Despachar os dois sub-agentes.** Standards recebe também o relatório de métrica e cruza arquivo, namespace e função com o diff. Cada função tocada na faixa de atenção documentada vira achado **judgement**, com valor, fonte, padrão e ação concreta; valores que reprovam ficam com o CI. Achados de Standards são marcados **hard** (um padrão documentado violado) ou **judgement** (um smell ou uma métrica na faixa de atenção). Achados de Spec são marcados **missing**, **partial**, **creep** ou **wrong**, com a seção Out of Scope como o teste mais afiado para creep. O Evidence e o Merge Danger do corpo do PR também são conferidos.
5. **Publicar** um comentário no formato de `COMMENT.md`, remover o worktree, e encerrar o turno com a URL do comentário.

O comentário é a única saída: branch, working tree e arquivos de task ficam intocados. Todo achado é acionável só pelo comentário, porque a sessão de `implement` age sobre ele sem o revisor no circuito.

## Arquivos

- `SKILL.md`: o processo e os briefings dos dois sub-agentes.
- `COMMENT.md`: o formato do comentário.
- `SMELLS.md`: a linha de base de smells que o eixo Standards aplica por cima dos padrões documentados.
