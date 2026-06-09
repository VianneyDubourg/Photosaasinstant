# AutoDeck

Interface automobile plein écran inspirée du style CarPlay — 100 % statique (HTML/CSS/JS vanilla, aucun build step).

## Fonctionnalités

- **Dock latéral gauche** : horloge temps réel, barre de signal, batterie, icônes d'apps en squircles
- **Plans** : Google Maps Embed API (gratuite) dans un iframe plein écran
- **Musique** : lecteur Spotify via Authorization Code + PKCE (sans client secret) et Web Playback SDK ; fallback iframe pour les comptes non-Premium
- **Plein écran** (Fullscreen API) & **Wake Lock** (écran toujours allumé)
- Transitions douces entre les vues, thème sombre, effet verre/blur

---

## Configuration rapide

### 1. Modifier `config.js`

```js
const CONFIG = {
  NOM_PRODUIT: 'AutoDeck',         // nom affiché dans l'interface
  ACCENT_COLOR: '#007AFF',         // couleur d'accent principale

  GOOGLE_MAPS_API_KEY: 'AIza...',  // clé Maps Embed API
  DEFAULT_LOCATION: 'Paris, France',

  SPOTIFY_CLIENT_ID: 'abc123...',  // client ID Spotify
  SPOTIFY_REDIRECT_URI: 'https://votre-domaine.com/autodeck/',
};
```

### 2. Google Maps Embed API (gratuite)

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer **uniquement** l'API **Maps Embed API** (ne pas activer Maps JavaScript API, elle est facturée)
3. Créer une clé API → restreindre par **Référent HTTP** à votre domaine :
   ```
   https://votre-domaine.com/*
   ```
4. Copier la clé dans `config.js`

### 3. Spotify (Authorization Code + PKCE)

1. Créer une application sur le [dashboard développeur Spotify](https://developer.spotify.com/dashboard)
2. Type : **Web application**
3. Ajouter la Redirect URI dans le dashboard :
   ```
   https://votre-domaine.com/autodeck/
   ```
   > En local : `http://localhost:8080/` ou `http://127.0.0.1:5500/`
4. Copier le **Client ID** dans `config.js`

> **Note** : la lecture complète (Web Playback SDK) nécessite un compte **Spotify Premium** côté utilisateur. Les comptes gratuits voient un iframe de prévisualisation 30 s.

---

## Déploiement FTP automatique (GitHub Actions)

### Secrets à créer dans GitHub

> **Settings → Secrets and variables → Actions → New repository secret**

| Nom du secret    | Description                        | Exemple               |
|------------------|------------------------------------|-----------------------|
| `FTP_SERVER`     | Nom d'hôte ou IP du serveur FTP    | `ftp.monserveur.com`  |
| `FTP_USERNAME`   | Nom d'utilisateur FTP              | `user@monserveur.com` |
| `FTP_PASSWORD`   | Mot de passe FTP                   | `••••••••`            |

> ⚠️ **NE JAMAIS** mettre ces informations dans le code source.

### Pousser le dépôt

```bash
git init
git add .
git commit -m "feat: ajout d'AutoDeck"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_REPO.git
git push -u origin main
```

Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement à chaque push sur `main` et déploie le dossier `autodeck/` vers `/public_html/autodeck/` sur votre serveur FTP.

Pour modifier le dossier de destination, éditer la ligne `server-dir` dans `deploy.yml`.

---

## Structure du projet

```
autodeck/
├── index.html               # Entrée SPA
├── config.js                # Configuration utilisateur
├── css/
│   ├── main.css             # Variables, layout, utilitaires
│   ├── sidebar.css          # Dock latéral
│   ├── maps.css             # Vue Plans
│   └── music.css            # Vue Musique / lecteur
├── js/
│   ├── app.js               # Point d'entrée
│   ├── router.js            # SPA sans rechargement
│   ├── clock.js             # Horloge temps réel
│   ├── fullscreen.js        # Fullscreen API
│   ├── wakelock.js          # Wake Lock API
│   ├── maps.js              # Google Maps
│   ├── spotify-auth.js      # OAuth PKCE
│   ├── spotify-player.js    # Web Playback SDK
│   └── music.js             # Contrôleur musique
├── assets/                  # (réservé pour assets locaux)
├── LICENSE-feather.txt      # Licence MIT Feather Icons
├── .gitignore
└── .github/
    └── workflows/
        └── deploy.yml       # CI/CD FTP
```

---

## Utilisation en local

Ouvrir avec un serveur HTTP local (obligatoire pour les iframes et l'API Spotify) :

```bash
# Python 3
python3 -m http.server 8080
# puis ouvrir http://localhost:8080/autodeck/
```

Ou utiliser l'extension **Live Server** dans VS Code.

---

## Attributions

- **Feather Icons** par [Cole Bemis](https://github.com/feathericons/feather) — [MIT License](LICENSE-feather.txt)
- Ce projet n'est pas affilié à Apple Inc., Spotify AB ou Google LLC.

---

## Raccourcis clavier

| Touche | Action                   |
|--------|--------------------------|
| `P`    | Vue Plans                |
| `M`    | Vue Musique              |
| `F`    | Basculer plein écran     |
