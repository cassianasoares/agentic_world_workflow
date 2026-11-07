---
name: review
description: >-
  Executa code review local rigoroso analisando o git diff da branch, garantindo
  qualidade de código, conformidade arquitetural (Clean Arch, DDD, SOLID, KISS)
  e aderência estrita às especificações técnicas do SDD (spec.md, plan.md, tasks.md).
---

# Skill: Review (Local Code Review, Architecture & SDD Adherence)

Esta skill é responsável pelo **controle de qualidade e conformidade final de uma feature branch**, atuando **100% de forma local e offline** através da inspeção minuciosa do `git diff`.

Ela atua através do subagente dedicado **`review-agent`** (Staff Code Reviewer & SDD Quality Gatekeeper).

---

## Pilares de Análise Inegociáveis

1. **Code Review:** Inspeção minuciosa do diff em busca de resíduos de depuração (`console.log`, `print`), código morto, ausência de tratamento de exceções, tipagem fraca e anti-patterns.
2. **Conformidade Arquitetural:** Verificação estrita de Clean Architecture (regra de dependência de fora para dentro), DDD (Entidades ricas, Value Objects auto-validados), SOLID e KISS.
3. **Aderência ao SDD (Spec-Driven Development):** Validação de que todos os critérios BDD (`[CA-XX]`) de `docs/specs/[slug]/spec.md` foram implementados, sem alteração de arquivos fora do escopo planejado (_Anti-Scope Creep_).
4. **Observabilidade & Telemetria:** Auditoria de logs estruturados em JSON, garantia de zero vazamento de PII/segredos, propagação de `X-Correlation-ID` e presença de healthchecks (`/health/liveness`, `/health/readiness`).

---

## Arquivos desta Skill

| Arquivo                          | Finalidade                                                      |
| :------------------------------- | :-------------------------------------------------------------- |
| `agent-prompt.md`                | Definição de role, modelo e system prompt do subagente revisor. |
| `references/review-checklist.md` | Checklist detalhado dos 4 pilares de revisão.                   |

---

## Modo Operacional (100% Local & Sem Dependência Externa)

O `review-agent` **não faz chamadas de rede nem depende de credenciais remotas**. Ele opera diretamente no terminal local:

1. Executa `git diff main...feat/[slug]` (ou `git diff HEAD~N`) para isolar exatamente as alterações da feature.
2. Compara o diff contra os artefatos de especificação em `docs/specs/[slug]/` e `docs/data/[slug].md`.
3. Emite um relatório executivo formal com um dos dois vereditos:
   - 🟢 **APPROVE (LGTM):** Código impecável, aderente ao SDD e pronto para finalização.
   - 🔴 **CHANGES REQUESTED:** Aponta os arquivos, linhas e correções mandatórias que o `dev-agent` deve aplicar antes de concluir a feature.

---

## Formato do Parecer de Review

```markdown
### 📋 Parecer de Code Review & Aderência ao SDD

- **Branch Avaliada:** `feat/[slug]`
- **Veredito:** [ 🟢 APPROVE (LGTM) | 🔴 CHANGES REQUESTED ]
- **Resumo Executivo:** Breve síntese da qualidade da entrega.

| Arquivo               | Linha | Severidade |    Pilar    | Descrição do Problema                                            | Correção Recomendada                                     |
| :-------------------- | :---: | :--------: | :---------: | :--------------------------------------------------------------- | :------------------------------------------------------- |
| `src/domain/user.ts`  |  42   |   Maior    | Arquitetura | Import direto de biblioteca de persistência na camada de Domínio | Isolar dependência atrás de uma interface de repositório |
| `src/services/pay.ts` |  88   |   Menor    | Code Review | Presença de `console.log("pagamento ok")` residual               | Remover log de depuração                                 |
```
