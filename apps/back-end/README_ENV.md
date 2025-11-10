# Configuração de Variáveis de Ambiente - Backend

## Arquivos de Ambiente

O projeto utiliza arquivos `.env` para configurar variáveis de ambiente. Os arquivos são:

- `.env` - Arquivo local (não commitado no Git)
- `.env.example` - Template de exemplo (commitado no Git)

## Como Configurar

1. Copie o arquivo de exemplo para criar seu arquivo local:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e ajuste as variáveis conforme necessário.

## Variáveis Disponíveis

### Database Configuration

#### `DB_HOST`
Host do banco de dados PostgreSQL.

**Valor padrão:** `localhost`

**Para Docker:** `postgres`

**Exemplo:**
```env
DB_HOST=localhost
```

#### `DB_PORT`
Porta do banco de dados PostgreSQL.

**Valor padrão:** `5432`

**Exemplo:**
```env
DB_PORT=5432
```

#### `DB_USERNAME`
Usuário do banco de dados.

**Valor padrão:** `postgres`

**Exemplo:**
```env
DB_USERNAME=postgres
```

#### `DB_PASSWORD`
Senha do banco de dados.

**Valor padrão:** `postgres`

**⚠️ IMPORTANTE:** Altere em produção!

**Exemplo:**
```env
DB_PASSWORD=senha_segura_aqui
```

#### `DB_DATABASE`
Nome do banco de dados.

**Valor padrão:** `clients_db`

**Exemplo:**
```env
DB_DATABASE=clients_db
```

### JWT Configuration

#### `JWT_SECRET`
Chave secreta para assinar tokens JWT.

**Valor padrão:** `your-secret-key-change-in-production`

**⚠️ IMPORTANTE:** Altere em produção para uma chave segura e aleatória!

**Exemplo:**
```env
JWT_SECRET=minha-chave-secreta-super-segura-aqui
```

#### `JWT_EXPIRES_IN`
Tempo de expiração do token JWT.

**Valor padrão:** `1d` (1 dia)

**Formatos aceitos:** `1d`, `24h`, `3600s`, etc.

**Exemplo:**
```env
JWT_EXPIRES_IN=1d
```

### Server Configuration

#### `PORT`
Porta em que o servidor NestJS irá rodar.

**Valor padrão:** `3000`

**Exemplo:**
```env
PORT=3000
```

#### `NODE_ENV`
Ambiente de execução.

**Valores possíveis:** `development`, `production`, `test`

**Valor padrão:** `development`

**Exemplo:**
```env
NODE_ENV=development
```

### Logging

#### `LOG_LEVEL`
Nível de log do Winston.

**Valores possíveis:** `error`, `warn`, `info`, `verbose`, `debug`, `silly`

**Valor padrão:** `info`

**Exemplo:**
```env
LOG_LEVEL=info
```

### CORS Configuration

#### `FRONTEND_URL`
URL do frontend para configuração de CORS.

**Valor padrão:** `http://localhost:5173`

**Exemplo:**
```env
FRONTEND_URL=http://localhost:5173
```

## Configuração para Docker

Quando usando Docker Compose, as variáveis do arquivo `.env` são automaticamente carregadas. O `docker-compose.yml` já está configurado para usar essas variáveis.

**Nota:** No Docker, `DB_HOST` deve ser `postgres` (nome do serviço no docker-compose), não `localhost`.

## Uso no Código

As variáveis são acessadas através de `process.env`:

```typescript
const dbHost = process.env.DB_HOST || 'localhost';
```

O NestJS carrega automaticamente o arquivo `.env` através do `ConfigModule` configurado no `app.module.ts`.

## Segurança

- **NUNCA** commit o arquivo `.env` no Git (já está no `.gitignore`).
- Use o arquivo `.env.example` como template.
- Em produção, use variáveis de ambiente do sistema ou um gerenciador de segredos.
- Altere `JWT_SECRET` e `DB_PASSWORD` para valores seguros em produção.

## Exemplo de Arquivo .env para Produção

```env
# Database
DB_HOST=seu-host-postgres
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=senha_super_segura
DB_DATABASE=clients_db_prod

# JWT
JWT_SECRET=chave-super-secreta-aleatoria-aqui
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=production

# Logging
LOG_LEVEL=warn

# CORS
FRONTEND_URL=https://seu-frontend.com
```

