@echo off
echo ==========================================
echo    🚀 INSTALLATION AUTHENTIFICATION
echo ==========================================
echo.

echo [1/4] 📦 Installation des dépendances npm...
call npm install next-auth@^4.24.10 bcryptjs@^2.4.3 @next-auth/prisma-adapter@^1.0.7 prisma@^5.22.0 @prisma/client@^5.22.0
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo [2/4] 🔧 Installation des types TypeScript...
call npm install --save-dev @types/bcryptjs@^2.4.6
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des types
    pause
    exit /b 1
)

echo [3/4] 🗄️ Génération du client Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la génération du client Prisma
    pause
    exit /b 1
)

echo [4/4] 🔨 Création de la base de données...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création de la base de données
    pause
    exit /b 1
)

echo.
echo ✅ ================================
echo    INSTALLATION TERMINÉE! 🎉
echo ================================
echo.
echo 📋 Prochaines étapes :
echo   1. Modifier les variables dans .env.local
echo   2. Lancer le serveur : npm run dev
echo   3. Aller sur http://localhost:3000/auth/signup
echo.
pause
