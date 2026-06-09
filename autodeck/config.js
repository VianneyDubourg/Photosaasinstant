/**
 * config.js — Configuration centrale d'AutoDeck
 * Modifiez ce fichier pour personnaliser l'application.
 * NE JAMAIS mettre des identifiants FTP ou secrets ici.
 */
const CONFIG = {

  /* ── Identité produit ─────────────────────────────────────── */
  NOM_PRODUIT: 'AutoDeck',
  VERSION: '1.0.0',

  /* Couleur d'accent principale (format CSS valide) */
  ACCENT_COLOR: '#007AFF',

  /* ── Google Maps Embed API ────────────────────────────────── */
  // Clé à créer sur https://console.cloud.google.com/
  // → Activer "Maps Embed API" (gratuite)
  // → Restreindre par "référent HTTP" à votre domaine
  GOOGLE_MAPS_API_KEY: '',

  // Lieu par défaut si la clé est fournie
  DEFAULT_LOCATION: 'Paris, France',

  // Coordonnées de secours (utilisées si le nom de lieu échoue)
  DEFAULT_COORDS: { lat: 48.8566, lng: 2.3522 },

  // Niveau de zoom initial (1=monde, 21=bâtiment)
  DEFAULT_ZOOM: 14,

  /* ── Spotify ──────────────────────────────────────────────── */
  // Client ID à créer sur https://developer.spotify.com/dashboard
  // → Type d'application : "Web application"
  // → Ajouter la Redirect URI ci-dessous dans le dashboard Spotify
  SPOTIFY_CLIENT_ID: '',

  // URI de redirection OAuth (doit correspondre EXACTEMENT au dashboard Spotify)
  // En local : 'http://localhost:8080/' ou 'http://127.0.0.1:5500/'
  // En production : 'https://votre-domaine.com/autodeck/'
  SPOTIFY_REDIRECT_URI: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/'),

  // Scopes Spotify requis
  SPOTIFY_SCOPES: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
  ].join(' '),

  // Playlist Spotify de secours pour l'iframe (ID publique)
  SPOTIFY_FALLBACK_PLAYLIST: '37i9dQZF1DXcBWIGoYBM5M',

};

// Injection de la couleur d'accent dans les variables CSS
document.documentElement.style.setProperty('--accent', CONFIG.ACCENT_COLOR);
