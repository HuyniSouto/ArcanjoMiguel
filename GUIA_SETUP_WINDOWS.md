# 📖 Guia Completo de Setup - Arcanjo Miguel no Windows

## 🎯 Objetivo

Este guia vai te ajudar a configurar e rodar o projeto **Arcanjo Miguel** localmente no seu computador Windows, usando Node.js e MySQL Workbench.

## ⚠️ Importante: Leia Primeiro!

- **Você NÃO precisa de admin**: O projeto foi configurado para rodar sem privilégios de administrador
- **Você NÃO precisa de XAMPP/WAMP**: Vai usar o MySQL Workbench que já está configurado
- **Você NÃO precisa de pnpm**: Vamos usar npm (que vem com Node.js)
- **Você NÃO precisa de Vite**: Já removemos tudo de Vite e Tailwind CSS

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. ✅ **Node.js** (versão 16 ou superior)
2. ✅ **MySQL Workbench** (já rodando e configurado)
3. ✅ **Visual Studio Code** (recomendado, mas opcional)

### Verificar se tem Node.js instalado

Abra o **Command Prompt** (cmd) e digite:

```cmd
node --version
npm --version
```

Se aparecer a versão (ex: `v18.0.0`), está tudo bem. Senão, instale em https://nodejs.org/

## 🚀 Passo a Passo

### PASSO 1: Extrair o Projeto

1. Você recebeu um arquivo chamado `arcanjo_miguel_windows.zip`
2. Clique com botão direito → **Extrair tudo**
3. Escolha uma pasta (ex: `C:\Users\SeuNome\Desktop\arcanjo_miguel_windows`)
4. Clique em **Extrair**

### PASSO 2: Abrir no Visual Studio Code

1. Abra o Visual Studio Code
2. Vá em **File** → **Open Folder**
3. Selecione a pasta `arcanjo_miguel_windows`
4. Clique em **Selecionar Pasta**

### PASSO 3: Criar o Banco de Dados

**Nota**: O arquivo `.env` já está pronto na pasta do projeto! Não precisa fazer nada com ele.

#### Executar o Script SQL

1. Abra o **MySQL Workbench**
2. Conecte com: `root` / `root` em `localhost:3306`
3. Vá em **File** → **Open SQL Script**
4. Navegue até a pasta do projeto e abra: `database/init.sql`
5. Você vai ver um script SQL
6. Clique no botão **Execute** (ou pressione `Ctrl+Shift+Enter`)
7. Pronto! O banco foi criado com todas as tabelas

**Prova de sucesso**: Na aba **Schemas** do Workbench, você vai ver um banco chamado `arcanjo_miguel`

### PASSO 4: Instalar Dependências

1. No VS Code, abra o terminal integrado: **Terminal** → **New Terminal**
2. Certifique-se de que está na pasta do projeto (deve aparecer `arcanjo_miguel_windows>`)
3. Digite:

```cmd
npm install
```

4. Espere terminar (pode levar alguns minutos)
5. Você vai ver muitas linhas de instalação, é normal

**Prova de sucesso**: Vai aparecer `added XXX packages` no final

### PASSO 5: Iniciar o Servidor

Agora você tem duas opções:

#### OPÇÃO A: Duplo clique (Mais fácil)

1. Na pasta do projeto, procure por um arquivo chamado `start.cmd`
2. Duplo clique nele
3. Uma janela preta vai abrir (Command Prompt)
4. Você vai ver mensagens como:
```
🚀 Iniciando servidor...
Acesse: http://localhost:3000
```

#### OPÇÃO B: Usar o Terminal do VS Code

1. No VS Code, abra o terminal: **Terminal** → **New Terminal**
2. Digite:

```cmd
npm run dev
```

3. Você vai ver:
```
[Server] Banco de dados conectado com sucesso
[Server] Servidor rodando em http://localhost:3000
```

### PASSO 6: Acessar a Aplicação

1. Abra seu navegador (Chrome, Firefox, Edge, etc)
2. Digite na barra de endereço:

```
http://localhost:3000
```

3. Você vai ver a tela de login
4. Digite qualquer ID (ex: `user123`)
5. Digite seu nome (ex: `João Silva`)
6. Clique em **Entrar**

**Pronto! Você está dentro da aplicação! 🎉**

## 🔑 Fazer Login

### Primeiro Login

1. Abra `http://localhost:3000`
2. Preencha os campos:
   - **ID de Usuário**: Digite qualquer ID (ex: `user123`, `admin`, `joao`, etc)
   - **Nome**: Seu nome (opcional)
   - **Email**: Seu email (opcional)
3. Clique em **Entrar**

### Usuário Admin

Para ter acesso ao painel administrativo, você precisa ser um admin.

