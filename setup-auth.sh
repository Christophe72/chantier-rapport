#!/bin/bash

echo "🚀 Installation des dépendances pour l'authentification..."

# Installation des packages npm
npm install next-auth@^4.24.10 bcryptjs@^2.4.3 @next-auth/prisma-adapter@^1.0.7 prisma@^5.22.0 @prisma/client@^5.22.0

# Installation des types TypeScript
npm install --save-dev @types/bcryptjs@^2.4.6

echo "✅ Dépendances installées!"

echo "🗄️ Initialisation de la base de données..."

# Générer le client Prisma
npx prisma generate

# Créer et migrer la base de données
npx prisma db push

echo "✅ Base de données initialisée!"

echo "🔐 Configuration terminée!"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Modifier les variables dans .env.local"
echo "2. Lancer le serveur : npm run dev"
echo "3. Aller sur http://localhost:3000/auth/signup pour créer un compte"
