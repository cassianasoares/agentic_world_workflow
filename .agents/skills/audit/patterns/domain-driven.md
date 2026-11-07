# Pattern: Domain-Driven Design (DDD)

## 1. Visão Geral
O Domain-Driven Design (Design Orientado a Domínio), concebido por Eric Evans, é uma abordagem de desenvolvimento de software que coloca o foco no núcleo do domínio e na lógica de negócio complexa, promovendo uma conexão profunda entre a linguagem dos especialistas do negócio e o código-fonte da aplicação.

---

## 2. Padrões Estratégicos

### 2.1 Linguagem Ubíqua (Ubiquitous Language)
- **Definição:** Um vocabulário compartilhado e rigoroso entre desenvolvedores e especialistas do domínio (stakeholders).
- **Como executar no código:**
  - Nomes de classes, métodos, variáveis e módulos devem usar termos exatos do negócio (ex.: `Aporte`, `RendaMensal`, `MetaPercentual`, em vez de genéricos como `DataRecord`, `MoneyItem`, `ProcessItem`).
  - Evitar nomes orientados puramente a banco de dados (ex.: `tbl_investimentos_row`) no domínio.

### 2.2 Contextos Delimitados (Bounded Contexts)
- **Definição:** Limites explícitos dentro dos quais um modelo de domínio se aplica e mantém sua consistência interna.
- **Como executar no código:**
  - Separar módulos/subprojetos que representam áreas distintas do negócio (ex.: `GestaoFinanceira`, `Autenticacao`, `SincronizacaoNuvem`).
  - Um modelo não deve tentar resolver todos os problemas de todos os contextos de forma monolítica.

---

## 3. Padrões Táticos e Regras de Execução

### 3.1 Entidades (Entities)
- **Conceito:** Objetos que possuem identidade própria contínua ao longo do tempo (ex.: `Usuario`, `ItemLancamento`).
- **Execução:**
  - Devem ser identificadas por um ID imutável (ex.: `UUID` ou ID de domínio).
  - A igualdade entre duas entidades se dá pela comparação de suas identidades (`id`), não de seus atributos.
  - Devem conter comportamentos e regras de negócio para proteger suas próprias invariantes (evitar "Modelos Anêmicos").

### 3.2 Objetos de Valor (Value Objects - VOs)
- **Conceito:** Objetos definidos exclusivamente pelos seus atributos, sem identidade conceitual própria (ex.: `Dinheiro`, `PercentualMeta`, `PeriodoMesAno`, `Email`).
- **Execução:**
  - **Imutabilidade obrigatória:** Uma vez criados, seus valores não se alteram; operações retornam novas instâncias.
  - **Auto-validação:** O VO garante sua integridade no momento da instanciação (ex.: `PercentualMeta` lança erro se o valor for menor que 0 ou maior que 100).
  - Dois VOs são iguais se todos os seus atributos forem idênticos.

### 3.3 Agregados e Raiz de Agregado (Aggregates & Aggregate Roots)
- **Conceito:** Um agrupamento de entidades e objetos de valor tratados como uma unidade para manipulação e garantia de consistência de dados.
- **Execução:**
  - O acesso externo e as alterações no agregado só podem ser realizados por meio da **Raiz de Agregado (Aggregate Root)**.
  - Nenhum objeto externo deve referenciar diretamente objetos internos de um agregado que não sejam a raiz.
  - Transações e consistência são garantidas no limite do agregado.

### 3.4 Serviços de Domínio (Domain Services)
- **Conceito:** Operações de negócio relevantes que não pertencem naturalmente a uma única Entidade ou Objeto de Valor (ex.: cálculos que envolvem múltiplos agregados).
- **Execução:**
  - Devem ser sem estado (stateless).
  - Contêm regras de negócio puras do domínio, sem lógica de infraestrutura ou I/O.

### 3.5 Repositórios (Repositories)
- **Conceito:** Abstração que provê a ilusão de uma coleção em memória para recuperação e persistência de agregados.
- **Execução:**
  - Apenas Raízes de Agregado possuem Repositórios.
  - A interface do repositório pertence à camada de Domínio (`domain/repositories/`).
  - Métodos refletem a linguagem ubíqua (ex.: `buscarPorPeriodo()`, `salvar()`), sem expor dialetos de banco SQL/NoSQL.

### 3.6 Eventos de Domínio (Domain Events)
- **Conceito:** Fatos que ocorreram no domínio e que são de interesse do negócio (ex.: `MetaAtingidaEvent`, `ValorSemDestinoZeradoEvent`).
- **Execução:**
  - Imutáveis, nomeados no pretérito (passado).
  - Notificam outros agregados ou contextos desacopladamente.

---

## 4. Checklist de Auditoria para Domain-Driven Design

Durante a execução da auditoria, verifique:
- [ ] O vocabulário do código reflete a Linguagem Ubíqua do negócio e não termos técnicos genéricos?
- [ ] Existem **Modelos Anêmicos** (classes que são apenas sacos de getters/setters com toda a lógica nos serviços)? *(Apontar como anti-pattern).*
- [ ] Objetos que deveriam ser **Value Objects** foram modelados como tipos primitivos crus (Primitive Obsession, ex.: usar `float` para dinheiro sem regras de moeda e arredondamento)?
- [ ] A consistência dos agregados é violada por acesso direto a entidades filhas sem passar pela Raiz?
- [ ] As interfaces de repositórios estão no domínio e são restritas a Raízes de Agregado?
