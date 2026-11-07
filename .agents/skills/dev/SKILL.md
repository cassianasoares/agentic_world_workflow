---
name: dev
description: >-
  Executa a implementação de código-fonte orientada a testes (TDD Red-Green-Refactor)
  baseando-se no checklist de tasks.md e na especificação de spec.md e plan.md.
  Atua em parceria com o test-agent, corrigindo problemas nos testes até atingir 100% de sucesso.
---

# Skill: Dev (TDD Implementation & Engineering Execution)

Esta skill é responsável por **transformar a especificação técnica e o planejamento em código-fonte funcional, testado e de alta qualidade**.

Ela atua através do subagente dedicado **`dev-agent`** (Senior Software Engineer & TDD Practitioner) em colaboração direta com o **`test-agent`**.

---

## Arquivos desta Skill

| Arquivo                      | Finalidade                                                                                            |
| :--------------------------- | :---------------------------------------------------------------------------------------------------- |
| `agent-prompt.md`            | Definição de role (Senior Software Engineer / TDD Practitioner), modelo e system prompt do subagente. |
| `references/tdd-workflow.md` | Guia prático do ciclo TDD (Red-Green-Refactor) e boas práticas de testes.                             |

---

## Entradas Mandatórias da Skill

Para iniciar o trabalho, o `dev-agent` consome os artefatos gerados nas fases anteriores:

1. **`docs/data/[slug].md`**: Entidades DDD e esquema de persistência física.
2. **`docs/design-system/[slug].md`**: Tokens e componentes de UI.
3. **`docs/specs/[slug]/spec.md`**: Regras de negócio e critérios BDD.
4. **`docs/specs/[slug]/plan.md`**: Clean Architecture e contratos de portas DIP.
5. **`docs/specs/[slug]/tasks.md`**: Lista sequencial de tarefas atômicas.
6. **`test/`**: Suítes de testes automatizados mantidas pelo `test-agent`.

---

## Fluxo de Execução com o `test-agent` (Ping-Pong TDD)

### Passo 1 — Recepção do Teste Vermelho (RED)

O `test-agent` escreve o teste automatizado na pasta `test/` e confirma sua falha no terminal. O `dev-agent` analisa o erro e os requisitos associados.

### Passo 2 — Implementação Mínima de Produção & Commit GREEN

O `dev-agent` implementa o código necessário em `src/` (ou `app/`) respeitando a camada correspondente (Domínio, Aplicação, Adaptadores ou Infra) até o teste passar.
Assim que aprovado pelo `test-agent`, comita: `git add src/` && `git commit -m "feat(<escopo>): implement [CA-XX] <descrição>"`.

### Passo 3 — Resolução Iterativa de Problemas

Se o `test-agent` detectar falhas em cenários de borda ou testes quebrados, o `dev-agent` analisa o diagnóstico e corrige o código de produção até que todos os testes passem.

### Passo 4 — Refatoração & Commit REFACTOR

Com a suíte 100% verde, o `dev-agent` limpa o código, elimina duplicações e assegura conformidade com Clean Architecture, DDD, SOLID e KISS, revalidando a suite de testes.
Se houver refatoração, comita: `git add src/` && `git commit -m "refactor(<escopo>): <descrição da melhoria>"`.

### Passo 5 — Atualização do Checklist

Com os testes 100% verdes e o commit realizado, marque `[x]` na tarefa em `docs/specs/[slug]/tasks.md` e prossiga para a próxima.
