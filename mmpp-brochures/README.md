# MMPP Brochures — Setup pas à pas

Application macOS locale pour le traitement automatique des demandes de brochures MMPP Prépa Santé.

---

## Prérequis

- macOS avec Python 3.11+
- Un compte Google avec accès à la boîte Gmail de réception des notifications

---

## 1. Installer Python 3.11+

Si ce n'est pas déjà fait :
```bash
brew install python@3.11
```

Vérifie :
```bash
python3 --version   # doit afficher 3.11.x ou supérieur
```

---

## 2. Créer l'environnement virtuel et installer les dépendances

```bash
cd ~/Bureau/mmpp-brochures        # ou l'endroit où tu as copié le dossier
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 3. Configurer l'API Gmail (OAuth Desktop)

### 3a. Créer un projet Google Cloud

1. Va sur https://console.cloud.google.com/
2. Crée un nouveau projet (ex : `MMPP Brochures`)
3. Cherche **Gmail API** dans la bibliothèque → **Activer**

### 3b. Configurer l'écran de consentement OAuth

1. Menu → **APIs & Services** → **OAuth consent screen**
2. Type : **External** → Créer
3. Remplis : Nom de l'app (`MMPP Brochures`), email de support
4. Ajoute ton email dans **Test users**
5. Enregistre

### 3c. Créer les identifiants OAuth

1. Menu → **APIs & Services** → **Credentials**
2. **+ Create Credentials** → **OAuth client ID**
3. Type : **Desktop app** → Nom : `MMPP Brochures Local`
4. Télécharge le JSON → renomme-le en **`credentials.json`**
5. Place-le dans le dossier `mmpp-brochures/`

---

## 4. Configurer l'application

```bash
cp config.example.json config.json
```

Édite `config.json` et remplis :

| Champ | Description |
|-------|-------------|
| `brevo_api_key` | Ta clé API Brevo (SMTP Transactionnel → API Keys) |
| `sender_email` | L'adresse **vérifiée dans Brevo** (Senders & IPs) |
| `sender_name` | Nom d'expéditeur affiché |
| `excel_path` | Chemin absolu ou relatif vers le fichier Excel (ex: `suivi_brochures.xlsx`) |
| `excel_sheet` | Nom de l'onglet : `Brochures` |
| `brochures_dir` | Chemin du dossier des PDF (par défaut : `brochures`) |

---

## 5. Placer les brochures PDF

Copie tes fichiers PDF dans le dossier `brochures/` en les nommant exactement ainsi :

| Libellé formulaire | Nom de fichier |
|---|---|
| PASS-LAS Bordeaux | `pass-las-bordeaux.pdf` |
| PASS-LAS Pau | `pass-las-pau.pdf` |
| Paramédical & social / Paramédical et social | `paramedical-social.pdf` |
| PASS-LAS Antilles | `pass-las-antilles.pdf` |
| Paramédical Antilles | `paramedical-antilles.pdf` |
| PASS-LAS Guadeloupe | `pass-las-guadeloupe.pdf` |
| PASS-LAS Martinique | `pass-las-martinique.pdf` |
| IFSI ORTHOPHONIE Guadeloupe | `ifsi-orthophonie-guadeloupe.pdf` |
| IFSI / Orthophonie Martinique | `ifsi-orthophonie-martinique.pdf` |

> Si tes fichiers ont d'autres noms, modifie simplement la section `brochure_files` dans `config.json`.

---

## 6. Premier lancement (authentification Gmail)

```bash
source .venv/bin/activate
python3 app.py
```

Au **premier lancement**, une fenêtre de navigateur s'ouvre automatiquement :
1. Connecte-toi avec le compte Gmail concerné
2. Accepte les permissions (`Gmail - modify`)
3. La fenêtre se ferme, un fichier `token.json` est créé localement

Les lancements suivants ne demandent plus d'authentification (token auto-renouvelé).

---

## 7. Utilisation quotidienne

1. Double-clique sur `launch.command` (voir ci-dessous) **ou** lance en terminal :
   ```bash
   cd ~/Bureau/mmpp-brochures && source .venv/bin/activate && python3 app.py
   ```
2. Clique sur **▶ Traiter les nouvelles demandes**
3. Le journal affiche chaque étape en temps réel

### Créer un lanceur double-clic (launch.command)

```bash
cat > ~/Bureau/mmpp-brochures/launch.command << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
source .venv/bin/activate
python3 app.py
EOF
chmod +x ~/Bureau/mmpp-brochures/launch.command
```

---

## 8. Mode dry-run (test)

Coche **"Mode dry-run"** dans l'interface : tout est simulé (Excel écrit, Brevo non appelé, mail non marqué traité). Parfait pour valider le parsing sans spammer.

---

## Structure du projet

```
mmpp-brochures/
├── app.py              # GUI + orchestration
├── gmail_client.py     # Lecture Gmail + gestion labels
├── parser.py           # Extraction des champs du mail
├── brevo_client.py     # Envoi via API Brevo
├── excel_logger.py     # Écriture Excel
├── config.json         # Secrets (ne jamais committer)
├── config.example.json # Modèle sans secrets
├── credentials.json    # OAuth Google (fourni par toi)
├── token.json          # Token auto-généré (ne pas supprimer)
├── brochures/          # Les PDF
├── suivi_brochures.xlsx # Créé automatiquement au 1er traitement
├── requirements.txt
└── README.md
```

---

## Dépannage

| Problème | Solution |
|---|---|
| `credentials.json introuvable` | Télécharge depuis Google Cloud Console (étape 3c) |
| `Le fichier Excel est ouvert` | Ferme Excel puis relance |
| `Brevo HTTP 401` | Vérifie la clé API dans config.json |
| `Brochure inconnue` | Vérifie le libellé exact dans config.json → brochure_files |
| Le label `MMPP-Traite` n'apparaît pas | Il se crée automatiquement au 1er traitement |
| Mail retraité par erreur | Impossible : idempotence garantie par le label Gmail |
