# New Way Challenge - API de Gerenciamento de Tarefas

Esta é a API para o desafio da New Way, desenvolvida em Nest.js para gerenciar usuários e suas respectivas tarefas.

## Tecnologias Utilizadas

- **Backend:** [Nest.js](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Containerização:** [Docker](https://www.docker.com/)

---

## Pré-requisitos

Antes de começar, garanta que você tenha o [Docker](https://www.docker.com/products/docker-desktop/) e o Docker Compose instalados em sua máquina.

---

## Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento.

### 1. Clone o Repositório

```bash
git clone https://github.com/bnkcodes/newway-challenge-api.git
cd newway-challenge-api
```

### 2. Configure as Variáveis de Ambiente

Este projeto usa o arquivo `.env.example` como um template para as variáveis de ambiente.

Primeiro, copie o arquivo de exemplo para criar seu próprio arquivo `.env`:

```bash
cp .env.example .env
```

Agora, abra o arquivo `.env` recém-criado e preencha as variáveis necessárias, como `JWT_SECRET` e as credenciais para o serviço de armazenamento de sua escolha (S3 ou Bunny). A `DATABASE_URL` já vem configurada corretamente para o ambiente Docker.

### 3. Inicie os Contêineres

Use o Docker Compose para construir as imagens e iniciar a aplicação e o banco de dados em segundo plano.

```bash
docker-compose up -d --build
```

### 4. Aplique as Migrações do Banco de Dados

Com os contêineres em execução, execute o script para criar as tabelas no banco de dados.

```bash
yarn docker:migrate
```
*O Prisma pode pedir para você dar um nome para a migração inicial (ex: `init`).*

### 5. Crie um Usuário Administrador

Para popular o banco com um usuário administrador, execute o seguinte script:

```bash
yarn docker:seed
```

---

## Acesso à Aplicação

- **URL Base da API:** `http://localhost:3000`
- **Documentação (Swagger):** `http://localhost:3000/doc/api`

---

## Comandos Úteis para o Dia a Dia

Todos os comandos abaixo devem ser executados com os contêineres já iniciados (`docker-compose up -d`).

- **Abrir o Prisma Studio (Interface visual do banco de dados):**
  ```bash
  yarn docker:studio
  ```
  Depois de executar, acesse `http://localhost:5555` no seu navegador.

- **Executar todos os testes:**
  ```bash
  yarn docker:test
  ```

- **Ver Logs da Aplicação em Tempo Real:**
  ```bash
  docker-compose logs -f app
  ```

- **Parar todos os contêineres:**
  ```bash
  docker-compose down
  ```

- **Parar contêineres e remover volumes (para limpar o banco de dados):**
  ```bash
  docker-compose down -v
  ```
