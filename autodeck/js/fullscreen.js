/**
 * fullscreen.js — Gestion du mode plein écran via la Fullscreen API
 */

const FullscreenManager = (() => {

  let btn = null;

  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );
  }

  async function toggle() {
    if (isFullscreen()) {
      await (document.exitFullscreen?.() ||
             document.webkitExitFullscreen?.() ||
             document.mozCancelFullScreen?.());
    } else {
      const el = document.documentElement;
      await (el.requestFullscreen?.() ||
             el.webkitRequestFullscreen?.() ||
             el.mozRequestFullScreen?.());
    }
  }

  function updateBtn() {
    if (!btn) return;
    const icon = btn.querySelector('svg use, svg');
    const title = isFullscreen() ? 'Quitter plein écran' : 'Plein écran';
    btn.title = title;
    // On change l'icône feather selon l'état
    const useEl = btn.querySelector('[data-feather]');
    if (useEl) {
      useEl.setAttribute('data-feather', isFullscreen() ? 'minimize' : 'maximize');
      if (window.feather) feather.replace();
    }
  }

  function init() {
    btn = document.getElementById('fullscreen-btn');
    if (!btn) return;

    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', toggle);
    document.addEventListener('fullscreenchange',       updateBtn);
    document.addEventListener('webkitfullscreenchange', updateBtn);
    document.addEventListener('mozfullscreenchange',    updateBtn);
    updateBtn();
  }

  return { init, toggle, isFullscreen };
})();
