/**
 * router.js — Routeur de vues SPA (sans rechargement de page).
 * Gère le switch entre apps via les boutons du dock.
 */

const Router = (() => {

  // Vue par défaut
  const DEFAULT_VIEW = 'maps';
  let currentView = null;

  // Callbacks enregistrés par les modules d'app
  const hooks = {
    onEnter: {},
    onLeave: {},
  };

  /**
   * Enregistre un callback appelé quand une vue devient active / inactive.
   * @param {string} viewId
   * @param {'enter'|'leave'} event
   * @param {Function} fn
   */
  function on(viewId, event, fn) {
    if (event === 'enter') hooks.onEnter[viewId] = fn;
    if (event === 'leave') hooks.onLeave[viewId] = fn;
  }

  /**
   * Navigue vers une vue.
   * @param {string} viewId  identifiant de la section (ex: 'maps', 'music')
   * @param {boolean} [force] force le rechargement même si déjà actif
   */
  function navigate(viewId, force = false) {
    if (viewId === currentView && !force) return;

    const toEl   = document.getElementById(`view-${viewId}`);
    const fromEl = currentView ? document.getElementById(`view-${currentView}`) : null;

    if (!toEl) {
      console.warn(`[Router] Vue inconnue : ${viewId}`);
      return;
    }

    // Callback de sortie de l'ancienne vue
    if (currentView && hooks.onLeave[currentView]) {
      hooks.onLeave[currentView]();
    }

    // Animation de sortie
    if (fromEl) {
      fromEl.classList.remove('active');
      fromEl.classList.add('leaving');
      setTimeout(() => fromEl.classList.remove('leaving'), 300);
    }

    // Mise à jour des boutons du dock
    document.querySelectorAll('.app-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Animation d'entrée
    requestAnimationFrame(() => {
      toEl.classList.add('active');
    });

    const previous = currentView;
    currentView = viewId;

    // Mise à jour URL (hash)
    history.replaceState(null, '', `#${viewId}`);

    // Callback d'entrée dans la nouvelle vue
    if (hooks.onEnter[viewId]) {
      hooks.onEnter[viewId](previous);
    }
  }

  function getCurrent() { return currentView; }

  function init() {
    // Lecture du hash initial
    const hash = location.hash.replace('#', '');
    const startView = ['maps', 'music'].includes(hash) ? hash : DEFAULT_VIEW;

    // Branchement des boutons du dock
    document.querySelectorAll('.app-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.view));
    });

    // Bouton accueil → vue par défaut
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) homeBtn.addEventListener('click', () => navigate(DEFAULT_VIEW));

    navigate(startView);
  }

  return { init, navigate, on, getCurrent };
})();
