# Threat Model & Política de Segurança: [Nome da Feature / Módulo]

> **Status:** [Draft | Aprovado] | **Caminho:** `docs/security/[slug]-threat-model.md`  
> **Plataforma de CI/CD:** [GitHub Actions | GitLab CI | Jenkins]  
> **Responsável AppSec:** `security-agent` | **Versão:** 1.0.0

---

## 1. Superfície de Ataque & Fluxos de Dados

- **Pontos de Entrada Públicos:** [Rotas HTTP, webhooks, uploads de arquivos]
- **Dados Sensíveis Manipulados (PII / Segredos):** [Tokens, senhas, CPF, cartões]
- **Serviços de Autenticação / Autorização:** [JWT, OAuth2, RBAC/ABAC]

---

## 2. Análise de Ameaças (Metodologia STRIDE)

| Vetor STRIDE | Componente / Rota Alvo | Cenário de Ataque | Mitigação Técnica Obrigatória |
| :--: | :-- | :-- | :-- |
| **S**poofing | Header `Authorization` | Falsificação de token de acesso | Validação de assinatura assimétrica (RS256/EdDSA) com tempo de expiração curto |
| **T**ampering | Payload da Requisição | Modificação de IDs/valores em trânsito | Schema validation rígida (Zod/Joi) e assinatura de webhooks com HMAC |
| **R**epudiation | Operação Crítica de Negócio | Usuário nega ter feito transferência/ação | Logs estruturados com `correlation-id`, `user-id`, IP e hash de auditoria |
| **I**nformation Disclosure | Resposta de Erro / Logs | Exposição de stack traces e dados sensíveis | Exception filter genérico, mascaramento de PII e DTOs de saída limpos |
| **D**enial of Service | Endpoint de Login / Busca | Ataque volumétrico esgotando CPU/DB | Rate limiting por IP/token e limites estritos no body do payload |
| **E**levation of Privilege | Endpoints com IDs no Path | IDOR/BOLA (usuário acessa dados de outro) | Validação de posse do recurso na camada de Use Case antes de consultar/alterar |

---

## 3. Matriz de Severidade (Metodologia DREAD)

| ID | Ameaça Identificada | D (Dano) | R (Reprod.) | E (Exploit) | A (Afetados) | D (Descob.) | Score Total (1-10) | Severidade |
| :--: | :-- | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| **TM-01** | [Ex.: IDOR na consulta de pedidos] | 8 | 9 | 8 | 7 | 6 | **7.6** | **HIGH** |
| **TM-02** | [Ex.: Brute force em rota de login] | 6 | 8 | 9 | 5 | 7 | **7.0** | **HIGH** |

---

## 4. Políticas Obrigatórias de Segurança na Aplicação

### 4.1. Headers HTTP Seguros
- `Content-Security-Policy`: `default-src 'self'`
- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`

### 4.2. Política de CORS
- Proibido `Access-Control-Allow-Origin: *` em rotas autenticadas. Origens permitidas explicitamente mapeadas em variáveis de ambiente.

---

## 5. Automação de Segurança no Pipeline (CI/CD)

- **Plataforma Ativa:** `[GitHub Actions | GitLab CI | Jenkins]`
- **Arquivo Gerado:** `[.github/workflows/security-sast.yml | .gitlab-ci.yml | Jenkinsfile]`
- **Regras de Bloqueio do Pipeline:**
  - 🚫 **Gitleaks:** Bloqueia o merge se encontrar segredos ou tokens commitados.
  - 🚫 **Semgrep (SAST):** Bloqueia o merge se detectar injeções (SQL, Command, Path Traversal) no código.
  - 🚫 **Trivy (SCA):** Bloqueia o merge se encontrar dependências com CVEs `CRITICAL` ou `HIGH`.
