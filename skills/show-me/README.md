# show-me

Mostra um ponto visualmente com a **menor vista** que exibe o que o leitor precisa ver, colocada ao lado do texto curto que ela sustenta.

**Invocação:** automática. Dispara em "show me", sempre que a prosa deixaria o leitor imaginando uma forma na cabeça, e quando outra skill precisa de uma forma visual (`grilling` a carrega para o corpo das perguntas, `implement` para o resumo do PR).

## As formas

Um ponto em geral precisa de uma forma, duas no máximo. Cada forma em `SKILL.md` vem com um exemplo curto.

| Forma | Use para |
| --- | --- |
| Scenario | Um caso concreto que força uma fronteira a ser declarada: um caso de borda, uma corrida, uma falha |
| Table | Várias opções em vários eixos, três ou quatro colunas no máximo |
| Pseudocode | Lógica, um algoritmo, uma máquina de estados, com a linha em aberto marcada |
| Diff | A mudança é o ponto e a forma em volta já existe |
| Call tree ou sequence | Fluxo de controle em execução: quem chama quem, em que ordem |
| Component tree | Estrutura de UI com os hooks de estado e as fronteiras de módulo em que o ponto se apoia |
| File tree | Onde a responsabilidade vive: uma divisão de módulo, uma refatoração ampla |
| Full block | Uma forma-alvo copiável: uma interface, um tipo, um schema, a assinatura de um comando |
| Mockup | Uma UI ou layout denso demais para texto, como um arquivo HTML focado aberto localmente |

Diagramas são texto de caixas e linhas com glifos de desenho de caixa, porque o terminal renderiza markdown como texto puro. Só as chamadas, arquivos, estados e fronteiras em que o ponto se apoia são mantidos.

Termina quando o leitor consegue ver a forma sem precisar imaginá-la.

## Arquivos

- `SKILL.md`: as formas, cada uma com um exemplo.
