/**
 * wakelock.js — Wake Lock API : garde l'écran allumé pendant la navigation.
 * Se réactive automatiquement si le document reprend le focus.
 */

const WakeLock = (() => {

  let lock = null;

  async function acquire() {
    if (!('wakeLock' in navigator)) return; // API non supportée
    try {
      lock = await navigator.wakeLock.request('screen');
    } catch (err) {
      // Silencieux : l'utilisateur peut avoir refusé ou l'onglet est en arrière-plan
    }
  }

  async function release() {
    if (lock) {
      await lock.release();
      lock = null;
    }
  }

  function init() {
    acquire();
    // Réacquérir après retour d'onglet au premier plan
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') acquire();
    });
  }

  return { init, acquire, release };
})();
