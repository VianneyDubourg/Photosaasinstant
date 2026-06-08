"""Gmail API client — lecture des mails et gestion des labels."""

import base64
import json
import os
from pathlib import Path
from typing import Optional

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]
TOKEN_PATH = Path("token.json")
CREDENTIALS_PATH = Path("credentials.json")


def get_service():
    """Authentifie et retourne un client Gmail API."""
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_PATH.exists():
                raise FileNotFoundError(
                    "credentials.json introuvable. Télécharge-le depuis Google Cloud Console."
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_PATH), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as f:
            f.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def get_or_create_label(service, label_name: str) -> str:
    """Retourne l'id du label, le crée s'il n'existe pas."""
    labels = service.users().labels().list(userId="me").execute().get("labels", [])
    for lbl in labels:
        if lbl["name"] == label_name:
            return lbl["id"]

    created = service.users().labels().create(
        userId="me",
        body={"name": label_name, "labelListVisibility": "labelShow", "messageListVisibility": "show"},
    ).execute()
    return created["id"]


def fetch_unprocessed_messages(service, query: str, processed_label_id: str) -> list[dict]:
    """
    Retourne les messages correspondant à la query et n'ayant pas le label traité.
    Chaque élément est le dict complet du message Gmail.
    """
    full_query = f"{query} -label:{processed_label_id}"
    result = service.users().messages().list(userId="me", q=full_query).execute()
    messages = result.get("messages", [])

    full_messages = []
    for msg in messages:
        try:
            full = service.users().messages().get(
                userId="me", msgId=msg["id"], format="full"
            ).execute()
            full_messages.append(full)
        except HttpError as e:
            print(f"[Gmail] Erreur chargement message {msg['id']}: {e}")

    return full_messages


def get_message_body(message: dict) -> str:
    """Extrait le corps texte brut d'un message Gmail (gère multipart)."""
    payload = message.get("payload", {})

    def _decode_part(part):
        data = part.get("body", {}).get("data", "")
        if data:
            return base64.urlsafe_b64decode(data + "==").decode("utf-8", errors="replace")
        return ""

    def _walk(part):
        mime = part.get("mimeType", "")
        if mime == "text/plain":
            return _decode_part(part)
        if "parts" in part:
            for sub in part["parts"]:
                text = _walk(sub)
                if text:
                    return text
        return ""

    return _walk(payload)


def mark_as_processed(service, message_id: str, processed_label_id: str):
    """Applique le label MMPP-Traite au message."""
    service.users().messages().modify(
        userId="me",
        id=message_id,
        body={"addLabelIds": [processed_label_id]},
    ).execute()
