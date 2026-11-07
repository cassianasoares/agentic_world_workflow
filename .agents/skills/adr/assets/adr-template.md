# ADR-{numero}: {titulo}

| Metadado | Detalhe |
| :-- | :-- |
| **Status** | Proposto \| Aprovado \| Em Revisão \| Substituído |
| **Data** | AAAA-MM-DD |
| **Decisores** | {nomes/papéis} |
| **Escopo de Tráfego** | {ex.: < 10.000 MAU, ~5-10 RPS} |
| **Padrão Arquitetural** | Monolito Simples \| Monolito Modular \| Microsserviços |
| **Stack Tecnológica** | {ex.: Node.js (Fastify) \| Go \| Python (FastAPI)} |
| **Regime de Execução** | {ex.: Contínuo 24/7 (VPS) \| Sob Demanda / Serverless} |
| **Estratégia de Deploy** | Docker Compose \| Binário Nativo (systemd) \| PaaS Buildpacks \| Serverless |
| **Plataforma CI/CD** | GitHub Actions \| GitLab CI \| Jenkins |
| **Região / Localização** | {ex.: Brasil (São Paulo) \| Global} |
| **Teto de Custo Mensal** | {ex.: R$ 80 a R$ 150/mês \| $30 USD/mês} |

---

## 1. Contexto e Problema
{Descreva o contexto do sistema, o problema que motivou a decisão arquitetural e os requisitos de negócio identificados no PRD.}

## 2. Parâmetros de Dimensionamento

### 2.1 Tráfego e Concorrência
- **Volume Estimado de Usuários:** {ex.: 1.000 MAU no lançamento, meta de 10.000 em 6 meses}
- **Vazão Esperada (RPS em Pico):** {ex.: 2 a 5 requisições por segundo}
- **Perfil de Carga:** {ex.: 80% leitura, 20% escrita}
- **Localização dos Usuários:** {ex.: 100% no território nacional / Brasil}
- **Requisitos de Latência:** {ex.: Tempo de resposta < 300ms}

### 2.2 Stack Tecnológica e Regime de Execução
- **Linguagem e Framework:** {ex.: Node.js / TypeScript com Fastify}
- **Pegada de Memória Estimada (Baseline):** {ex.: ~120 MB em repouso; ~300 MB sob carga moderada}
- **Regime de Execução:** {ex.: Contínuo 24/7 em instância dedicada / Sob demanda}
- **Justificativa do Regime (FinOps):** {Por que execução contínua em VPS (StayCloud) é mais barata e estável do que serverless para o tráfego previsto, sem riscos de cold start.}

### 2.3 Perfil de I/O de Rede e Comunicação entre Serviços
- **Saída de Dados (Egress):** {ex.: Baixo volume (apenas payloads JSON de APIs, < 20GB/mês)}
- **Consumo de Dados Externos (Ingress/APIs):** {ex.: Chamadas pontuais a gateway de pagamento / APIs de autenticação}
- **Interação entre Serviços no Provedor:** {ex.: Aplicação e banco de dados comunicam-se via localhost/socket na mesma instância (zero tráfego externo e latência < 1ms) \| Rede privada VPC no mesmo provedor}

## 3. Decisão Arquitetural e Acoplamento de Camadas

### 3.1 Topologia: Monolito vs Monolito Modular vs Microsserviços
{Justifique a escolha da topologia arquitetural equilibrando tráfego, tamanho do time, domínio DDD e custo FinOps.}
- **Topologia Selecionada:** {Monolito Simples \| Monolito Modular \| Microsserviços}
- **Justificativa Técnica e de Negócio:** {ex.: Para a carga de X MAU e equipe de Y devs, o Monolito Modular oferece a separação estrita de domínios DDD da Clean Architecture sem o custo operacional, sobrecarga de rede e custos de infraestrutura de microsserviços.}

### 3.2 Nível de Separação (Frontend / Backend / Banco de Dados)
- **Separação Frontend/Backend:** {ex.: Mantidos juntos em uma única instância / Separados devido ao fluxo de acessos}
- **Estratégia de Banco de Dados:** {ex.: Banco de dados relacional (PostgreSQL/MySQL) rodando em uma instância compartilhada junto à aplicação (co-located na mesma VPS) \| Banco separado em instância dedicada se o tráfego justificar}
- **Justificativa de Não-Separação (KISS & FinOps):** {Por que manter a aplicação e o banco na mesma instância atende à stack e ao tráfego atual sem custos adicionais de rede, instâncias extras ou complexidade operacional.}

## 4. Escolha de Provedores e Infraestrutura

### 4.1 Provedor(es) Selecionado(s)
- **Provedor Principal:** {ex.: StayCloud (VPS Brasil) / Oracle Cloud Infrastructure (Vinhedo/SP) / Hetzner Cloud}
- **Justificativa de Localização:** {Por que este provedor atende a região geográfica e latência necessárias}
- **Justificativa Custo/Benefício:** {Por que esta é a opção mais econômica e estável para a carga esperada, considerando faturamento em BRL/USD sem custos ocultos de tráfego}

