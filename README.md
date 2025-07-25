# 🏗️ Dashboard IoT - Gestion de Chantiers

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth-5.0-purple?style=for-the-badge&logo=auth0)

**Application complète de gestion de chantiers avec authentification et dashboard IoT en temps réel**

[🚀 Démo en direct](#) • [📖 Documentation](#fonctionnalités) • [⚡ Installation rapide](#installation-rapide)

</div>

---

## ✨ Fonctionnalités principales

### 🔐 **Authentification sécurisée**

- Système de connexion/inscription complet
- Protection automatique des routes
- Sessions sécurisées avec NextAuth v5
- Gestion des rôles utilisateur

### 📊 **Dashboard IoT**

- Réception de données ESP32 via HTTP POST
- Support MQTT (broker local ou cloud)
- Visualisation temps réel des mesures
- Stockage avec Prisma + SQLite

### 🏗️ **Gestion de chantiers**

- CRUD complet des chantiers
- Création de rapports journaliers
- Historique et suivi d'activité
- Interface responsive et moderne

### 🔧 **Architecture technique**

- **Frontend** : Next.js 15 + React 19 + TypeScript
- **Base de données** : Prisma ORM + SQLite
- **Authentification** : NextAuth v5
- **Styling** : CSS-in-JS + Design System
- **Docker Ready** : Migration facile vers conteneurs

---

## 🚀 Installation rapide

### Prérequis

- Node.js 18+
- Git

### 1️⃣ Cloner le repository

```bash
git clone https://github.com/Christophe72/chantier-rapport.git
cd chantier-rapport
```

### 2️⃣ Installation automatique (Recommandé)

```bash
# Windows
./setup-auth.bat

# Linux/Mac
chmod +x setup-auth.sh && ./setup-auth.sh
```

### 3️⃣ Installation manuelle

```bash
# Installer les dépendances
npm install

# Configurer la base de données
npx prisma generate
npx prisma db push

# Démarrer l'application
npm run dev
```

### 4️⃣ Première utilisation

1. Allez sur `http://localhost:3000`
2. Créez votre compte sur `/auth/signup`
3. Connectez-vous et explorez le dashboard !

---

## 📁 Structure du projet

```
my-iot-dashboard/
├── app/
│   ├── page.tsx                    # 🏠 Dashboard principal
│   ├── auth/
│   │   ├── signin/page.tsx         # 🔐 Page de connexion
│   │   └── signup/page.tsx         # 📝 Page d'inscription
│   ├── rapports/page.tsx           # 📊 Historique des rapports
│   └── api/
│       ├── auth/[...nextauth]/     # 🔑 API NextAuth
│       └── measure/route.ts        # 📡 API REST pour ESP32
├── lib/
│   ├── auth.ts                     # ⚙️ Configuration NextAuth
│   ├── prisma.ts                   # 🗄️ Client Prisma
│   └── mqttClient.ts               # 📶 Client MQTT
├── components/
│   ├── Navbar.tsx                  # 🧭 Navigation
│   ├── ProtectedRoute.tsx          # 🛡️ Protection des routes
│   └── Charts.tsx                  # 📈 Visualisations
├── prisma/
│   └── schema.prisma               # 🏗️ Modèle de données
└── scripts/
    └── mqtt-listener.ts            # 🔄 Process MQTT → DB
```

---

## 🛠️ Fonctionnalités détaillées

<table>
<tr>
<td width="50%">

### 🔐 **Authentification**

- [x] Connexion/Inscription
- [x] Protection des routes
- [x] Gestion des sessions
- [x] Mot de passe crypté (bcrypt)
- [x] Validation des données
- [x] Types TypeScript

</td>
<td width="50%">

### 📡 **Intégration IoT**

- [x] API REST `/api/measure`
- [x] Client MQTT configurable
- [x] Base de données Prisma
- [x] Dashboard temps réel
- [x] Compatible ESP32
- [x] Stockage des mesures

</td>
</tr>
<tr>
<td>

### 🏗️ **Gestion de chantiers**

- [x] CRUD complet des chantiers
- [x] Rapports journaliers
- [x] Historique et édition
- [x] Statuts visuels
- [x] Interface responsive
- [x] Stockage localStorage

</td>
<td>

### ⚙️ **DevOps & Production**

- [x] Scripts d'installation
- [x] Configuration Docker
- [x] Variables d'environnement
- [x] Base de données migratable
- [x] Déployable sur Vercel/Netlify
- [x] Documentation complète

</td>
</tr>
</table>

---

## 🌐 API Endpoints

### Authentification

- `POST /api/auth/signin` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/session` - Session courante

### Données IoT

- `POST /api/measure` - Recevoir données ESP32
- `GET /api/measures` - Historique des mesures
- `WebSocket /api/mqtt` - Temps réel MQTT

---

## 🔧 Configuration

### Variables d'environnement

```bash
# Base de données
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-forte"

# MQTT (optionnel)
MQTT_BROKER_URL="mqtt://localhost:1883"
MQTT_USERNAME=""
MQTT_PASSWORD=""
MQTT_TOPIC="esp32/sensors"
```

### ESP32 Configuration

```cpp
// Exemple d'envoi de données vers l'API
POST http://localhost:3000/api/measure
Content-Type: application/json

{
  "deviceId": "ESP32_001",
  "temperature": 25.5,
  "humidity": 60.2,
  "current": 2.1,
  "voltage": 12.0
}
```

---

## 🎯 Commandes utiles

```bash
# Développement
npm run dev              # 🚀 Serveur de développement
npm run build           # 🏗️ Build de production
npm run start           # ▶️ Serveur de production

# Base de données
npx prisma studio       # 🗄️ Interface graphique DB
npx prisma db push      # ⬆️ Synchroniser le schéma
npx prisma generate     # 🔄 Générer le client

# Authentification
./setup-auth.bat        # 🔐 Installation complète (Windows)
```

---

## 📊 Screenshots

<div align="center">

### 🔐 Page de connexion

![Connexion](https://via.placeholder.com/600x300/667eea/ffffff?text=Page+de+Connexion)

### 📱 Dashboard responsive

![Dashboard](https://via.placeholder.com/600x300/38a169/ffffff?text=Dashboard+IoT)

### 📈 Visualisation des données

![Charts](https://via.placeholder.com/600x300/3182ce/ffffff?text=Graphiques+Temps+Réel)

</div>

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Christophe72**

- GitHub: [@Christophe72](https://github.com/Christophe72)
- Repository: [chantier-rapport](https://github.com/Christophe72/chantier-rapport)

---

<div align="center">

**⭐ N'hésitez pas à donner une étoile si ce projet vous plaît !**

![Built with ❤️](https://img.shields.io/badge/Built%20with-❤️-red?style=for-the-badge)
![Made in France](https://img.shields.io/badge/Made%20in-🇫🇷%20France-blue?style=for-the-badge)

</div>
