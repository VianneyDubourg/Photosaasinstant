# PhotoInstant — Complete Platform Brief
## Document de référence pour création de contenu & communication

---

## 1. C'est quoi PhotoInstant ?

PhotoInstant est une plateforme de photographie événementielle instantanée basée en Australie. L'idée est simple : un photographe professionnel shoote un événement (bar, club, festival, soirée étudiante…), et **les photos sont disponibles sur le site en moins de 2 minutes** après la prise de vue. Les participants scannent un QR code, trouvent leur photo, paient 1 AUD et téléchargent la version HD instantanément. Pas d'appli, pas de compte, pas d'attente.

**Le problème qu'on résout :** les photographes événementiels traditionnels livrent en 3 jours. À ce moment-là, personne ne poste plus. L'énergie de la soirée est morte, le moment est passé. PhotoInstant livre pendant la soirée — quand les gens sont encore dans l'ambiance, qu'ils veulent partager, que l'algorithme récompense.

---

## 2. Le photographe — Vianney Dubourg

- Photographe professionnel basé en Australie
- Shoote sur **Panasonic Lumix S5IIX** — un des meilleurs hybrides plein format du marché
- Fondateur de PhotoInstant — a conçu et développé toute la plateforme technique
- Contact : hello@vlogo.fr
- Instagram : @photoinstant
- Site : vlogo.fr

---

## 3. Le matériel & le setup sur place

