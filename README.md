# New Way Challenge - API de Gerenciamento de Tarefas

API desenvolvida em Nest.js para o desafio da New Way, com gerenciamento de usuários e tarefas.

---

## Tecnologias
- Nest.js (TypeScript)
- PostgreSQL + Prisma ORM
- Docker
- AWS ECS, RDS, Secrets Manager, Terraform

---

## Documentação da API

A API possui documentação interativa via Swagger/OpenAPI que permite:

- **Visualizar todos os endpoints** disponíveis
- **Testar as requisições** diretamente no navegador
- **Ver exemplos de payloads** de entrada e saída
- **Consultar códigos de resposta** e mensagens de erro

### Acesso à Documentação

**Desenvolvimento Local:**
```
http://localhost:3000/doc/api
```

**Produção:**
```
http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/doc/api
```

> **Dica:** Use a documentação Swagger para explorar e testar todos os endpoints da API de forma interativa.

---

## Autenticação e Permissões

### Autenticação
- Autenticação via JWT.
- Após login, use o token JWT no header:
  ```
  Authorization: Bearer <token>
  ```
- O token é necessário para acessar rotas protegidas (tarefas, perfil, etc).

### Perfis e Permissões

A API possui dois níveis de acesso com permissões específicas:

#### **Usuário Comum (USER)**
- **Gerenciar próprias tarefas:** Criar, visualizar, editar e excluir apenas suas tarefas
- **Gerenciar próprio perfil:** Atualizar informações pessoais
- **Acesso restrito:** Não pode ver tarefas de outros usuários

#### **Administrador (ADMIN)**
- **Todas as permissões de usuário comum**
- **Visualizar todas as tarefas:** Lista tarefas de todos os usuários
- **Gerenciar usuários:** Criar, listar, editar e desativar usuários
- **Acesso total:** Pode modificar qualquer tarefa ou usuário

### Tabela de Permissões por Endpoint

| Endpoint | Método | USER | ADMIN | Descrição |
|----------|--------|------|-------|-----------|
| `/auth/login` | POST | ✅ | ✅ | Login de usuários |
| `/users` | POST | ✅ | ✅ | Criar usuário (público) |
| `/users` | GET | ❌ | ✅ | Listar todos os usuários |
| `/users/:id` | GET | ❌ | ✅ | Buscar usuário específico |
| `/users/:id` | PUT | ❌ | ✅ | Atualizar usuário |
| `/tasks` | POST | ✅ | ✅ | Criar tarefa |
| `/tasks` | GET | ✅* | ✅ | Listar tarefas (próprias/todas) |
| `/tasks/:id` | GET | ✅* | ✅ | Buscar tarefa (própria/qualquer) |
| `/tasks/:id` | PUT | ✅* | ✅ | Atualizar tarefa (própria/qualquer) |
| `/tasks/:id` | DELETE | ✅* | ✅ | Excluir tarefa (própria/qualquer) |

> **Legenda:** ✅ = Permitido | ❌ = Negado | ✅* = Apenas recursos próprios

### Requisitos de Senha
- **Mínimo:** 8 caracteres
- **Máximo:** 20 caracteres
- **Obrigatório:** 1 letra minúscula, 1 maiúscula, 1 número, 1 caractere especial
- **Exemplo válido:** `Senha123!`

### Status das Tarefas
- `PENDING` - Pendente
- `IN_PROGRESS` - Em andamento
- `COMPLETED` - Concluída
- `CANCELLED` - Cancelada

---

## Exemplos de Uso

### 1. Criar usuário
```http
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "password": "Senha123!",
  "passwordConfirmation": "Senha123!",
  "phone": "+55 11 99999-9999"
}
```

**Resposta de sucesso (201):**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "+55 11 99999-9999",
    "imageUrl": null,
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "deletedAt": null
  }
}
```

### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao.silva@email.com",
  "password": "Senha123!"
}
```

**Resposta de sucesso (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "role": "USER"
  }
}
```

### 3. Criar tarefa (autenticado)
```http
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Implementar autenticação JWT",
  "description": "Criar sistema de autenticação usando JWT tokens",
  "dueDate": "2024-02-15T23:59:59.000Z"
}
```

**Resposta de sucesso (201):**
```json
{
  "task": {
    "id": "uuid-da-tarefa",
    "title": "Implementar autenticação JWT",
    "description": "Criar sistema de autenticação usando JWT tokens",
    "status": "PENDING",
    "dueDate": "2024-02-15T23:59:59.000Z",
    "userId": "uuid-do-usuario",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Atualizar tarefa
```http
PUT /tasks/uuid-da-tarefa
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Implementar autenticação JWT - Atualizado",
  "description": "Sistema de autenticação JWT com refresh tokens",
  "status": "IN_PROGRESS",
  "dueDate": "2024-02-20T23:59:59.000Z"
}
```

### 5. Listar tarefas do usuário
```http
GET /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de sucesso (200):**
```json
{
  "tasks": [
    {
      "id": "uuid-da-tarefa-1",
      "title": "Implementar autenticação JWT",
      "description": "Criar sistema de autenticação usando JWT tokens",
      "status": "PENDING",
      "dueDate": "2024-02-15T23:59:59.000Z",
      "userId": "uuid-do-usuario",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalCount": 1
}
```

### 6. Atualizar usuário
```http
PUT /users/uuid-do-usuario
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.santos@email.com",
  "phone": "+55 11 88888-8888"
}
```

### Exemplo de resposta de erro
```json
{
  "statusCode": 400,
  "message": "O campo senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial."
}
```

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

---

## Testes
- Para rodar os testes automatizados:
  ```bash
  # Com Docker (recomendado)
  yarn docker:test

  # Localmente (requer Node.js e dependências instaladas)
  yarn test
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

## Estrutura do Projeto e Patterns

O projeto segue princípios de **Domain-Driven Design (DDD)** e **Clean Architecture** para garantir separação de responsabilidades, testabilidade e escalabilidade.

- **src/**: Código principal da aplicação
  - **modules/**: Cada domínio (users, tasks) é um módulo independente, seguindo o padrão modular do Nest.js
    - **application/**: Casos de uso (use-cases), DTOs e lógica de aplicação
    - **domain/**: Entidades, repositórios e regras de negócio
    - **infrastructure/**: Implementações concretas (banco, controllers, presenters)
  - **shared/**: Código utilitário, providers, estratégias, decorators e infraestrutura comum
- **prisma/**: Schema do banco de dados e seed (população inicial/admin)

**Principais patterns utilizados:**
- DDD (Domain-Driven Design)
- Clean Architecture
- Repository Pattern