**Para criar um admin**:

1. Abra o MySQL Workbench
2. Clique em **File** → **Open SQL Script**
3. Crie um novo arquivo com este conteúdo:

```sql
UPDATE usuarios SET funcao = 'admin' WHERE openId = 'seu_id_aqui';
```

4. Substitua `seu_id_aqui` pelo ID que você usou no login (ex: `user123`)
5. Execute o script
6. Faça login novamente e você terá acesso ao painel admin

## 🛑 Parar o Servidor

### Se usou `start.cmd`
- Feche a janela preta do Command Prompt

### Se usou `npm run dev` no VS Code
- Pressione `Ctrl+C` no terminal
- Digite `Y` e pressione Enter

## ❌ Troubleshooting

### Problema: "Node.js não está instalado"

**Solução**:
1. Instale Node.js em https://nodejs.org/
2. Escolha a versão **LTS** (recomendada)
3. Siga o instalador
4. **Reinicie o Command Prompt**
5. Verifique com: `node --version`

### Problema: "Banco de dados não conectado"

**Solução**:
1. Certifique-se de que MySQL Workbench está aberto e rodando
2. Verifique se consegue conectar com `root` / `root`
3. Execute o script `database/init.sql` novamente
4. Reinicie o servidor

### Problema: "Porta 3000 já está em uso"

**Solução**:
1. Abra o arquivo `.env`
2. Mude `PORT=3000` para `PORT=3001`
3. Reinicie o servidor
4. Acesse `http://localhost:3001`

### Problema: "npm: comando não encontrado"

**Solução**:
1. Instale Node.js de https://nodejs.org/
2. **Reinicie o Command Prompt** (feche e abra novamente)
3. Tente novamente

### Problema: "Erro ao instalar dependências"

**Solução**:
1. Delete a pasta `node_modules` (se existir)
2. Delete o arquivo `package-lock.json` (se existir)
3. Execute: `npm install` novamente
4. Se ainda não funcionar, tente: `npm install --legacy-peer-deps`

### Problema: "Erro de conexão ao fazer login"

**Solução**:
1. Verifique se o servidor está rodando (deve aparecer `Servidor rodando em http://localhost:3000`)
2. Verifique se o banco de dados está conectado
3. Reinicie o servidor
4. Limpe o cache do navegador (Ctrl+Shift+Delete)

## 📁 Estrutura de Pastas

```
arcanjo_miguel_windows/
├── client/              # Frontend (o que você vê no navegador)
│   ├── index.html      # Página principal
│   ├── css/            # Estilos CSS
│   └── js/             # Código JavaScript
├── server/             # Backend (servidor)
│   ├── index.js        # Arquivo principal do servidor
│   ├── db.js           # Conexão com banco de dados
│   ├── auth.js         # Autenticação
│   └── routes/         # Rotas da API
├── database/           # Banco de dados
│   ├── init.sql        # Script para criar o banco
│   └── schema.js       # Estrutura das tabelas
├── package.json        # Dependências do projeto
├── .env                # Configurações (já pronto)
├── start.cmd           # Script para iniciar (Windows)
└── README.md           # Documentação
```

## 🎓 Próximos Passos

Depois que o projeto estiver rodando:

1. **Explore a interface** - Clique nos botões e veja como funciona
2. **Crie dados de teste** - Adicione contribuições, orações, etc
3. **Estude o código** - Abra os arquivos em `client/js/` e `server/routes/`
4. **Faça modificações** - Tente adicionar novos recursos

## 📚 Recursos Úteis

### Documentação
- Node.js: https://nodejs.org/docs/
- Express.js: https://expressjs.com/
- MySQL: https://dev.mysql.com/doc/

### Videoaulas (YouTube)
- Node.js para iniciantes
- Express.js tutorial
- MySQL Workbench tutorial
- JavaScript vanilla

## 🆘 Precisa de Ajuda?

1. **Leia o README.md** - Tem mais informações lá
2. **Verifique os logs** - O console mostra mensagens de erro
3. **Verifique o arquivo .env** - Certifique-se de que está correto
4. **Reinicie tudo** - Às vezes ajuda fechar e abrir novamente

## ✅ Checklist Final

Antes de começar a usar, verifique:

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] MySQL Workbench rodando
- [ ] Arquivo `.env` existe (já vem pronto)
- [ ] Banco de dados criado (script `init.sql` executado)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Aplicação acessível em `http://localhost:3000`
- [ ] Conseguiu fazer login

Se tudo está marcado ✅, **parabéns! Você está pronto para usar o Arcanjo Miguel!** 🎉

---

**Dúvidas?** Releia este guia ou consulte o README.md

**Boa sorte! 🙏**
