# review

Revisa um PR aberto por `implement` em dois **eixos** independentes, Standards e Spec, e publica a revisão como um único comentário no PR.

**Invocação:** manual (`/review <número ou URL>`, ou sem argumento para o PR do branch atual). Roda em uma sessão própria, separada da sessão de `implement` que abriu o PR e vai responder a revisão.

## Os dois eixos

- **Standards**: o diff segue os padrões documentados do repositório e os padrões da casa?
- **Spec**: o diff entrega o que a task, e a spec por trás dela, pediram, e nada mais?

Cada eixo roda em seu próprio sub-agente, em paralelo, e os relatórios ficam separados no comentário, porque uma mudança pode passar em um eixo e falhar no outro, e fundi-los deixa um mascarar o outro.

## O que faz

1. **Fixar o PR e coletar evidências de padrões.** Faz checkout do head em um worktree git desanexado e lê os padrões do repo: `AGENTS.md`/`CLAUDE.md`, glossário, ADRs, `CONTRIBUTING.md` e `CODING_STANDARDS.md`, além dos padrões da casa nas skills irmãs e em `SMELLS.md`. Para cada check ou pacote com relatório de métrica documentado que cubra arquivos tocados, localiza a execução pelos checks, confere seu commit com o head e lê a tabela no log do job ou no artefato. A URL do job summary serve para citar a fonte. Guarda cada relatório com seu check ou pacote, fonte, commit e faixas documentadas; relatório pendente, ausente, de outro commit ou inacessível vira limitação por check ou pacote. Lê também o histórico do PR nos três lugares onde uma revisão cai e anota os pontos **resolvidos** e **alegados**. O passo termina com cada relatório requerido coletado ou sua limitação registrada.
2. **Encontrar as fontes de spec.** A task na linha Task do corpo do PR, senão a task que o branch nomeia, senão o usuário. Depois a spec na linha Spec. Tasks vivem fora do controle de versão, então são lidas do clone, não do worktree.
3. **Despachar os dois sub-agentes.** Cada eixo recebe suas fontes. Standards recebe também todos os relatórios e limitações, e cruza as entradas com o diff por arquivo e função ou pela unidade medida pelo relatório. Funções tocadas na faixa de atenção documentada viram achados **judgement**, com valor, fonte, padrão e ação concreta; valores que reprovam ficam com o CI. Essa é a exceção à regra de pular o que o ferramental já impõe. Achados de Standards são marcados **hard** (um padrão documentado violado) ou **judgement** (um smell ou uma métrica na faixa de atenção). Achados de Spec são marcados **missing**, **partial**, **creep** ou **wrong**, com a seção Out of Scope como o teste mais afiado para creep. O Evidence e o Merge Danger do corpo do PR também são conferidos.
4. **Publicar** um comentário no formato de `COMMENT.md`, com uma linha de limitação por relatório indisponível em Standards, mesmo sem achados. Remover o worktree e encerrar o turno com a URL do comentário.

O comentário é a única saída: branch, working tree e arquivos de task ficam intocados. Todo achado é acionável só pelo comentário, porque a sessão de `implement` age sobre ele sem o revisor no circuito.

## Arquivos

- `SKILL.md`: o processo e os briefings dos dois sub-agentes.
- `COMMENT.md`: o formato do comentário.
- `SMELLS.md`: a linha de base de smells que o eixo Standards aplica por cima dos padrões documentados.
