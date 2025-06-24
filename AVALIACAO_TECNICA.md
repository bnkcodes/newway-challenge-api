# Avaliação Técnica - New Way Challenge

## Resumo Executivo

Este projeto demonstra a implementação completa de uma API RESTful para gerenciamento de tarefas, desenvolvida em **Nest.js** com **TypeScript**, seguindo as melhores práticas de arquitetura e deploy automatizado na **AWS** utilizando **Terraform**.

## 🚀 Tecnologias Implementadas

### Backend
- **Nest.js** (Framework Node.js com TypeScript)
- **PostgreSQL** + **Prisma ORM** (Banco de dados e migrations)
- **JWT** (Autenticação e autorização)
- **Swagger/OpenAPI** (Documentação interativa da API)
- **Docker** (Containerização)
- **Jest** (Testes automatizados)

### Infraestrutura AWS (Terraform)
- **ECS Fargate** (Container orchestration)
- **RDS PostgreSQL** (Banco de dados gerenciado)
- **Application Load Balancer** (Load balancing)
- **ECR** (Container registry)
- **Secrets Manager** (Gerenciamento seguro de secrets)
- **VPC** com subnets públicas e privadas
- **CloudWatch** (Logs e monitoramento)
- **IAM** (Controle de acesso)

## 🏗️ Arquitetura Implementada

### Padrão Clean Architecture
```
src/
├── modules/
│   ├── users/          # Módulo de usuários
│   │   ├── application/ # Casos de uso
│   │   ├── domain/     # Entidades e regras de negócio
│   │   └── infrastructure/ # Repositórios e controllers
│   └── tasks/          # Módulo de tarefas
├── shared/             # Código compartilhado
│   ├── guards/         # Guards de autenticação
│   ├── decorators/     # Decorators customizados
│   └── providers/      # Provedores (storage, crypto, etc.)
```

### Sistema de Permissões
- **Usuário Comum (USER)**: Gerencia apenas suas próprias tarefas
- **Administrador (ADMIN)**: Acesso total ao sistema

## 🔧 Funcionalidades Implementadas

### Usuários
- ✅ Cadastro de usuários
- ✅ Login com JWT
- ✅ Validação de senha forte
- ✅ Gerenciamento de perfil
- ✅ Sistema de roles (USER/ADMIN)

### Tarefas
- ✅ CRUD completo de tarefas
- ✅ Status das tarefas (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- ✅ Filtros por status e data
- ✅ Validação de propriedade (usuários só veem suas tarefas)

### Segurança
- ✅ Autenticação JWT
- ✅ Validação de entrada com class-validator
- ✅ Senhas criptografadas com bcrypt
- ✅ Secrets gerenciados via AWS Secrets Manager
- ✅ CORS configurado

## 🌐 Deploy e Infraestrutura

### URL da API em Produção
```
http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com
```

### Documentação Swagger
```
http://newway-challenge-alb-499076483.sa-east-1.elb.amazonaws.com/doc/api
```

### Infraestrutura AWS Criada
- **VPC** com subnets públicas e privadas
- **ECS Cluster** com service Fargate
- **RDS PostgreSQL** em subnet privada
- **Application Load Balancer** para distribuição de tráfego
- **ECR Repository** para imagens Docker
- **Secrets Manager** para credenciais
- **CloudWatch Logs** para monitoramento

## 📊 Métricas de Qualidade

### Cobertura de Testes
- Testes unitários implementados
- Testes e2e configurados
- Jest como framework de testes

### Código
- **ESLint** + **Prettier** para padronização
- **TypeScript** para type safety
- **Prisma** para type-safe database queries
- **Swagger** para documentação automática

## 🎯 Pontos Fortes do Projeto

1. **Arquitetura Limpa**: Separação clara entre camadas (domain, application, infrastructure)
2. **Infraestrutura como Código**: Terraform completo para AWS
3. **Segurança**: JWT, validações, secrets gerenciados
4. **Documentação**: Swagger interativo e README detalhado
5. **Containerização**: Docker com multi-stage build
6. **CI/CD Ready**: Estrutura preparada para pipelines
7. **Escalabilidade**: ECS Fargate com load balancer
8. **Monitoramento**: CloudWatch logs configurado

## 🔄 Processo de Deploy

1. **Build da imagem Docker**
2. **Push para ECR**
3. **Deploy via Terraform**
4. **Migrations automáticas**
5. **Seed do usuário admin**

## 📝 Comandos de Desenvolvimento

```bash
# Local com Docker
docker-compose up --build
yarn migrate:seed

# Testes
yarn docker:test

# Produção
terraform apply
```

## 🎉 Conclusão

O projeto demonstra:
- **Conhecimento sólido** em Nest.js e TypeScript
- **Experiência com AWS** e infraestrutura como código
- **Boas práticas** de desenvolvimento e arquitetura
- **Capacidade de aprendizado** (Terraform aprendido durante o projeto)
- **Visão de produto** com documentação e deploy funcionais

A API está **100% funcional** em produção e pronta para uso, com todas as funcionalidades solicitadas implementadas e documentadas.

---

**Desenvolvedor:** Bruno Nascimento
**Repositório:** https://github.com/bnkcodes/newway-challenge-api
**Data:** Janeiro 2024
