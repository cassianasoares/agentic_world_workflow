# Referência OWASP Top 10 para APIs e Aplicações

Este guia serve como base técnica para o **`security-agent`** ao modelar ameaças e configurar regras de SAST/DAST.

---

## 1. OWASP API Security Top 10

| Código | Vulnerabilidade | Mitigação Obrigatória |
| :-- | :-- | :-- |
| **API1:2023** | **Broken Object Level Authorization (BOLA/IDOR)** | Validar sempre se o usuário autenticado é proprietário do ID requisitado na camada de Use Case. |
| **API2:2023** | **Broken Authentication** | Tokens com expiração curta, rotação de refresh tokens e rate limiting em rotas de autenticação. |
| **API3:2023** | **Broken Object Property Level Authorization** | Usar DTOs estritos de entrada e saída (impedir *Mass Assignment* / *Over-posting*). |
| **API4:2023** | **Unrestricted Resource Consumption** | Paginação obrigatória, limite de tamanho de payload (body limit), timeout e rate limiting. |
| **API5:2023** | **Broken Function Level Authorization (BFLA)** | Checagem de papéis/permissões administrativas em middlewares antes de invocar o Use Case. |
| **API6:2023** | **Unrestricted Access to Sensitive Business Flows** | Detecção de automação maliciosa, CAPTCHA ou throttling em fluxos sensíveis (ex.: cupons, compras). |
| **API7:2023** | **Server Side Request Forgery (SSRF)** | Validar e sanitizar URLs externas requisitadas pelo backend; isolar requisições em rede protegida. |
| **API8:2023** | **Security Misconfiguration** | Headers HTTP seguros (CSP, HSTS, CORS restrito), desabilitar mensagens de debug em produção. |
| **API9:2023** | **Improper Inventory Management** | Documentação e versionamento de APIs (OpenAPI/Swagger); desativar endpoints obsoletos/antigos. |
| **API10:2023** | **Unsafe Consumption of APIs** | Validar payloads recebidos de terceiros com esquemas rígidos antes de processar. |

---

## 2. Padrões de Ferramentas Recomendadas por Plataforma

- **Secret Scanning:** `Gitleaks` (CLI Docker universal)
- **SAST (Static Analysis):** `Semgrep` (Regras OWASP Top 10, multi-linguagem)
- **SCA (Dependencies):** `Trivy` (Rápido, atualizado diariamente)
- **DAST (Dynamic Analysis):** `OWASP ZAP` (Automação de varredura dinâmica baseline)
