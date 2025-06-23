# New Way Challenge - API de Gerenciamento de Tarefas

API desenvolvida em Nest.js para o desafio da New Way, com gerenciamento de usuários e tarefas.

---

## Visão Geral

API RESTful para cadastro/login de usuários, autenticação JWT, permissões (admin/usuário) e gerenciamento de tarefas (CRUD). Permite que cada usuário gerencie suas próprias tarefas e admin visualize todas.

---

## Tecnologias
- Nest.js (TypeScript)
- PostgreSQL + Prisma ORM
- Docker
- AWS ECS, RDS, Secrets Manager, Terraform

---

## Autenticação
- Autenticação via JWT.
- Após login, use o token JWT no header:
  ```
  Authorization: Bearer <token>
  ```
- O token é necessário para acessar rotas protegidas (tarefas, perfil, etc).

---

## Perfis e Permissões
- **Admin:** pode ver todas as tarefas e gerenciar usuários.
- **Usuário comum:** só pode ver e gerenciar suas próprias tarefas.

---

## Exemplos de Uso

### Criar usuário
```json
POST /users
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

### Login
```json
POST /auth/login
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Criar tarefa (autenticado)
```json
POST /tasks
{
  "title": "Minha tarefa",
  "description": "Detalhes da tarefa"
}
```

### Exemplo de resposta de erro
```json
{
  "statusCode": 400,
  "message": "Email ou senha estão incorretos."
}
```

---

## Estrutura do Projeto e Patterns

O projeto segue princípios de **Domain-Driven Design (DDD)** e **Clean Architecture** para garantir separação de responsabilidades, testabilidade e escalabilidade.

- **src/**: Código principal da aplicação
  - **modules/**: Cada domínio (users, tasks) é um módulo independente, seguindo o padrão modular do Nest.js
    - **application/**: Casos de uso (use-cases), DTOs e lógica de aplicação
    - **domain/**: Entidades, repositórios e regras de negócio
    - **infrastructure/**: Implementações concretas (banco, controllers, presenters)
  - **shared/**: Código utilitário, providers, estratégias, decorators e infraestrutura comum
- **prisma/**: Schema do banco de dados e seed (população inicial/admin)
- **test/**: Testes automatizados (unitários e e2e)

**Principais patterns utilizados:**
- DDD (Domain-Driven Design)
- Clean Architecture
- Repository Pattern
- DTOs para entrada/saída
- Use Cases isolando regras de negócio
- Injeção de dependências (Nest.js DI)

---

## Documentação da API
- **Swagger (dev):** `http://localhost:3000/doc/api`
- **Produção:** `http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/doc/api`
- A documentação Swagger permite visualizar todos os endpoints e ver exemplos de payloads e respostas.

---

## Testes
- Para rodar os testes automatizados:
  ```bash
  yarn docker:test
  ```

---

## Produção (AWS)
- O seed roda automaticamente ao subir o container e garante que o usuário admin existe/atualizado.
- O login de admin padrão é:
  - **E-mail:** `admin@example.com`
  - **Senha:** `admin123`
- Para mudar o admin, defina as variáveis de ambiente na Task Definition do ECS (ou via Terraform):
  - `ADMIN_EMAIL` (ex: `admin@newway.com`)
  - `ADMIN_PASSWORD` (ex: `suaSenhaForte`)
  - `ADMIN_NAME` (opcional)
- Após alterar as variáveis, faça um novo deploy para atualizar o admin.
- O seed é idempotente: sempre que o container sobe, garante o admin correto.

---

## Desenvolvimento Local

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos principais
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/bnkcodes/newway-challenge-api.git
   cd newway-challenge-api
   ```
2. **Configure o .env:**
   ```bash
   cp .env.example .env
   # Edite o .env conforme necessário
   ```
3. **Suba os containers:**
   ```bash
   docker-compose up --build
   # (sem -d, para ver os logs no terminal)
   ```
4. **Aplique as migrações e rode o seed (admin):**
   Em outro terminal, rode:
   ```bash
   yarn migrate:seed
   # Isso aplica as migrações e garante o admin no banco
   ```

### Comandos essenciais
- **Aplique migrações e seed juntos:**
  ```bash
  yarn migrate:seed
  ```
- **Parar todos os containers:**
  ```bash
  docker-compose down
  ```
- **Iniciar novamente:**
  ```bash
  docker-compose up
  ```
- **Ver logs da aplicação:**
  ```bash
  docker-compose logs -f app
  ```
- **Abrir Prisma Studio:**
  ```bash
  yarn docker:studio
  # Acesse http://localhost:5555
  ```
- **Executar testes:**
  ```bash
  yarn docker:test
  ```
- **Resetar banco:**
  ```bash
  docker-compose down -v
  docker-compose up
  yarn migrate:seed
  ```
