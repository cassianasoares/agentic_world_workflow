# Guia de Dimensionamento de Tráfego, Arquitetura e FinOps

Este guia auxilia o agente na tomada de decisão arquitetural com base no fluxo real de usuários, stack tecnológica, regime de execução e princípios de FinOps.

---

## 1. Regras Rígidas de Seleção de Tecnologias e Provedores

### 🚫 Proibições e Restrições Rígidas:
1. **NUNCA sugerir Vercel:** Sob nenhuma hipótese sugerir Vercel. O modelo de cobrança de egress/banda e execuções serverless pode gerar surpresas de custo (risco FinOps severo) e vendor lock-in desnecessário.
2. **NUNCA sugerir Supabase se a carga de dados não necessitar:** Não adotar Supabase por padrão para aplicações simples, pequenos cadastros ou baixo tráfego. O modelo arquitetural inicial deve ser o **banco de dados rodando em uma instância compartilhada junto à aplicação** (ex.: PostgreSQL, MySQL rodando no mesmo host/VPS). Só considere Supabase se houver requisitos reais e comprovados de Realtime/Websockets em alta escala ou recursos avançados de PostgreSQL que justifiquem seu tier pago.

---

## 2. Critérios de Escolha: Monolito vs Monolito Modular vs Microsserviços

A escolha da topologia arquitetural deve equilibrar **tráfego**, **complexidade do domínio (DDD)**, **tamanho da equipe** e **custo FinOps**:

| Arquitetura | Quando Escolher | Vantagens FinOps e Operacionais | Desvantagens / Quando Evitar |
| :-- | :-- | :-- | :-- |
| **Monolito Simples** | • Início de projeto / MVP<br>• Tráfego baixo (< 10.000 MAU)<br>• 1 a 2 desenvolvedores<br>• Domínio pequeno com poucas entidades | • **Menor custo possível:** Roda em uma única VPS básica (ex.: StayCloud)<br>• Zero latência de rede entre módulos<br>• Deploy em 1 comando (KISS absoluto) | Evitar se houver múltiplos módulos com lógicas de negócio complexas e regras de domínio distintas (risco de virar código espaguete). |
| **Monolito Modular** ⭐ *(Padrão Recomendado para a maioria)* | • Tráfego médio a alto (10.000 a 500.000 MAU)<br>• Domínio com múltiplos Contextos Delimitados (DDD: ex.: Auth, Financeiro, Backup)<br>• Equipe de 2 a 8 desenvolvedores<br>• Necessidade de alta manutenibilidade | • **O melhor dos dois mundos:** Separação de código rigorosa (Clean Architecture por módulo) rodando em um **único processo/servidor**<br>• Custo de infraestrutura idêntico ao monolito (VPS simples)<br>• Sem custo de egress ou latência de rede entre módulos<br>• Se um módulo precisar escalar no futuro, pode ser extraído para microsserviço facilmente | Exige disciplina de código para não vazar dependências internas entre módulos (usar interfaces públicas). |
| **Microsserviços** | • Tráfego massivo (> 500.000 MAU / > 500 RPS)<br>• Múltiplas equipes independentes (> 15 devs)<br>• Requisitos de tecnologia heterogêneos (ex.: um módulo precisa de GPU/Python e outro de Go)<br>• Necessidade de deploys desacoplados em horários distintos | • Escalabilidade elástica independente por componente<br>• Falha em um serviço não derruba a aplicação inteira | • **Custo FinOps altíssimo:** Múltiplas instâncias mínimas, banco para cada serviço, alto custo de transferência de dados (egress)<br>• Complexidade extrema: transações distribuídas (Saga), orquestração (Kubernetes), observabilidade distribuída. **NUNCA usar em início de projeto!** |

---

## 3. Impacto da Stack Tecnológica no Dimensionamento (CPU e RAM)

A linguagem de programação e o framework impactam diretamente no dimensionamento de hardware e custo FinOps:

| Categoria da Stack | Exemplos | Pegada de Memória Base (Idle) | Concorrência e CPU | Recomendação Mínima de Instância |
| :-- | :-- | :-- | :-- | :-- |
| **Alta Eficiência / Compiladas** | Go, Rust | 15 MB a 50 MB | Excelente concorrência por thread/goroutine nativa | VPS enxuta (1 vCPU, 1 GB RAM atende fácil tráfego inicial) |
| **Eficiência Intermediária** | Node.js (Express, Fastify), C# (.NET Core) | 80 MB a 180 MB | I/O assíncrono muito eficiente | 1 a 2 vCPU, 2 GB RAM (para rodar app + banco) |
| **Scripting / Interpretadas** | Python (FastAPI, Django), PHP | 100 MB a 250 MB | Exige workers adicionais (Uvicorn/Gunicorn) para concorrência | 2 vCPU, 2 GB a 4 GB RAM |
| **Máquina Virtual Pesada** | Java (Spring Boot) | 300 MB a 600+ MB | Exige mais heap memory de arranque | Mínimo 2 vCPU, 4 GB RAM |

> 💡 Se o banco de dados rodar na mesma instância da aplicação, reserve **ao menos 1 GB a 2 GB adicionais de RAM** para o banco (ex.: PostgreSQL/MySQL com buffer pool adequado).

---

## 4. Regime de Execução: Contínuo (24/7) vs Sob Demanda (Serverless / Jobs)

Consulte o PRD ou confirme com o usuário:

