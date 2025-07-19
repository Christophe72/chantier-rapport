# 🚧 Application de gestion de chantiers et rapports

> Application Next.js pour la gestion des chantiers, la création de rapports journaliers et le suivi d'activité.

## Fonctionnalités principales

- **Gestion CRUD des chantiers** : créez, modifiez, supprimez et consultez vos chantiers.
- **Création de rapports** : saisissez un rapport journalier lié à un chantier existant ou personnalisé.
- **Historique des rapports** : visualisez, filtrez et supprimez les rapports enregistrés.
- **Navigation fluide** : accès rapide entre l'accueil, les chantiers et l'historique.
- **Design moderne** : interface responsive, badges de statut, icônes et expérience utilisateur soignée.
- **Données persistantes** : tout est stocké dans le navigateur (localStorage).

## Démarrage rapide

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure des pages

- `/` : Accueil, création d'un rapport journalier
- `/chantiers` : Gestion complète des chantiers (CRUD)
- `/rapports` : Historique des rapports, suppression possible

## Utilisation

### 1. Gérer les chantiers

- Accédez à l'onglet "Gérer les chantiers" pour créer, modifier ou supprimer vos chantiers.
- Les chantiers "Actifs" sont proposés lors de la création d'un rapport.

### 2. Créer un rapport

- Depuis l'accueil, sélectionnez un chantier existant ou saisissez-en un nouveau.
- Renseignez l'état d'avancement, ajoutez des remarques si besoin, puis enregistrez.

### 3. Consulter l'historique

- L'onglet "Historique" affiche tous les rapports enregistrés.
- Vous pouvez supprimer un rapport si nécessaire.

## Technologies

- [Next.js](https://nextjs.org) 15+
- React 18+
- Stockage local (localStorage)
- TypeScript

## Déploiement

Pour déployer l'application, vous pouvez utiliser Vercel, Netlify ou tout hébergeur compatible Next.js.

## Auteur

Application réalisée pour la gestion de chantiers et le suivi de rapports journaliers.