**Sur le terrain, Vianney arrive avec :**
- Son appareil photo Panasonic Lumix S5IIX + objectifs
- Un laptop Windows (Surface Go 3) qui tourne le logiciel d'upload automatique
- Des supports QR code (à poser au bar, à l'entrée, sur les tables)

**Ce qui se passe techniquement :**
1. Vianney prend une photo
2. Le fichier arrive automatiquement dans le dossier surveillé par le logiciel sur le laptop
3. Le logiciel génère une preview basse résolution avec filigrane "PREVIEW" + la version HD avec un copyright discret
4. Les deux fichiers sont uploadés sur les serveurs (Supabase/AWS) en moins de 60 secondes
5. La photo apparaît immédiatement sur le site vlogo.fr, visible par tous

**Zero intervention manuelle.** Vianney shoote, le reste est automatique.

---

## 4. L'expérience côté participant

1. **Scan** — le participant scanne le QR code affiché dans la salle
2. **Galerie** — il arrive sur vlogo.fr/photos et voit toutes les photos de la soirée en preview watermarkée (basse résolution, impossible à utiliser)
3. **Filtres** — il peut filtrer par heure (ex : "je cherche ma photo prise entre 23h et minuit") ou par lieu
4. **Il trouve sa photo** — clique dessus, voit le détail
5. **Paiement** — 1 AUD via Stripe (carte bancaire, Apple Pay, Google Pay) — sécurisé, aucune donnée carte stockée
6. **Téléchargement** — il reçoit immédiatement un lien de téléchargement + un email de confirmation avec le lien. La photo HD sans watermark est dans son téléphone en quelques secondes
7. **Il poste** — pendant la soirée, pendant que l'ambiance est encore là

**Durée totale de l'expérience : moins de 2 minutes.**

---

## 5. La plateforme technique — vlogo.fr

**Site web (React, Tailwind CSS, dark premium theme)**

- `/` — Page d'accueil
- `/photos` — Galerie avec filtres (date, heure de début, heure de fin, lieu). Pagination 48 photos par page.
- `/photo/:id` — Page détail d'une photo. Aperçu watermarké, prix, bouton d'achat.
- `/success` — Page post-achat. Bouton de téléchargement HD, rappel d'expiration 10h, contacts support.
- `/brochure` — Formulaire de téléchargement de la brochure commerciale (pour les bars/venues). Nom, email, nom du venue — envoie automatiquement le PDF par mail.
- `/terms`, `/privacy`, `/refund` — Pages légales conformes Australian Consumer Law + Privacy Act 1988.

**Admin (accès restreint, Vianney seulement)**
- `/admin` — Dashboard : photos actives, commandes du jour, de la semaine, revenus, taux de conversion
- `/admin/photos` — Gestion des photos (upload manuel, suppression)
- `/admin/orders` — Toutes les commandes Stripe avec détail
- `/admin/leads` — Tous les contacts B2B (bars/venues) ayant téléchargé la brochure, avec bouton "Follow up" par mail

**Tablette sur place (`/slideshow`)**
- Écran plein format qui tourne en boucle sur les photos de la soirée
- Affiche le QR code, le prix "1$", et les 3 étapes (scan → find → download)
- Protégé par authentification — uniquement accessible pour Vianney

---

## 6. Le modèle économique

### Option A — Budget Booking (pour les venues)
- Le venue paie un **tarif réduit** pour réserver le photographe
- Les participants paient **1 AUD** pour leur photo
- Le photographe est rentabilisé en partie par les ventes de photos
- Idéal pour : bars, clubs, soirées régulières, événements étudiants

### Option B — Full Service (premium)
- Le venue paie le **tarif plein** du photographe
- Les participants téléchargent leurs photos **gratuitement**
- Expérience premium, satisfaction maximale des guests
- Idéal pour : activations de marque, événements corporate, venues haut de gamme, soirées privées, lancements de produit

### Ce que ça coûte aux participants
- **1 AUD** = environ 0,60€ = prix symbolique, quasi nul
- Barrière psychologique minimale → taux de conversion élevé

---

## 7. La logique de viralité

C'est le cœur de la proposition de valeur pour les venues :

- **Instagram Stories disparaissent en 24h.** Une photo partagée le soir même génère 3x plus d'engagement qu'une photo partagée 3 jours plus tard.
- **L'algorithme récompense le temps réel.** Un post de soirée fait le lendemain matin est invisible comparé à un post fait à minuit, pendant que l'énergie est encore là.
- **Chaque participant devient un vecteur de communication gratuit.** 50 personnes à un événement. Si 10 postent leur photo avec le venue taggé = 10 stories organiques, touchant potentiellement des milliers de personnes, sans que le venue n'ait rien fait ni dépensé.

**Formule :** PhotoInstant transforme chaque soirée en campagne de contenu organique spontané.

---

## 8. Les garanties et la sécurité

- **Photos disponibles 10 heures** après l'événement, puis supprimées automatiquement des serveurs (propre, aucun stockage long terme des previews)
- **Photos HD** supprimées des serveurs après 10h — les originaux restent uniquement sur le disque de Vianney
- **Paiement sécurisé via Stripe** — aucune donnée bancaire stockée sur la plateforme
- **Lien de téléchargement** unique, valable 10h, non partageable efficacement (URL signée Supabase expirante)
- **Pas d'accès aux HD sans paiement** — bucket privé, impossible d'accéder directement aux fichiers
- **Conformité légale** : Australian Consumer Law, Privacy Act 1988, ABN australien

---

## 9. Les cas d'usage

| Type d'événement | Pourquoi ça marche |
|---|---|
| 🍸 Bars & clubs | Soirées régulières, clientèle jeune qui poste sur les réseaux |
| 🎓 Événements étudiants | Uni balls, O-week, college parties — ils VONT poster |
| 🎪 Festivals | Grands rassemblements, forte densité de participants |
| 🏢 Corporate | Lancements produit, team events, activations de marque |
| 🎉 Soirées privées | Anniversaires, mariages, fêtes — souvenir premium |
| 🎭 Brand activations | Pop-ups, influencer events, soirées PR |

---

## 10. Stack technique (pour les curieux)

- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Storage + Edge Functions Deno)
- **Paiement** : Stripe Checkout + Webhooks
- **Email transactionnel** : Resend (confirmation d'achat, livraison brochure, notifs photographe)
- **Outil d'upload** : Application Windows custom (Node.js/TypeScript + Sharp + Chokidar) — tourne en arrière-plan sur le laptop pendant le shoot
- **Hébergement** : LWS (vlogo.fr), Supabase (AWS us-east-1)

---

## 11. Identité visuelle

- **Couleurs** : Fond `#05050a` (noir profond), violet `#7c3aed`, violet clair `#a78bfa`, blanc, accents rose/dégradé
- **Ambiance** : Dark, premium, nightlife haut de gamme — entre boîte de nuit et startup tech
- **Typographie** : Sans-serif bold pour les titres, regular pour le corps
- **Ton** : Confiant, direct, pas de blabla. "1 AUD. HD. Instant."

---

## 12. Ce qui différencie PhotoInstant

| | PhotoInstant | Photographe traditionnel | Photo booth |
|---|---|---|---|
| Délai de livraison | **< 2 minutes** | 3-5 jours | Immédiat mais basse qualité |
| Qualité | **HD full frame** | HD | Basse à moyenne |
| Prix pour le participant | **1 AUD** | Inclus ou non disponible | Souvent gratuit mais inutilisable |
| Viralité soirée | **Maximum** | Nulle | Faible |
| Setup pour le venue | **Zero** | Coordination nécessaire | Installation lourde |
| Suppression auto données | **10h** | Non | Non |

---

## 13. Contact & liens

- **Site** : vlogo.fr
- **Email** : hello@vlogo.fr
- **Instagram** : @photoinstant
- **Galerie photos** : vlogo.fr/photos
- **Brochure (PDF)** : vlogo.fr/brochure
- **Tarifs & devis** : hello@vlogo.fr

---

*Document généré le 1 juin 2026 — PhotoInstant · Vianney Dubourg · Australie*
