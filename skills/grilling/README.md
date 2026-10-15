# grilling

Entrevista o usuário implacavelmente sobre um plano, decisão ou ideia, **uma pergunta por turno**, até alcançar um entendimento compartilhado.

**Invocação:** automática. Dispara em "grill me", em pedidos de testar um plano sob pressão, e sempre que outra skill precisa de uma conversa de design (`wayfinder`, `improve-codebase-architecture`).

## Como funciona

O trabalho é mapeado como uma **árvore de design**: toda decisão se ramifica nas decisões que dependem dela. A **fronteira** é o conjunto de decisões cujos pré-requisitos já estão resolvidos, as perguntas que podem ser feitas agora sem chutar respostas ainda não ouvidas.

- Exatamente uma pergunta por turno, recalculando a fronteira após cada resposta, porque cada resposta remodela a árvore.
- A pergunta escolhida é a cuja resposta remodela mais da árvore, em geral a mais próxima da raiz.
- **Fatos são trabalho do agente; decisões são do usuário.** Quando uma pergunta precisa de um fato do ambiente, o agente o procura (ou despacha um sub-agente) e leva ao usuário só a decisão.

Cada pergunta carrega um título, um corpo, as opções quando a escolha é fechada, e a resposta recomendada pelo agente com a razão. A forma do corpo é a menor vista que mostra o que cada resposta significaria: prosa para um julgamento, uma forma visual de `show-me` (um diff, uma árvore, um cenário, um mockup) para uma escolha sobre forma ou estrutura.

```
❓ **<título da pergunta>**

<corpo da pergunta na forma escolhida, opções incluídas>

➡️ <sua resposta recomendada e por quê>
```

A sessão termina quando a fronteira está vazia, nada foi assumido em silêncio, e o usuário confirma o entendimento compartilhado. Agir sobre o plano (em geral com `/feature`) começa só depois disso.

## Arquivos

- `SKILL.md`: o modelo da fronteira e o formato da pergunta.
