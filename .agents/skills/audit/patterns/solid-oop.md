# Pattern: SOLID (Object-Oriented Programming)

## 1. Visão Geral
Os princípios SOLID são cinco diretrizes fundamentais da programação orientada a objetos (POO), compiladas por Robert C. Martin, que visam tornar o código mais compreensível, flexível, desacoplado e manutenível ao longo do tempo.

---

## 2. Os Cinco Princípios e Como Executá-los

### S — Single Responsibility Principle (Princípio da Responsabilidade Única)
> *"Uma classe/módulo deve ter um, e apenas um, motivo para mudar."*

- **Como executar no código:**
  - Cada classe deve encapsular uma única responsabilidade ou papel do sistema.
  - Não misture regras de cálculo de negócio, formatação de saída e persistência de dados na mesma classe.
  - Exemplo: Uma classe `Lancamento` calcula seus totais e valida seus limites; uma classe `LancamentoRepository` cuida da persistência; um `LancamentoPresenter` formata a exibição para a tela.
- **Sintomas de violação (Anti-patterns):**
  - "God Classes" (classes gigantes com centenas/milhares de linhas fazendo múltiplos trabalhos).
  - Alterações no layout da UI exigindo mudanças na classe que gerencia regras de negócio.

---

### O — Open/Closed Principle (Princípio Aberto/Fechado)
> *"Entidades de software devem estar abertas para extensão, mas fechadas para modificação."*

- **Como executar no código:**
  - O comportamento de uma classe deve ser extensível sem a necessidade de modificar seu código-fonte original.
  - Utilize abstrações (interfaces, classes abstratas, polimorfismo ou composição de estratégias/Strategy Pattern) em pontos de variação.
  - Exemplo: Ao adicionar um novo tipo de cálculo de rendimento ou desconto, crie uma nova classe implementando `ICalculadoraRendimento` em vez de adicionar mais blocos `switch/case` ou `if/else` gigantescos.
- **Sintomas de violação:**
  - Cadeias longas de `if (tipo == TipoX) ... else if (tipo == TipoY) ...` espalhadas pelo código.

---

### L — Liskov Substitution Principle (Princípio da Substituição de Liskov)
> *"Se $S$ é um subtipo de $T$, então objetos do tipo $T$ podem ser substituídos por objetos do tipo $S$ sem alterar as propriedades desejadas do programa."*

- **Como executar no código:**
  - As subclasses ou implementações de uma interface devem cumprir o contrato esperado da superclasse/interface sem surpresas.
  - Não lance exceções inesperadas em métodos herdados (ex.: `throw new NotImplementedException()`).
  - Não enfraqueça as pós-condições nem fortaleça as pré-condições nas subclasses.
- **Sintomas de violação:**
  - Métodos implementados apenas com `throw UnsupportedOperationException` ou vazios porque a classe derivada "não suporta aquele comportamento".
  - Códigos clientes fazendo checagens explícitas de tipo: `if (obj instanceof SubClasseX) { ... }`.

---

### I — Interface Segregation Principle (Princípio da Segregação de Interfaces)
> *"Muitas interfaces específicas são melhores do que uma interface geral única. Nenhum cliente deve ser forçado a depender de métodos que não utiliza."*

- **Como executar no código:**
  - Crie interfaces granulares, enxutas e focadas em papéis específicos (Role Interfaces).
  - Em vez de uma interface monolítica `IRepositorioGeral` com 30 métodos (leitura, escrita, auditoria, exportação, batch, etc.), segmente em interfaces menores como `ILeitorLancamento`, `IEscritorLancamento`.
- **Sintomas de violação:**
  - Classes implementando métodos "vazios" ou dummy só para satisfazer um contrato inchado da interface.

---

### D — Dependency Inversion Principle (Princípio da Inversão de Dependência)
> *"1. Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.*
> *2. Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações."*

- **Como executar no código:**
  - Módulos de domínio/casos de uso (alto nível) dependem de interfaces (`IRepositorio`, `INotificador`).
  - Módulos de infraestrutura/banco/APIs (baixo nível) implementam essas interfaces.
  - Utilize Injeção de Dependência (DI) via construtor para fornecer as instâncias concretas às classes de negócio.
- **Sintomas de violação:**
  - Classes de regra de negócio instanciando diretamente dependências externas via `new DatabaseClient()` ou chamando métodos estáticos/singletons acoplados.

---

## 3. Checklist de Auditoria para SOLID

Durante a execução da auditoria, verifique:
- [ ] Há classes que acumulam múltiplas responsabilidades (God Objects)? *(Violação de SRP).*
- [ ] O código utiliza `switch/if-else` encadeados para selecionar comportamentos que poderiam ser polimórficos? *(Violação de OCP).*
- [ ] Há interfaces com métodos que forçam implementações a lançar `NotImplementedException` ou deixar corpos vazios? *(Violação de LSP/ISP).*
- [ ] Há interfaces sobrecarregadas com métodos não relacionados? *(Violação de ISP).*
- [ ] Classes de negócio instanciam diretamente conexões de banco de dados, clientes HTTP ou SDKs externos via `new`? *(Violação de DIP).*
