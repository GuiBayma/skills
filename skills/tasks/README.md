# tasks

Quebra uma fonte (a conversa atual, um plano, ou uma spec de feature) em **tasks**, cada uma do tamanho de uma sessão nova e de um PR, após um corte adversarial feito por um sub-agente que nunca vê o seu.

**Invocação:** manual (`/tasks`, opcionalmente com o caminho de uma spec, um arquivo de plano ou a URL de uma issue). `follow-ups` e `retro` também executam seu processo, por caminho, sobre os candidatos que o usuário escolheu.

## O que é uma task

Uma fatia tracer bullet: uma entrega que uma sessão nova consegue terminar, que cabe em um PR, e que declara as tasks que a **bloqueiam**. Uma task pode ser operacional (uma migração executada, um segredo rotacionado, um dashboard configurado) e não tocar nada versionado; a entrega continua observável. Tasks nomeiam módulos e interfaces, nunca arquivos, e são escritas no vocabulário do glossário do projeto.

## Onde vivem

- Tasks de feature, quando a fonte é uma spec: `docs/features/<feature-name>/tasks/<NN>-<slug>.md`, numeradas em ordem de dependência.
- Tasks avulsas: `docs/tasks/<slug>.md`.

Os dois diretórios são anotação de trabalho, adicionados ao `.gitignore` quando faltam.

## O que faz

1. **Reunir a fonte** e fixá-la: os dois cortes são feitos da mesma coisa.
2. **Explorar o repositório**, procurando **prefactoring**: mudanças que tornam a implementação fácil, cortadas como tasks próprias que vêm primeiro.
3. **Fixar o briefing** quando a fonte não é um arquivo: o quê e por quê, nas palavras da própria fonte, sem pista de sequência ou fatiamento.
4. **Rascunhar seu corte** por `CUTTING.md`.
5. **Despachar o corte adversarial.** Um sub-agente recebe exatamente duas coisas, o briefing e `CUTTING.md`, e devolve seu próprio corte sem escrever em disco. Seu valor é a independência: um corte feito sem o seu à vista expõe o que o seu assumiu.
6. **Reconciliar.** Comparar os dois cortes, absorver o que melhora o seu, e registrar o **delta** com a razão de cada mudança e de cada descarte.
7. **Revisar com o usuário**: o corte como lista numerada mais o delta. A granularidade está certa, cada aresta é um bloqueio real, alguma task deveria unir ou dividir? Itera até a aprovação.
8. **Escrever os arquivos**, um por task, no template de `CUTTING.md`.

Termina quando as tasks aprovadas estão em disco, toda decisão da fonte é carregada por alguma task, e o delta foi mostrado. O trabalho então avança pela fronteira: qualquer task cujos bloqueios estão todos prontos pode começar, via `implement`.

## Arquivos

- `SKILL.md`: o processo.
- `CUTTING.md`: as regras de corte e o template de task, a única fonte de que os dois cortes partem.
