# Hirix - Simulation d'Entretiens par IA

Hirix est une plateforme complète de simulation d'entretiens d'embauche (RH et Techniques) utilisant l'Intelligence Artificielle pour aider les candidats à se préparer. Ce projet a été réalisé en collaboration par une équipe de deux développeurs.

## ✨ Fonctionnalités Principales

- 🤖 **Simulations d'Entretiens** - Modules dédiés pour les entretiens RH et Techniques.
- 📊 **Évaluation Automatique** - Analyse intelligente des réponses avec feedback détaillé.
- 🔐 **Authentification Sécurisée** - Système complet basé sur JWT (Access & Refresh tokens).
- 🎨 **Interface Premium** - Design moderne avec mode sombre, gradients et animations fluides.
- 📱 **Responsive Design** - Expérience optimisée sur tous les supports.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 16+ installé
- (Optionnel) Base de données MongoDB

### 1. Configuration du Backend

```bash
cd server

# Installation des dépendances
npm install

# Créer le fichier .env (IMPORTANT !)
# Copiez .env.example vers .env et mettez à jour les valeurs
# Pour le développement, vous pouvez laisser MONGO_URI vide pour utiliser le stockage JSON local
```

Créez `server/.env` :
```env
MONGO_URI=
PORT=5000
NODE_ENV=development

JWT_ACCESS_SECRET=votre_cle_secrete_access_token_a_changer
JWT_REFRESH_SECRET=votre_cle_secrete_refresh_token_a_changer
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

```bash
# Lancer le serveur
npm run dev
```

Le serveur tournera sur http://localhost:5000

### 2. Configuration du Frontend

```bash
cd client

# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend tournera sur http://localhost:5173 (ou 5174 si le port 5173 est occupé)

### 3. Tester l'Application

1. Ouvrez http://localhost:5173 dans votre navigateur
2. Cliquez sur "S'inscrire" pour créer un nouveau compte
3. Remplissez le nom d'utilisateur, l'email et le mot de passe (min 8 caractères)
4. Vous serez redirigé vers le tableau de bord
5. Testez la déconnexion et la connexion

## 📚 Points d'Entrée API (Endpoints)

### Routes d'Authentification

| Méthode | Endpoint | Description | Protégé |
|---------|----------|-------------|---------|
| POST | `/api/auth/register` | Créer un nouvel utilisateur | Non |
| POST | `/api/auth/login` | Connecter un utilisateur | Non |
| POST | `/api/auth/refresh` | Rafraîchir l'access token | Non |
| POST | `/api/auth/logout` | Déconnecter l'utilisateur | Non |
| GET | `/api/me` | Récupérer les infos de l'utilisateur actuel | Oui |

### Routes de Simulation & Analyse

| Méthode | Endpoint | Description | Protégé |
|---------|----------|-------------|---------|
| POST | `/api/hr-interview` | Lancer une simulation RH (via n8n) | Oui |
| POST | `/api/technical-interview` | Générer des questions techniques | Non |
| POST | `/api/profile-critique` | Analyser et critiquer un profil | Oui |
| GET | `/api/cvs` | Gérer les CVs uploadés | Oui |

### Exemple : Créer un Utilisateur

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Exemple : Connexion

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔒 Sécurité

- ✅ **bcrypt** pour le hachage des mots de passe (12 rounds)
- ✅ **JWT** avec access tokens (15min) & refresh tokens (7 jours)
- ✅ **Cookies httpOnly** pour les refresh tokens
- ✅ **Rate limiting** - 5 tentatives par tranche de 15 minutes
- ✅ **Token blacklist** - Invalidation des tokens stockée en base
- ✅ **CORS** configuré pour le frontend
- ✅ **Validation des entrées** côté client et serveur

## 🗂️ Modes de Stockage

### Mode Fichier JSON (Par défaut)
Idéal pour le développement sans MongoDB :
- Utilisateurs stockés dans `server/data/users.json`
- Tokens stockés dans `server/data/refreshTokens.json`
- Création automatique au premier lancement

