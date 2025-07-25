# 🔐 Guide d'utilisation - Authentification

## ✅ Installation terminée !

Votre système d'authentification est maintenant configuré et opérationnel.

## 🚀 Premier démarrage

### 1. Accédez à l'application

- Ouvrez votre navigateur sur : `http://localhost:3000`
- Vous serez automatiquement redirigé vers la page de connexion

### 2. Créez votre premier compte

- Cliquez sur "Pas encore de compte ? S'inscrire"
- Ou allez directement sur : `http://localhost:3000/auth/signup`
- Remplissez le formulaire d'inscription

### 3. Connectez-vous

- Utilisez vos identifiants pour vous connecter
- Vous accéderez alors au dashboard principal

## 🔧 Configuration de sécurité

### Variable d'environnement importante

Dans le fichier `.env.local`, modifiez la ligne :

```
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

Remplacez par une clé secrète forte :

```
NEXTAUTH_SECRET="votre-clé-très-secrète-et-unique-pour-la-production"
```

## 📱 Pages disponibles

| URL            | Description                       |
| -------------- | --------------------------------- |
| `/`            | Dashboard principal (protégé)     |
| `/auth/signin` | Page de connexion                 |
| `/auth/signup` | Page d'inscription                |
| `/rapports`    | Historique des rapports (protégé) |

## 🛡️ Fonctionnalités de sécurité

- ✅ **Mots de passe chiffrés** avec bcrypt
- ✅ **Sessions sécurisées** avec NextAuth
- ✅ **Protection automatique** des pages
- ✅ **Redirection automatique** vers la connexion
- ✅ **Validation** des données d'entrée

## 🔄 Utilisation quotidienne

1. **Première visite** : Redirection automatique vers `/auth/signin`
2. **Après connexion** : Accès au dashboard complet
3. **Navigation** : Utilisez la navbar pour vous déconnecter
4. **Session expirée** : Redirection automatique vers la connexion

## 🗃️ Base de données

- **Type** : SQLite (fichier `dev.db`)
- **Localisation** : Racine du projet
- **Gestion** : Automatique avec Prisma

### Commandes utiles

```bash
# Voir la base de données en interface graphique
npx prisma studio

# Réinitialiser complètement la DB
npx prisma db push --force-reset
```

## 🔧 Dépannage

### Problème : "Module not found"

```bash
npm install
npx prisma generate
```

### Problème : "Client fetch error"

- Vérifiez que le serveur est démarré (`npm run dev`)
- Vérifiez que le port 3000 est libre

### Problème : Base de données

```bash
npx prisma db push
```

## 📞 Support

Le système d'authentification est maintenant configuré et prêt à l'emploi !

Toutes les pages importantes sont automatiquement protégées et redirigent vers la page de connexion si l'utilisateur n'est pas authentifié.
