/**
 * clock.js — Horloge en temps réel dans la barre de statut
 * Met à jour l'heure toutes les secondes.
 */

const Clock = (() => {

  const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const MOIS  = ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'juin',
                 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.'];

  let elHeure = null;
  let elDate  = null;
  let timer   = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = new Date();
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());

    if (elHeure) elHeure.textContent = `${h}:${m}`;

    if (elDate) {
      const j = JOURS[now.getDay()];
      const d = now.getDate();
      const mo = MOIS[now.getMonth()];
      elDate.textContent = `${j} ${d} ${mo}`;
    }
  }

  function init() {
    elHeure = document.getElementById('clock');
    elDate  = document.getElementById('clock-date');
    tick();
    // Synchroniser sur le changement de minute
    const maintenant = new Date();
    const msJusquaLaSeconde = 1000 - maintenant.getMilliseconds();
    setTimeout(() => {
      tick();
      timer = setInterval(tick, 1000);
    }, msJusquaLaSeconde);
  }

  function destroy() {
    if (timer) clearInterval(timer);
  }

  return { init, destroy };
})();
