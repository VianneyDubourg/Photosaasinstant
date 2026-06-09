/**
 * app.js — Point d'entrée principal.
 * Initialise tous les modules dans le bon ordre.
 */

document.addEventListener('DOMContentLoaded', async () => {

  /* ── 1. Gestion du callback OAuth Spotify (si on revient de Spotify) ── */
  if (window.location.search.includes('code=') ||
      window.location.search.includes('error=')) {
    await SpotifyAuth.handleCallback();
  }

  /* ── 2. Remplacer les icônes Feather (<i data-feather="">) par du SVG inline ── */
  if (window.feather) {
    feather.replace({ 'stroke-width': 2 });
  }

  /* ── 3. Modules utilitaires ──────────────────────────────── */
  Clock.init();
  WakeLock.init();
  FullscreenManager.init();

  /* ── 4. Statut batterie (si disponible) ─────────────────── */
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      const el = document.getElementById('battery-pct');
      function updateBattery() {
        if (el) el.textContent = `${Math.round(battery.level * 100)}%`;
      }
      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
    }).catch(() => {});
  }

  /* ── 5. Modale "À propos" ─────────────────────────────────── */
  const modal    = document.getElementById('modal-about');
  const aboutBtn = document.getElementById('about-btn');
  const closeBtn = document.getElementById('modal-close-btn');

  if (aboutBtn && modal) {
    aboutBtn.addEventListener('click', () => modal.classList.add('open'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    // Nom du produit dans la modale
    const nameEls = document.querySelectorAll('.product-name');
    nameEls.forEach(el => { el.textContent = CONFIG.NOM_PRODUIT; });
    // Version
    const verEl = document.querySelector('.product-version');
    if (verEl) verEl.textContent = `v${CONFIG.VERSION}`;
  }

  /* ── 6. Titre de l'onglet ─────────────────────────────────── */
  document.title = CONFIG.NOM_PRODUIT;

  /* ── 7. Initialisation des apps ──────────────────────────── */
  MapsApp.init();
  MusicApp.init();

  /* ── 8. Routeur — enregistrement des hooks ───────────────── */
  Router.on('maps',  'enter', MapsApp.onEnter);
  Router.on('music', 'enter', MusicApp.onEnter);

  /* ── 9. Démarrage du routeur ─────────────────────────────── */
  Router.init();

  /* ── 10. Toast pour les raccourcis clavier ───────────────── */
  document.addEventListener('keydown', (e) => {
    // Espace → play/pause si sur la vue musique
    if (e.code === 'Space' && Router.getCurrent() === 'music') {
      e.preventDefault();
    }
    // M → vue musique, P → vue plans
    if (e.key === 'm' || e.key === 'M') Router.navigate('music');
    if (e.key === 'p' || e.key === 'P') Router.navigate('maps');
    // F → plein écran
    if (e.key === 'f' || e.key === 'F') FullscreenManager.toggle();
  });

});

/* ── Fonction utilitaire toast ─────────────────────────────── */
function showToast(msg, durationMs = 2500) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('visible'), durationMs);
}
