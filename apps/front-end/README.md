# Front-End - Sistema de Clientes

Aplicação front-end desenvolvida com React + Vite + TypeScript.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React Router** - Roteamento
- **React Hook Form + Zod** - Formulários e validação
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **Vitest** - Testes unitários

## 📁 Estrutura

```
src/
├── app/              # Rotas e layouts
├── features/         # Features da aplicação
│   ├── auth/        # Autenticação
│   ├── clients/     # CRUD de clientes
│   └── dashboard/   # Dashboard/Admin
├── shared/          # Componentes, hooks e libs compartilhadas
└── test/            # Configuração de testes
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
npm install
```

### Executar localmente

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Executar com Docker

```bash
docker-compose up
```

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com UI
npm run test:ui

# Cobertura
npm run test:coverage
```

## 📦 Build

```bash
npm run build
```

## 🔧 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

- `VITE_API_URL` - URL da API backend (padrão: http://localhost:3000)

