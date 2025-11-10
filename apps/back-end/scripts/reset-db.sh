#!/bin/sh
# Script para limpar o banco de dados (útil em desenvolvimento)

echo "⚠️  ATENÇÃO: Este script vai DELETAR todos os dados do banco de dados!"
echo "Pressione Ctrl+C para cancelar ou aguarde 5 segundos..."
sleep 5

echo "🔄 Parando containers..."
docker-compose down

echo "🗑️  Removendo volume do PostgreSQL..."
docker volume rm desafio_postgres_data 2>/dev/null || docker volume rm back-end_postgres_data 2>/dev/null || echo "Volume não encontrado ou já foi removido"

echo "✅ Banco de dados limpo! Agora você pode iniciar os containers novamente com:"
echo "   docker-compose up --build"

