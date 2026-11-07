---
name: audit
description: >-
  Estrutura o contexto de IA de um projeto (arquivos AGENTS.md lidos por outras habilidades)
  e audita o código e arquitetura da aplicação garantindo o uso dos patterns
  Clean Architecture, Domain-Driven Design (DDD), SOLID (OOP) e KISS. Executado no início
  de projetos novos ou via /audit. NUNCA deve ser executado em PRDs ou ADRs.
---

# Skill: Audit (Contexto de IA & Auditoria Arquitetural)

Esta skill é responsável por:
1. **Estruturar o contexto de IA do projeto:** Gerar ou atualizar os arquivos `AGENTS.md` (e regras correlatas) que guiam todos os agentes e habilidades posteriores no repositório.
2. **Auditar e garantir a conformidade arquitetural da aplicação:** Avaliar e guiar o código-fonte em relação a cinco padrões arquiteturais essenciais:
   - `clean-architecture`
   - `domain-driven` (DDD)
   - `solid-oop`
   - `kiss`
   - `twelve-factor` (The Twelve-Factor App)

Execute esta skill ao iniciar um novo projeto (ou invoque `/audit` quando desejar auditar/estruturar o contexto de desenvolvimento da aplicação).

---

## ⚠️ REGRA INEGOCIÁVEL: NUNCA USAR AUDIT EM PRD OU ADR

> [!CAUTION]
> **ESTA SKILL NUNCA DEVE SER APLICADA A ARQUIVOS DE PRD (Product Requirements Document) OU ADR (Architectural Decision Record).**
> - Se o usuário solicitar a auditoria de um PRD (ex.: arquivos em `docs/prd/`, `*prd*.md`), recuse ou redirecione para a skill `prd`. O PRD é um documento de especificação e requisitos de produto, não código de aplicação.
> - Se o usuário solicitar a auditoria de um ADR (ex.: arquivos em `docs/adr/`, `*adr*.md`), não aplique as regras de código/classe de POO/Clean Architecture sobre a narrativa de decisão.
> - A skill `audit` atua **estritamente sobre código-fonte, design técnico de software, organização de módulos da aplicação e na geração/manutenção dos arquivos `AGENTS.md`**.

---

## Arquivos desta Skill

| Arquivo | Finalidade |
| :-- | :-- |
| `agent-prompt.md` | Definição de role (Lead Architect & Quality Auditor), modelo e system prompt do subagente. |
| `patterns/` | Pasta contendo o detalhamento de cada um dos 4 patterns mandatórios. |

---

## Patterns de Referência

Todos os padrões exigidos estão documentados em detalhes na pasta `patterns/` desta skill:

| Pattern | Arquivo | Foco Principal |
| :-- | :-- | :-- |
| **Clean Architecture** | [`patterns/clean-architecture.md`](./patterns/clean-architecture.md) | Independência de frameworks, regra de dependência voltada para dentro, separação de Entidades, Casos de Uso, Adaptadores e Infraestrutura. |
| **Domain-Driven Design** | [`patterns/domain-driven.md`](./patterns/domain-driven.md) | Linguagem Ubíqua, Contextos Delimitados, Entidades com invariantes, Value Objects imutáveis, Agregados/Aggregate Roots e Repositórios no domínio. |
| **SOLID (OOP)** | [`patterns/solid-oop.md`](./patterns/solid-oop.md) | Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation e Dependency Inversion. |
| **KISS** | [`patterns/kiss.md`](./patterns/kiss.md) | Simplicidade deliberada, evitar over-engineering e abstrações prematuras, clareza acima de clever code, equilíbrio prático com Clean/DDD. |
| **12-Factor App** | [`patterns/twelve-factor.md`](./patterns/twelve-factor.md) | Configurações por env, Zero Secrets, processos stateless, port binding, graceful shutdown (`SIGTERM`/`SIGINT`) e logs no stdout. |

---

## Fluxo de Execução

### Passo 1 — Validação de Escopo e Proteção
1. Verifique o alvo da auditoria.
2. Se o alvo for um PRD ou ADR, aborte a auditoria técnica imediatamente e informe ao usuário a regra de não aplicação sobre esses documentos.
3. Se for início de projeto ou solicitação de auditoria técnica da aplicação, prossiga.

### Passo 2 — Estruturação do Contexto de IA (`AGENTS.md`)
Ao estruturar ou iniciar um projeto novo, garanta que o arquivo `AGENTS.md` na raiz (e em subpastas se houver arquitetura modular) contenha:
1. **Identificação e Regras do Projeto:** Nome, objetivo técnico e stack da aplicação.
2. **Diretrizes Arquiteturais Mandatórias:** Explicitar que qualquer código escrito por agentes DEVE respeitar:
   - Clean Architecture (separação de camadas e regra de dependência).
   - Domain-Driven Design (Entidades ricas, Value Objects, Linguagem Ubíqua).
   - Princípios SOLID em POO.
   - Princípio KISS (código simples, sem abstrações especulativas).
3. **Mapeamento de Skills:** Tabela de skills disponíveis em `.agents/skills/` para fácil consulta por outros agentes.
4. **Convenções de Código e Testes:** Estrutura de pastas esperada para domínio, aplicação, infraestrutura e apresentação.

### Passo 3 — Execução da Auditoria Arquitetural no Código
Analise a estrutura de diretórios e o código-fonte existente contra os 4 patterns:
1. **Clean Architecture Check:**
   - O domínio depende de ORM, UI ou frameworks externos?
   - Os Casos de Uso expõem portas/interfaces para os repositórios e serviços externos?
   - As dependências apontam para o centro?
2. **Domain-Driven Design Check:**
   - Existem modelos anêmicos sem métodos de negócio?
   - Identificou *Primitive Obsession* onde caberiam Value Objects auto-validados?
   - Agregados possuem consistência protegida pela Raiz?
3. **SOLID OOP Check:**
   - Há God Classes violando SRP?
   - Existem cadeias extensas de `switch/case` que violam OCP?
   - Há violações de Liskov ou métodos vazios por contratos mal segregados (ISP)?
   - O código instancia diretamente dependências externas via `new` em vez de usar injeção de dependência (DIP)?
4. **KISS Check:**
   - Há camadas redundantes, classes pass-through vazias ou abstrações desnecessárias (over-engineering)?
   - O código é claro e fácil de ler?

### Passo 4 — Relatório de Auditoria
Apresente o resultado estruturado em:
- **Resumo Executivo:** Estado geral da arquitetura (Conforme / Atenção / Não Conforme).
- **Conformidade por Pattern:**
  - `clean-architecture`: Diagnóstico e pontos de melhoria.
  - `domain-driven`: Diagnóstico e pontos de melhoria.
  - `solid-oop`: Diagnóstico e pontos de melhoria.
  - `kiss`: Diagnóstico e pontos de simplificação.
- **Ações Corretivas Priorizadas:** Passos práticos de refatoração para adequação da base de código.
