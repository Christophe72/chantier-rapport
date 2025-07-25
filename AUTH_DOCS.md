# 🔐 Système d'Authentification

## Installation

### Automatique (Recommandé)

```bash
# Windows
./setup-auth.bat

# Linux/Mac
chmod +x setup-auth.sh
./setup-auth.sh
```

### Manuelle

```bash
npm install next-auth bcryptjs @next-auth/prisma-adapter prisma @prisma/client
npm install --save-dev @types/bcryptjs
npx prisma generate
npx prisma db push
```

## Configuration

### 1. Variables d'environnement (.env.local)

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-très-longue-et-sécurisée"

# MQTT Configuration
MQTT_BROKER_URL="mqtt://localhost:1883"
MQTT_USERNAME=""
MQTT_PASSWORD=""
MQTT_TOPIC="esp32/sensors"
```

### 2. Générer une clé secrète

```bash
openssl rand -base64 32
```

## Utilisation

### Pages disponibles

- `/auth/signin` - Connexion
- `/auth/signup` - Inscription
- `/` - Dashboard (protégé)

### Protection des routes

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### Utilisation de la session

```tsx
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Chargement...</p>;
  if (status === "unauthenticated") return <p>Non connecté</p>;

  return <p>Connecté en tant que {session.user.email}</p>;
}
```

## Base de données

### Modèles Prisma

- **User** : Utilisateurs du système
- **Account** : Comptes d'authentification
- **Session** : Sessions utilisateur
- **Measure** : Données IoT associées aux utilisateurs

### Commandes utiles

```bash
# Voir la base de données
npx prisma studio

# Réinitialiser la DB
npx prisma db push --force-reset

# Créer une migration
npx prisma migrate dev --name init
```

## Sécurité

### Fonctionnalités incluses

- ✅ Hachage des mots de passe (bcrypt)
- ✅ Validation des données
- ✅ Protection CSRF
- ✅ Sessions sécurisées
- ✅ Types TypeScript

### Bonnes pratiques

- Utiliser HTTPS en production
- Configurer une clé secrète forte
- Valider toutes les entrées utilisateur
- Limiter les tentatives de connexion

## Déploiement

### Production

```env
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="clé-secrète-production"
DATABASE_URL="postgresql://..."
```

### Docker

Le système est compatible avec Docker. Assurez-vous de :

- Monter le volume de la base de données
- Configurer les variables d'environnement
- Exposer le port 3000
