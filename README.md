# Projeto B — API de Gerenciamento de Impressão 3D

API REST desenvolvida para gerenciar os processos de uma operação de impressão 3D sob demanda, incluindo clientes, produtos, materiais, pedidos, pagamentos, impressoras e trabalhos de impressão.

**Nível do projeto:** Projeto B — API de domínio único.

**Status:** Em desenvolvimento.

**Repositório:** [github.com/gabrieldev6/APIimpressao3d](https://github.com/gabrieldev6/APIimpressao3d)

---

## 1. Sobre o projeto

O objetivo deste projeto é desenvolver uma API capaz de centralizar o gerenciamento de uma operação de impressão 3D, permitindo controlar desde o cadastro de clientes e produtos até o acompanhamento da produção.

A ideia surgiu da necessidade de organizar o funcionamento de ambientes que utilizam impressoras 3D para atender solicitações sob demanda. Em vez de depender exclusivamente de planilhas para acompanhar pedidos, materiais e impressões, o sistema propõe uma solução centralizada.

### Principais funcionalidades

- Gerenciamento de usuários do sistema.
- Cadastro e gerenciamento de clientes.
- Cadastro de produtos e seus custos de produção.
- Controle de materiais e estoque de filamentos e resinas.
- Gerenciamento de pedidos e respectivos itens.
- Registro e acompanhamento de pagamentos.
- Cadastro e controle de impressoras.
- Gerenciamento de trabalhos de impressão (*Print Jobs*).

## 2. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução |
| TypeScript | Linguagem de programação |
| Express 5 | Construção da API REST |
| Sequelize 6 | ORM e comunicação com o banco |
| MySQL 8.4 | Banco de dados relacional |
| Docker Compose | Ambiente de banco de dados |
| Vitest | Testes automatizados |
| Supertest | Testes HTTP |
| GitHub Actions | Integração contínua |
| OpenAPI / Swagger UI | Documentação da API |

## 3. Arquitetura do projeto

O projeto utiliza uma organização em camadas, separando as responsabilidades da aplicação.

- **Routes:** definem os endpoints e encaminham as requisições.
- **Controllers:** recebem as requisições HTTP, executam as operações e retornam as respostas.
- **Models:** representam as entidades e regras relacionadas aos dados.
- **Config:** concentra configurações, incluindo a conexão com o banco de dados.
- **Tests:** contém os testes unitários e de integração.

### Estrutura de diretórios

```text
APIimpressao3d/
├── .github/
│   └── workflows/
│       └── ci.yml
├── config/
├── docs/
│   └── openapi.yaml
├── migrations/
├── models/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── compose.yaml
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── vitest.integration.config.ts
```

> A estrutura acima representa a organização esperada do projeto. Ajuste os diretórios caso algum deles tenha sido renomeado ou ainda não esteja versionado.

## 4. Modelagem do domínio

O sistema possui as seguintes entidades principais:

| Entidade | Responsabilidade |
|---|---|
| User | Usuários internos e seus níveis de acesso |
| Customer | Clientes que solicitam impressões |
| Product | Produtos disponíveis para fabricação |
| Material | Filamentos e resinas utilizados |
| Order | Pedidos realizados pelos clientes |
| OrderItem | Produtos e quantidades de cada pedido |
| Payment | Pagamentos associados aos pedidos |
| Printer | Impressoras disponíveis para produção |
| PrintJob | Trabalhos de impressão associados aos pedidos |

### Relacionamentos principais

- Um cliente pode possuir vários pedidos.
- Um pedido pode possuir vários itens.
- Um produto pode estar presente em vários itens de pedido.
- Um pedido pode possuir registros de pagamento.
- Um item de pedido pode gerar trabalhos de impressão.
- Uma impressora pode executar vários trabalhos de impressão.
- Um material pode ser utilizado em vários trabalhos de impressão.

## 5. Requisitos para execução

Antes de iniciar, instale:

- Node.js 20 ou superior.
- npm.
- Docker e Docker Compose.
- Git.

## 6. Instalação e configuração

Clone o repositório:

```bash
git clone https://github.com/gabrieldev6/APIimpressao3d.git

cd APIimpressao3d
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell, também é possível utilizar:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis de ambiente conforme seu ambiente.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DB_HOST` | Endereço do servidor MySQL |
| `DB_PORT` | Porta do MySQL |
| `DB_NAME` | Nome do banco de dados |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do usuário |
| `DB_ROOT_PASSWORD` | Senha root utilizada pelo Docker Compose |
| `TEST_DB_NAME` | Banco exclusivo para testes de integração |

> Confira se todas as variáveis utilizadas pelo `compose.yaml` estão presentes no `.env.example`. Não versionar o arquivo `.env` nem credenciais reais.

## 7. Executando o banco de dados com Docker Compose

O projeto utiliza MySQL 8.4 em um container Docker, com volume persistente para os dados.

Para iniciar o banco:

```bash
docker compose up -d
```

Para verificar os containers:

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f mysql
```

Para parar os containers:

```bash
docker compose down
```

Para remover também o volume persistente:

```bash
docker compose down -v
```

**Atenção:** o último comando remove os dados armazenados no volume do MySQL.

O serviço MySQL publica a porta configurada em `DB_PORT` no host. No arquivo de exemplo atual, essa porta é `3307`.

## 8. Executando a aplicação

### Ambiente de desenvolvimento

```bash
npm run dev
```

O servidor utiliza `tsx watch` para reiniciar automaticamente quando os arquivos são alterados.

### Compilação

```bash
npm run build
```

### Ambiente de produção

Após a compilação, o ponto de entrada do servidor é `dist/server.js`:

```bash
node dist/server.js
```

> O script `start` do `package.json` deve ser conferido: no arquivo publicado atualmente ele aponta para `dist/index.js`, enquanto o servidor é iniciado por `src/server.ts`. Recomenda-se ajustar o script para `node dist/server.js`.

## 9. Testes automatizados

Os testes são implementados utilizando Vitest e Supertest.

A suíte está dividida em duas categorias principais.

### Testes unitários

Os testes unitários verificam comportamentos isolados do domínio, como validações e métodos das entidades.

Execute:

```bash
npx vitest run tests/unit
```

### Testes de integração

Os testes de integração verificam o funcionamento conjunto dos componentes, realizando requisições HTTP e interagindo com o banco de dados de testes.

Execute:

```bash
npm run test:integration
```

O projeto utiliza um banco exclusivo para testes, configurado pela variável `TEST_DB_NAME`.

**Importante:** o banco de testes deve ser separado do banco de desenvolvimento. A configuração de integração recria as tabelas para executar os cenários, portanto nunca utilize o banco de produção nesse processo.

### Executar todos os testes

```bash
npm test
```

### Executar em modo watch

```bash
npm run test:watch
```

### Estado dos testes

A suíte de integração foi executada com sucesso durante o desenvolvimento, incluindo 20 cenários de integração. Os testes unitários também foram executados com sucesso.

## 10. Integração contínua (CI)

O projeto utiliza GitHub Actions para automatizar verificações a cada execução do workflow.

O pipeline contempla:

1. Checkout do repositório.
2. Configuração do Node.js.
3. Instalação das dependências.
4. Compilação do TypeScript.
5. Execução dos testes unitários.
6. Execução dos testes de integração com MySQL.

Arquivo de configuração:

```text
.github/workflows/ci.yml
```

A execução do pipeline pode ser acompanhada na aba **Actions** do GitHub:

[Consultar execuções do CI](https://github.com/gabrieldev6/APIimpressao3d/actions)

## 11. Documentação da API

A API possui documentação baseada na especificação OpenAPI.

O arquivo de especificação está localizado em:

```text
docs/openapi.yaml
```

A interface Swagger UI permite visualizar os endpoints, parâmetros, modelos de dados e respostas documentadas.

Com a aplicação em execução, acesse:

```text
http://localhost:3000/api-docs
```

A documentação deve ser mantida sincronizada com as rotas e os controllers da aplicação.

## 12. Segurança e boas práticas

O projeto utiliza variáveis de ambiente para separar configurações do código-fonte.

Boas práticas adotadas ou previstas:

- Não versionar arquivos `.env`.
- Manter um `.env.example` sem credenciais reais.
- Separar o banco de testes do banco de desenvolvimento.
- Validar os dados recebidos pela API.
- Retornar códigos HTTP adequados para erros de requisição e falhas internas.
- Evitar expor informações sensíveis nas respostas HTTP.

## 13. Próximas melhorias

Os seguintes pontos fazem parte da evolução planejada do projeto e devem ser considerados pendências até sua implementação e validação:

- [ ] Revisar e demonstrar os princípios SOLID.
- [ ] Implementar e documentar um Design Pattern.
- [ ] Definir e registrar uma decisão arquitetural (ADR).
- [ ] Configurar e estabelecer um percentual mínimo de cobertura de testes.
- [ ] Adicionar lint ao pipeline de CI.
- [ ] Implementar logs estruturados.
- [ ] Implementar pelo menos uma métrica.
- [ ] Definir um SLO simples.
- [ ] Validar todos os contratos do OpenAPI com as rotas reais.
- [ ] Criar um smoke test com k6.
- [ ] Medir e documentar o p95 das requisições.

## 14. Decisões arquiteturais

As principais decisões técnicas devem ser registradas em documentos ADR (*Architecture Decision Records*).

Local sugerido:

```text
docs/adr/
```

Cada ADR deve apresentar:

- Contexto e problema.
- Decisão adotada.
- Alternativas consideradas.
- Consequências positivas e negativas.

## 15. Licença

Este projeto está distribuído sob a licença ISC.

---

**Desenvolvido por Gabriel Silva Pimentel**

[GitHub](https://github.com/gabrieldev6)