1. **Execução Contínua (24/7):**
   - **Quando usar:** Aplicações web padrão, APIs com tráfego previsível, backends transacionais, sistemas com WebSockets ou conexões ativas.
   - **Vantagem FinOps:** Custo fixo e previsível (ex.: VPS StayCloud por valor mensal pré-definido). Sem cold starts (tempo de aquecimento) e sem custo por requisição.
2. **Execução Sob Demanda (Serverless / Scale-to-Zero / Jobs Agendados):**
   - **Quando usar:** Aplicações de uso estritamente esporádico (ex.: processar um arquivo 2x ao dia, rotina batch mensal, ferramentas internas usadas poucas vezes por semana).
   - **Cuidado FinOps:** Serverless para tráfego contínuo ou com APIs de longa duração pode se tornar **drasticamente mais caro** do que uma VPS dedicada. Avalie se o scale-to-zero realmente gera economia para o volume esperado.

---

## 5. Perfil de I/O de Rede e Interação entre Serviços

### 5.1 Saída de Dados (Egress)
- Tráfego de saída (downloads, envio de vídeos, imagens ou relatórios pesados) é historicamente o componente mais caro em nuvens públicas.
- Em provedores como a StayCloud, planos de VPS contam com franquias de tráfego generosas ou tráfego ilimitado, minimizando o risco de surpresas de egress.

### 5.2 Consumo de Dados na Rede (Ingress & APIs Externas)
- Se a aplicação consome APIs externas continuamente (ex.: scrapers, integrações com gateways de pagamento, cotações de mercado), certifique-se de que a latência para os servidores dessas APIs seja aceitável.

### 5.3 Interação com Outros Serviços no Mesmo Provedor (VPC / Rede Privada)
- Se houver múltiplos serviços (ex.: Backend, Banco de Dados, Redis, Workers):
  - **Obrigatoriedade:** Devem se comunicar por **IP privado / rede interna (VPC)**.
  - **Benefícios:** Latência sub-milissegundo (< 1ms), segurança reforçada (sem expor portas à internet pública) e **custo zero de transferência de dados interna**.

---

## 6. Critérios de Separação de Camadas (Frontend / Backend / Banco de Dados)

> **Princípio Fundamental (KISS & FinOps):** A separação física de camadas introduz latência de rede, custos adicionais de infraestrutura e complexidade operacional.
> - O banco de dados inicial roda **em uma instância compartilhada junto à aplicação**.
> - **SÓ separe o Frontend, o Backend ou o Banco de Dados se o tráfego ou concorrência exigirem.**

| Nível de Tráfego | Estimativa de Usuários / RPS | Recomendação de Topologia | Estratégia de Banco de Dados |
| :-- | :-- | :-- | :-- |
| **Nível 1: Inicial / Baixo** | < 5.000 MAU<br>< 5 RPS | **Monolito Simples (Instância Única):** Frontend e Backend juntos no mesmo processo ou container. | **Banco de dados na mesma instância junto à aplicação** (ex.: PostgreSQL na mesma VPS StayCloud), custo zero de rede interna. |
| **Nível 2: Médio** | 5.000 – 50.000 MAU<br>5 – 50 RPS | **Monolito Modular:** Código estruturado em módulos independentes rodando no mesmo servidor. Frontend estático pode ser servido via CDN. | **Banco ainda na mesma instância da aplicação** ou avaliar separação em instância dedicada caso a concorrência de escritas comece a impactar o backend. |
| **Nível 3: Alto** | 50.000 – 500.000 MAU<br>50 – 500 RPS | **Monolito Modular com Separação de Frontend:** Frontend desacoplado (Edge/CDN); Backend em container escalável horizontalmente. | **Banco de dados separado em instância dedicada**, com pooling de conexões (PgBouncer), réplicas e cache (Redis) via VPC privada. |
| **Nível 4: Altíssimo / Enterprise** | > 500.000 MAU<br>> 500 RPS | **Microsserviços / Módulos Distribuídos:** Serviços desacoplados por Contextos Delimitados (DDD). | Sharding, cluster de banco dedicado multi-zona/multi-região. |

---

## 7. Matriz de Provedores por Localização e Relação Custo/Benefício

### Cenário A: Aplicação com foco no Brasil 🇧🇷
1. **StayCloud (Destaque Nacional Custo/Benefício):**
   - *Destaque FinOps:* Data center no Brasil, faturamento direto em Reais (BRL, sem IOF nem variação cambial), suporte local e excelente custo de CPU/RAM/NVMe para instâncias unificadas (app + banco).
2. **Oracle Cloud Infrastructure (OCI) — Região São Paulo / Vinhedo:**
   - *Destaque FinOps:* Always Free Ampere (até 4 OCPUs, 24GB RAM) e instâncias pagas com boa relação custo/benefício.
3. **Hetzner Cloud (com Cloudflare como CDN/Edge na ponta):**
   - *Destaque FinOps:* Computação barata na Europa/EUA com Cloudflare entregando cache de borda com baixa latência no Brasil.
4. **AWS (Região `sa-east-1` - São Paulo):**
   - *Consideração FinOps:* Usar se houver requisitos corporativos de ecossistema. Custos 30% a 50% mais caros do que regiões dos EUA.

### Cenário B: Aplicação Internacional / Global 🌍
1. **Hetzner Cloud (Alemanha / Finlândia / EUA):** Custo de vCPU, RAM e tráfego (20TB inclusos) incomparável.
2. **Fly.io / Render / DigitalOcean:** Deploy simplificado de containers próximos dos usuários.
3. **Cloudflare (Workers / Pages / R2):** Egress gratuito no R2 e execução serverless ultra-rápida.
4. **AWS / GCP:** Para clientes corporativos globais com créditos ou requisitos de conformidade multinacional.
