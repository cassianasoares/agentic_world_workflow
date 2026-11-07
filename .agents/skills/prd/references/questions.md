# Banco de perguntas para PRD

Perguntas marcadas com ⭐ são **essenciais** (usadas no modo rápido).
No modo completo, percorra os blocos em ordem, em rodadas de 3–5 perguntas,
pulando o que já foi respondido ou não se aplica.

---

## Bloco 1 — Visão e problema

1. ⭐ Qual é o nome (provisório) do produto ou da feature?
2. ⭐ Que problema estamos resolvendo? Descreva a dor em 1–3 frases.
3. ⭐ Quem sente esse problema hoje e com que frequência?
4. Como esse problema é resolvido hoje (alternativas, gambiarras, concorrentes)?
5. Por que resolver isso **agora**? (oportunidade, pressão de mercado, regulação, custo)
6. Qual evidência temos de que o problema existe? (dados, pesquisas, tickets, feedbacks)

## Bloco 2 — Usuários e personas

1. ⭐ Quem é o público-alvo principal? (perfil, papel, nível técnico)
2. Existem públicos secundários? (ex.: administradores, suporte, parceiros)
3. Quais são os objetivos de cada persona ao usar o produto?
4. Em que contexto o usuário vai usar? (dispositivo, ambiente, frequência)
5. Há requisitos de acessibilidade ou idioma específicos para esse público?

## Bloco 3 — Objetivos e métricas de sucesso

1. ⭐ Qual é o principal objetivo de negócio? (ex.: aumentar conversão, reduzir custo, reter usuários)
2. ⭐ Como vamos saber que deu certo? Qual métrica, qual meta e em quanto tempo?
3. Qual é a linha de base atual dessa métrica (se conhecida)?
4. Existem métricas de proteção (que não podem piorar)? (ex.: tempo de carregamento, churn)
5. Quais são os **não objetivos** — o que explicitamente não queremos alcançar?

## Bloco 4 — Escopo e funcionalidades

1. ⭐ Quais são as funcionalidades principais? Liste o que o usuário precisa conseguir fazer.
2. Dessas, quais são **obrigatórias** para a primeira versão (MVP) e quais podem vir depois?
3. ⭐ O que está **fora do escopo** desta versão?
4. Descreva a jornada principal passo a passo (do primeiro contato até o objetivo cumprido).
5. Existem fluxos alternativos ou casos de erro importantes? (ex.: pagamento recusado, sem conexão)
6. Para cada funcionalidade principal: como saberemos que está "pronta"? (critérios de aceite)

## Bloco 5 — Experiência e design

1. Já existem protótipos, wireframes ou referências visuais? (links/arquivos)
2. Quais plataformas serão suportadas? (web, iOS, Android, desktop, API, CLI)
3. Há um design system ou guia de estilo a seguir?
4. Existem produtos de referência cuja experiência deve ser imitada ou evitada?

## Bloco 6 — Requisitos não funcionais

1. Expectativas de desempenho? (tempo de resposta, volume de usuários/requisições)
2. Requisitos de disponibilidade e confiabilidade? (ex.: 99,9%, janela de manutenção)
3. Requisitos de segurança e privacidade? (autenticação, dados sensíveis, LGPD/GDPR)
4. Requisitos de compliance ou regulatórios do setor?
5. Requisitos de observabilidade? (logs, métricas, alertas, auditoria)
6. Compatibilidade necessária? (navegadores, versões de SO, dispositivos)

## Bloco 7 — Técnico, dados e integrações

1. O produto se integra a sistemas existentes ou serviços de terceiros? Quais?
2. Quais dados serão criados, consumidos ou migrados?
3. Existem restrições de stack ou arquitetura já definidas?
4. Há dependências de outros times ou projetos?

## Bloco 8 — Restrições, riscos e premissas

1. ⭐ Existe prazo ou data-alvo? É fixo ou flexível? Por quê?
2. Qual é o orçamento ou tamanho do time disponível?
3. Quais são os maiores riscos? (técnicos, de adoção, legais, de negócio)
4. Que premissas estamos assumindo como verdadeiras sem validação?

## Bloco 9 — Lançamento e operação

1. Como será o lançamento? (big bang, beta, feature flag, rollout gradual)
2. Precisa de comunicação, treinamento ou documentação para usuários/suporte?
3. Existe modelo de monetização ou impacto em preço? (pule se não se aplica)
4. Quem dá suporte após o lançamento e como serão tratados os feedbacks?

## Bloco 10 — Stakeholders e governança

1. Quem é o responsável (owner) pelo produto/PRD?
2. Quem precisa revisar e aprovar? (produto, engenharia, design, jurídico, negócios)
3. Há outras pessoas que devem ser informadas?

---

## Perguntas de aprofundamento (use quando a resposta for vaga)

- "Pode dar um exemplo concreto?"
- "Como mediríamos isso?"
- "O que acontece se não fizermos isso?"
- "Isso é obrigatório para a primeira versão ou pode esperar?"
- "Quem é afetado se isso falhar?"
