# Pattern: KISS (Keep It Simple, Stupid)

## 1. Visão Geral
O princípio KISS prega que a maioria dos sistemas funciona melhor se mantidos simples, em vez de tornados complicados. A simplicidade deve ser um objetivo essencial de design e complexidades desnecessárias devem ser ativamente evitadas.

> *"A simplicidade é o pré-requisito para a confiabilidade."* — Edsger W. Dijkstra

---

## 2. Princípios de Execução do KISS

### 2.1 Evitar Engenharia Excessiva (Over-Engineering)
- Não crie camadas de abstração, fábricas (`Factory`), adaptadores ou estratégias complexas para cenários hipotéticos que não existem hoje (princípio YAGNI: *You Aren't Gonna Need It*).
- Se uma função simples resolve o problema de forma clara e limpa, não a envolva em 4 classes e 3 interfaces sem necessidade real de polimorfismo ou substituição.

### 2.2 Clareza Acima de Código "Esperto" (Clever Code)
- Código legível, direto e autoexplicativo é preferível a truques de sintaxe de uma linha (one-liners densos com regexes impenetráveis ou composições funcionais arcanas).
- Qualquer desenvolvedor ou agente deve ser capaz de ler o fluxo e entender o que está acontecendo sem ter que decodificar construções obscuras.

### 2.3 Equilíbrio com Clean Architecture e DDD
- Clean Architecture e DDD fornecem separação e clareza, mas podem se tornar uma armadilha se levados a extremos burocráticos em projetos pequenos ou em domínios simples.
- **Diretriz prática de equilíbrio:**
  - Em um MVP ou módulo simples, não crie dezenas de DTOs intermediários quando não há transformação real de dados acontecendo.
  - Mantenha a separação de camadas, mas com o menor número possível de passos e arquivos necessários para garantir a independência.
  - Elimine código duplicado sem introduzir abstrações prematuras difíceis de manter.

### 2.4 Modularidade Enxuta & Complexidade Cognitiva
- Funções curtas e focadas.
- Poucos parâmetros em métodos (ideal: 1 a 3 parâmetros; agrupar em objetos de valor ou DTOs se forem mais).
- Pouca aninhamento de código (evitar o "Arrow Anti-pattern" com 5 níveis de `if/for` aninhados — preferir early returns / guard clauses).
- **Métrica de Complexidade Cognitiva (Cognitive Complexity):**
  - Mede o esforço mental que um desenvolvedor despende para compreender o código (penaliza severamente aninhamentos, quebras de fluxo e operadores lógicos misturados).
  - **Teto Aceito:** $\le 15$ pontos por função/método.
  - Funções com pontuação $> 15$ são classificadas como violação do princípio KISS e devem ser decompostas em sub-funções claras.

---

## 3. Checklist de Auditoria para KISS

Durante a execução da auditoria, verifique:
- [ ] Há classes, interfaces ou abstrações criadas apenas "para o futuro" sem nenhum uso prático hoje? *(Se sim, remover ou simplificar).*
- [ ] O código possui aninhamento profundo (mais de 3 níveis de `if/else/for`) que dificulta a leitura? *(Refatorar usando guard clauses / early returns).*
- [ ] A Complexidade Cognitiva de alguma função ultrapassa o teto de 15 pontos? *(Exigir refatoração).*
- [ ] Há código "esperto" ou one-liners complexos onde um bloco legível de 3 linhas seria mais claro?
- [ ] O número de camadas e DTOs adiciona valor real de desacoplamento ou apenas gera boilerplate e custo de manutenção injustificado?
- [ ] Existem métodos gigantescos ou estruturas com nomes excessivamente complicados para conceitos triviais?
