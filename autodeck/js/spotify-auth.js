/**
 * spotify-auth.js — Authentification Spotify via Authorization Code + PKCE
 * Aucun client secret requis : le code est 100% public.
 */

const SpotifyAuth = (() => {

  const LS = {
    TOKEN:        'autodeck_spotify_token',
    REFRESH:      'autodeck_spotify_refresh',
    EXPIRES_AT:   'autodeck_spotify_expires_at',
    VERIFIER:     'autodeck_pkce_verifier',
    STATE:        'autodeck_oauth_state',
    USER_PREMIUM: 'autodeck_spotify_premium',
  };

  /* ── Utilitaires PKCE ─────────────────────────────────────── */

  function generateRandom(length = 64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, b => chars[b % chars.length]).join('');
  }

  function base64UrlEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  async function sha256(plain) {
    const data = new TextEncoder().encode(plain);
    return crypto.subtle.digest('SHA-256', data);
  }

  async function generateChallenge(verifier) {
    const hash = await sha256(verifier);
    return base64UrlEncode(hash);
  }

  /* ── Stockage des tokens ──────────────────────────────────── */

  function saveTokens({ access_token, refresh_token, expires_in }) {
    const expiresAt = Date.now() + expires_in * 1000 - 60_000; // marge 60s
    localStorage.setItem(LS.TOKEN,      access_token);
    localStorage.setItem(LS.EXPIRES_AT, expiresAt);
    if (refresh_token) {
      localStorage.setItem(LS.REFRESH, refresh_token);
    }
  }

  function getAccessToken() {
    const token     = localStorage.getItem(LS.TOKEN);
    const expiresAt = parseInt(localStorage.getItem(LS.EXPIRES_AT) || '0', 10);
    if (!token || Date.now() > expiresAt) return null;
    return token;
  }

  function getRefreshToken() {
    return localStorage.getItem(LS.REFRESH);
  }

  function isPremium() {
    return localStorage.getItem(LS.USER_PREMIUM) === 'true';
  }

  function isConnected() {
    return !!getAccessToken();
  }

  /* ── Lancement du flux OAuth PKCE ────────────────────────── */

  async function login() {
    if (!CONFIG.SPOTIFY_CLIENT_ID) {
      alert('Ajoutez votre SPOTIFY_CLIENT_ID dans config.js');
      return;
    }

    const verifier  = generateRandom(64);
    const challenge = await generateChallenge(verifier);
    const state     = generateRandom(16);

    sessionStorage.setItem(LS.VERIFIER, verifier);
    sessionStorage.setItem(LS.STATE,    state);

    const params = new URLSearchParams({
      response_type:         'code',
      client_id:             CONFIG.SPOTIFY_CLIENT_ID,
      scope:                 CONFIG.SPOTIFY_SCOPES,
      redirect_uri:          CONFIG.SPOTIFY_REDIRECT_URI,
      state,
      code_challenge_method: 'S256',
      code_challenge:        challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }

  /* ── Échange code → token ────────────────────────────────── */

  async function exchangeCode(code) {
    const verifier = sessionStorage.getItem(LS.VERIFIER);
    if (!verifier) throw new Error('PKCE verifier manquant');

    const body = new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  CONFIG.SPOTIFY_REDIRECT_URI,
      client_id:     CONFIG.SPOTIFY_CLIENT_ID,
      code_verifier: verifier,
    });

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error_description || `HTTP ${res.status}`);
    }

    const data = await res.json();
    saveTokens(data);
    sessionStorage.removeItem(LS.VERIFIER);
    sessionStorage.removeItem(LS.STATE);

    // Vérification Premium
    await fetchUserProfile(data.access_token);

    return data.access_token;
  }

  /* ── Rafraîchissement du token ───────────────────────────── */

  async function refreshToken() {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('Pas de refresh token disponible');

    const body = new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: refresh,
      client_id:     CONFIG.SPOTIFY_CLIENT_ID,
    });

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      logout();
      throw new Error(`Refresh échoué : HTTP ${res.status}`);
    }

    const data = await res.json();
    saveTokens(data);
    return data.access_token;
  }

  /* ── Obtenir un token valide (refresh auto) ──────────────── */

  async function getValidToken() {
    let token = getAccessToken();
    if (token) return token;

    const refresh = getRefreshToken();
    if (refresh) {
      token = await refreshToken();
      return token;
    }
    return null;
  }

  /* ── Profil utilisateur → détection Premium ─────────────── */

  async function fetchUserProfile(token) {
    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const user = await res.json();
      const premium = user.product === 'premium';
      localStorage.setItem(LS.USER_PREMIUM, premium);
      return premium;
    } catch {
      // silencieux
    }
  }

  /* ── Déconnexion ─────────────────────────────────────────── */

  function logout() {
    Object.values(LS).forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem(LS.VERIFIER);
    sessionStorage.removeItem(LS.STATE);
  }

  /* ── Gestion du callback OAuth (appelée au chargement) ──── */

  async function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const error  = params.get('error');
    const state  = params.get('state');

    if (error) {
      console.warn('[SpotifyAuth] Accès refusé :', error);
      window.history.replaceState({}, '', window.location.pathname);
      return null;
    }

    if (!code) return null;

    // Vérification du state CSRF
    const savedState = sessionStorage.getItem(LS.STATE);
    if (state !== savedState) {
      console.error('[SpotifyAuth] State OAuth invalide (CSRF possible)');
      window.history.replaceState({}, '', window.location.pathname);
      return null;
    }

    try {
      const token = await exchangeCode(code);
      // Nettoyer l'URL (retirer ?code=...&state=...)
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
      return token;
    } catch (err) {
      console.error('[SpotifyAuth] Échange de code échoué :', err);
      window.history.replaceState({}, '', window.location.pathname);
      return null;
    }
  }

  return {
    login,
    logout,
    handleCallback,
    getValidToken,
    isConnected,
    isPremium,
    fetchUserProfile,
  };
})();
