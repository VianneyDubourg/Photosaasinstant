# PhotoInstant — Mode d'emploi terrain
## À imprimer et garder dans le sac

---

## AVANT DE PARTIR

- [ ] Appareil photo chargé + carte SD vide
- [ ] Laptop chargé + câble secteur
- [ ] Tablette chargée + câble secteur
- [ ] QR codes imprimés (ou affichés sur tablette secondaire)

---

## 1. DÉMARRER L'OUTIL D'UPLOAD (Laptop)

Ouvrir **PowerShell** puis :

```
cd C:\Users\viann\Desktop\PhotoInstant\automation
npm run dev
```

Le terminal demande :
```
📍 Location for this session: _
```

→ Taper le nom du lieu (ex: `Surry Hills`, `Sydney CBD`) puis **Entrée**

✅ L'outil est prêt quand tu vois :
```
Watching folder: C:\Users\viann\Pictures\PhotoInstant
```

**Laisser le terminal ouvert toute la soirée.**

---

## 2. DÉMARRER LA TABLETTE

1. Ouvrir **Chrome**
2. Aller sur **vlogo.fr/admin/login**
3. Se connecter : `hello@vlogo.fr` + mot de passe
4. Aller sur **vlogo.fr/slideshow**
5. Mettre en **plein écran**
6. Poser la tablette bien visible avec le QR code face aux clients

---

## 3. PENDANT LA SOIRÉE

1. **Prendre les photos** normalement avec l'appareil
2. Copier les fichiers JPG dans le dossier :
   ```
   C:\Users\viann\Pictures\PhotoInstant
   ```
3. L'outil upload **automatiquement** en moins de 60 secondes
4. La photo apparaît sur **vlogo.fr/photos** 🎉

> **Astuce** : copier les photos par batch toutes les 30-45 min
> plutôt qu'une par une

---

## 4. EN CAS DE PROBLÈME

**La photo n'apparaît pas sur le site**
→ Vérifier que le terminal PowerShell est toujours ouvert
→ Vérifier la connexion WiFi du laptop

**Un client ne trouve pas sa photo**
→ Filtrer par heure dans la galerie
→ Si introuvable : DM Instagram **@vlogo.photoinstant**

**Un client a payé mais ne peut pas télécharger**
→ Lui donner l'URL : `vlogo.fr/success?token=cs_test_...` (dans Stripe Dashboard → Payments)
→ Contact : **hello@vlogo.fr**

**L'outil plante**
→ Fermer PowerShell
→ Relancer : `cd C:\Users\viann\Desktop\PhotoInstant\automation` puis `npm run dev`
→ Les photos déjà uploadées ne sont pas perdues

---

## 5. FIN DE SOIRÉE

1. **Arrêter l'outil** : Ctrl+C dans PowerShell
2. **Vérifier l'admin** : vlogo.fr/admin → voir les ventes du soir
3. **Supprimer les photos de test** si besoin : vlogo.fr/admin/photos
4. Les photos sont **supprimées automatiquement** après 10h — rien à faire

---

## CONTACTS & LIENS UTILES

| | |
|---|---|
| Site | vlogo.fr |
| Admin | vlogo.fr/admin |
| Slideshow | vlogo.fr/slideshow |
| Email | hello@vlogo.fr |
| Instagram | @vlogo.photoinstant |
| Supabase | supabase.com |
| Stripe | dashboard.stripe.com |

---

*PhotoInstant · vlogo.fr · hello@vlogo.fr*
