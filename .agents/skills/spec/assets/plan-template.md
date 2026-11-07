# Plano Técnico de Implementação: [Nome da Feature / Módulo]

> **Status:** [Draft | Aprovado] | **Spec:** `docs/specs/[slug]/spec.md` | **ADR:** `docs/adr/ADR-[numero-slug].md`  
> **Design System:** `docs/design-system/[slug].md` | **Versão:** 1.0.0 | **Autor:** `spec-agent`

---

## 1. Estrutura Clean Architecture

```
src/ ou app/
├── domain/                      # Camada 1: Entidades, Value Objects, Erros (docs/data/)
├── application/                 # Camada 2: Use Cases, Input/Output DTOs, Portas (Interfaces DIP)
├── adapters/                    # Camada 3: Controllers, Presenters, Views/UI (docs/design-system/)
└── infrastructure/              # Camada 4: DB (migrations, ORM/SQL), Rotas HTTP, Middlewares
```

---

## 2. Contratos de Portas & Inversão de Dependência (DIP)

```typescript
// Assinatura estrita antes da codificação
export interface I[Nome]Repository {
  findById(id: [Nome]Id): Promise<[Nome]Entity | null>;
  save(entity: [Nome]Entity): Promise<void>;
}

export interface I[Nome]Gateway {
  execute(params: GatewayParams): Promise<GatewayResult>;
}

// Porta de Observabilidade & Telemetria (DIP)
export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
}
```

### 2.1 Middlewares Mandatórios & Rotas de Infraestrutura
- **Correlation ID Middleware:** Injeção/propagação do cabeçalho `X-Correlation-ID` em logs e respostas HTTP.
- **Health Probes:** Rotas `/health/liveness` e `/health/readiness` (checagem de banco sem expor dados internos).

---

## 3. Estratégia de Testes (Pirâmide TDD)

| Nível | Camada Alvo | Abordagem | Dependência Externa |
| :-- | :-- | :-- | :-- |
| **Unitário (Domínio)** | Entidades & Value Objects (`docs/data/`) | Teste puro e determinístico | Nenhuma (em memória) |
| **Unitário (Aplicação)** | Casos de Uso | Mocks / Repositórios Fake | Zero I/O real |
| **Componentes (UI)** | Componentes (`docs/design-system/`) | Testing Library / Vitest UI | DOM virtual isolado |
| **Integração (Infra)** | Repositórios concretos | Banco de teste / Migrations | DB real de testes |
| **E2E / API** | Controllers & Middlewares | Chamadas HTTP reais (Supertest) | Servidor de teste |

---

## 4. Dependências Autorizadas (KISS) & Riscos Técnicos

| Pacote / Dependência | Versão | Finalidade |
| :-- | :-- | :-- |
| `[ex.: zod / tailwindcss]` | `[versão]` | [Validação / Estilização conforme ADR] |

| Risco Técnico Identificado | Impacto | Estratégia de Mitigação |
| :-- | :--: | :-- |
| [Risco de concorrência ou render] | Médio/Alto | [Uso de transações / memoização / lazy loading] |
