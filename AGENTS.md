# Instruções para agentes

## Contexto e Padrões Arquiteturais Mandatórios

Qualquer código desenvolvido neste projeto deve seguir rigorosamente os seguintes padrões de engenharia de software (detalhados na skill `audit`):
- **Clean Architecture:** Separação estrita em camadas (Domínio, Aplicação, Adaptadores e Infraestrutura), com a regra de dependência voltada unicamente para dentro.
- **Domain-Driven Design (DDD):** Uso de Linguagem Ubíqua, Entidades com invariantes protegidas, Value Objects imutáveis auto-validados e Agregados consistentes.
- **SOLID (OOP):** Princípios de Responsabilidade Única (SRP), Aberto/Fechado (OCP), Substituição de Liskov (LSP), Segregação de Interfaces (ISP) e Inversão de Dependência (DIP).
- **KISS (Keep It Simple, Stupid):** Simplicidade como prioridade; evitar complexidade desnecessária e over-engineering (YAGNI).
- **The Twelve-Factor App (Cloud-Native & Resiliente):** Aderência aos fatores essenciais de código: configurações exclusivas por variáveis de ambiente com validação fail-fast e Zero Hardcoded Secrets (Fator III com `.env.example`), serviços de apoio desacoplados via portas DIP (Fator IV), processos stateless sem retenção de sessão em memória RAM (Fator VI), port binding autônomo (Fator VII), encerramento gracioso (*Graceful Shutdown*) com tratamento de `SIGTERM`/`SIGINT` fechando pools de conexões e transações (Fator IX), e logs como fluxo contínuo de eventos no `stdout` (Fator XI).
- **Secure by Design (SbD) & DevSecOps:** Princípio de segurança intrínseca desde a concepção (Shift-Left). Modelagem formal de ameaças (STRIDE + DREAD) em `docs/security/` antes da codificação, prevenção ativa do OWASP Top 10, validação contra IDOR/BOLA, sanitização de PII em logs e automação contínua de segurança (SAST, SCA, Secret Scanning e DAST) com bloqueio de vulnerabilidades.
- **Observabilidade & Telemetria:** Logs estruturados em JSON (`timestamp`, `level`, `correlation_id`, `service`, `message`, `context`), Mascaramento estrito de PII/segredos, propagação de `X-Correlation-ID` em todas as camadas, Métricas RED (Rate, Errors, Duration) e Sondas de Saúde (`/health/liveness`, `/health/readiness`). Abstraídos como portas (DIP) na camada de aplicação e implementados na Infraestrutura.

> ⚠️ **Regra Fundamental:** A auditoria arquitetural (`audit`) aplica-se **exclusivamente a código-fonte, arquitetura técnica e ao contexto de IA da aplicação**. Ela **NUNCA** deve ser executada sobre documentos de PRD ou ADR.

---

## Stack Tecnológica da Aplicação

> *Esta seção é mantida e atualizada automaticamente pela skill `adr` com base nas decisões arquiteturais registradas em `docs/adr/`.*

| Componente | Tecnologia / Decisão | Detalhes |
| :-- | :-- | :-- |
| **Topologia Arquitetural** | A definir via ADR | Monolito Simples, Monolito Modular ou Microsserviços |
| **Backend** | A definir via ADR | Linguagem e framework |
| **Banco de Dados** | A definir via ADR | Tecnologia e estratégia de instância |
| **Frontend / Cliente** | A definir via ADR | Plataforma e stack de UI |
| **Infraestrutura / Provedor** | A definir via ADR | Provedor de hospedagem, regime de execução e FinOps |
| **Regime de Deploy** | A definir via ADR | Docker Compose, Binário Nativo (systemd), PaaS Buildpacks ou Serverless |
| **Plataforma CI/CD** | A definir via ADR | GitHub Actions, GitLab CI ou Jenkins |
| **Observabilidade & Logs** | A definir via ADR | OpenTelemetry, Prometheus, Logs Estruturados JSON e Correlation ID |
| **ADR Vigente** | Nenhum ADR gerado ainda | Executar a skill `adr` para formalizar |

---

## Modos de Orquestração da Esteira (Execution Modes)

O desenvolvimento técnico a partir do PRD e ADR aprovados pode ser executado em dois modos distintos:

1. **Modo Ponto de Controle (Human-in-the-Loop — Padrão):**
   * O orquestrador aciona `security` e `spec`.
   * **⏸️ Checkpoint:** O orquestrador pausa e apresenta o resumo da modelagem de dados (`docs/data/`), Design System (`docs/design-system/`) e tarefas (`tasks.md`), aguardando a aprovação explícita do usuário antes de liberar a codificação.
   * Após o "OK", o ciclo TDD (`test` + `dev`) roda até 100% verde, seguido do `audit` e do portão de qualidade local `review`.
2. **Modo Fire and Forget (100% Autônomo / `/goal`):**
   * O orquestrador executa toda a esteira de forma contínua e autônoma sem pausas intermediárias:
     `security` $\rightarrow$ `spec` $\rightarrow$ `test` + `dev` (loop TDD) $\rightarrow$ `audit` $\rightarrow$ `review`.
   * Paradas ocorrem apenas em caso de impedimento crítico insuperável.
   * Entrega final consolidada entregue ao usuário com todos os testes verdes e parecer LGTM do review.

> 💡 **Como Acionar:** O usuário pode especificar o modo no comando (ex.: *"execute em Fire and Forget"* ou *"com Pontos de Controle"*). Se não informado, o orquestrador pergunta antes de iniciar.

### Higiene de Contexto & Comandos Operacionais (`/compact`, `/clear`, `/goal`)

Toda a inteligência e estado do projeto estão persistidos nos arquivos do disco (`docs/`, `AGENTS.md`, `test/`, `src/`), tornando seguro compactar ou limpar a conversa sem risco de perda de memória:
- **Após aprovar PRD e ADR:** Use `/compact` para resumir a longa entrevista de requisitos e FinOps antes do design técnico.
- **No Checkpoint (antes do TDD):** Use `/compact` para limpar a memória de trabalho antes de iniciar o ciclo de codificação e testes.
- **No modo Fire and Forget:** Use `/goal` para execuções autônomas contínuas de ponta a ponta.
- **Ao concluir a feature inteira:** Use `/clear` para iniciar a próxima funcionalidade com contexto 100% limpo e sem resíduos anteriores.
- **Regra Anti-Bloat:** Subagentes são proibidos de despejar logs brutos extensos de terminal na conversa principal; devem comunicar apenas diagnósticos acionáveis sintetizados.

---

## Diretrizes de Versionamento de Código (Git & Conventional Commits)

O gerenciamento de código na esteira segue práticas estritas de isolamento, rastreabilidade e commits atômicos integradas às responsabilidades dos agentes:

### 1. Estratégia de Branching (Short-Lived Feature Branches)
- A branch principal (`main` ou `master`) é protegida e deve estar sempre em estado estável (verde).
- Todo trabalho de uma nova feature, correção ou refatoração roda em uma branch dedicada nomeada a partir do `[slug]` da especificação:
  - `feat/[slug]`: Novas funcionalidades (ex.: `feat/autenticacao-jwt`).
  - `fix/[slug]`: Correções de bugs ou defeitos em produção.
  - `refactor/[slug]`: Reestruturações de código sem alteração funcional.
  - `chore/[slug]` ou `docs/[slug]`: Ajustes de infraestrutura, CI ou documentação pura.
- **Responsável pelo Ciclo da Branch:** O `orchestrator-agent` garante a criação/checkout da branch no início da esteira técnica (`git checkout -b feat/[slug]`) e orienta a abertura do Pull Request ou merge ao final do ciclo.

### 2. Padrão de Mensagens (Conventional Commits 1.0.0)
As mensagens de commit devem seguir rigorosamente o padrão:
```
<tipo>(<escopo>): <descrição no imperativo e em minúsculas>
```
- **Tipos Permitidos:**
  - `feat`: Nova funcionalidade no código de produção (`src/`).
  - `fix`: Correção de bug no código de produção (`src/`).
  - `test`: Adição ou modificação de testes automatizados (`test/`).
  - `refactor`: Mudança de código que não corrige bug nem adiciona funcionalidade (`src/`).
  - `docs`: Alterações exclusivas em documentação (`docs/`, `AGENTS.md`, `README.md`).
  - `ci`: Alterações em pipelines de CI/CD (`.github/`, `.gitlab-ci.yml`, `Jenkinsfile`).
  - `chore`: Atualizações de dependências, build tools ou tarefas administrativas.
- **Escopo Obrigatório:** Representa o módulo, subdomínio DDD ou camada afetada (ex.: `auth`, `order`, `billing`, `api`, `db`, `ui`).

