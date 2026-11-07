# Rodada de Perguntas Obrigatórias para Decisão Arquitetural (ADR)

> 💡 *Antes de perguntar: consulte o PRD em `docs/prd/`. Se informações como stack, domínios de negócio ou regime de execução já estiverem definidas no PRD, aproveite-as e confirme com o usuário, perguntando apenas os itens faltantes.*

O agente deve apresentar estas perguntas de forma clara e numerada para que o usuário possa responder de forma objetiva (ex.: `1.a, 2.b, 3.Node/Fastify, 4.a...`):

---

### Pergunta 1: Volume de Tráfego e Concorrência
**Qual é a estimativa de usuários ativos no lançamento e a expectativa de concorrência em pico?**
- a) **Baixo tráfego / Baixa concorrência:** Até 5.000 MAU e < 5 requisições por segundo (RPS) no pico.
- b) **Médio tráfego:** 5.000 a 50.000 MAU e 5 a 50 RPS no pico.
- c) **Alto tráfego / Escala rápida:** > 50.000 MAU e centenas de RPS com muitas escritas no banco.

---

### Pergunta 2: Stack Tecnológica (Linguagem e Framework)
**Qual linguagem de programação e framework serão utilizados no backend?**
*(Isso define o consumo base de memória RAM e capacidade de concorrência).*
- a) **Linguagem compilada de alta performance:** Go, Rust (baixo consumo de RAM: ~30-50MB).
- b) **Node.js / TypeScript:** Express, Fastify, NestJS (consumo médio: ~100-180MB).
- c) **Python:** FastAPI, Django, Flask (consumo moderado/alto com múltiplos workers: ~150-300MB).
- d) **C# (.NET Core)** ou **Java (Spring Boot):** (consumo de 200MB a 500MB+ de heap).
- e) Outra (especifique).

---

### Pergunta 3: Regime de Execução (Contínuo 24/7 vs Sob Demanda)
**A aplicação precisa rodar continuamente ou funciona sob demanda?**
- a) **Contínua (24/7):** Ficará sempre ligada recebendo requisições web/APIs a qualquer momento (ideal para VPS StayCloud, com custo fixo e previsível, sem cold starts).
- b) **Sob Demanda / Event-Driven:** Executada apenas quando acionada por eventos, agendamentos (cron jobs) ou poucas vezes ao dia (possibilidade de serverless / scale-to-zero).

---

### Pergunta 4: Perfil de I/O de Rede (Saída de Dados e Consumo de APIs)
**Como será o fluxo de dados na rede?**
- a) **Padrão (Payloads JSON leves):** Saída baixa de dados (egress insignificante, sem mídias pesadas) e poucas chamadas a APIs externas.
- b) **Saída pesada de dados (Alto Egress):** Envio ou download de arquivos, mídias, relatórios pesados ou streaming.
- c) **Consumo intensivo de rede externa:** A aplicação consome intensamente dados de terceiros (scrapers, APIs de cotação/pagamento em loop constante).

---

### Pergunta 5: Interação com Outros Serviços no Provedor
**A aplicação irá se comunicar com outros serviços na infraestrutura?**
- a) **Tudo em uma única instância:** Aplicação e banco de dados rodando na mesma máquina (comunicação em localhost, zero latência e zero custo de rede).
- b) **Múltiplos serviços no mesmo provedor:** Aplicação, banco de dados, Redis ou workers separados comunicando-se via rede privada (VPC) com custo zero de tráfego interno.
- c) **Serviços espalhados em nuvens diferentes** (atenção a custos de tráfego público e latência).

---

### Pergunta 6: Localização dos Usuários e Orçamento FinOps
**Onde os usuários estão localizados e qual é o teto de gastos mensal?**
- a) **Brasil 🇧🇷:** Teto até R$ 100 - R$ 250/mês (provedor nacional como StayCloud, faturamento em Reais sem IOF/câmbio).
- b) **Internacional / Global 🌍:** Teto em USD ou EUR (provedores como Hetzner Cloud, Fly.io).

---

### Pergunta 7: Organização da Equipe e Topologia Preferida
**Qual é a preferência quanto à organização interna do sistema?**
- a) **Monolito Simples:** MVP rápido, domínio pequeno com 1 desenvolvedor.
- b) **Monolito Modular (Recomendado):** Múltiplos domínios DDD (ex.: Auth, Financeiro, Backup) isolados por módulos e interfaces, rodando em um único processo e servidor para manter custo zero de rede e deploy simples.
- c) **Microsserviços:** Equipes grandes e independentes (> 15 devs) com deploys totalmente desacoplados.

---

### Pergunta 8: Estratégia de Empacotamento e Regime de Deploy
**Como a aplicação será empacotada e executada no servidor/nuvem?**
- a) **Docker / Docker Compose (Padrão Recomendado para VPS):** Aplicação e banco containerizados com `Dockerfile` multi-stage seguro (sem root) e `docker-compose.yml`. Garante paridade total entre dev, CI e prod.
- b) **Binário Nativo com `systemd` (Bare-Metal / VPS Direto):** Sem Docker. A aplicação roda direto no Linux gerenciada por um serviço `systemd` (ideal para Go, Rust ou C# AOT: zero overhead de Docker, latência nativa e economia máxima de RAM).
- c) **PaaS com Buildpacks (Dokku, Coolify, Fly.io):** Sem necessidade de manter Dockerfile manual. A plataforma detecta o código e compila a imagem automaticamente.
- d) **Serverless / Edge Functions:** Deploy de pacote/script zip sem servidor persistente (Cloudflare Workers, AWS Lambda).

---

### Pergunta 9: Plataforma de Automação CI/CD
**Qual plataforma de CI/CD será utilizada para automação de testes e segurança?**
- a) **GitHub Actions:** Workflows em `.github/workflows/`.
- b) **GitLab CI:** Pipeline em `.gitlab-ci.yml`.
- c) **Jenkins:** Pipeline declarativo em `Jenkinsfile`.
- d) Outra (especifique).
