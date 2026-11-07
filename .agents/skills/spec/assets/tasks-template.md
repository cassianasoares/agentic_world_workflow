# Checklist de Tarefas: [Nome da Feature / Módulo]

> **Status:** [Não Iniciado | Em Progresso | Concluído] | **Spec:** `docs/specs/[slug]/spec.md` | **Plan:** `docs/specs/[slug]/plan.md`  
> **Data Model:** `docs/data/[slug].md` | **Design System:** `docs/design-system/[slug].md`  
> **Executor:** `dev-agent` | **Versão:** 1.0.0

---

## 🎯 Regras Inegociáveis para o `dev-agent`

1. **Ciclo TDD:** Para itens `[TDD]`, escreva o teste antes (Red), implemente o mínimo (Green) e limpe aplicando Clean Arch/DDD/SOLID/KISS (Refactor).
2. **Execução Sequencial:** Conclua uma tarefa por vez, rode a suite de testes e marque `[x]`.
3. **Fidelidade aos Artefatos:** Consulte `docs/data/[slug].md` para entidades/banco e `docs/design-system/[slug].md` para UI/tokens.

---

## Fase 1: Domínio & Value Objects (Núcleo Puro)

- [ ] **Task 1.1** `[TDD]` `[Domain]` Implementar Value Objects
  - **Alvo:** `src/domain/value-objects/[nome-vo].ts`
  - **Cobre:** `[RT-02]`, `[CA-02]` (consulte PlantUML em `docs/data/[slug].md`)
  - **DoD:** Testes unitários puros em `test/domain/value-objects/[nome-vo].test.ts` cobrindo entradas válidas e exceções (100% verde).

- [ ] **Task 1.2** `[TDD]` `[Domain]` Implementar Entidade / Aggregate Root
  - **Alvo:** `src/domain/entities/[nome-entidade].ts`
  - **Cobre:** `[RT-01]`, `[CA-01]`, `[CA-02]` (consulte PlantUML em `docs/data/[slug].md`)
  - **DoD:** Testes unitários em `test/domain/entities/[nome-entidade].test.ts` validando métodos de negócio e invariantes protegidas.

- [ ] **Task 1.3** `[Domain]` Implementar Exceções Tipadas de Domínio
  - **Alvo:** `src/domain/exceptions/`
  - **DoD:** Classes de erro customizadas herdando do base error do domínio.

---

## Fase 2: Aplicação, Casos de Uso & Portas

- [ ] **Task 2.1** `[Application]` Definir Contratos de Portas (DIP)
  - **Alvo:** `src/application/ports/` (`repositories/`, `gateways/`)
  - **DoD:** Interfaces TypeScript tipadas sem dependência de bibliotecas externas.

- [ ] **Task 2.2** `[TDD]` `[Application]` Implementar Casos de Uso com Repositório Fake
  - **Alvo:** `src/application/use-cases/[nome-usecase].ts`
  - **Cobre:** `[CA-01]`, `[CA-02]`
  - **DoD:** Testes unitários em `test/application/use-cases/[nome-usecase].test.ts` usando fake repos em memória cobrindo sucesso e erro.

---

## Fase 3: Infraestrutura & Banco de Dados

- [ ] **Task 3.1** `[Infra]` Criar Migrations e Esquema Físico
  - **Alvo:** `src/infrastructure/database/migrations/`
  - **Cobre:** Esquema ERD PlantUML em `docs/data/[slug].md`
  - **DoD:** Migration executa sem erro em banco de teste local.

- [ ] **Task 3.2** `[TDD]` `[Infra]` Implementar Repositório Concreto no Banco
  - **Alvo:** `src/infrastructure/database/repositories/[nome-repo].ts`
  - **Cobre:** `[CA-01]`
  - **DoD:** Testes de integração em `test/infrastructure/repositories/[nome-repo].integration.test.ts` testando persistência e busca.

---

## Fase 4: UI & Design System *(Se houver camada frontend)*

- [ ] **Task 4.1** `[UI]` Implementar Tokens e Componentes Base
  - **Alvo:** `src/adapters/ui/components/`
  - **Cobre:** Especificação e PlantUML em `docs/design-system/[slug].md`
  - **DoD:** Tokens aplicados e componentes com estados (Default, Hover, Disabled, Loading, Error) e contraste WCAG AA.

- [ ] **Task 4.2** `[TDD]` `[UI]` Implementar Telas/Formulários Conectados aos Use Cases
  - **Alvo:** `src/adapters/ui/views/`
  - **Cobre:** `[CA-01]`, `[CA-02]`
  - **DoD:** Testes de componente/UI validando renderização, validações de erro e submissão.

---

## Fase 5: Segurança (STRIDE) & Verificação Final

- [ ] **Task 5.1** `[TDD]` `[Security]` Aplicar Mitigações STRIDE (IDOR, Auth, Rate Limit)
  - **Alvo:** Middlewares / Use Case guards
  - **Cobre:** Tabela STRIDE da `spec.md`
  - **DoD:** Testes de segurança simulando acesso cruzado de usuários e requisições não autenticadas rejeitadas.

- [ ] **Task 5.2** `[Verification]` Executar Suíte Completa de Testes
  - **DoD:** 100% dos testes unitários, integração, UI e E2E verdes sem warnings.
