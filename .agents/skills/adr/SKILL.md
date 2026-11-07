---
name: adr
description: >-
  Conduz o processo de decisão de arquitetura técnica e FinOps para a aplicação,
  dimensionando infraestrutura conforme o tráfego esperado, localização dos usuários,
  stack (linguagem/framework), regime de execução e custos de rede. Gera um artefato
  ADR-{numero}-{nome}.md em docs/adr/ e atualiza o resumo das stacks no AGENTS.md.
---

# Skill: ADR (Architectural Decision Record & FinOps)

Esta skill é **agnóstica de agente e de sistema operacional**. Ela utiliza apenas as capacidades essenciais de diálogo e manipulação de arquivos do projeto.

Seu propósito é conduzir uma avaliação técnica estruturada para **definir a arquitetura da aplicação e sua infraestrutura**, dimensionada rigorosamente de acordo com:
1. **Topologia Arquitetural:** Monolito Simples vs Monolito Modular vs Microsserviços.
2. **Tráfego de usuários esperado, concorrência e necessidade de escala.**
3. **Stack tecnológica:** Linguagem de programação e framework (impacto em CPU, memória RAM e concorrência).
4. **Regime de execução:** Funcionamento contínuo 24/7 vs sob demanda (serverless / jobs / eventos).
5. **Perfil de tráfego de rede:** Volume de saída de dados (egress), consumo de dados externos (APIs) e tráfego interno (VPC).
6. **FinOps & Custo real:** Localização do público (ex.: Brasil com StayCloud vs Internacional) e orçamento mensal.

Além de gerar o artefato formal de decisão (`ADR-{numero}-{slug}.md`), esta skill **atualiza obrigatoriamente o resumo das stacks da aplicação no arquivo `AGENTS.md` na raiz do projeto**, garantindo que todas as outras habilidades e agentes tenham clareza das tecnologias vigentes.

---

## 🚫 Regras Rígidas e Mandatórias

1. **NUNCA SUGERIR VERCEL:** Sob nenhuma circunstância a Vercel deve ser sugerida como opção de hospedagem (risco de custos ocultos com egress/banda e aprisionamento tecnológico).
2. **NUNCA SUGERIR SUPABASE SE A CARGA DE DADOS NÃO NECESSITAR:** Não recomende Supabase por conveniência ou para pequenas cargas de dados. O padrão de arquitetura inicial é ter o banco de dados rodando em uma instância compartilhada junto à aplicação (co-located na mesma VPS/host). O Supabase só pode ser considerado se a volumetria, concorrência extrema de dados ou requisitos reais de WebSockets/Realtime em alta escala justificarem explicitamente o custo.
3. **DIRETRIZ DE TOPOLOGIA (MONOLITO vs MONOLITO MODULAR vs MICROSSERVIÇOS):**
   - **Monolito Simples:** Adotar apenas para MVPs descartáveis, ferramentas internas simples ou projetos de 1 único dev com domínio trivial.
   - **Monolito Modular (Padrão Recomendado):** É o ponto de equilíbrio ideal para a grande maioria das aplicações. Aplica Clean Architecture e DDD rigorosos (módulos desacoplados com interfaces públicas), mas roda em um **único processo/servidor** (ex.: VPS StayCloud). Garante zero latência de rede entre módulos, zero custo de egress interno, deploy simples e facilita a extração futura de qualquer módulo para microsserviço sem reescrever o código.
   - **Microsserviços:** **NUNCA adotar em início de projeto ou com equipes pequenas.** Requer mais de 500.000 MAU ou múltiplas equipes autônomas (> 15 devs), devido à sobrecarga de orquestração (Kubernetes), latência de rede, transações distribuídas (Saga) e custos FinOps multiplicados.
4. **SEPARAÇÃO DE CAMADAS BASEADA ESTRITAMENTE NO FLUXO (KISS):**
   - **Frontend e Backend:** Mantenha unificados (monolito / mesmo container / mesma instância) por padrão. **SÓ sugira separá-los fisicamente se o volume de tráfego, concorrência ou escalabilidade independente exigirem.**
   - **Banco de Dados:** O banco de dados deve rodar inicialmente **na mesma instância junto à aplicação** (compartilhando recursos da VPS/servidor), eliminando custos adicionais de instâncias gerenciadas e tráfego de rede interna. **SÓ sugira separar o banco de dados em uma instância ou serviço dedicado/gerenciado se o volume de tráfego, concorrência severa de escritas ou consumo de I/O exigirem.**
