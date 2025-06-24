# Guia de Teste - API New Way Challenge

## 🚀 Como Testar a API

### 1. Acesso à Documentação Interativa
Acesse a documentação Swagger para explorar todos os endpoints:
```
http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/doc/api
```

### 2. Credenciais de Teste

#### Usuário Admin (já criado automaticamente)
- **Email:** `admin@example.com`
- **Senha:** `admin123`

### 3. Fluxo de Teste Recomendado

#### Passo 1: Criar um usuário comum
```bash
curl -X POST http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "password": "Senha123!",
    "passwordConfirmation": "Senha123!",
    "phone": "+55 11 99999-9999"
  }'
```

#### Passo 2: Fazer login
```bash
curl -X POST http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "password": "Senha123!"
  }'
```

**Guarde o token JWT retornado para usar nos próximos requests.**

#### Passo 3: Criar uma tarefa
```bash
curl -X POST http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "title": "Implementar autenticação JWT",
    "description": "Criar sistema de autenticação usando JWT tokens",
    "dueDate": "2024-02-15T23:59:59.000Z"
  }'
```

#### Passo 4: Listar tarefas do usuário
```bash
curl -X GET http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/tasks \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

#### Passo 5: Atualizar uma tarefa
```bash
curl -X PUT http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/tasks/ID_DA_TAREFA \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "title": "Implementar autenticação JWT - Atualizado",
    "description": "Sistema de autenticação JWT com refresh tokens",
    "status": "IN_PROGRESS",
    "dueDate": "2024-02-20T23:59:59.000Z"
  }'
```

### 4. Testando como Admin

#### Login como admin
```bash
curl -X POST http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

#### Listar todos os usuários (apenas admin)
```bash
curl -X GET http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/users \
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI"
```

#### Listar todas as tarefas (apenas admin)
```bash
curl -X GET http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/tasks \
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI"
```

### 5. Testando Validações

#### Senha fraca (deve retornar erro)
```bash
curl -X POST http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@email.com",
    "password": "123",
    "passwordConfirmation": "123",
    "phone": "+55 11 99999-9999"
  }'
```

#### Email inválido (deve retornar erro)
```bash
curl -X POST http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "email-invalido",
    "password": "Senha123!",
    "passwordConfirmation": "Senha123!",
    "phone": "+55 11 99999-9999"
  }'
```

### 6. Testando Permissões

#### Tentar acessar tarefas sem token (deve retornar 401)
```bash
curl -X GET http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/tasks
```

#### Tentar acessar tarefas de outro usuário (deve retornar 403)
```bash
# Use um token de um usuário para tentar acessar tarefas de outro
curl -X GET http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/tasks/ID_DE_OUTRO_USUARIO \
  -H "Authorization: Bearer TOKEN_USUARIO_AQUI"
```

### 7. Health Check

#### Verificar se a API está funcionando
```bash
curl -X GET http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/health
```

### 8. Usando o Swagger UI

1. Acesse: `http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/doc/api`
2. Clique em "Authorize" e insira: `Bearer SEU_TOKEN_JWT`
3. Teste os endpoints diretamente na interface

## 🎯 Cenários de Teste Importantes

### Cenário 1: Fluxo Completo de Usuário
1. Criar usuário
2. Fazer login
3. Criar tarefa
4. Listar tarefas
5. Atualizar tarefa
6. Deletar tarefa

### Cenário 2: Teste de Permissões
1. Criar dois usuários diferentes
2. Cada um cria suas tarefas
3. Verificar que não conseguem ver tarefas do outro
4. Login como admin e verificar que consegue ver todas

### Cenário 3: Validações
1. Tentar criar usuário com senha fraca
2. Tentar criar usuário com email inválido
3. Tentar criar tarefa sem autenticação
4. Tentar acessar recurso sem permissão

## 📊 Status Codes Esperados

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## 🔧 Ferramentas Recomendadas

- **Postman** ou **Insomnia** para testes de API
- **cURL** para testes via linha de comando
- **Swagger UI** para exploração interativa

---

**Dica:** Use o Swagger UI para uma experiência mais visual e interativa!
