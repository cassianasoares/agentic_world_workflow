---
name: orchestrator
description: >-
  Coordena a esteira completa de desenvolvimento de software de ponta a ponta,
  gerenciando a transição entre os subagentes especializados (security -> spec -> test -> dev -> audit)
  com suporte aos modos de execução "Ponto de Controle" (Human-in-the-Loop) e "Fire and Forget" (Autônomo).
---

# Skill: Orchestrator (Multi-Agent Engineering Pipeline Manager)

Esta skill é responsável por **orquestrar o ciclo completo de engenharia de software**, despachando os subagentes especializados na ordem correta, gerenciando o ciclo TDD e oferecendo ao usuário a escolha entre **Modo Ponto de Controle** e **Modo Fire and Forget**.

Ela atua através do subagente dedicado **`orchestrator-agent`** (Engineering Manager & Multi-Agent Orchestrator).

---

## Arquivos desta Skill

| Arquivo                         | Finalidade                                                                                               |
| :------------------------------ | :------------------------------------------------------------------------------------------------------- |
| `agent-prompt.md`               | Definição de role (Engineering Manager / Multi-Agent Orchestrator), modelo e system prompt do subagente. |
| `references/pipeline-states.md` | Máquina de estados da esteira e detalhamento dos dois modos de execução.                                 |

---

## Os 2 Modos de Execução da Esteira

### 1. Modo Ponto de Controle (Checkpoint / Human-in-the-Loop — Padrão)

- O orquestrador aciona `security-agent` e `spec-agent`.
- **⏸️ Checkpoint:** Pausa antes de escrever qualquer código em `src/`, apresentando ao usuário o resumo da modelagem de dados, Design System e tarefas em `tasks.md`.
- O usuário valida e dá o comando de prosseguir (`"Aprovado"`).
- O orquestrador aciona o ciclo TDD (`test-agent` + `dev-agent`) até todos os testes ficarem verdes, seguido de `code-auditor` e do portão final local `review-agent`.

### 2. Modo Fire and Forget (Autônomo / Unattended / `/goal`)

- O orquestrador aciona toda a esteira de forma contínua sem pausas intermediárias:
  `security-agent` $\rightarrow$ `spec-agent` $\rightarrow$ `test-agent` + `dev-agent` (loop TDD) $\rightarrow$ `code-auditor` $\rightarrow$ `review-agent`.
- Paradas acontecem apenas se houver impedimento crítico insuperável.
- Entrega final apresentada diretamente com 100% dos testes verdes e parecer LGTM do Code Review.

---

## Fluxo Operacional da Esteira

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuário
    participant Orch as orchestrator-agent
    participant Sec as security-agent
    participant Spec as spec-agent
    participant TDD as Duo TDD (test + dev)
    participant Git as Git Repo
    participant Audit as code-auditor
    participant Rev as review-agent

    User->>Orch: Solicita implementação (Modo: Ponto de Controle ou Fire and Forget)
    Orch->>Git: Cria e alterna para branch feat/[slug]
    Orch->>Sec: Gera Threat Model e CI/CD
    Sec-->>Orch: Threat Model pronto em docs/security/
    Orch->>Spec: Gera docs/data/, docs/design-system/ e docs/specs/[slug]/
    Spec-->>Orch: Tríade técnica e tarefas prontas

    opt Se Modo for Ponto de Controle
        Orch->>User: Apresenta resumo e solicita aprovação
        User-->>Orch: "Aprovado, pode codificar"
    end

    loop Para cada tarefa [TDD] em tasks.md
        Orch->>TDD: Executa ciclo Red-Green-Refactor
        TDD->>Git: Commit atômico RED (test:) e GREEN/REFACTOR (feat:/refactor:)
        TDD-->>Orch: Tarefa verde, testada e commitada
    end

    Orch->>Audit: Executa auditoria arquitetural
    Audit-->>Orch: Relatório de conformidade aprovado

    Orch->>Rev: Inspeciona git diff localmente (Code Review + SDD)
    Rev-->>Orch: Veredito: APPROVE (LGTM)

    Orch->>Git: Valida status e lista histórico git log
    Orch->>User: Relatório final de entrega (100% Testes Verdes + LGTM do Review + instruções de PR)
```
