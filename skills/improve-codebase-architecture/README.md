# improve-codebase-architecture

Varre uma base de código em busca de **oportunidades de aprofundamento** (aglomerados de módulos rasos que seriam melhores como um módulo profundo), as apresenta em um relatório HTML visual, e faz grilling sobre a que o usuário escolher.

**Invocação:** manual (`/improve-codebase-architecture`, opcionalmente nomeando um módulo, subsistema ou dor como escopo). Seu resultado alimenta `feature`.

## O que faz

Carrega `codebase-design` primeiro, porque seu glossário e princípios são a linguagem de todo candidato, e `domain-modeling` para o glossário e os ADRs do projeto.

### 1. Explorar

O escopo vem antes da varredura. Uma direção nomeada pelo usuário é o escopo; senão, os **hot spots** do histórico recente do git puxam a atenção primeiro, porque aprofundar um módulo compensa ao baratear as próximas mudanças nele. Um sub-agente percorre o escopo procurando **atrito**: um conceito entendido só pulando entre módulos pequenos, módulos rasos, funções puras extraídas por testabilidade enquanto os bugs se escondem em como são chamadas, módulos vazando pelo seam, código testável só por trás da interface. O teste da deleção é aplicado a todo suspeito. Um candidato é um aglomerado de repasses em torno de um corpo de lógica; um repasse isolado é uma deleção, não um candidato.

### 2. Relatório

Um único arquivo HTML autocontido no diretório temporário do sistema (o repositório fica intocado), aberto automaticamente. Cada candidato é um card cujo diagrama antes/depois carrega o peso: arquivos, problema, solução (nomeando o aprofundamento, nunca sua interface, que é projetada com o usuário no passo 3), ganhos em termos de localidade e alavancagem, categoria da dependência, força da recomendação, e um destaque de ADR quando o candidato contradiz uma decisão registrada. O relatório termina com uma recomendação principal e o turno termina perguntando qual candidato explorar. Um escopo sem candidato não gera relatório, só os hot spots varridos e os ADRs que resolveram o resto.

### 3. Grilling sobre a escolha

Carrega `grilling` e percorre a árvore de design do candidato escolhido: restrições, dependências, a forma do módulo aprofundado, o que fica atrás do seam, quais testes sobrevivem. Quando o usuário rejeita um candidato por uma razão estrutural, um ADR é oferecido para que a próxima revisão não o sugira de novo.

Termina quando o relatório está aberto, o usuário escolheu, e o grilling alcançou um entendimento compartilhado (que `feature` então transforma em spec).

## Arquivos

- `SKILL.md`: o processo em três passos e o que cada card carrega.
- `HTML-REPORT.md`: o esqueleto HTML, o card, os padrões de diagrama e o estilo.
