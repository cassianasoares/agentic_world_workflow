# Guia Prático de Threat Modeling (STRIDE para Software)

Este guia serve como base técnica para o **`spec-agent`** ao elaborar a seção de Threat Modeling nos artefatos de especificação técnica (`spec.md`).

---

## 1. O Modelo STRIDE

O modelo STRIDE categoriza os vetores de ameaça em 6 dimensões fundamentais aplicáveis à engenharia de software e APIs:

| Letra | Ameaça | Violação de Segurança | Pergunta de Investigação no Design |
| :--: | :-- | :-- | :-- |
| **S** | **Spoofing** (Falsificação) | Autenticidade | Um invasor pode se passar por outro usuário, serviço ou componente? |
| **T** | **Tampering** (Adulteração) | Integridade | Dados em trânsito ou no banco podem ser alterados indevidamente? |
| **R** | **Repudiation** (Repúdio) | Não-repúdio | Uma ação crítica pode ser executada sem que haja prova de quem a realizou? |
| **I** | **Information Disclosure** (Vazamento) | Confidencialidade | Dados sigilosos, PII, chaves ou stack traces podem vazar para partes não autorizadas? |
| **D** | **Denial of Service** (Negação de Serviço) | Disponibilidade | Uma carga excessiva ou payload malicioso pode derrubar a memória/CPU ou esgotar conexões? |
| **E** | **Elevation of Privilege** (Elevação de Privilégio) | Autorização | Um usuário comum pode acessar funções de admin ou dados de outros usuários (IDOR/BOLA)? |

---

## 2. Checklist Rápido de Mitigação por Camada

### Camada de Apresentação / Adaptadores (Controllers, APIs, Webhooks):
- **Spoofing:** Autenticação obrigatória (JWT/mTLS/Assinatura de Webhook).
- **Tampering:** Validação rigorosa de payload contra esquema (schema validation) antes de tocar o domínio.
- **Denial of Service:** Rate limiting por IP/token, limites de tamanho de payload (body limit), paginação obrigatória.

### Camada de Aplicação (Casos de Uso):
- **Elevation of Privilege:** Verificação explícita de permissão e propriedade do recurso (*"O tenant/user X tem autorização para modificar a entidade Y?"*). Previne IDOR (Insecure Direct Object Reference) e BOLA (Broken Object Level Authorization).
- **Repudiation:** Emissão de logs de auditoria estruturados com `correlation-id`, `timestamp`, `user_id` e ação realizada.

### Camada de Domínio & Dados (Entidades & Repositórios):
- **Tampering:** Entidades protegem invariantes contra estados inválidos; Value Objects validam dados no construtor.
- **Information Disclosure:** Proibir retorno de entidades ou senhas/hashes em DTOs de saída; mascarar campos sensíveis (ex.: CPF, cartão) em logs.
