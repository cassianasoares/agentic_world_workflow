# Checklist de Code Review Local & Aderência ao SDD

Este documento detalha os critérios de avaliação utilizados pelo `review-agent` ao inspecionar o `git diff` local de uma feature branch antes da finalização.

---

## 1. Pilar de Code Review (Qualidade de Código & Higiene)

### 1.1 Resíduos de Desenvolvimento & Depuração
- [ ] **Zero Logs de Debug:** Nenhum `console.log`, `print()`, `System.out.println`, `debugger`, `dump()` ou similar presente no diff.
- [ ] **Zero Código Comentado:** Trechos de código desativados ou comentados devem ser sumariamente removidos.
- [ ] **Zero TODOs Órfãos:** Comentários do tipo `// TODO: fix this later` sem issue ou tarefa correspondente são proibidos.

### 1.2 Robustez & Tratamento de Erros
- [ ] **Tratamento Específico de Erros:** Proibido capturar exceções genéricas (`catch (Exception e)`) sem relançar ou tratar de forma tipada e contextualizada.
- [ ] **Sem "Silent Swallowing":** Nenhum bloco catch vazio que mascare falhas em produção.
- [ ] **Prevenção de Nulos / Indefinidos:** Validação explícita de entradas, uso de operadores seguros (`?.`, `??`) e retorno defensivo contra NullPointer/Undefined.

### 1.3 Tipagem & Clareza
- [ ] **Tipagem Forte:** Evitar o uso indiscriminado de `any`, `object` ou `dynamic` quando um tipo estrito pode ser definido.
- [ ] **Nomenclatura Expressiva:** Nomes de variáveis, funções e classes devem revelar a intenção do negócio, sem abreviações crípticas (`usr`, `d`, `tmp`).
- [ ] **Gerenciamento de Recursos:** Fechamento adequado de conexões, descritores de arquivo ou streams (`try-with-resources`, `using`, `defer`, `finally`).

### 1.4 Padrões The Twelve-Factor App
- [ ] **Zero Hardcoded Secrets / Keys (Fator III):** Proibido em absoluto conter senhas, tokens de API, chaves privadas, secrets JWT ou connection strings com credenciais no diff.
- [ ] **Consumo via Variáveis de Ambiente (Fator III):** Todas as credenciais e parâmetros dinâmicos de infraestrutura devem ser lidos exclusivamente via variáveis de ambiente.
- [ ] **Atualização do `.env.example`:** Se novas variáveis foram introduzidas pela funcionalidade, devem estar documentadas no `.env.example` com valores fictícios/placeholders.
- [ ] **Processos Stateless (Fator VI):** Nenhuma sessão de usuário ou estado volátil armazenado em memória RAM global ou singletons de processo.
- [ ] **Graceful Shutdown (Fator IX):** Presença de tratamento de sinais `SIGTERM` e `SIGINT` para fechamento ordenado do servidor HTTP e pools de conexões de banco.
- [ ] **Proteção do `.gitignore`:** Nenhum arquivo de ambiente real (`.env`, `.env.local`, `.pem`) está sendo rastreado pelo Git.

---

## 2. Pilar de Arquitetura & Patterns (Clean Arch, DDD, SOLID, KISS)

### 2.1 Clean Architecture & Fronteiras de Camadas
- [ ] **Regra de Dependência:** O fluxo de dependências aponta exclusivamente de fora para dentro:
  - `Domínio` NÃO depende de nada externo (sem imports de ORM, Web Framework, libs de terceiros).
  - `Aplicação (Use Cases)` depende apenas do `Domínio` e de interfaces/portas.
  - `Infraestrutura` e `Adaptadores` implementam as interfaces definidas na aplicação/domínio.
- [ ] **Injeção de Dependências (DIP):** Controladores e Casos de Uso recebem dependências via construtor/abstração, nunca instanciando diretamente serviços externos (`new ConcreteRepository()`).

### 2.2 Domain-Driven Design (DDD)
- [ ] **Entidades com Invariantes:** Entidades contêm regras de negócio e validações em seus métodos, evitando o modelo anêmico.
- [ ] **Value Objects Imutáveis:** Conceitos atômicos (Email, CPF, Moeda, Endereço) encapsulados em VOs que validam a si mesmos no momento da instanciação.
- [ ] **Linguagem Ubíqua:** Nomes de métodos refletem eventos ou operações do domínio (`ativarAssinatura()`, não `setStatus(1)`).

### 2.3 Princípio KISS (Keep It Simple, Stupid)
- [ ] **Sem Abstrações Prematuras:** Evitar padrões complexos (Factory, Strategy, Observer) se um simples `if/switch` ou função pura resolve o problema de forma clara.
- [ ] **Funções Curtas:** Métodos com propósito único, sem aninhamentos profundos (máximo 3 níveis de indentação).

---

## 3. Pilar de Aderência ao SDD (Spec-Driven Development)

### 3.1 Cobertura Fiel dos Requisitos BDD
- [ ] **Critérios de Aceite Atendidos:** Todos os cenários BDD (`[CA-XX]`) descritos em `docs/specs/[slug]/spec.md` estão concretamente atendidos no código de produção.
- [ ] **Contratos de API/Interface:** As rotas HTTP, payloads de request/response e códigos de status HTTP batem exatamente com o especificado em `spec.md`.

### 3.2 Anti-Scope Creep (Isolamento de Escopo)
- [ ] **Sem Alterações Fora de Escopo:** O `git diff` contém **apenas** arquivos pertencentes à funcionalidade especificada em `docs/specs/[slug]/plan.md` e `tasks.md`.
- [ ] **Sem Refatorações Oportunistas Desnecessárias:** Arquivos alheios à feature não foram alterados para "melhorias estéticas" não solicitadas.

### 3.3 Fidelidade aos Dados e Esquema
- [ ] **Conformidade com `docs/data/[slug].md`:** Entidades, nomes de colunas, tipos e relacionamentos de persistência respeitam integralmente a modelagem de dados documentada.

---

## 4. Pilar de Observabilidade & Telemetria

### 4.1 Logs Estruturados & Higiene
- [ ] **JSON Estruturado:** Todos os logs operacionais são emitidos via logger injetado (porta DIP) em formato JSON estruturado com campos obrigatórios (`timestamp`, `level`, `correlation_id`, `service`, `message`, `context`).
- [ ] **Proibido Texto Livre:** Proibido uso de concatenação de strings soltas ou métodos não indexáveis.
- [ ] **Níveis Apropriados de Log:** Uso coerente de níveis (`DEBUG` apenas para diagnóstico em dev; `INFO` para marcos de negócio; `WARN` para recuperações inesperadas; `ERROR` para exceções não tratadas).

### 4.2 Segurança & Proteção de Dados Sensíveis (PII / Segredos)
- [ ] **Zero Vazamento de PII:** Nenhum dado pessoal não mascarado (CPF, senhas, tokens Bearer, CVV, cartão de crédito) pode ser impresso no log.
- [ ] **Sanitização de Payloads:** Headers sensíveis (`Authorization`, `Cookie`) e payloads de entrada são filtrados ou mascarados antes do log.

### 4.3 Rastreamento & Sondas de Saúde
- [ ] **Propagação de Correlation ID:** Middleware captura ou gera `X-Correlation-ID` e anexa ao contexto do logger em toda a cadeia de execução.
- [ ] **Health Probes Ativos:** Presença de rotas `/health/liveness` e `/health/readiness` (checando conectividade de banco/dependências sem travar em falso positivo).
- [ ] **Métricas RED:** Instrumentação de contadores e histogramas para taxa, erros e duração das requisições.
