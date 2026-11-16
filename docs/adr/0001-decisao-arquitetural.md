# ADR 0001 — Decisão de tecnologias e arquitetura da API

- **Status:** Aceita
- **Data:** Novembro de 2026
- **Projeto:** API de Gerenciamento de Impressão 3D

## 1. Contexto

O projeto consiste no desenvolvimento de uma API REST para gerenciamento de operações de impressão 3D, envolvendo diferentes entidades, como usuários, clientes, produtos, materiais, pedidos, pagamentos, impressoras e trabalhos de impressão.

Como essas entidades possuem relacionamentos entre si, era necessário escolher tecnologias que facilitassem a organização dos dados, a manutenção do código e a implementação das regras de negócio.

A escolha das tecnologias também considerou a experiência prévia com as ferramentas, buscando reduzir a curva de aprendizado e permitir maior foco no desenvolvimento das funcionalidades.

## 2. Decisões

### TypeScript

Foi escolhido como linguagem principal por oferecer tipagem estática, facilitando a identificação de inconsistências durante o desenvolvimento.

Como a aplicação trabalha com diversas entidades e relacionamentos, a tipagem ajuda a manter maior consistência na manipulação de variáveis, parâmetros, retornos de funções e estruturas de dados.

### Node.js e Express

O Node.js foi escolhido por permitir o desenvolvimento da API utilizando TypeScript e JavaScript no ambiente de execução.

O Express foi adotado para estruturar a aplicação HTTP, organizar as rotas e facilitar a implementação dos controladores e middlewares.

### Sequelize

O Sequelize foi escolhido como ORM por já existir familiaridade com a ferramenta e por facilitar o mapeamento das entidades da aplicação para tabelas relacionais.

Também oferece recursos para relacionamentos, consultas, validações e operações de persistência, reduzindo a necessidade de escrever consultas SQL manualmente em todas as operações.

### MySQL

O MySQL foi escolhido principalmente pela familiaridade com o banco de dados e com a ferramenta MySQL Workbench.

Além disso, seu modelo relacional atende às necessidades do projeto, que possui diversas entidades relacionadas e exige consistência na organização e persistência dos dados.

### Docker Compose

O Docker Compose foi adotado para facilitar a configuração e inicialização do ambiente de desenvolvimento, especialmente do banco de dados, permitindo reproduzir o ambiente com menos configurações manuais.

### Vitest e Supertest

O Vitest foi escolhido para execução dos testes automatizados, enquanto o Supertest foi utilizado para realizar requisições HTTP durante os testes de integração da API.

## 3. Alternativas consideradas

Não foi realizada uma comparação formal entre diversas tecnologias. As escolhas foram baseadas principalmente na familiaridade prévia, na compatibilidade entre as ferramentas e nas necessidades do projeto.

Existem alternativas como PostgreSQL, Prisma e outros frameworks para desenvolvimento de APIs, mas não houve necessidade de adotá-las neste projeto.

## 4. Consequências

As decisões tomadas proporcionam:

- Maior consistência na manipulação dos dados por meio da tipagem estática do TypeScript.
- Facilidade na manutenção dos relacionamentos entre entidades utilizando o Sequelize.
- Persistência de dados em um banco relacional adequado ao domínio da aplicação.
- Facilidade de configuração e reprodução do ambiente utilizando Docker Compose.
- Desenvolvimento e validação das funcionalidades por meio de testes automatizados.

Como consequência, o projeto também fica vinculado às particularidades das tecnologias escolhidas, exigindo familiaridade com TypeScript, Sequelize e MySQL para futuras manutenções e evoluções.