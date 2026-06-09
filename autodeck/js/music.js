/**
 * music.js — Contrôleur de la vue Musique.
 * Orchestre SpotifyAuth + SpotifyPlayer, gère l'affichage du lecteur
 * ou de l'iframe de secours selon l'état de connexion.
 */

const MusicApp = (() => {

  /* ── Références DOM ─────────────────────────────────────── */
  let els = {};

  function bindEls() {
    els = {
      card:          document.getElementById('player-card'),
      fallback:      document.getElementById('spotify-fallback'),
      sdkLoading:    document.getElementById('sdk-loading'),
      premiumNotice: document.getElementById('premium-notice'),
      connectBtn:    document.getElementById('spotify-connect-btn'),
      logoutBtn:     document.getElementById('spotify-logout-btn'),
      embedFrame:    document.getElementById('spotify-embed-frame'),

      // Infos piste
      art:           document.getElementById('album-art'),
      title:         document.getElementById('track-title'),
      artist:        document.getElementById('track-artist'),
      album:         document.getElementById('track-album'),

      // Progression
      progressFill:  document.getElementById('progress-fill'),
      progressBar:   document.getElementById('progress-bar-wrapper'),
      timePos:       document.getElementById('time-position'),
      timeDur:       document.getElementById('time-duration'),

      // Contrôles
      btnPlay:       document.getElementById('btn-play-pause'),
      btnPrev:       document.getElementById('btn-prev'),
      btnNext:       document.getElementById('btn-next'),
      volume:        document.getElementById('volume-slider'),

      // Fond dynamique
      bg:            document.getElementById('music-bg'),
    };
  }

  /* ── Formatage du temps ──────────────────────────────────── */

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  /* ── Rendu du lecteur SDK ────────────────────────────────── */

  function renderSDKState(state) {
    const track = state.track_window?.current_track;
    if (!track) return;

    // Infos piste
    const title  = track.name;
    const artist = track.artists.map(a => a.name).join(', ');
    const album  = track.album?.name || '';
    const artUrl = track.album?.images?.[0]?.url || '';

    if (els.title)  els.title.textContent  = title;
    if (els.artist) els.artist.textContent = artist;
    if (els.album)  els.album.textContent  = album;

    if (els.art && artUrl) {
      els.art.src = artUrl;
      els.art.alt = `${title} — ${artist}`;
    }

    // Fond dynamique (pochette floutée)
    if (els.bg && artUrl) {
      els.bg.style.backgroundImage = `url('${artUrl}')`;
    }

    // Durée totale
    const dur = track.duration_ms;
    if (els.timeDur) els.timeDur.textContent = fmtTime(dur);

    // Progression
    updateProgress(state.position, dur);

    // Bouton play/pause
    updatePlayPauseBtn(state.paused);
  }

  function updateProgress(posMs, durMs) {
    if (!durMs) return;
    const pct = Math.min(100, (posMs / durMs) * 100);
    if (els.progressFill) els.progressFill.style.width = `${pct}%`;
    if (els.timePos) els.timePos.textContent = fmtTime(posMs);
  }

  function updatePlayPauseBtn(paused) {
    if (!els.btnPlay) return;
    // On remplace l'icône feather selon l'état
    const icon = els.btnPlay.querySelector('[data-feather]');
    if (icon) {
      icon.setAttribute('data-feather', paused ? 'play' : 'pause');
      if (window.feather) feather.replace({ 'stroke-width': 2 });
    }
  }

  /* ── Callback d'état du SDK ─────────────────────────────── */

  function onPlayerState(event) {
    if (event.premiumRequired) {
      showFallback(true); // Premium requis
      return;
    }

    if (event.sdkState) {
      renderSDKState(event.sdkState);
    }

    if (event.tick) {
      // Mise à jour de la progression sans refaire tout le rendu
      SpotifyPlayer.getState().then(state => {
        if (state) {
          const dur = state.track_window?.current_track?.duration_ms;
          if (dur) updateProgress(event.tick.position, dur);
        }
      });
    }
  }

  /* ── Affichage des zones ─────────────────────────────────── */

  function showLoader() {
    els.card?.classList.add('hidden');
    els.fallback?.classList.add('hidden');
    els.sdkLoading?.classList.remove('hidden');
  }

  function showPlayer() {
    els.sdkLoading?.classList.add('hidden');
    els.fallback?.classList.add('hidden');
    els.card?.classList.remove('hidden');
    els.premiumNotice?.classList.add('hidden');
  }

  function showFallback(premiumRequired = false) {
    els.sdkLoading?.classList.add('hidden');
    els.card?.classList.add('hidden');
    els.fallback?.classList.remove('hidden');
    if (els.premiumNotice) {
      els.premiumNotice.classList.toggle('hidden', !premiumRequired);
    }
  }

  /* ── Initialisation de l'iframe de secours ──────────────── */

  function initFallbackEmbed() {
    if (!els.embedFrame) return;
    const pid = CONFIG.SPOTIFY_FALLBACK_PLAYLIST;
    els.embedFrame.src =
      `https://open.spotify.com/embed/playlist/${pid}?utm_source=generator&theme=0`;
  }

  /* ── Branchement des contrôles ──────────────────────────── */

  function bindControls() {
    els.btnPlay?.addEventListener('click', async () => {
      const state = await SpotifyPlayer.getState();
      if (!state) return;
      if (state.paused) SpotifyPlayer.play();
      else SpotifyPlayer.pause();
    });

    els.btnPrev?.addEventListener('click', () => SpotifyPlayer.prev());
    els.btnNext?.addEventListener('click', () => SpotifyPlayer.next());

    // Seek via clic sur la barre
    els.progressBar?.addEventListener('click', (e) => {
      const rect = els.progressBar.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      SpotifyPlayer.seek(fraction);
    });

    // Volume
    els.volume?.addEventListener('input', (e) => {
      SpotifyPlayer.setVolume(e.target.value / 100);
    });

    // Connexion Spotify
    els.connectBtn?.addEventListener('click', () => SpotifyAuth.login());

    // Déconnexion
    els.logoutBtn?.addEventListener('click', () => {
      SpotifyPlayer.destroy();
      SpotifyAuth.logout();
      showFallback(false);
      if (els.logoutBtn) els.logoutBtn.style.display = 'none';
    });
  }

  /* ── Lancement du SDK si connecté et Premium ────────────── */

  async function launchSDK() {
    showLoader();

    try {
      const token = await SpotifyAuth.getValidToken();
      if (!token) { showFallback(); return; }

      // Vérification Premium fraîche si non mémorisée
      let premium = SpotifyAuth.isPremium();
      if (!premium) {
        premium = await SpotifyAuth.fetchUserProfile(token);
      }

      if (!premium) {
        showFallback(true);
        return;
      }

      await SpotifyPlayer.init(
        () => SpotifyAuth.getValidToken(),
        onPlayerState
      );

      showPlayer();

      // Afficher le bouton de déconnexion
      if (els.logoutBtn) els.logoutBtn.style.display = '';
    } catch (err) {
      console.error('[MusicApp] Erreur SDK :', err);
      showFallback();
    }
  }

  /* ── Init globale ───────────────────────────────────────── */

  function init() {
    bindEls();
    bindControls();
    initFallbackEmbed();

    if (SpotifyAuth.isConnected()) {
      launchSDK();
    } else {
      showFallback();
    }
  }

  // Appelé par le routeur à chaque entrée dans la vue
  function onEnter() {
    // Rien de spécial : le SDK continue en arrière-plan
  }

  return { init, onEnter };
})();
