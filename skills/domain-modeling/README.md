# domain-modeling

Fale a mesma linguagem que o seu agente.
Instruções permanentes para manter afiado o **modelo de domínio** de um projeto durante o design: um glossário de termos canônicos (a linguagem ubíqua) e registros de decisão de arquitetura (ADRs).

**Invocação:** automática. O agente a carrega quando um termo ou uma decisão está sendo resolvido, e a maioria das skills do fluxo (`grilling`, `feature`, `tasks`, `implement`, `tdd`, `wayfinder`) a carrega para que o vocabulário que produzem chegue ao glossário.

## O que faz

Em vez de um processo com passos, instala comportamentos que valem pela sessão inteira:

- **Confrontar com o glossário.** Um termo que o usuário usa em conflito com o glossário é apontado na hora.
- **Afiar linguagem vaga.** Um termo vago ou sobrecarregado ("conta") recebe uma proposta canônica precisa ("Customer ou User?").
- **Testar com cenários.** Casos de borda concretos forçam a fronteira entre dois conceitos a ser declarada.
- **Cruzar com o código.** Quando o usuário diz como algo funciona, o código é verificado e as contradições vêm à tona.
- **Escrever o glossário na hora.** Um termo resolvido vai para o `GLOSSARY.md` no momento em que é decidido, porque um termo deixado para depois se perde na compactação.
- **Oferecer um ADR quando a barra é atingida.** Uma decisão só é oferecida como ADR quando é difícil de reverter, surpreendente sem contexto, e um trade-off real. As três precisam valer.

A sessão termina quando todo termo resolvido na conversa está no glossário e toda decisão que atinge a barra foi oferecida como ADR.

## Onde o modelo vive

- Um único bounded context (a maioria dos repositórios): `GLOSSARY.md` na raiz, decisões em `docs/adr/`.
- Vários contextos: `GLOSSARY-MAP.md` na raiz aponta para o `GLOSSARY.md` e o `docs/adr/` de cada contexto; o `docs/adr/` da raiz guarda as decisões de sistema.

Os arquivos são criados sob demanda, quando o primeiro termo ou decisão está pronto. Um glossário ausente significa que nada foi resolvido ainda, não que a skill não se aplica.

## Arquivos

- `SKILL.md`: as instruções permanentes e a barra do ADR.
- `GLOSSARY-FORMAT.md`: o formato de entrada do `GLOSSARY.md`.
- `ADR-FORMAT.md`: o template de ADR, mais os tipos de decisão que costumam atingir a barra.
