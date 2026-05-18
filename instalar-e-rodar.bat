@echo off
title ERP - Instalador Playarts Pets
echo ==================================================
echo   INICIALIZANDO SISTEMA ERP - PLAYARTS PETS
echo ==================================================
echo.

:: Verifica se o Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado. Por favor, instale o Node.js para continuar.
    pause
    exit
)

echo [1/4] Instalando dependencias (isso pode demorar na primeira vez)...
call npm install

echo [2/4] Configurando banco de dados local...
call npx drizzle-kit push

echo [3/4] Importando produtos da Playarts Pets...
call node seed-playarts.mjs

echo [4/4] Iniciando o sistema...
echo.
echo ==================================================
echo   O SISTEMA ABRIRA EM INSTANTES NO NAVEGADOR
echo   PARA FECHAR O SISTEMA, FECHE ESTA JANELA
echo ==================================================
echo.

:: Abre o navegador no localhost:3000
start http://localhost:3000

:: Inicia o servidor Next.js
npm run dev
