/**
 * maps.js — Vue Plans : charge Google Maps Embed API dans un iframe.
 * Si la clé API est absente, affiche un message d'aide.
 */

const MapsApp = (() => {

  let initialized = false;

  function buildEmbedUrl() {
    const key   = CONFIG.GOOGLE_MAPS_API_KEY;
    const coord = CONFIG.DEFAULT_COORDS;
    const zoom  = CONFIG.DEFAULT_ZOOM;

    // Maps Embed API — version gratuite (aucune facturation)
    if (CONFIG.DEFAULT_LOCATION) {
      return `https://www.google.com/maps/embed/v1/place?key=${key}` +
             `&q=${encodeURIComponent(CONFIG.DEFAULT_LOCATION)}` +
             `&zoom=${zoom}&language=fr`;
    }
    return `https://www.google.com/maps/embed/v1/view?key=${key}` +
           `&center=${coord.lat},${coord.lng}` +
           `&zoom=${zoom}&language=fr`;
  }

  function init() {
    const noKeyEl  = document.getElementById('maps-no-key');
    const iframeEl = document.getElementById('maps-iframe');
    const wrapper  = document.getElementById('maps-iframe-wrapper');
    const locEl    = document.getElementById('topbar-location');

    if (!CONFIG.GOOGLE_MAPS_API_KEY) {
      // Clé absente → message d'aide, pas d'iframe cassé
      if (noKeyEl)  noKeyEl.classList.remove('hidden');
      if (iframeEl) iframeEl.style.display = 'none';
    } else {
      if (noKeyEl)  noKeyEl.classList.add('hidden');
      if (iframeEl) {
        iframeEl.style.display = 'block';
        iframeEl.src = buildEmbedUrl();
      }
      if (locEl) locEl.textContent = CONFIG.DEFAULT_LOCATION || '';
    }

    initialized = true;
  }

  // Appelé par le routeur à chaque entrée dans la vue
  function onEnter() {
    if (!initialized) init();
  }

  return { init, onEnter };
})();
