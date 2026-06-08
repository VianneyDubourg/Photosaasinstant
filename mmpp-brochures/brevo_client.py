"""Envoi d'emails via l'API transactionnelle Brevo (HTTPS)."""

import base64
import re
from pathlib import Path

import requests

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

EMAIL_TEMPLATE_METROPOLE = """\
Bonjour {prenom},

Merci pour votre intérêt et votre demande de documentation via notre site.
Vous trouverez en pièce jointe la brochure complète qui présente notre formation, les objectifs pédagogiques ainsi que les modalités d'admission.

📌 Les demandes sont particulièrement nombreuses en cette période. Si vous souhaitez nous rejoindre pour l'année 2026-2027, nous vous conseillons de ne pas trop tarder pour réserver votre place.
👉 Cliquez ici pour effectuer votre demande et finaliser votre inscription : {url}

N'hésitez pas à revenir vers nous si vous avez des questions,

À très bientôt,
{sender_name}"""

EMAIL_TEMPLATE_ANTILLES = """\
Bonjour {prenom},

Merci pour votre intérêt et votre demande de documentation via notre site.
Vous trouverez en pièce jointe la brochure complète qui présente notre formation, les objectifs pédagogiques ainsi que les modalités d'admission.

📌 Les demandes sont particulièrement nombreuses en cette période. Si vous souhaitez nous rejoindre pour l'année 2026-2027, nous vous conseillons de ne pas trop tarder pour réserver votre place.
👉 Cliquez ici pour effectuer votre demande et finaliser votre inscription : {url}

N'hésitez pas à revenir vers nous si vous avez des questions,

À très bientôt,
{sender_name}"""


def _is_antilles_brochure(brochure_label: str, antilles_list: list[str]) -> bool:
    return brochure_label in antilles_list


def _build_body(
    prenom: str,
    brochures: list[str],
    antilles_list: list[str],
    url_metropole: str,
    url_antilles: str,
    sender_name: str,
) -> str:
    """Choisit le template selon la géographie de la première brochure."""
    is_antilles = any(_is_antilles_brochure(b, antilles_list) for b in brochures)
    template = EMAIL_TEMPLATE_ANTILLES if is_antilles else EMAIL_TEMPLATE_METROPOLE
    url = url_antilles if is_antilles else url_metropole
    return template.format(prenom=prenom or "Madame, Monsieur", url=url, sender_name=sender_name)


def send_brochures(
    api_key: str,
    sender_name: str,
    sender_email: str,
    to_email: str,
    prenom: str,
    brochures: list[str],
    brochure_files: dict[str, str],
    brochures_dir: str,
    antilles_list: list[str],
    url_metropole: str,
    url_antilles: str,
    dry_run: bool = False,
) -> dict:
    """
    Envoie les brochures par email.
    Retourne {"success": True} ou {"success": False, "error": "..."}.
    """
    # Construire les pièces jointes
    attachments = []
    missing = []
    for label in brochures:
        filename = brochure_files.get(label)
        if not filename:
            # Essai normalisation partielle (insensible à la casse)
            for key, val in brochure_files.items():
                if key.lower().strip() == label.lower().strip():
                    filename = val
                    break
        if not filename:
            missing.append(label)
            continue

        pdf_path = Path(brochures_dir) / filename
        if not pdf_path.exists():
            missing.append(f"{label} (fichier {filename} introuvable)")
            continue

        with open(pdf_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
        attachments.append({"content": encoded, "name": filename})

    if missing:
        return {
            "success": False,
            "error": f"Brochure(s) inconnue(s) ou fichier manquant : {', '.join(missing)}",
        }

    body_text = _build_body(prenom, brochures, antilles_list, url_metropole, url_antilles, sender_name)

    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": to_email}],
        "subject": "Votre documentation MMPP Prépa Santé",
        "textContent": body_text,
        "attachment": attachments,
    }

    if dry_run:
        return {"success": True, "dry_run": True, "payload_preview": payload}

    try:
        resp = requests.post(
            BREVO_API_URL,
            json=payload,
            headers={"api-key": api_key, "Content-Type": "application/json"},
            timeout=30,
        )
        resp.raise_for_status()
        return {"success": True, "message_id": resp.json().get("messageId")}
    except requests.exceptions.HTTPError as e:
        detail = ""
        try:
            detail = e.response.json().get("message", str(e))
        except Exception:
            detail = str(e)
        return {"success": False, "error": f"Brevo HTTP {e.response.status_code}: {detail}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Erreur réseau Brevo: {e}"}
