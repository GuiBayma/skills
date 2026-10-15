# tdd

Desenvolvimento guiado por testes como um ciclo **red → green**, uma fatia por vez, todo teste em um **seam** confirmado.

**Invocação:** automática. Dispara em "TDD", "red-green-refactor", em construir uma feature ou corrigir um bug com testes primeiro, e em querer testes que sobrevivam a refatorações. `implement` a carrega antes da primeira mudança de código, e `review` a lê como padrão da casa.

## A postura

Testes verificam comportamento pela interface, nunca detalhes de implementação: o código pode mudar inteiro e os testes ficam. Um bom teste se lê como uma especificação e sobrevive a refatorações porque nunca olha para dentro. Valores esperados vêm de uma fonte de verdade independente, nunca recalculados do jeito que o código faz.

## Seams

Um seam é onde a interface de um módulo vive (o termo de `codebase-design`). Testes vivem só em seams **confirmados**: antes do primeiro teste, os seams sob teste são listados, cada um com o que pega e o que deixa passar, e confirmados com o usuário, para que o esforço caia nos caminhos críticos e na lógica complexa em vez de em todo caso de borda. Seams já registrados nas Testing Decisions de uma spec ou em um arquivo de task contam como confirmados.

## O ciclo

Cada ciclo é uma fatia vertical: um seam, um teste, uma implementação mínima. Testes escritos em lote antes do código (fatiamento horizontal) verificam comportamento imaginado e são evitados.

1. **Red.** Escrever um teste e rodá-lo. O red é observado, nunca assumido: a falha precisa ser o comportamento que o teste nomeia faltando, não um erro de digitação ou um import errado. Para um bug, o red é um teste que o reproduz no seam e fica como guarda de regressão.
2. **Green.** Escrever só o código suficiente para deixá-lo verde. Rodar o teste, depois a suíte.

Termina quando toda fatia foi observada red antes de green, todo teste está em um seam confirmado, e nenhum teste bate com um anti-padrão.

## Anti-padrões

- **Acoplado à implementação**: faz mock de colaboradores internos, testa métodos privados, ou verifica por um canal lateral. Quebra na refatoração sem o comportamento mudar.
- **Tautológico**: a asserção recalcula o valor esperado do jeito que o código faz, então passa por construção.

## Arquivos

- `SKILL.md`: a postura, os seams, o ciclo e os anti-padrões.
- `tests.md`: cada anti-padrão em código ao lado da sua contraparte boa.
- `mocking.md`: onde dublês cabem (só em seams onde o código sai do processo) e como esses seams são moldados para isso.
