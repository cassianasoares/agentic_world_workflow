# Heurísticas de Testes para o Test Agent (SDET)

Este guia prático fornece heurísticas para que o **`test-agent`** identifique cenários críticos e casos de borda sem depender de intuição subjetiva.

---

## 1. Heurísticas de Valores Limite (Boundary Analysis)

- **Zero / Vazio / Nulo:**
  - Valores nulos (`null`), indefinidos (`undefined`), strings vazias (`""`), arrays vazios (`[]`).
  - Números zerados (`0`, `0.00`).
- **Limites Numéricos:**
  - `min - 1`, `min`, `min + 1`.
  - `max - 1`, `max`, `max + 1`.
  - Inteiros negativos onde se espera positivo.
- **Limites de String:**
  - 1 caractere abaixo do mínimo exigido.
  - Exatamente no limite máximo permitido.
  - 1 caractere acima do limite máximo (deve estourar validação de DTO/VO).

---

## 2. Heurísticas de Estados & Fluxos Alternativos

- **Idempotência:**
  - O que acontece se a mesma requisição chegar 2 vezes em menos de 10 milissegundos?
  - O que acontece se o usuário clicar duas vezes seguidas no botão de submissão?
- **Ordem de Operações Inválida:**
  - Tentar cancelar um pedido que ainda não foi criado.
  - Tentar confirmar um pagamento já estornado.
- **Falha Parcial & Rollback:**
  - Operação grava no banco, mas a notificação externa falha: o estado no banco foi revertido?

---

## 3. Heurísticas de Segurança & Entrada Maliciosa

- **Injeções em Campos de Texto:**
  - SQL: `' OR '1'='1`
  - HTML/XSS: `<script>alert(1)</script>`
- **IDOR / BOLA:**
  - Usuário A passa o UUID do recurso do Usuário B no path parameter: o sistema bloqueia com 403 Forbidden ou 404 Not Found?
- **Payloads Excessivos:**
  - Envio de JSON com 10MB para rota que só aceita 100KB: rejeição imediata com 413 Payload Too Large.

---

## 4. Heurísticas de Complexidade Ciclomática (McCabe & Basis Path)

A complexidade ciclomática $V(G)$ determina o número mínimo de casos de teste necessários para cobrir todos os caminhos independentes de execução:

$$V(G) = P + 1$$

Onde **$P$** é a quantidade de pontos de decisão na função:
- Comandos condicionais: `if`, `else if`, `switch/case`, operador ternário `? :`.
- Loops de repetição: `for`, `while`, `do/while`.
- Operadores booleanos de curto-circuito: `&&`, `||`, `??`.

### Diretrizes de Ação para o SDET:
1. **Calcular o Limiar de Testes:** Se uma função possui $V(G) = 6$, ela exige **no mínimo 6 casos de teste distintos** para garantir cobertura real de caminhos.
2. **Reprovação por Alta Complexidade:** Se qualquer função ultrapassar $V(G) > 10$, o `test-agent` deve sinalizar como **código de alto risco de manutenção** e instruir o `dev-agent` a simplificá-la (ex.: substituir cadeias de `if/else` por dicionários/Lookup Tables, polimorfismo ou extrair métodos menores - respeitando o KISS).
3. **Bloqueio Crítico ($V(G) > 15$):** Nenhuma tarefa deve ser marcada como concluída se contiver métodos com $V(G) > 15$. O `dev-agent` DEVE quebrar o método antes do aceite final.

---

## 5. Heurísticas de Integridade Relacional & Análise com EXPLAIN

Para projetos com banco relacional (PostgreSQL, MySQL, SQLite), o SDET deve aplicar as seguintes checagens nas suites de integração:

### 5.1. Heurísticas de Relacionamentos & Chaves Estrangeiras (FK)
- **Teste de Exclusão com Dependência:** Tentar executar `DELETE` no registro pai. Se o banco permitir e apagar silenciosamente os filhos sem estar explicitamente modelado como cascata, isso é um bug grave. Deve falhar com `ForeignKeyViolationException` (`ON DELETE RESTRICT`).
- **Teste de Filho Órfão:** Tentar executar `INSERT` com chave estrangeira apontando para ID inexistente (`00000000-0000-0000-0000-000000000000`). O banco DEVE rejeitar com erro de integridade referencial.
- **Auditoria de Índices em FKs:** Em bancos relacionais, criar uma Foreign Key NÃO cria índice automaticamente na coluna filha. O `test-agent` deve verificar se existe `CREATE INDEX idx_[tabela]_[coluna_fk]`. A ausência desse índice causa locks na tabela inteira e *Sequential Scan* em cascata.

### 5.2. Heurísticas de Análise de Queries com EXPLAIN
- **Detecção de Sequential Scan (`Seq Scan`):**
  - Execute `EXPLAIN` nas queries do repositório.
  - Se a query buscar por chave, status, data ou relacionamento e o plano apresentar `Seq Scan` em tabelas com potencial de crescimento (> 1.000 linhas), o teste deve reprovar e exigir a criação de um índice (`Index Scan`).
- **Detecção do Anti-Pattern N+1:**
  - Execute um teste buscando 10 registros com seus dependentes (ex.: 10 pedidos com seus itens).
  - Conte a quantidade de queries disparadas ao banco no teste.
  - Se houver 11 queries (1 + 10), reprove imediatamente com falha de N+1 e oriente o `dev-agent` a usar `JOIN` ou buscar com cláusula `IN (...)` em lote.
- **Auditoria de Custo de Execução:**
  - Verifique se o `Total Cost` no plano do `EXPLAIN` não possui valores anômalos causados por sorting em disco (`External Sort`) ou junções cartesianas acidentais (`Nested Loop` sem índice).
