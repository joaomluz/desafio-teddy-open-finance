#!/bin/sh
# Aguarda o PostgreSQL estar pronto

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "PostgreSQL está indisponível - aguardando..."
  sleep 1
done

>&2 echo "PostgreSQL está disponível - executando comando"
exec $cmd