### Mode MongoDB
Définissez `MONGO_URI` dans `server/.env` :
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/authdb
```

## 📁 Structure du Projet

```
Hirix/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── api/            # Configuration Axios
│   │   ├── components/     # Composants React
│   │   ├── context/        # Contexte d'Authentification
│   │   ├── pages/          # Login, Inscription, Dashboard
│   │   └── ...
│   └── package.json
│
└── server/                  # Backend Node.js
    ├── controllers/        # Contrôleurs de routes
    ├── middleware/         # Middleware Auth & Erreurs
    ├── models/             # Modèles Mongoose
    ├── routes/             # Routes de l'API
    ├── utils/              # Utilitaires de stockage
    └── package.json
```

## 🎨 Interface Utilisateur

L'application arbore un thème sombre moderne avec :
- Arrière-plans en dégradé animé
- Cartes au style Glassmorphism
- Transitions fluides et effets de survol
- Palette de couleurs premium (indigo/purple)
- Design entièrement responsive

## 🧪 Tests

### Tests Manuels
1. Inscrivez un nouvel utilisateur
2. Vérifiez la validation du formulaire (email invalide, mot de passe trop court)
3. Connectez-vous avec l'utilisateur créé
4. Accédez au tableau de bord
5. Déconnectez-vous
6. Tentez d'accéder au tableau de bord en étant déconnecté (redirection attendue)

### Test de Limite de Requêtes (Rate Limiting)
Tentez de vous connecter avec un mauvais mot de passe 6 fois rapidement. Vous devriez recevoir :
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again later"
}
```

## 🛠️ Technologies Utilisées

### Backend
- Node.js & Express
- bcrypt (hachage de mot de passe)
- jsonwebtoken (JWT)
- Mongoose (ODM MongoDB)
- cookie-parser (gestion des cookies)
- express-rate-limit (limite de requêtes)
- CORS

### Frontend
- React 19
- React Router DOM (navigation)
- Axios (client HTTP)
- Vite (outil de build)
- CSS Moderne avec animations

## 📝 Variables d'Environnement

### Serveur (.env)
```env
MONGO_URI=                    # Connexion MongoDB (optionnel)
PORT=5000                     # Port du serveur
NODE_ENV=development          # Environnement
JWT_ACCESS_SECRET=secret1     # Secret pour l'access token
JWT_REFRESH_SECRET=secret2    # Secret pour le refresh token
JWT_ACCESS_EXPIRES_IN=15m     # Expiration de l'access token
JWT_REFRESH_EXPIRES_IN=7d     # Expiration du refresh token
CLIENT_URL=http://localhost:5173  # URL Frontend pour CORS
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api  # URL de l'API Backend
```

## 🚀 Déploiement en Production

1. Définissez `NODE_ENV=production` dans `server/.env`
2. Utilisez des secrets JWT complexes et aléatoires
3. Activez HTTPS (les cookies deviendront sécurisés automatiquement)
4. Configurez `MONGO_URI` vers une base de données de production
5. Build du frontend : `cd client && npm run build`
6. Servez les fichiers statiques depuis `client/dist`

## 🤝 Contributions

Ce projet a été réalisé en collaboration.

### Moi (Aram FILALI)
- **Développement des modules d’entretiens RH** (simulation et logique de questions)
- **Développement des modules d’entretiens techniques** (simulation et logique de questions)
- **Implémentation des systèmes d’évaluation des réponses** : Mise en place de la logique d'évaluation automatique.
- **Intégration des fonctionnalités liées aux simulations d'entretien** : Développement des flux frontend/backend.

## 📄 Licence

Ce projet est réalisé à des fins éducatives.

## 🚀 Améliorations Futures

N'hésitez pas à améliorer ce projet ! Quelques idées :
- Vérification d'email
- Fonctionnalité de réinitialisation de mot de passe
- Authentification à deux facteurs (2FA)
- Connexion via réseaux sociaux (OAuth)
- Gestion du profil utilisateur
