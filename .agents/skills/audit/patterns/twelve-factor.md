# Pattern: The Twelve-Factor App (Aplicações Cloud-Native e Resilientes)

## 1. Visão Geral
A metodologia **The Twelve-Factor App** é um conjunto de princípios arquiteturais **100% agnóstico a linguagens de programação e frameworks**. Desenvolvida para guiar a criação de softwares modernos prontos para produção em nuvem, ela garante que as aplicações sejam fáceis de implantar, altamente escaláveis, resilientes a falhas e desacopladas do ambiente onde são executadas.

> *"Aplicações cloud-native devem ser descartáveis, sem estado na memória e configuradas exclusivamente pelo ambiente onde vivem."*

---

## 2. Os Fatores Críticos Aplicados ao Código

Nem todos os 12 fatores afetam o código-fonte (alguns pertencem à infraestrutura ou VCS). Abaixo estão os fatores que **devem ser estritamente seguidos e auditados no código da aplicação**:

### 2.1 Fator III — Configurações via Variáveis de Ambiente & Zero Secrets (Config)
- **Princípio:** Separação estrita entre código e configuração. Configurações que variam entre ambientes (dev, staging, prod) nunca devem ser hardcodadas.
- **Diretriz de Código:**
  - Valores lidos exclusivamente via variáveis de ambiente (`process.env`, `os.environ`, `IConfiguration`, etc.).
  - Validação de tipos e presença obrigatória de variáveis no momento da inicialização da aplicação (ex.: validação com Zod, Pydantic ou structs tipadas), falhando rápido (*fail-fast*) caso falte uma variável crítica.
  - **Zero Hardcoded Secrets:** Proibido comitar senhas, tokens, chaves de API ou segredos.
  - Manter sempre um arquivo `.env.example` versionado com valores de exemplo fictícios/placeholders. O `.env` real é protegido no `.gitignore`.

### 2.2 Fator IV — Serviços de Apoio como Recursos Anexados (Backing Services)
- **Princípio:** Tratar bancos de dados, mensageria (RabbitMQ, Kafka), cache (Redis) e serviços de e-mail como recursos anexados e intercambiáveis via URL/credenciais.
- **Diretriz de Código (Alinhada à Clean Architecture):**
  - O código de domínio e use cases não deve ter acoplamento rígido com a infraestrutura do recurso (DIP).
  - Trocar um banco local por um banco gerenciado em nuvem (ou vice-versa) deve exigir apenas a alteração da string de conexão nas variáveis de ambiente, sem nenhuma modificação no código de aplicação.

### 2.3 Fator VI — Processos Sem Estado na Memória (Stateless Processes)
- **Princípio:** A aplicação deve ser executada como um ou mais processos que não retêm estado em memória local entre requisições.
- **Diretriz de Código:**
  - **Proibido Armazenar Sessão em Memória RAM:** Não utilize variáveis globais, singletons em memória ou dicionários estáticos para guardar o estado de usuários ou carrinhos de compra.
  - Qualquer dado que precise persistir deve ser armazenado em um recurso com estado (Banco de Dados Relacional, Redis ou Document Store).
  - Autenticação e contexto de usuário devem ser resolvidos via tokens auto-contidos (JWT assinado com expiração) ou sessões em cache compartilhado.
  - Isso permite que o processo seja reiniciado, escalado horizontalmente com múltiplas réplicas ou transferido de máquina a qualquer momento sem desconectar usuários.

### 2.4 Fator VII — Vinculação de Portas Autônoma (Port Binding)
- **Princípio:** A aplicação é 100% autossuficiente e exporta seus serviços vinculando-se a uma porta TCP/HTTP.
- **Diretriz de Código:**
  - O serviço não deve depender de injeção em servidores web externos (como Apache, Tomcat ou IIS gerenciados fora do código).
  - O código inicia seu próprio servidor HTTP/gRPC interno (ex.: Fastify, Express, Gin, Axum, ASP.NET Core Kestrel) escutando na porta definida pela variável de ambiente `PORT`.

### 2.5 Fator IX — Descartabilidade & Graceful Shutdown (Disposability)
- **Princípio:** Processos devem ser descartáveis, o que significa que podem ser iniciados rapidamente e terminados de forma graciosa (*Graceful Shutdown*).
- **Diretriz de Código (Tratamento de SIGTERM/SIGINT):**
  - A aplicação deve capturar os sinais do sistema operacional (`SIGTERM` e `SIGINT` emitidos pelo Docker, Kubernetes ou systemd).
  - Ao receber o sinal:
    1. Interrompe o recebimento de novas conexões HTTP.
    2. Aguarda a conclusão das requisições e transações em andamento (com timeout de segurança).
    3. Fecha de forma ordenada as conexões do pool de banco de dados, filas e caches.
    4. Encerra o processo com código de saída 0.
  - Isso previne transações incompletas, corrupção de dados e erros 502/504 durante deploys contínuos.

### 2.6 Fator XI — Logs como Fluxos de Eventos no `stdout` (Logs)
- **Princípio:** A aplicação nunca deve se preocupar com o roteamento ou armazenamento dos seus arquivos de log.
- **Diretriz de Código:**
  - Proibido gerenciar escrita direta em arquivos `.log` no sistema de arquivos local (que consomem espaço em disco e travam a VPS sem rotação).
  - A aplicação emite seus logs estruturados em JSON diretamente no fluxo padrão de saída (`stdout` / `stderr`).
  - O ambiente de execução (Docker logging driver, systemd journald ou agentes como Fluentd/Datadog) é o único responsável por capturar, agregar e encaminhar os logs.

---

## 3. Checklist de Auditoria para Twelve-Factor App

Durante a auditoria arquitetural (`code-auditor`) e a revisão de código (`review-agent`), verifique:

- [ ] **Configuração via Env:** Todas as credenciais, portas e URLs de banco são lidas exclusivamente de variáveis de ambiente?
- [ ] **Fail-Fast de Config:** A aplicação valida a presença e o formato das variáveis no boot antes de aceitar tráfego?
- [ ] **Zero Secrets:** O diff está 100% livre de senhas, chaves de API ou segredos hardcoded? O `.env.example` está atualizado?
- [ ] **Processos Stateless:** O código evita salvar estado de sessão ou dados voláteis de usuários em memória RAM global?
- [ ] **Graceful Shutdown:** O código trata os sinais `SIGTERM` e `SIGINT` fechando o servidor HTTP e os pools de conexões de banco de forma limpa?
- [ ] **Logs no stdout:** Os logs estruturados são impressos no `stdout`/`stderr` sem gravar em arquivos de texto locais?
- [ ] **Port Binding:** A aplicação inicia o servidor escutando na porta especificada por `PORT` de forma autônoma?
