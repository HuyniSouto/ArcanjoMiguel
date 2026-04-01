@echo off
REM ============================================
REM Script de Inicialização - Arcanjo Miguel
REM Windows CMD - Versão Corrigida
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     🙏 ARCANJO MIGUEL - Sistema de Gerenciamento      ║
echo ║                                                        ║
echo ║  Iniciando aplicação...                               ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM 1. Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js não está instalado ou não está no PATH.
    echo Por favor, instale o Node.js de: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado.

REM 2. Verificar .env
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado. Criando um padrão...
    echo DATABASE_URL=mysql://root:root@localhost:3306/arcanjo_miguel > .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo JWT_SECRET=chave_secreta_padrao_arcanjo_miguel >> .env
    echo.
    echo ⚠️  IMPORTANTE: Configure o arquivo .env com sua senha do MySQL.
)

REM 3. Instalar/Verificar dependências
if not exist node_modules (
    echo 📦 Instalando dependências (isso pode demorar um pouco)...
    call npm install
    if errorlevel 1 (
        echo ❌ ERRO ao instalar dependências. Verifique sua conexão com a internet.
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependências já instaladas.
)

REM 4. Verificar se a porta 3000 está em uso
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  AVISO: A porta 3000 já parece estar em uso.
    echo O servidor tentará encontrar outra porta automaticamente.
)

REM 5. Iniciar servidor
echo 🚀 Iniciando servidor...
echo.
echo Se o servidor iniciar corretamente, você verá uma mensagem abaixo.
echo Se a janela fechar imediatamente, execute "npm start" no terminal para ver o erro.
echo.

set NODE_ENV=development
node server/index.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ O servidor parou inesperadamente (Erro: %errorlevel%).
    echo Verifique se o MySQL está rodando e se a DATABASE_URL no .env está correta.
    echo.
    pause
)

pause
