# Guia de Instalação

## Opção 1: Docker Compose (Recomendado)

### Front-End

```bash
cd apps/front-end
docker-compose up --build
```

Acesse: http://localhost:5173

### Back-End

```bash
cd apps/back-end
docker-compose up --build
```

Acesse:
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Healthcheck: http://localhost:3000/healthz
- Métricas: http://localhost:3000/metrics

## Opção 2: Instalação Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Passo 1: Instalar dependências

```bash
# Na raiz do projeto
npm install

# Front-end
cd apps/front-end
npm install

# Back-end
cd ../back-end
npm install
```

### Passo 2: Configurar Back-End

```bash
cd apps/back-end
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=clients_db
JWT_SECRET=seu-secret-key-aqui
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### Passo 3: Configurar Banco de Dados

```bash
# Criar banco de dados
createdb clients_db

# Executar migrações
cd apps/back-end
npm run migration:run
```

### Passo 4: Iniciar Back-End

```bash
cd apps/back-end
npm run start:dev
```

### Passo 5: Configurar Front-End

```bash
cd apps/front-end
cp .env.example .env
```

O arquivo `.env` já está configurado por padrão, mas você pode ajustar:

```env
VITE_API_URL=http://localhost:3000
```

### Passo 6: Iniciar Front-End

```bash
cd apps/front-end
npm run dev
```

## Verificação

1. Acesse http://localhost:5173
2. Faça login com:
   - Email: `admin@example.com`
   - Senha: `admin123`
3. Você deve ver o dashboard

## Troubleshooting

### Erro de conexão com banco

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `psql -U postgres -d clients_db`

### Erro de CORS

- Verifique se `FRONTEND_URL` no back-end está correto
- Por padrão: `http://localhost:5173`

### Erro de migração

- Certifique-se de que o banco existe
- Verifique as permissões do usuário PostgreSQL
- Tente executar manualmente: `npm run migration:run`