### 3. Rastreabilidade Atômica no Ciclo TDD (Ping-Pong)
O histórico do Git reflete a evolução exata de cada requisito:
1. **Fase RED (`test-agent`):** Comita a suíte de teste falha antes de qualquer código de produção ser escrito:
   ```bash
   git add test/
   git commit -m "test(auth): add failing tests for token refresh [CA-01]"
   ```
2. **Fase GREEN (`dev-agent`):** Comita o código mínimo de produção assim que o `test-agent` validar que o teste passou:
   ```bash
   git add src/
   git commit -m "feat(auth): implement token refresh rotation [CA-01]"
   ```
3. **Fase REFACTOR (`dev-agent`):** Comita melhorias de design, desacoplamento ou Clean Architecture mantendo 100% dos testes verdes:
   ```bash
   git add src/
   git commit -m "refactor(auth): extract token verification into value object"
   ```
4. **Regra de Ouro:** Nunca comitar código que quebra os testes existentes. Cada commit representa uma unidade lógica verificável e funcional.

---

## Skills do projeto

As skills deste projeto ficam em `.agents/skills/<nome>/SKILL.md` (formato aberto Agent Skills). Se o seu agente não descobre skills automaticamente, leia o `SKILL.md` correspondente quando a tarefa se encaixar na descrição.

| Skill | Subagente Dedicado & Role | Modelo | Quando usar | Caminho |
| :-- | :-- | :-- | :-- | :-- |
| `orchestrator` | **Engineering Manager & Orchestrator** (`orchestrator-agent`) | `high` | Coordenar a esteira completa de engenharia de software de ponta a ponta, gerenciando a transição entre agentes nos modos Ponto de Controle ou Fire and Forget. | `.agents/skills/orchestrator/SKILL.md` |
| `prd` | **Product Manager & PO** (`prd-specialist`) | `high` | Criar, revisar ou atualizar um PRD / documento de requisitos de produto. Os PRDs são salvos em `docs/prd/`. | `.agents/skills/prd/SKILL.md` |
| `adr` | **Principal Architect & FinOps** (`adr-architect`) | `high` | Definir ou registrar decisões de arquitetura técnica e FinOps dimensionadas por tráfego, localização e custo real. Gera ADRs em `docs/adr/`. | `.agents/skills/adr/SKILL.md` |
| `security` | **AppSec & DevSecOps Lead** (`security-agent`) | `high` | Modelar ameaças (STRIDE + DREAD) em `docs/security/`, auditar OWASP e implementar automação DevSecOps (SAST, Secrets, SCA, DAST) com suporte multi-CI/CD (GitHub Actions, GitLab CI, Jenkins). | `.agents/skills/security/SKILL.md` |
| `spec` | **Staff Software Engineer & Tech Lead** (`spec-agent`) | `high` | Elaborar modelagem de dados/DDD em PlantUML em `docs/data/`, Design System em PlantUML em `docs/design-system/`, e a tríade técnica (`spec.md`, `plan.md`, `tasks.md`) em `docs/specs/[slug]/`. **Não implementa código.** | `.agents/skills/spec/SKILL.md` |
| `test` | **QA Lead & SDET** (`test-agent`) | `medium` | Escrever suítes de teste automatizado (RED) diretamente em `test/`, auditar queries com EXPLAIN, validar integridade relacional e conduzir o ciclo TDD em parceria com o dev. | `.agents/skills/test/SKILL.md` |
| `dev` | **Senior Software Engineer & TDD** (`dev-agent`) | `medium` | Implementar código de produção em `src/` guiado por `tasks.md`, corrigindo falhas apontadas pelo `test-agent` até atingir 100% de sucesso via TDD. | `.agents/skills/dev/SKILL.md` |
| `audit` | **Lead Architect & Quality Auditor** (`code-auditor`) | `medium` | Estruturar o contexto de IA (`AGENTS.md`) e auditar código/arquitetura garantindo Clean Architecture, DDD, SOLID, KISS, Complexidade Cognitiva e Acoplamento. **Nunca usar em PRD ou ADR.** | `.agents/skills/audit/SKILL.md` |
| `review` | **Staff Code Reviewer & SDD Gatekeeper** (`review-agent`) | `medium` | Executar code review 100% local no git diff, validando qualidade de código, Clean Architecture e aderência estrita ao SDD (`spec.md`). | `.agents/skills/review/SKILL.md` |