5. **LOCALIZAÇÃO E PROVEDORES CUSTO/BENEFÍCIO:**
   - **Se o público for prioritariamente no Brasil:** Inclua e avalie prioritariamente **StayCloud** (provedor com presença e infraestrutura no Brasil, faturamento direto em Reais e excelente custo/benefício), além de opções como Oracle Cloud Infrastructure (região Vinhedo/SP), AWS `sa-east-1` ou soluções com CDN na borda brasileira (ex.: Hetzner com Cloudflare em SP/Rio).
   - **Se o público for Internacional / Global:** Busque provedores globais de excelente relação custo/benefício (ex.: Hetzner Cloud, Fly.io, DigitalOcean, Cloudflare).
6. **INTERAÇÃO ENTRE SERVIÇOS NO MESMO PROVEDOR:** Se houver múltiplos serviços (ex.: aplicação, banco de dados, Redis, workers), priorize a hospedagem no mesmo provedor com comunicação via rede privada (VPC/localhost), garantindo latência mínima e **custo zero de transferência interna de dados**.
7. **ATUALIZAÇÃO DO `AGENTS.md`:** Todo ADR gerado deve refletir imediatamente a stack aprovada no arquivo `AGENTS.md`.
8. **CÁLCULO APROXIMADO DE CUSTOS (FinOps):** Todo ADR deve apresentar uma memória de cálculo aproximada com custos de computação (CPU/RAM considerando a stack), armazenamento, tráfego de saída (egress) e licenças, convertendo para Reais (BRL) e Dólares (USD).

---

## Arquivos desta Skill

| Arquivo | Finalidade |
| :-- | :-- |
| `agent-prompt.md` | Definição de role (Principal Architect & FinOps), modelo e system prompt do subagente. |
| `references/questions.md` | Questionário de tráfego, stack, topologia, regime de execução, I/O de rede e FinOps. **Leia antes de iniciar.** |
| `references/finops-sizing.md` | Matriz de decisão Monolito vs Monolito Modular vs Microsserviços, dimensionamento e provedores. |
| `assets/adr-template.md` | Template obrigatório para o artefato gerado. |

---

## Saídas da Skill

1. **Artefato de Decisão:** `docs/adr/ADR-{numero}-{slug}.md` na raiz do projeto (crie a pasta `docs/adr/` se não existir).
   - **Numeração:** Sequencial de 3 dígitos (ex.: `ADR-001-arquitetura-inicial.md`, `ADR-002-estrategia-cache.md`). Verifique os ADRs já existentes na pasta para definir o próximo número.
   - **Formato:** Markdown puro em UTF-8.
2. **Atualização do Contexto Geral:** Seção `## Stack Tecnológica da Aplicação` no arquivo `AGENTS.md` na raiz do repositório.

---

## Fluxo de Trabalho Passo a Passo

### Passo 1 — Coleta de Contexto Inicial no PRD
1. Verifique se o projeto já possui um PRD em `docs/prd/` ou documentação equivalente.
2. **Extraia do PRD:**
   - Domínios de negócio identificados (para avaliar Monolito Simples vs Modular).
   - Linguagem de programação e frameworks previstos.
   - Regime de execução esperado: se a aplicação deve ficar funcionando **direto 24/7** ou se pode ser usada **por demanda** (jobs, agendamentos, scale-to-zero).
   - Perfil de tráfego de rede: se haverá saída substancial de dados (downloads, streaming, relatórios) e se ela consome APIs de terceiros na rede.
3. Identifique os ADRs já existentes em `docs/adr/` para calcular a numeração correta (`ADR-001`, `ADR-002`, etc.).

