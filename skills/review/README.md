# review

Revisa um PR aberto por `implement` em dois **eixos** independentes, Standards e Spec, e publica a revisão como um único comentário no PR.

**Invocação:** manual (`/review <número ou URL>`, ou sem argumento para o PR do branch atual). Roda em uma sessão própria, separada da sessão de `implement` que abriu o PR e vai responder a revisão.

## Os dois eixos

- **Standards**: o diff segue os padrões documentados do repositório e os padrões da casa?
- **Spec**: o diff entrega o que a task, e a spec por trás dela, pediram, e nada mais?

Cada eixo roda em seu próprio sub-agente, em paralelo, e os relatórios ficam separados no comentário, porque uma mudança pode passar em um eixo e falhar no outro, e fundi-los deixa um mascarar o outro.

## O que faz

1. **Fixar o PR e ler os padrões.** Faz checkout do head em um worktree git desanexado e lê os padrões do repo: `AGENTS.md`/`CLAUDE.md`, glossário, ADRs, `CONTRIBUTING.md` e `CODING_STANDARDS.md`, além dos padrões da casa nas skills irmãs e em `SMELLS.md`. Quando o repo documenta um relatório de métrica publicado pela CI, busca o relatório desse head onde o repo diz que ele é publicado; relatório pendente, ausente ou de outro commit vira uma limitação declarada. Lê também o histórico do PR nos três lugares onde uma revisão cai e anota os pontos **resolvidos** e **alegados**.
2. **Encontrar as fontes de spec.** A task na linha Task do corpo do PR, senão a task que o branch nomeia, senão o usuário. Depois a spec na linha Spec e, quando a linha Design da task nomeia IDs, o gabarito da feature: o eixo Spec compara cada par gabarito/app do PR e o movimento com a ficha. Tasks vivem fora do controle de versão, então são lidas do clone, não do worktree.
3. **Despachar os dois sub-agentes.** Cada eixo recebe suas fontes; Standards recebe também os relatórios de métrica e suas limitações, e reporta como **judgement** as unidades tocadas na faixa de atenção documentada, enquanto valores que reprovam ficam com o CI. Achados de Standards são marcados **hard** (um padrão documentado violado) ou **judgement** (um smell ou uma métrica na faixa de atenção). Achados de Spec são marcados **missing**, **partial**, **creep** ou **wrong**, com a seção Out of Scope como o teste mais afiado para creep; teste de lógica que a task entrega nunca é creep, mesmo quando a task ou a spec limitam os testes, porque a `tdd` lê os seams registrados como piso. O Evidence e o Merge Danger do corpo do PR também são conferidos, incluindo se todo teste citado ou adicionado cruza um seam listado no Evidence. Os dois eixos recebem os checks do head e julgam lint, tipos e testes por eles, sem reexecutar nem imitar com buscas no worktree.
4. **Publicar** um comentário no formato de `COMMENT.md`, com cada correção em forma de código verificada no worktree ou rotulada como direção não verificada, com as limitações de métrica sob Standards. Remover o worktree e encerrar o turno com a URL do comentário.

O comentário é a única saída: branch, working tree e arquivos de task ficam intocados. Todo achado é acionável só pelo comentário, porque a sessão de `implement` age sobre ele sem o revisor no circuito.

## Arquivos

- `SKILL.md`: o processo e os briefings dos dois sub-agentes.
- `COMMENT.md`: o formato do comentário.
- `SMELLS.md`: a linha de base de smells que o eixo Standards aplica por cima dos padrões documentados.
