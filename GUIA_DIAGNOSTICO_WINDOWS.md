# Guia de Diagnóstico - Erro de Conexão Recusada (ERR_CONNECTION_REFUSED)

Se você está vendo o erro `ERR_CONNECTION_REFUSED` ao tentar acessar `http://localhost:3000`, isso significa que o servidor Node.js não está rodando ou não conseguiu iniciar corretamente. Siga os passos abaixo para resolver:

## 1. Verifique se o Servidor está Rodando
O servidor não inicia sozinho ao ligar o computador. Você deve:
1. Abrir a pasta do projeto.
2. Clicar duas vezes no arquivo `start.cmd`.
3. **Mantenha a janela preta (terminal) aberta.** Se você fechar essa janela, o site para de funcionar.

## 2. Verifique se o MySQL está Ligado
O servidor Arcanjo Miguel precisa se conectar ao seu banco de dados MySQL para funcionar.
- Se você usa o **XAMPP**, certifique-se de que o módulo **MySQL** está com o botão "Start" ativado (ficando verde).
- Se você usa o **MySQL Workbench**, verifique se o serviço `MySQL80` (ou similar) está em execução nos Serviços do Windows.

## 3. Verifique as Credenciais no Arquivo `.env`
Abra o arquivo `.env` com o Bloco de Notas e verifique a linha `DATABASE_URL`:
`DATABASE_URL=mysql://USUARIO:SENHA@localhost:3306/arcanjo_miguel`
- Substitua `USUARIO` pelo seu usuário do MySQL (geralmente `root`).
- Substitua `SENHA` pela sua senha do MySQL. Se não tiver senha, deixe vazio: `mysql://root:@localhost:3306/arcanjo_miguel`.

## 4. Como ver o erro real (Se a janela fechar sozinha)
Se ao clicar em `start.cmd` a janela fechar muito rápido, faça o seguinte:
1. Clique na barra de endereços da pasta do projeto, digite `cmd` e aperte Enter.
2. Na janela preta que abrir, digite: `npm start` e aperte Enter.
3. O erro real aparecerá na tela. Se o erro for `ECONNREFUSED`, o problema é o **MySQL desligado** ou **senha errada**.

## 5. Porta em Uso
Se você já tem outro programa usando a porta 3000, o servidor Arcanjo Miguel tentará usar a 3001, 3002, etc. Verifique a mensagem que aparece no terminal: `Servidor rodando em: http://localhost:XXXX`. Use o número que aparecer lá.

---
**Dica:** Sempre execute o `start.cmd` como administrador se encontrar problemas de permissão.
