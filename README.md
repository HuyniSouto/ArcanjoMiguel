# 🙏 Arcanjo Miguel - Sistema de Gerenciamento

Sistema de gerenciamento para Igreja Arcanjo Miguel. Aplicação web full-stack com autenticação, contribuições, pedidos de oração, testemunhos, loja interna e painel administrativo.

## ✨ Características

- ✅ **Autenticação** - Login/logout de usuários
- ✅ **Contribuições** - Gerenciar doações, dízimos, ofertas
- ✅ **Pedidos de Oração** - Criar e comentar em pedidos
- ✅ **Testemunhos** - Compartilhar testemunhos (com moderação)
- ✅ **Agendamento de Visitas** - Agendar visitas (com aprovação)
- ✅ **Loja Interna** - Vender produtos da igreja
- ✅ **Despesas** - Registrar despesas da igreja
- ✅ **Anúncios** - Publicar anúncios e avisos
- ✅ **Dashboard Admin** - Painel administrativo

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Banco de Dados**: MySQL + Drizzle ORM
- **Autenticação**: JWT
- **Gerenciador de Pacotes**: npm

## 📋 Pré-requisitos

### Obrigatório
- **Node.js** 16+ (download: https://nodejs.org/)
- **MySQL Workbench** (já configurado e rodando)
- **Visual Studio Code** (recomendado)

### Configuração do MySQL
- Servidor: `localhost:3306`
- Usuário: `root`
- Senha: `root`
- Banco de dados: será criado automaticamente

## 🚀 Instalação Rápida

### 1️⃣ Clonar/Extrair o Projeto

```bash
# Se estiver em um arquivo ZIP, extraia-o
# Navegue até a pasta do projeto
cd arcanjo_miguel_windows
```

### 2️⃣ Verificar Arquivo .env

O arquivo `.env` já está pronto para usar com as configurações corretas:

```env
DATABASE_URL=mysql://root:root@localhost:3306/arcanjo_miguel
PORT=3000
NODE_ENV=development
JWT_SECRET=chave_secreta_super_segura_arcanjo_miguel_2026
```

**Não precisa fazer nada!** Apenas verifique se o arquivo `.env` existe na pasta do projeto.

### 3️⃣ Criar Banco de Dados

**Opção A: Usando MySQL Workbench (Recomendado)**

1. Abra o MySQL Workbench
2. Conecte com: `root` / `root` em `localhost:3306`
3. Vá em: **File** → **Open SQL Script**
4. Selecione o arquivo: `database/init.sql`
5. Clique em **Execute** (ou pressione Ctrl+Shift+Enter)
6. Pronto! O banco foi criado com todas as tabelas

**Opção B: Usando Command Prompt**

```bash
# Abra o Command Prompt (cmd) como administrador
mysql -u root -p < database/init.sql
# Digite a senha quando solicitado: root
```

### 4️⃣ Instalar Dependências

```bash
# Abra o Command Prompt (cmd) na pasta do projeto
npm install
```

### 5️⃣ Iniciar o Servidor

**Opção A: Duplo clique no script (Mais fácil)**

```bash
# Simplesmente duplo clique em:
start.cmd
```

**Opção B: Command Prompt Manual**

```bash
# Abra o Command Prompt na pasta do projeto
npm run dev
```

### 6️⃣ Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

## 📝 Como Usar

### Primeiro Login

1. Acesse `http://localhost:3000`
2. Digite um ID de usuário (ex: `user123`)
3. Digite seu nome (opcional)
4. Digite seu email (opcional)
5. Clique em "Entrar"

### Usuário Admin

Para ter acesso ao painel administrativo, você precisa ser um admin. Por padrão, o primeiro usuário criado é admin.

Para criar um admin manualmente no MySQL:

```sql
UPDATE users SET role = 'admin' WHERE openId = 'seu_id_aqui';
```

## 📂 Estrutura do Projeto

```
arcanjo_miguel_windows/
├── client/                    # Frontend (HTML, CSS, JavaScript)
│   ├── index.html            # Página principal
│   ├── css/
│   │   └── style.css         # Estilos CSS simples
│   └── js/
│       ├── app.js            # Aplicação principal
│       └── api.js            # Funções de API
├── server/                    # Backend (Node.js + Express)
│   ├── index.js              # Servidor principal
│   ├── auth.js               # Autenticação JWT
│   ├── db.js                 # Conexão e queries do banco
│   └── routes/               # Rotas da API
│       ├── auth.js           # Rotas de autenticação
│       ├── users.js          # Rotas de usuários
│       ├── campaigns.js      # Rotas de campanhas
│       ├── contributions.js  # Rotas de contribuições
│       ├── prayers.js        # Rotas de orações
│       ├── testimonies.js    # Rotas de testemunhos
│       ├── visits.js         # Rotas de visitas
│       ├── store.js          # Rotas da loja
│       ├── expenses.js       # Rotas de despesas
│       └── announcements.js  # Rotas de anúncios
├── database/                  # Banco de dados
│   ├── schema.js             # Schema do Drizzle ORM
│   └── init.sql              # Script de criação do banco
├── package.json              # Dependências npm
├── .env.example              # Exemplo de variáveis de ambiente
├── .env                      # Variáveis de ambiente (não commitar)
├── .gitignore                # Arquivos ignorados pelo Git
├── drizzle.config.js         # Configuração do Drizzle ORM
├── start.cmd                 # Script de inicialização (Windows)
└── README.md                 # Este arquivo
```

## 🔌 API REST

### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "openId": "user123",
  "name": "João Silva",
  "email": "joao@email.com"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "openId": "user123",
    "name": "João Silva",
    "role": "user"
  }
}
```

### Usar Token em Requisições

```http
GET /api/users/me
Authorization: Bearer eyJhbGc...
```

### Endpoints Disponíveis

#### Públicos
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/verify` - Verificar token

