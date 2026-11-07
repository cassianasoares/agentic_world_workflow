---
name: security
description: >-
  Conduz a modelagem de ameaças (Threat Modeling STRIDE + DREAD) em docs/security/[slug]-threat-model.md,
  define políticas de headers HTTP/CORS e implementa pipelines de automação DevSecOps
  (SAST, Secret Scanning, SCA e DAST) com suporte multi-CI/CD: GitHub Actions, GitLab CI e Jenkins.
---

# Skill: Security (Application Security & Multi-CI/CD DevSecOps)

Esta skill é responsável pela **segurança em camadas (Shift-Left Security)** do software: desde a modelagem preventiva de ameaças no design até a automação de *Security Quality Gates* no pipeline de CI/CD.

Ela atua através do subagente dedicado **`security-agent`** (Application Security Engineer & DevSecOps Lead).

---

## Arquivos desta Skill

| Arquivo | Finalidade |
| :-- | :-- |
| `agent-prompt.md` | Definição de role (AppSec & DevSecOps Lead), modelo e system prompt do subagente. |
| `assets/threat-model-template.md` | Template do artefato canônico em `docs/security/[slug]-threat-model.md`. |
| `assets/ci-templates/github-actions/` | Templates de workflows para GitHub Actions (`security-sast.yml` e `security-dast.yml`). |
| `assets/ci-templates/gitlab-ci/` | Template de pipeline para GitLab CI (`gitlab-ci-security.yml`). |
| `assets/ci-templates/jenkins/` | Template declarativo para Jenkins (`Jenkinsfile.security`). |
| `references/owasp-top10.md` | Guia de vulnerabilidades OWASP Top 10 e mitigações técnicas. |

---

## Saídas Canônicas da Skill

1. **Documentação de Segurança:** `docs/security/[slug]-threat-model.md`
   - Superfície de ataque e fluxos sensíveis.
   - Matriz STRIDE e pontuação de risco DREAD.
   - Políticas de headers HTTP (CSP, HSTS, CORS) e rate limiting.
2. **Pipelines de Automação de Segurança (Conforme a plataforma escolhida):**
   - **GitHub Actions:** `.github/workflows/security-sast.yml` e `.github/workflows/security-dast.yml`
   - **GitLab CI:** `.gitlab-ci.yml`
   - **Jenkins:** `Jenkinsfile`

---

## Fluxo de Execução Passo a Passo

### Passo 1 — Threat Modeling Preventivo
1. Leia o PRD em `docs/prd/` e a modelagem de dados em `docs/data/`.
2. Mapeie os vetores de ameaça STRIDE (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege) e calcule a severidade com DREAD.
3. Salve o artefato formal em `docs/security/[slug]-threat-model.md`.

### Passo 2 — Definição da Plataforma de CI/CD
1. Verifique se o ADR em `docs/adr/` já define a plataforma de CI/CD.
2. Se não estiver definida, pergunte ao usuário:
   > *"Qual plataforma de CI/CD será utilizada: GitHub Actions, GitLab CI ou Jenkins?"*

### Passo 3 — Geração do Pipeline de DevSecOps
Com base na escolha do usuário, gere o arquivo de automação no repositório utilizando os templates em `assets/ci-templates/`:
- **Se GitHub Actions:** crie `.github/workflows/security-sast.yml` e `security-dast.yml`.
- **Se GitLab CI:** crie ou atualize `.gitlab-ci.yml`.
- **Se Jenkins:** crie o `Jenkinsfile` com os stages de segurança.

### Passo 4 — Auditoria Contínua com o Time
- Apoie o `spec-agent` garantindo que os Use Cases contenham validações contra IDOR/BOLA.
- Apoie o `dev-agent` na correção imediata de qualquer alerta gerado pelo SAST ou SCA.