### Passo 2 — Rodada Obrigatória de Perguntas (Tráfego, Stack e Execução)
Caso as informações do PRD não sejam suficientes ou estejam ausentes, o agente **DEVE obrigatoriamente** realizar uma rodada de perguntas estruturadas ao usuário (consultando `references/questions.md`), cobrindo:
1. **Volume de Tráfego e Concorrência:** MAU inicial, meta em 6 meses, acessos simultâneos (RPS) no pico e proporção leitura/escrita.
2. **Stack Tecnológica:** Linguagem de programação (ex.: Node.js, Go, Python, Java, C#) e framework adotado.
3. **Regime de Execução:** Funcionamento contínuo 24/7 (ex.: VPS StayCloud) vs sob demanda (serverless / jobs / workers event-driven).
4. **Tráfego de Rede (Egress / Ingress):**
   - Haverá grande volume de saída de dados (arquivos pesados, mídias, relatórios)?
   - A aplicação consome dados intensivamente de APIs externas na rede?
5. **Interação com Outros Serviços:** Comunicação com outros serviços no mesmo provedor (ex.: banco, cache, mensageria via rede privada)?
6. **Localização e Orçamento FinOps:** Usuários no Brasil (faturamento em BRL com StayCloud) vs Global, e teto orçamentário mensal.
7. **Estratégia de Empacotamento e Deploy:** Escolha obrigatória com o usuário entre **Docker / Docker Compose** (paridade e isolamento), **Binário Nativo com systemd** (VPS bare-metal com zero overhead de RAM para Go/Rust) ou **PaaS com Buildpacks** (sem Dockerfile manual).
8. **Plataforma de CI/CD:** GitHub Actions, GitLab CI ou Jenkins.

### Passo 3 — Formulação da Decisão Técnica
Com base nas respostas e nas diretrizes de `references/finops-sizing.md`:
1. **Definição da Topologia Arquitetural:**
   - Justifique a escolha entre **Monolito Simples**, **Monolito Modular** ou **Microsserviços**. Priorize o **Monolito Modular** para aplicações com múltiplos domínios (DDD) para manter o código limpo sem a complexidade e custos de microsserviços.
2. **Dimensionamento de Computação (CPU/RAM):** Avalie a memória base e CPU necessárias para a stack escolhida (Go consome muito menos RAM que Java/Python).
3. **Regime de Execução:** Avalie se o regime contínuo 24/7 (VPS como StayCloud) é mais barato e estável do que soluções serverless sob demanda (evitando surpresas de cobrança por invocação/tempo de execução).
4. **Acoplamento de Camadas e Dados:** Avalie se o tráfego justifica separar Frontend de Backend ou se o banco deve rodar na mesma instância da aplicação (regra: manter juntos até que o tráfego justifique).
5. **Estratégia de Rede e FinOps:** Dimensione custos de rede (tráfego interno gratuito na mesma VPC e franquia de egress).
6. **Cálculo de Custos:** Elabore a estimativa detalhada em BRL e USD.

### Passo 4 — Validação com o Usuário
Apresente uma síntese da arquitetura proposta contendo:
- Topologia recomendada (Monolito Modular, etc.).
- Estratégia de banco de dados (co-located na mesma instância vs dedicado).
- Stack e regime de execução (24/7 vs demanda).
- Provedor(es) sugerido(s) (StayCloud, etc.) e estratégia de rede.
- Estimativa mensal de custo (em BRL e USD).
- Confirme com o usuário: *"Podemos gerar o documento formal ADR-{numero} com esta proposta?"*.

### Passo 5 — Geração do Artefato
1. Leia `assets/adr-template.md`.
2. Preencha todas as seções rigorosamente.
3. Salve o arquivo em `docs/adr/ADR-{numero}-{slug}.md`.

### Passo 6 — Atualização Obrigatória do `AGENTS.md` (Resumo das Stacks)
Logo após salvar o ADR, o agente **DEVE obrigatoriamente atualizar o arquivo `AGENTS.md` na raiz do projeto**, inserindo ou atualizando a seção `## Stack Tecnológica da Aplicação` com a tabela-resumo das tecnologias definidas no ADR:

```markdown
## Stack Tecnológica da Aplicação

| Componente | Tecnologia / Decisão | Detalhes |
| :-- | :-- | :-- |
| **Topologia Arquitetural** | {ex.: Monolito Modular} | Módulos desacoplados via Clean Architecture em processo único |
| **Backend** | {ex.: Node.js / TypeScript (Fastify)} | API REST / RPC |
| **Banco de Dados** | {ex.: PostgreSQL co-located} | Rodando na mesma instância junto à aplicação |
| **Frontend / Cliente** | {ex.: Android Nativo (Kotlin)} | Definido conforme PRD/ADR |
| **Infraestrutura / Provedor** | {ex.: StayCloud VPS Brasil} | Regime contínuo 24/7, faturamento em BRL |
| **ADR Vigente** | [`ADR-{numero}-{slug}.md`](./docs/adr/ADR-{numero}-{slug}.md) | Registro oficial da decisão de arquitetura |
```

### Passo 7 — Encerramento
Responda ao usuário com:
- O link do arquivo ADR gerado em `docs/adr/`.
- Confirmação de que a tabela de stacks em `AGENTS.md` foi atualizada.
- Resumo dos principais pontos acordados (topologia, stack, provedor e custo estimado).
