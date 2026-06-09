/**
 * spotify-player.js — Web Playback SDK Spotify (comptes Premium uniquement).
 * Charge dynamiquement le SDK, crée le player, et expose les contrôles.
 */

const SpotifyPlayer = (() => {

  let player      = null;
  let deviceId    = null;
  let currentState = null;
  let onStateChange = null;  // callback → music.js

  // Calcul de la position en temps réel (SDK ne pousse pas de tick continu)
  let positionTimer = null;
  let lastKnownPosition = 0;
  let lastKnownTimestamp = 0;
  let isPaused = true;

  /* ── Chargement du SDK ───────────────────────────────────── */

  function loadSDK() {
    return new Promise((resolve, reject) => {
      if (window.Spotify) { resolve(); return; }

      window.onSpotifyWebPlaybackSDKReady = resolve;

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.onerror = () => reject(new Error('SDK non chargé'));
      document.head.appendChild(script);
    });
  }

  /* ── Initialisation du player ────────────────────────────── */

  async function init(getToken, onState) {
    onStateChange = onState;

    await loadSDK();

    player = new Spotify.Player({
      name:    CONFIG.NOM_PRODUIT,
      volume:  0.7,
      getOAuthToken: async (cb) => {
        const token = await getToken();
        cb(token);
      },
    });

    /* Erreurs */
    player.addListener('initialization_error', ({ message }) => {
      console.error('[SDK] Initialisation :', message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.error('[SDK] Authentification :', message);
    });
    player.addListener('account_error', ({ message }) => {
      // Compte non-Premium : basculer sur l'iframe
      console.warn('[SDK] Compte :', message);
      if (onStateChange) onStateChange({ premiumRequired: true });
    });
    player.addListener('playback_error', ({ message }) => {
      console.error('[SDK] Lecture :', message);
    });

    /* Prêt */
    player.addListener('ready', ({ device_id }) => {
      deviceId = device_id;
      transferPlayback(device_id);
      startPositionTick();
    });

    /* Non disponible */
    player.addListener('not_ready', ({ device_id }) => {
      console.warn('[SDK] Appareil non disponible :', device_id);
    });

    /* Changement d'état de lecture */
    player.addListener('player_state_changed', (state) => {
      if (!state) return;
      currentState = state;
      lastKnownPosition  = state.position;
      lastKnownTimestamp = Date.now();
      isPaused = state.paused;

      if (onStateChange) onStateChange({ sdkState: state });
    });

    await player.connect();
  }

  /* ── Transfert de la lecture vers notre device ───────────── */

  async function transferPlayback(id) {
    const token = await SpotifyAuth.getValidToken();
    if (!token) return;

    await fetch('https://api.spotify.com/v1/me/player', {
      method:  'PUT',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ device_ids: [id], play: false }),
    });
  }

  /* ── Tick de position pour la barre de progression ─────── */

  function startPositionTick() {
    if (positionTimer) clearInterval(positionTimer);
    positionTimer = setInterval(() => {
      if (!isPaused && onStateChange) {
        const elapsed = Date.now() - lastKnownTimestamp;
        const position = lastKnownPosition + elapsed;
        onStateChange({ tick: { position } });
      }
    }, 500);
  }

  /* ── Contrôles ───────────────────────────────────────────── */

  const play = ()       => player?.resume();
  const pause = ()      => player?.pause();
  const next  = ()      => player?.nextTrack();
  const prev  = ()      => player?.previousTrack();

  async function seek(fraction) {
    if (!currentState) return;
    const posMs = Math.floor(fraction * currentState.track_window.current_track.duration_ms);
    await player?.seek(posMs);
  }

  async function setVolume(fraction) {
    await player?.setVolume(Math.max(0, Math.min(1, fraction)));
  }

  async function getState() {
    if (!player) return null;
    return player.getCurrentState();
  }

  function isReady() {
    return !!deviceId;
  }

  function destroy() {
    if (positionTimer) clearInterval(positionTimer);
    player?.disconnect();
    player   = null;
    deviceId = null;
  }

  return { init, play, pause, next, prev, seek, setVolume, getState, isReady, destroy };
})();
