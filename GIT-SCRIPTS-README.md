# 🚀 Scripts de Gestion Git pour Chantier-Rapport

Ce dossier contient plusieurs scripts pour faciliter la gestion de votre code avec Git et GitHub.

## 📁 Fichiers disponibles

### 1. `push-to-github.bat` - Script Simple ⚡

**Usage rapide pour Windows**

- Double-cliquez sur le fichier
- Suit un processus automatique en 5 étapes
- Parfait pour un push rapide sans options

**Fonctionnalités :**

- ✅ Vérification du statut Git
- ✅ Ajout automatique de tous les fichiers modifiés
- ✅ Commit avec message personnalisé ou automatique
- ✅ Push vers GitHub
- ✅ Gestion des erreurs basique

### 2. `git-manager.bat` - Script Avancé 🛠️

**Interface complète en menu pour Windows**

- Double-cliquez sur le fichier
- Menu interactif avec plusieurs options
- Support des émojis et interface colorée

**Fonctionnalités :**

- 📤 Push rapide (add + commit + push)
- 📊 Visualisation du statut Git
- 📋 Historique des commits
- 🔄 Pull depuis GitHub
- 🌿 Changement de branche
- ❌ Gestion d'erreurs avancée

### 3. `git-manager.ps1` - Script PowerShell 💪

**Version PowerShell moderne pour Windows**

- Clic droit → "Exécuter avec PowerShell"
- Interface moderne avec couleurs
- Gestion d'erreurs améliorée

**Fonctionnalités :**

- 🎨 Interface colorée et moderne
- 🔍 Détection intelligente des modifications
- 📅 Messages de commit avec timestamp automatique
- 🚀 Optimisations PowerShell

## 🚀 Comment utiliser

### Option 1 : Script Simple (Recommandé pour débuter)

1. Double-cliquez sur `push-to-github.bat`
2. Suivez les instructions à l'écran
3. Entrez votre message de commit ou laissez vide pour un message automatique

### Option 2 : Script Avancé (Recommandé pour usage régulier)

1. Double-cliquez sur `git-manager.bat`
2. Choisissez l'option désirée dans le menu
3. Suivez les instructions pour chaque action

### Option 3 : PowerShell (Pour les utilisateurs avancés)

1. Clic droit sur `git-manager.ps1` → "Exécuter avec PowerShell"
2. Si vous avez une erreur de politique d'exécution, lancez PowerShell en administrateur et tapez :
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## 🔧 Configuration requise

- **Git** installé sur votre système
- **Connexion Internet** pour communiquer avec GitHub
- **Authentification GitHub** configurée (token ou SSH)

## ⚠️ Résolution des problèmes courants

### Erreur d'authentification GitHub

1. Vérifiez que vous avez configuré votre token GitHub
2. Ou configurez SSH pour GitHub
3. Commande pour configurer le token :
   ```bash
   git remote set-url origin https://[VOTRE_TOKEN]@github.com/Christophe72/chantier-rapport.git
   ```

### Erreur "failed to push some refs"

1. Utilisez l'option **Pull** d'abord
2. Résolvez les conflits si nécessaire
3. Relancez le push

### Le script ne trouve pas Git

- Assurez-vous que Git est installé
- Ajoutez Git au PATH système si nécessaire

## 📋 Workflow recommandé

1. **Avant de commencer à coder** : Utilisez l'option "Pull" pour récupérer les dernières modifications
2. **Après avoir codé** : Utilisez l'option "Push rapide" pour envoyer vos modifications
3. **Pour vérifier l'état** : Utilisez l'option "Voir le statut Git"

## 🎯 Avantages de ces scripts

- ✅ **Simplicité** : Plus besoin de mémoriser les commandes Git
- ✅ **Sécurité** : Vérifications automatiques avant les actions
- ✅ **Rapidité** : Push en quelques clics
- ✅ **Gestion d'erreurs** : Messages d'erreur clairs et solutions proposées
- ✅ **Interface intuitive** : Menus et émojis pour une meilleure expérience

## 📞 Support

Si vous rencontrez des problèmes :

1. Lisez les messages d'erreur affichés
2. Vérifiez votre connexion Internet
3. Assurez-vous que Git est correctement configuré
4. Vérifiez vos identifiants GitHub

---

💡 **Astuce** : Créez un raccourci sur votre bureau vers `git-manager.bat` pour y accéder rapidement !

🌐 **Repository** : https://github.com/Christophe72/chantier-rapport