#### Protegidos (requerem autenticação)
- `GET /api/users/me` - Obter usuário autenticado
- `GET /api/campaigns` - Listar campanhas
- `GET /api/contributions` - Listar contribuições do usuário
- `GET /api/prayers` - Listar pedidos de oração
- `GET /api/testimonies` - Listar testemunhos aprovados
- `GET /api/store/products` - Listar produtos da loja
- `GET /api/announcements` - Listar anúncios

#### Admin (requerem autenticação + role admin)
- `GET /api/contributions/all` - Listar todas as contribuições
- `GET /api/prayers/all` - Listar todos os pedidos
- `GET /api/testimonies/all` - Listar todos os testemunhos
- `GET /api/visits/all` - Listar todos os agendamentos
- `GET /api/expenses` - Listar despesas

## 🐛 Troubleshooting

### Erro: "Node.js não está instalado"

**Solução**: Instale Node.js de https://nodejs.org/ (versão LTS recomendada)

### Erro: "Banco de dados não conectado"

**Solução**: 
1. Certifique-se de que MySQL Workbench está rodando
2. Verifique as credenciais no arquivo `.env`
3. Execute o script `database/init.sql` para criar o banco

### Erro: "Porta 3000 já está em uso"

**Solução**: 
1. Mude a porta no arquivo `.env`: `PORT=3001`
2. Ou feche a aplicação que está usando a porta 3000

### Erro: "npm: comando não encontrado"

**Solução**: 
1. Instale Node.js de https://nodejs.org/
2. Reinicie o Command Prompt
3. Verifique com: `npm --version`

### Erro ao instalar dependências

**Solução**:
1. Delete a pasta `node_modules` e arquivo `package-lock.json`
2. Execute: `npm install` novamente
3. Se persistir, tente: `npm install --legacy-peer-deps`

## 📚 Documentação Adicional

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | URL de conexão MySQL | `mysql://root:root@localhost:3306/arcanjo_miguel` |
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente (development/production) | `development` |
| `JWT_SECRET` | Chave secreta para JWT | `chave_secreta_super_segura_arcanjo_miguel_2026` |

### Banco de Dados

O banco de dados é criado automaticamente ao executar `database/init.sql`. Tabelas incluem:

- **users** - Usuários do sistema
- **campaigns** - Campanhas de doações
- **contributions** - Contribuições financeiras
- **prayerRequests** - Pedidos de oração
- **messages** - Mensagens em pedidos de oração
- **testimonies** - Testemunhos
- **visitSchedules** - Agendamentos de visitas
- **storeProducts** - Produtos da loja
- **storePurchases** - Compras na loja
- **expenses** - Despesas da igreja
- **announcements** - Anúncios
- **dailyVerses** - Versículos do dia

## 🤝 Suporte

Para problemas ou dúvidas:

1. Verifique este README
2. Verifique os logs no console
3. Verifique o arquivo `.env`
4. Reinicie o servidor

## 📄 Licença

MIT

## 🙏 Agradecimentos

Sistema desenvolvido para a Igreja Arcanjo Miguel.

---

**Última atualização**: Março 2026
**Versão**: 1.0.0
**Status**: Pronto para uso local
