# codebase-design

Vocabulário e princípios compartilhados para projetar **módulos profundos** (deep modules): muito comportamento atrás de uma interface pequena, colocado em um seam limpo, testável por essa interface.

**Invocação:** automática. O agente a carrega sozinho quando surge uma questão de design, e outras skills (`feature`, `implement`, `tdd`, `improve-codebase-architecture`, `review`) a carregam pelo vocabulário.

## O que faz

É quase toda referência, não processo. Fixa uma única linguagem para falar de estrutura de código, para que prompts, docs, código e toda skill que a carrega queiram dizer a mesma coisa com a mesma palavra:

| Termo | Significado |
| --- | --- |
| Module | Qualquer coisa com exatamente uma interface e uma implementação, em qualquer escala |
| Interface | Tudo que quem chama precisa saber para usar o módulo corretamente, não só a assinatura de tipos |
| Depth | Alavancagem na interface: quanto comportamento quem chama ganha por unidade de interface aprendida |
| Seam | Onde a interface de um módulo vive; o lugar onde o comportamento pode ser trocado sem editar ali |
| Port / Adapter | A interface em um seam, e uma coisa concreta que a satisfaz |
| Leverage / Locality | O que quem chama ganha com profundidade, e o que quem mantém ganha com ela |

Quatro princípios decorrem do vocabulário:

- **A profundidade vive na interface.** Seams internos usados pelos testes do próprio módulo ficam fora da interface.
- **O teste da deleção.** Apague o módulo na cabeça. Se a complexidade some, era um repasse (pass-through). Se reaparece espalhada em quem chamava, o módulo merece existir.
- **A interface é a superfície de teste.** Testes cruzam o mesmo seam que quem chama, então sobrevivem a refatorações internas.
- **Um adapter é um seam hipotético; dois adapters fazem um seam real.** Um seam com só a implementação de produção é indireção sem retorno.

Um design está resolvido nos termos desta skill quando todo módulo passa no teste da deleção, todo seam tem dois adapters ou nenhum, e todo teste cruza a interface.

## Arquivos

- `SKILL.md`: o glossário, os princípios, e dois movimentos para encolher uma interface (receber como parâmetro as dependências que variam; retornar resultados em vez de mutar).
- `DEEPENING.md`: como absorver um aglomerado de módulos rasos em um módulo profundo, classificando suas dependências, o que decide como o módulo aprofundado é testado e o que acontece com os testes antigos.
- `DESIGN-IT-TWICE.md`: projetar uma interface de várias formas em sub-agentes paralelos, cada um sob uma restrição diferente, e comparar por profundidade, localidade e posição do seam.
