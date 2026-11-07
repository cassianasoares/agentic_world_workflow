---
name: spec
description: >-
  Conduz o design técnico, modelagem de dados em PlantUML em docs/data/, Design System
  em PlantUML em docs/design-system/, análise de segurança (Threat Modeling STRIDE) e
  planejamento de tarefas em docs/specs/[slug]/.
---

# Skill: Spec (System Specification, Data Modeling & Design System)

Esta skill é responsável por transformar os requisitos de negócio definidos no **PRD** e as decisões de infraestrutura consolidadas no **ADR** em:

1. **Modelagem de Dados & Domínio canônica** em `docs/data/` (PlantUML).
2. **Design System & Padrões Visuais** em `docs/design-system/` (PlantUML).
3. **Tríade de Especificação da Feature** em `docs/specs/[slug]/` (`spec.md`, `plan.md`, `tasks.md`).

Ela atua através do subagente dedicado **`spec-agent`** (Staff Software Engineer & Technical Lead).

> ⚠️ **Regra Fundamental:** Esta skill **NÃO implementa código-fonte**. Seu objetivo é exclusivamente a concepção, modelagem em PlantUML, Design System, análise de segurança e planejamento atômico de tarefas para que o **`dev-agent`** implemente.

---

## Arquivos desta Skill

| Arquivo                            | Finalidade                                                                                                |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `agent-prompt.md`                  | Definição de role (Staff Software Engineer / Tech Lead), modelo e system prompt do subagente.             |
| `assets/data-model-template.md`    | Template do artefato canônico de dados em `docs/data/[slug].md` (DDD + ERD em PlantUML).                  |
| `assets/design-system-template.md` | Template do artefato canônico de UI em `docs/design-system/[slug].md` (Tokens + Componentes em PlantUML). |
| `assets/spec-template.md`          | Template do artefato `docs/specs/[slug]/spec.md` (Requisitos, Critérios BDD, Sequência e STRIDE).         |
| `assets/plan-template.md`          | Template do artefato `docs/specs/[slug]/plan.md` (Clean Architecture, Portas DIP e Estratégia TDD).       |
| `assets/tasks-template.md`         | Template do artefato `docs/specs/[slug]/tasks.md` (Checklist de tarefas atômicas com tags `[TDD]`).       |
| `references/threat-modeling.md`    | Guia prático de aplicação do modelo STRIDE em software.                                                   |

---

## Saídas Canônicas da Skill

```
docs/
├── data/
│   └── [slug].md            # Modelagem DDD e Esquema Físico ERD em PlantUML
│
├── design-system/
│   └── [slug].md            # Design Tokens, Componentes em PlantUML e WCAG AA
│
└── spec/
    └── [slug]/
        ├── spec.md          # Regras RT-XX, Critérios BDD [CA-XX] e STRIDE
        ├── plan.md          # Clean Architecture, Portas DIP e Pirâmide TDD
        └── tasks.md         # Checklist atômico sequencial para o dev-agent
```

---

## Fluxo de Execução Passo a Passo

### Passo 1 — Coleta de Contexto (PRD e ADR)

1. Inspecione `docs/prd/` para localizar o PRD correspondente à feature.
2. Inspecione `docs/adr/` e o `AGENTS.md` para garantir aderência à topologia, stack e diretrizes vigentes.
3. Defina o slug da feature (ex.: `auth-jwt`, `checkout-carrinho`, `gestao-pedidos`).

### Passo 2 — Modelagem de Dados em `docs/data/[slug].md`

1. Modele as classes de domínio DDD (Entidades, Aggregate Roots, Value Objects) em **PlantUML**.
2. Modele o esquema físico do banco de dados (ERD) em **PlantUML**.
3. Documente o dicionário de campos, tipos e constraints.

### Passo 3 — Design System em `docs/design-system/[slug].md` _(se houver UI)_

1. Especifique os tokens visuais (cores, tipografia, espaçamento, raios, elevação).
2. Desenhe o diagrama de componentes em **PlantUML**.
3. Documente os 7 estados obrigatórios e conformidade WCAG 2.1 AA.

### Passo 4 — Especificação e Plano em `docs/specs/[slug]/`

1. **`spec.md`:** Refine os requisitos (`RT-XX`), critérios BDD (`[CA-XX]`), sequência de execução e Threat Modeling STRIDE.
2. **`plan.md`:** Estruture as camadas Clean Architecture, portas/interfaces (DIP) e estratégia TDD.
3. **`tasks.md`:** Decomponha em tarefas atômicas numeradas com tags `[TDD]`, vínculos `[CA-XX]` e DoD inequívoco.

### Passo 5 — Validação com o Usuário

Apresente a visão integrada dos artefatos para aprovação antes de iniciar a implementação com o **`dev-agent`**.
