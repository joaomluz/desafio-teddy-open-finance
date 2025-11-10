FROM node:18-alpine

# Instalar dependências de build necessárias para módulos nativos (bcrypt)
RUN apk add --no-cache python3 make g++ netcat-openbsd

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (sem --ignore-scripts para compilar bcrypt)
RUN npm install

# Copiar código fonte
COPY . .

EXPOSE 3000

# Script de inicialização melhorado
CMD sh -c "echo '⏳ Aguardando PostgreSQL estar pronto...' && \
  export DB_HOST=postgres && \
  until nc -z postgres 5432; do \
    echo 'Aguardando PostgreSQL em postgres:5432...'; \
    sleep 2; \
  done && \
  echo '✅ PostgreSQL está pronto!' && \
  sleep 2 && \
  echo '📦 Executando migrations...' && \
  DB_HOST=postgres npm run migration:run && \
  echo '✅ Migrations executadas com sucesso!' && \
  echo '🚀 Iniciando aplicação NestJS...' && \
  DB_HOST=postgres npm run start:dev"