@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ==========================================
echo    🔧 CONFIGURATION ENVIRONNEMENT
echo ==========================================
echo.

echo [1/6] 🧹 Nettoyage de l'environnement...
if exist "node_modules" (
    echo Suppression de node_modules...
    rmdir /s /q "node_modules" 2>nul
)

if exist "dev.db" (
    echo Suppression de l'ancienne base de données...
    del "dev.db*" 2>nul
)

echo [2/6] 📦 Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances!
    pause
    exit /b 1
)

echo [3/6] 🗄️ Configuration de Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la génération de Prisma!
    pause
    exit /b 1
)

echo [4/6] 🏗️ Création de la base de données...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création de la base de données!
    pause
    exit /b 1
)

echo [5/6] 🔧 Configuration PowerShell...
powershell -ExecutionPolicy Bypass -File "fix-powershell.ps1"

echo [6/6] 🚀 Démarrage optionnel du serveur...
set /p start_server="Voulez-vous démarrer le serveur maintenant ? (o/N): "
if /i "%start_server%"=="o" (
    echo Démarrage du serveur en arrière-plan...
    start /B npm run dev
    timeout /t 3 >nul
    echo.
    echo 🌐 Application accessible sur http://localhost:3000
    echo 🔐 Première connexion : http://localhost:3000/auth/signup
)

echo.
echo ✅ ================================
echo    CONFIGURATION TERMINÉE! 🎉
echo ================================
echo.
echo 📋 Commandes disponibles :
echo   npm run dev           - Démarrer le serveur
echo   npx prisma studio     - Interface de base de données
echo   ./git-clean.ps1       - Gestionnaire Git propre
echo   ./fix-powershell.ps1  - Corriger PowerShell
echo.
echo 🔗 Liens utiles :
echo   Application : http://localhost:3000
echo   Prisma Studio : http://localhost:5555
echo   GitHub : https://github.com/Christophe72/chantier-rapport
echo.
pause
