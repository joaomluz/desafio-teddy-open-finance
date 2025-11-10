# Arquitetura do Sistema

## Visão Geral

O sistema é um monorepo organizado com Nx.dev, contendo aplicações front-end e back-end independentes, cada uma com sua própria configuração Docker.

## Componentes Principais

### Front-End (React + Vite)

- **Tecnologia**: React 18, Vite, TypeScript
- **Porta**: 5173
- **Estrutura**:
  - `src/app/` - Rotas e layouts
  - `src/features/` - Features modulares (auth, clients, dashboard)
  - `src/shared/` - Componentes e utilitários compartilhados

### Back-End (NestJS)

- **Tecnologia**: NestJS, TypeORM, PostgreSQL
- **Porta**: 3000
- **Estrutura Modular**:
  - `auth/` - Autenticação JWT
  - `clients/` - CRUD de clientes
  - `dashboard/` - Estatísticas e métricas
  - `metrics/` - Contador de views e métricas Prometheus
  - `common/` - Interceptors, filters, pipes

### Banco de Dados

- **PostgreSQL 15+**
- **Tabelas**:
  - `users` - Usuários do sistema
  - `clients` - Clientes (com soft delete)
  - `view_counts` - Contador de visualizações

## Fluxo de Dados

### Autenticação

```
1. Front-End → POST /auth/login (email, password)
2. Back-End → Valida credenciais → Gera JWT
3. Front-End → Armazena token no localStorage
4. Front-End → Inclui token em todas as requisições (Bearer)
```

### CRUD de Clientes

```
1. Front-End → GET /clients (com JWT)
2. Back-End → Valida JWT → Retorna lista
3. Front-End → Exibe lista

1. Front-End → GET /clients/:id (com JWT)
2. Back-End → Valida JWT → Incrementa contador → Retorna cliente
3. Front-End → Exibe detalhes com contador
```

### Dashboard

```
1. Front-End → GET /dashboard/stats (com JWT)
2. Back-End → Calcula estatísticas → Retorna dados
3. Front-End → Renderiza gráficos e cards
```

## Observabilidade

### Logs Estruturados

- **Formato**: JSON
- **Biblioteca**: Winston
- **Conteúdo**:
  - Timestamp
  - Nível (info, error, warn)
  - Mensagem
  - Contexto (método, URL, status, tempo de resposta)

### Healthcheck

- **Endpoint**: `/healthz`
- **Retorna**:
  - Status da aplicação
  - Timestamp
  - Uptime

### Métricas Prometheus

- **Endpoint**: `/metrics`
- **Formato**: Prometheus exposition format
- **Métricas**:
  - `client_views_total` - Contador de views por cliente
  - Métricas padrão do Node.js

## Segurança

- **Autenticação**: JWT com expiração configurável
- **Validação**: class-validator nos DTOs
- **CORS**: Configurado para front-end específico
- **Senhas**: Hash com bcrypt (10 rounds)

## Escalabilidade

### Local (Atual)

- Front-end: Vite dev server
- Back-end: NestJS single instance
- Banco: PostgreSQL local

### AWS (Proposta)

- **Front-end**: S3 + CloudFront (CDN global)
- **Back-end**: ECS Fargate (auto-scaling)
- **Banco**: RDS PostgreSQL (Multi-AZ, read replicas)
- **Cache**: ElastiCache Redis
- **Load Balancer**: ALB/NLB
- **Monitoramento**: CloudWatch + X-Ray

## CI/CD

### GitHub Actions

- **Front-end Pipeline**:
  - Lint
  - Testes unitários
  - Build

- **Back-end Pipeline**:
  - Lint
  - Testes unitários
  - Build
  - Testes E2E (com PostgreSQL em container)

## Dependências Principais

### Front-End
- react, react-dom
- react-router-dom
- axios
- react-hook-form, zod
- recharts
- vitest

### Back-End
- @nestjs/core, @nestjs/common
- @nestjs/typeorm, typeorm
- @nestjs/jwt, passport-jwt
- @nestjs/swagger
- winston, nest-winston
- prom-client
- pg (PostgreSQL driver)
- bcrypt
- class-validator, class-transformer

## Próximos Passos

1. Adicionar Redis para cache
2. Implementar rate limiting
3. Adicionar testes E2E completos
4. Configurar deploy automatizado
5. Adicionar monitoramento com Grafana
6. Implementar traces com OpenTelemetry

