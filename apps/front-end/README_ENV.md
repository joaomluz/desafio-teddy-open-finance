# Configuração de Variáveis de Ambiente - Frontend

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

### `VITE_API_URL`
URL da API backend.

**Valor padrão:** `http://localhost:3000`

**Exemplo:**
```env
VITE_API_URL=http://localhost:3000
```

### `VITE_NODE_ENV`
Ambiente de execução.

**Valores possíveis:** `development`, `production`, `test`

**Valor padrão:** `development`

**Exemplo:**
```env
VITE_NODE_ENV=development
```

## Importante

- As variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código do cliente.
- Após alterar as variáveis, reinicie o servidor de desenvolvimento.
- O arquivo `.env` não deve ser commitado no Git (já está no `.gitignore`).

## Uso no Código

As variáveis são acessadas através de `import.meta.env`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

