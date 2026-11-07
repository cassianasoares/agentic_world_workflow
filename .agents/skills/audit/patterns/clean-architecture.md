# Pattern: Clean Architecture

## 1. Visão Geral
A Clean Architecture (Arquitetura Limpa), proposta por Robert C. Martin (Uncle Bob), tem como objetivo principal a separação de responsabilidades e o desacoplamento do código de negócio em relação a frameworks, bancos de dados, interfaces de usuário e bibliotecas externas.

O sistema deve ser:
1. **Independente de Frameworks:** Os frameworks devem ser ferramentas, não restrições de arquitetura.
2. **Testável:** As regras de negócio podem ser testadas sem UI, banco de dados ou serviços externos.
3. **Independente de UI:** A interface gráfica pode mudar sem alterar as regras de negócio.
4. **Independente de Banco de Dados:** O banco (SQL, NoSQL, memória) é um detalhe de infraestrutura.
5. **Independente de qualquer agente externo:** As regras de negócio não conhecem nada do mundo exterior.

---

## 2. A Regra de Dependência (The Dependency Rule)
> **Regra Fundamental:** O código-fonte só pode apontar **para dentro**, em direção às políticas de mais alto nível (regras de negócio).

```
[ Frameworks & Drivers (Web, DB, UI, Dispositivos) ]   (Camada Mais Externa)
         ↓
[ Interface Adapters (Controllers, Gateways, Presenters) ]
         ↓
[ Application / Use Cases (Regras de Negócio da Aplicação) ]
         ↓
[ Enterprise / Domain Entities (Regras de Negócio Centrais) ] (Camada Mais Interna)
```

Nenhum elemento de uma camada interna pode saber o nome, tipo ou estrutura de qualquer elemento pertencente a uma camada externa (ex.: Entidades não importam Casos de Uso; Casos de Uso não importam Controllers ou DAOs).

---

## 3. Estrutura de Camadas e Execução

### Camada 1: Domínio / Entidades (Enterprise Business Rules)
- **O que contém:** Entidades de negócio puras, objetos de valor e regras corporativas que continuariam existindo mesmo sem o software.
- **Regras de execução:**
  - Zero dependências externas (sem anotações de ORM, sem frameworks HTTP, sem libs terceiras desnecessárias).
  - Devem ser representadas por classes puras da linguagem (POJOs/POCOs/dataclasses/structs puras).
  - Validações de integridade da própria entidade ocorrem aqui.

### Camada 2: Casos de Uso / Aplicação (Application Business Rules)
- **O que contém:** Fluxos específicos de casos de uso da aplicação (ex.: `CriarUsuarioUseCase`, `ProcessarAporteUseCase`).
- **Regras de execução:**
  - Orquestram o fluxo de dados de e para as Entidades.
  - Definem **Portas de Entrada (Input Ports)** e **Portas de Saída (Output Ports / Gateways)** através de interfaces/abstrações.
  - Dependência Inversa: Se o caso de uso precisa salvar no banco, ele define uma interface `IInvestimentoRepository`. A camada externa de infraestrutura implementa essa interface.
  - DTOs (Data Transfer Objects): Usar Input/Output DTOs para receber e retornar dados sem vazar entidades de domínio diretamente para a UI ou camada web se não for apropriado.

### Camada 3: Adaptadores de Interface (Interface Adapters)
- **O que contém:** Controllers, Presenters, ViewModels, Gateways, Repositórios concretos.
- **Regras de execução:**
  - Convertem dados do formato mais conveniente para casos de uso/entidades no formato mais conveniente para frameworks/UI/DB (e vice-versa).
  - Controllers recebem requisições/inputs da UI/API, chamam o Caso de Uso apropriado e repassam a resposta.
  - Implementações de repositórios adaptam chamadas abstratas para chamadas concretas a ORMs ou drivers de dados.

### Camada 4: Frameworks & Drivers (Infrastructure)
- **O que contém:** Banco de dados (Room, SQLite, PostgreSQL), Framework Web (Express, Nest, Spring, FastAPI), SDKs de terceiros (Firebase, AdMob, Google Sign-In), UI (Jetpack Compose, React, Flutter).
- **Regras de execução:**
  - É a camada mais descartável e volátil.
  - Todo código aqui conecta ferramentas específicas às portas/interfaces definidas nas camadas internas.

---

## 4. Métricas de Acoplamento e Instabilidade (Uncle Bob)

Para avaliar formalmente o acoplamento entre os pacotes e camadas:

1. **Acoplamento Eferente ($Ce$):** Número de classes externas que as classes deste pacote utilizam.
2. **Acoplamento Aferente ($Ca$):** Número de classes externas que dependem das classes deste pacote.
3. **Índice de Instabilidade ($I$):**
   $$I = \frac{Ce}{Ca + Ce}$$
   - $I = 0$: Pacote **maximamente estável** (muitos dependem dele, ele não depende de ninguém).
   - $I = 1$: Pacote **maximamente instável/volátil** (ele depende de muitos, ninguém depende dele).

### Diretriz Mandatória de Camadas:
* **Camada de Domínio (`domain`):** Deve ter $Ce = 0$, resultando em **$I = 0$** (estabilidade máxima). Se o domínio tiver $Ce > 0$ apontando para fora, há violação grave de acoplamento.
* **Camada de Aplicação (`application`):** Deve depender apenas do Domínio ($I \to 0.1 - 0.3$).
* **Camada de Infraestrutura/Adaptadores:** Podem ter alta instabilidade ($I \to 0.8 - 1.0$), pois dependem das abstrações internas.

---

## 5. Checklist de Auditoria para Clean Architecture

Durante a execução da auditoria, verifique:
- [ ] O domínio possui dependência de frameworks, decorators de ORM ou bibliotecas externas ($Ce > 0$ para fora)? *(Se sim, apontar violação).*
- [ ] Os Casos de Uso dependem de implementações concretas em vez de abstrações/interfaces? *(Se sim, apontar violação de DIP).*
- [ ] Entidades de banco (tabelas/modelos de ORM) estão misturadas com entidades de domínio? *(Devem ser separadas ou mapeadas).*
- [ ] O índice de instabilidade do Domínio é $I = 0$?
- [ ] A lógica de negócio está espalhada em Controllers ou componentes de UI? *(Se sim, mover para Casos de Uso/Domínio).*
- [ ] O projeto possui limites arquiteturais claros em diretórios (ex.: `domain/`, `application/`, `infrastructure/`, `presentation/` ou similar)?
