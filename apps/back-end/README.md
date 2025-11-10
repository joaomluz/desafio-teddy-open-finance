# Back-End - Sistema de Clientes

API REST desenvolvida com NestJS, TypeORM e PostgreSQL.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Winston** - Logs estruturados
- **Prometheus** - Métricas

## 📁 Estrutura

```
src/
├── app.module.ts          # Módulo raiz
├── main.ts                # Entry point
├── config/                # Configurações
├── common/                # Interceptors, filters, pipes
├── auth/                  # Módulo de autenticação
├── clients/               # Módulo de clientes
├── metrics/               # Contador de views
└── migrations/            # Migrações do banco
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Instalação

```bash
npm install
```

### Configuração

Copie `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

### Executar localmente

1. Inicie o PostgreSQL
2. Execute as migrações:
   ```bash
   npm run migration:run
   ```
3. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

A API estará disponível em `http://localhost:3000`
Swagger em `http://localhost:3000/docs`

### Executar com Docker

```bash
docker-compose up
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 📦 Build

```bash
npm run build
npm run start:prod
```

## 🔗 Endpoints

- `POST /auth/login` - Autenticação
- `POST /clients` - Criar cliente (auth)
- `GET /clients` - Listar clientes (auth)
- `GET /clients/:id` - Detalhes do cliente (auth)
- `PUT /clients/:id` - Atualizar cliente (auth)
- `DELETE /clients/:id` - Excluir cliente (soft delete, auth)
- `GET /healthz` - Healthcheck
- `GET /metrics` - Métricas Prometheus
- `GET /docs` - Documentação Swagger

## 🔐 Credenciais Padrão

- Email: `admin@example.com`
- Senha: `admin123`

