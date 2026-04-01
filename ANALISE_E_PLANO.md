# Análise do Projeto Arcanjo Miguel e Plano de Reestruturação

## 📋 O QUE FOI ENCONTRADO

### Estrutura Atual
O projeto é uma aplicação full-stack com:
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Express.js + tRPC + Node.js
- **Banco de Dados**: MySQL com Drizzle ORM
- **Gerenciador de Pacotes**: pnpm
- **Dependências Manus**: vite-plugin-manus-runtime (específica da Manus)

### Arquitetura Atual
```
arcanjo_miguel/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── main.tsx       # Entry point
│   │   ├── App.tsx        # Router principal
│   │   ├── pages/         # Páginas (Home, Contributions, etc)
│   │   ├── components/    # Componentes React
│   │   └── index.css      # Estilos Tailwind
│   └── index.html         # HTML com Vite
├── server/                # Backend Express
│   ├── _core/
│   │   ├── index.ts       # Servidor principal
│   │   ├── vite.ts        # Integração com Vite
│   │   ├── oauth.ts       # OAuth (Manus)
│   │   └── ...
│   ├── routers/           # Rotas tRPC
│   └── db.ts              # Queries do banco
├── drizzle/               # Schema e migrations
│   ├── schema.ts          # Definição das tabelas
│   └── migrations/
├── shared/                # Código compartilhado
├── package.json           # pnpm
├── vite.config.ts         # Configuração Vite
└── tsconfig.json          # TypeScript
```

### Dependências Críticas a Remover
1. **Vite** e plugins relacionados
2. **Tailwind CSS** (será substituído por CSS simples)
3. **pnpm** (será substituído por npm)
4. **vite-plugin-manus-runtime** (específica da Manus)
5. **@radix-ui/** (componentes complexos - usar HTML nativo)
6. **tRPC** (será simplificado para REST API simples)
7. **React** (será mantido ou removido - depende da complexidade)

### Banco de Dados
- **Tipo**: MySQL
- **ORM**: Drizzle ORM
- **Tabelas**: 12 tabelas (users, campaigns, contributions, prayerRequests, messages, testimonies, visitSchedules, storeProducts, storePurchases, expenses, announcements, dailyVerses)
- **Conexão**: DATABASE_URL (ambiente)
- **Status**: O banco NÃO é criado automaticamente - precisa ser criado manualmente

## ✅ FUNCIONALIDADES DO PROJETO

O projeto é um sistema de gerenciamento para uma Igreja (Arcanjo Miguel) com:

1. **Autenticação** - Login/logout de usuários
2. **Contribuições** - Gerenciar doações, dízimos, ofertas
3. **Pedidos de Oração** - Criar e comentar em pedidos
4. **Testemunhos** - Compartilhar testemunhos (com moderação)
5. **Agendamento de Visitas** - Agendar visitas (com aprovação)
6. **Loja Interna** - Vender produtos da igreja
7. **Despesas** - Registrar despesas da igreja
8. **Anúncios** - Publicar anúncios e avisos
9. **Versículos Diários** - Mostrar versículos do dia
10. **Dashboard Admin** - Painel administrativo

## 🔄 PLANO DE REESTRUTURAÇÃO

### Fase 1: Remover Vite e Tailwind
- ❌ Remover `vite.config.ts`
- ❌ Remover `@tailwindcss/vite` e `tailwindcss`
- ❌ Remover `@vitejs/plugin-react`
- ✅ Criar estrutura de CSS simples (sem Tailwind)
- ✅ Atualizar `package.json` (remover scripts Vite)

### Fase 2: Remover pnpm e converter para npm
- ❌ Remover `pnpm-lock.yaml`
- ✅ Converter `package.json` para npm
- ✅ Remover `packageManager: pnpm`

### Fase 3: Simplificar Frontend
- ❌ Remover `@radix-ui/*` (usar HTML nativo)
- ❌ Remover `tRPC` (usar fetch simples)
- ✅ Manter React (mais simples que converter para vanilla JS)
- ✅ Usar `fetch` ao invés de tRPC client
- ✅ Criar API REST simples no backend

### Fase 4: Simplificar Backend
- ❌ Remover `@trpc/server` e adapters
- ❌ Remover `vite-plugin-manus-runtime`
- ✅ Manter Express.js
- ✅ Criar rotas REST simples
- ✅ Manter Drizzle ORM (funciona bem com MySQL)

### Fase 5: Banco de Dados
- ✅ Manter Drizzle ORM
- ✅ Criar script SQL para criar banco e tabelas
- ✅ Criar arquivo `.env.example` com instruções

### Fase 6: Compatibilidade Windows
- ✅ Remover scripts com `NODE_ENV=development` (usar `set` no Windows)
- ✅ Usar `cross-env` para compatibilidade
- ✅ Remover paths Unix-specific
- ✅ Usar `localhost:3306` para MySQL

## 📦 NOVA ESTRUTURA

```
arcanjo_miguel-windows/
├── client/
│   ├── index.html         # HTML simples (sem Vite)
│   ├── css/
│   │   └── style.css      # CSS simples
│   ├── js/
│   │   ├── app.js         # App principal
│   │   ├── api.js         # Funções fetch
│   │   └── pages/         # Lógica de páginas
│   └── public/            # Assets estáticos
├── server/
│   ├── index.js           # Servidor Express
│   ├── routes/            # Rotas REST
│   ├── db.js              # Conexão MySQL
│   └── middleware/        # Middlewares
├── database/
│   ├── schema.sql         # Script para criar banco
│   └── seed.sql           # Dados iniciais (opcional)
├── .env.example           # Variáveis de ambiente
├── .env                   # Variáveis locais (gitignore)
├── package.json           # npm (sem pnpm)
├── README.md              # Instruções de setup
└── start.cmd              # Script para Windows
```

## 🎯 PRÓXIMOS PASSOS

1. **Criar nova estrutura de pastas**
2. **Converter React para JavaScript/HTML simples** (ou manter React com webpack simples)
3. **Converter tRPC para REST API simples**
4. **Remover todas as dependências Manus**
5. **Criar script SQL para banco de dados**
6. **Criar instruções de setup para Windows**
7. **Testar localmente**

## ⚠️ DECISÕES IMPORTANTES

### Manter ou Remover React?
- **Opção 1**: Manter React (mais fácil, menos mudanças no código)
- **Opção 2**: Converter para vanilla JavaScript (mais simples, menos dependências)

**Recomendação**: Manter React, pois o código já está estruturado assim e a conversão seria muito complexa.

### Banco de Dados
- O banco NÃO é criado automaticamente
- Precisa criar manualmente no MySQL Workbench ou via script SQL
- Drizzle ORM será mantido (funciona bem)

### Autenticação
- Remover OAuth Manus
- Implementar autenticação simples (JWT ou sessão)

---

**Status**: Pronto para começar a reestruturação
