---
name: prd
description: >-
  Conduz uma entrevista estruturada com o usuário e gera um PRD (Product
  Requirements Document) em Markdown salvo em docs/prd/ do projeto. Use quando o
  usuário pedir para criar, escrever, revisar ou atualizar um PRD, especificação
  de produto, documento de requisitos ou definição de uma nova feature/produto.
---

# Skill: PRD (Product Requirements Document)

Esta skill é **agnóstica de agente e de sistema operacional**. Ela usa apenas
duas capacidades que qualquer agente de código possui:

1. Conversar com o usuário (fazer perguntas e ler respostas).
2. Ler e escrever arquivos no projeto.

Não dependa de ferramentas específicas (comandos de shell, MCPs, UIs de
múltipla escolha). Se o seu ambiente oferecer uma ferramenta de perguntas
estruturadas, você **pode** usá-la, mas o fluxo deve funcionar só com texto.

## Arquivos desta skill

| Arquivo | Uso |
| :-- | :-- |
| `agent-prompt.md` | Definição de role (Product Manager/PO), modelo e system prompt do subagente. |
| `references/questions.md` | Banco de perguntas, organizado em blocos. **Leia antes de começar a entrevista.** |
| `assets/prd-template.md` | Template do artefato final. **Leia antes de gerar o PRD.** |

Os caminhos são relativos à pasta desta skill (o diretório onde está este
`SKILL.md`).

## Saída (artefato)

- **Pasta:** `docs/prd/` na **raiz do projeto** (crie a pasta se não existir).
- **Nome do arquivo:** `AAAA-MM-DD-<slug>.md`
  - `AAAA-MM-DD` = data atual.
  - `<slug>` = nome do produto/feature em minúsculas, sem acentos, palavras
    separadas por hífen, máx. ~50 caracteres. Ex.: `2026-11-05-checkout-pix.md`.
- **Formato:** Markdown puro (UTF-8, quebras de linha `\n`), seguindo o template.
- Use sempre `/` nos caminhos que você escrever dentro do documento.
- Se já existir um PRD para o mesmo produto/feature em `docs/prd/`, **pergunte**
  se o usuário quer atualizar o existente (incrementando a versão e registrando
  no histórico de mudanças) ou criar um novo.

> A raiz do projeto é o diretório de trabalho do workspace (normalmente onde
> estão `.git`, `package.json`, `pyproject.toml`, etc.). Nunca salve em pastas
> temporárias ou fora do projeto.

## Fluxo de trabalho

### Passo 0 — Coletar contexto existente (sem perguntar)

Antes de perguntar qualquer coisa:

1. Releia a mensagem do usuário e extraia tudo que já foi informado.
2. Se houver, leia rapidamente: `README*`, `docs/` (incluindo PRDs existentes
   em `docs/prd/`), `AGENTS.md`/regras do projeto e arquivos que o usuário
   anexou ou citou.
3. **Não pergunte o que já está respondido.** Apenas confirme no resumo final.

### Passo 1 — Definir o modo da entrevista

Pergunte ao usuário (uma única pergunta curta):

> "Quer um PRD **rápido** (~8 perguntas essenciais) ou **completo**
> (entrevista detalhada em blocos)?"

- **Rápido:** use somente as perguntas marcadas com ⭐ em `references/questions.md`.
- **Completo:** percorra todos os blocos, pulando os irrelevantes ao contexto.

Se o usuário já deixou claro o que quer (ex.: "faz algo rápido"), pule esta
pergunta.

### Passo 2 — Entrevista em rodadas

Regras da entrevista:

- Faça as perguntas **em rodadas de 3 a 5 perguntas**, agrupadas por bloco.
  Nunca despeje o questionário inteiro de uma vez.
- Numere as perguntas na rodada (ex.: `2.1`, `2.2`) para o usuário poder
  responder de forma curta.
- Quando útil, ofereça **exemplos ou opções sugeridas** entre parênteses para
  facilitar a resposta.
- Aceite "não sei", "pular" ou "depois": registre o item na seção
  **Questões em aberto** do PRD em vez de insistir.
- Adapte: se uma resposta tornar um bloco irrelevante (ex.: produto interno sem
  monetização), pule-o. Se uma resposta for vaga, faça **uma** pergunta de
  aprofundamento (ex.: "como vamos medir isso?").
- Ao final de cada rodada, faça um resumo de 1–3 linhas do que entendeu antes
  de seguir para a próxima.
- Mantenha o idioma do usuário (padrão: português).

### Passo 3 — Validação antes de escrever

Antes de gerar o arquivo, apresente um **resumo curto** contendo:

- Problema, público-alvo, objetivo principal e métrica de sucesso.
- Lista dos requisitos funcionais com prioridade (MoSCoW).
- O que está **fora do escopo**.
- Premissas que você assumiu sem confirmação explícita.

Pergunte: "Posso gerar o PRD com isso? Algo a ajustar?". Faça os ajustes
solicitados.

### Passo 4 — Gerar o artefato

1. Leia `assets/prd-template.md`.
2. Preencha **todas** as seções. Para seções sem informação:
   - Escreva `A definir` e adicione o item em **Questões em aberto**; ou
   - Remova a seção apenas se ela claramente não se aplica (ex.: monetização
     em ferramenta interna) e mencione isso no resumo final.
3. Regras de qualidade:
   - Requisitos funcionais com ID (`RF-01`), prioridade MoSCoW e critérios de
     aceite verificáveis (preferencialmente no formato *Dado / Quando / Então*).
   - Requisitos não funcionais com ID (`RNF-01`) e valores mensuráveis sempre
     que possível (ex.: "p95 < 300 ms", não "rápido").
   - Métricas com linha de base (se conhecida), meta e prazo.
   - Marque premissas não confirmadas com `(premissa)`.
   - Não invente números, nomes ou datas: use `A definir`.
4. Crie a pasta `docs/prd/` se necessário e salve o arquivo.
5. Se o seu ambiente tiver um conceito próprio de "artefato" (painel, documento
   anexado, etc.), você também pode exibi-lo lá — mas o arquivo em `docs/prd/`
   é **obrigatório** e é a fonte da verdade.

### Passo 5 — Encerramento

Responda ao usuário com:

- O caminho do arquivo gerado (como link, se o ambiente suportar).
- As principais **Questões em aberto** (no máximo 5).
- Sugestão de próximo passo (ex.: revisar com stakeholders, quebrar em
  histórias/tarefas, gerar especificação técnica).

Não repita o PRD inteiro na resposta.

## Atualizando um PRD existente

1. Leia o PRD atual.
2. Pergunte apenas o que mudou (ou use o pedido do usuário).
3. Atualize as seções afetadas, incremente a versão (`1.0` → `1.1` para ajustes,
   `2.0` para mudanças de escopo) e adicione uma linha em **Histórico de
   mudanças**.
4. Mantenha o mesmo nome de arquivo.
