@echo off
chcp 65001 >nul

echo ==========================================
echo    🚀 DÉMARRAGE RAPIDE - IoT DASHBOARD
echo ==========================================
echo.

:: Vérifier si node_modules existe
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    call npm install
)

:: Vérifier si la base de données existe
if not exist "dev.db" (
    echo 🗄️ Création de la base de données...
    call npx prisma generate
    call npx prisma db push
)

echo 🚀 Démarrage de l'application...
echo.
echo ✅ Application IoT Dashboard
echo 🌐 URL: http://localhost:3000
echo 🔐 Connexion: http://localhost:3000/auth/signin
echo 📝 Inscription: http://localhost:3000/auth/signup
echo.
echo 💡 Appuyez sur Ctrl+C pour arrêter
echo.

:: Démarrer le serveur
npm run dev