### 4.2 Estratégia de Empacotamento, Deploy e CI/CD
- **Regime de Empacotamento Escolhido:** {Docker / Docker Compose \| Binário Nativo (systemd) \| PaaS Buildpacks \| Serverless}
- **Justificativa da Escolha de Deploy:** {ex.: Docker Compose garante isolamento da app + Postgres na mesma VPS com rede privada interna \| Binário compilado em Go roda direto via systemd sem overhead de daemon do Docker}
- **Plataforma de CI/CD Selecionada:** {GitHub Actions \| GitLab CI \| Jenkins}

### 4.3 Estratégia de Observabilidade & Telemetria
- **Formato e Biblioteca de Logs:** {ex.: JSON Estruturado via Pino / Winston / Zap / Slog / Serilog}
- **Padrão de Rastreamento & Contexto:** {Correlation ID via cabeçalho X-Correlation-ID injetado por middleware em todas as requisições}
- **Métricas e Telemetria:** {Prometheus client / OpenTelemetry com endpoint /metrics exposto para scraping}
- **Destino dos Logs e Métricas:** {ex.: Grafana Cloud Free Tier / Datadog / CloudWatch / Logs rotacionados locais com logrotate}
- **Sondas de Saúde (Health Probes):** {/health/liveness (vida da app) e /health/readiness (checando conectividade de banco)}

## 5. Estimativa e Modelagem de Custos FinOps

Memória de cálculo aproximada com base nas calculadoras e tabelas dos provedores:

| Componente | Especificação | Consumo Estimado | Custo Mensal (USD) | Custo Mensal (BRL) |
| :-- | :-- | :-- | :-- | :-- |
| **Computação (Aplicação + Banco)** | {ex.: VPS StayCloud 2 vCPU, 4GB RAM (compatível com Node.js + Postgres)} | 730 horas (mês inteiro 24/7) | — | R$ {valor} |
| **Armazenamento (Disco SSD)** | {ex.: 60GB NVMe incluso na VPS} | 60 GB | — | R$ 0 (incluso) |
| **Tráfego de Rede (Egress / Saída)** | {ex.: Tráfego ilimitado / 1TB incluso na StayCloud} | ~20 GB previstos | — | R$ 0 (incluso) |
| **Tráfego Interno (VPC / Localhost)** | Comunicação app-banco interna | Ilimitado | — | R$ 0 (incluso) |
| **Instância Separada de Banco** | Não aplicável (co-located) | — | — | R$ 0 |
| **Serviços Complementares** | {ex.: Backups automáticos diários} | — | — | R$ {valor} |
| **TOTAL ESTIMADO** | — | — | **$ {total_usd}** | **R$ {total_brl}** |

> *Taxa de câmbio / Faturamento: Faturamento direto em BRL (sem IOF nem variação cambial).*

## 6. Alternativas Consideradas e Rejeitadas

### Alternativa 1: Microsserviços Distribuídos
- **Descrição:** Separação prematura em múltiplos serviços independentes com bancos separados.
- **Razão da Rejeição:** Violação do princípio KISS e risco FinOps severo. Introduz custos de rede, complexidade de deploys múltiplos e orquestração desnecessária para o volume de tráfego inicial.

### Alternativa 2: Vercel + Supabase
- **Descrição:** Hospedagem serverless na Vercel com banco de dados gerenciado no Supabase.
- **Razão da Rejeição:** Rejeitado conforme regras inegociáveis de FinOps (proibição de Vercel por custos abusivos de banda/egress e rejeição de Supabase para cargas de dados que rodam perfeitamente em instância co-located de baixo custo).

## 7. Consequências e Trade-offs

### Impactos Positivos
- {Vantagem 1, ex.: Custo operacional mínimo previsível em Reais com StayCloud}
- {Vantagem 2, ex.: Simplicidade de manutenção, deploy e backup único (KISS)}
- {Vantagem 3, ex.: Baixíssima latência entre aplicação e banco de dados (comunicação em localhost/socket)}

### Impactos Negativos e Limitações
- {Desvantagem/Compromisso 1, ex.: Aplicação e banco de dados compartilham os mesmos recursos de CPU e memória RAM da máquina}
- {Desvantagem/Compromisso 2, ex.: Necessidade de gerenciar backups e atualizações do banco de dados na VPS}

## 8. Gatilhos de Mudança (Scale Triggers)
Esta decisão deve ser reavaliada se:
1. O volume de requisições ultrapassar **{X} RPS sustentados**.
2. O consumo de CPU/RAM da instância ultrapassar **75% constante**, competindo entre o backend e o banco de dados.
3. O volume de saída de dados (egress) ou dados de banco exigirem a separação de instâncias ou armazenamento em Object Storage (S3/R2).
