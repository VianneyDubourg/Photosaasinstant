"""
Parsing du corps d'un mail de notification MMPP.

Un mail peut contenir plusieurs blocs (Métropole + Antilles).
Chaque bloc produit un dict de demande.
"""

import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Demande:
    nom: str = ""
    prenom: str = ""
    email: str = ""
    telephone: str = ""
    scolarite: str = ""
    brochures: list[str] = field(default_factory=list)
    raw_block: str = ""
    errors: list[str] = field(default_factory=list)

    @property
    def is_valid(self) -> bool:
        return bool(self.email) and bool(self.brochures) and not self.errors


def _extract_field(pattern: str, text: str, flags=re.IGNORECASE) -> Optional[str]:
    m = re.search(pattern, text, flags)
    if m:
        return m.group(1).strip()
    return None


def _split_blocks(body: str) -> list[str]:
    """
    Découpe le corps en blocs individuels.
    Chaque bloc commence par une ligne d'introduction type
    'Mail brochure ...' ou 'Bonjour,' suivi du contenu du formulaire.
    Stratégie : on coupe sur les lignes qui ressemblent à un en-tête de bloc.
    """
    # Marqueurs d'en-tête de bloc
    header_re = re.compile(
        r"(?:mail\s+brochure[^:\n]*:|bonjour\s*,?\s*\n\s*envo[yi])",
        re.IGNORECASE,
    )
    positions = [m.start() for m in header_re.finditer(body)]

    if not positions:
        return [body]

    blocks = []
    for i, pos in enumerate(positions):
        end = positions[i + 1] if i + 1 < len(positions) else len(body)
        blocks.append(body[pos:end])
    return blocks


def parse_body(body: str) -> list[Demande]:
    """Parse le corps complet et retourne une liste de Demande."""
    blocks = _split_blocks(body)
    demandes = []
    for block in blocks:
        d = _parse_block(block)
        if d is not None:
            demandes.append(d)
    return demandes


def _parse_block(block: str) -> Optional[Demande]:
    """Parse un bloc individuel."""
    # Ignorer les blocs sans champs formulaire
    if not re.search(r"nom\s*:", block, re.IGNORECASE):
        return None

    d = Demande(raw_block=block)

    d.nom = _extract_field(r"^nom\s*:\s*(.+)$", block, re.IGNORECASE | re.MULTILINE) or ""
    d.prenom = _extract_field(r"^pr[eé]nom\s*:\s*(.+)$", block, re.IGNORECASE | re.MULTILINE) or ""
    d.telephone = _extract_field(r"^t[eé]l[eé]phone\s*:\s*(.+)$", block, re.IGNORECASE | re.MULTILINE) or ""
    d.scolarite = _extract_field(r"^scolarit[eé]\s*:\s*(.+)$", block, re.IGNORECASE | re.MULTILINE) or ""

    # Email — chercher d'abord le champ "email :", sinon une adresse dans le bloc
    raw_email = _extract_field(r"^email\s*:\s*(.+)$", block, re.IGNORECASE | re.MULTILINE)
    if raw_email and re.match(r"[^@]+@[^@]+\.[^@]+", raw_email):
        d.email = raw_email
    else:
        fallback = re.search(r"[\w.+-]+@[\w-]+\.[a-z]{2,}", block, re.IGNORECASE)
        if fallback:
            d.email = fallback.group(0)

    if not d.email:
        d.errors.append("Email manquant ou illisible")

    # Brochures — peut contenir plusieurs valeurs séparées par virgule / point-virgule / &
    raw_brochures = _extract_field(r"^brochures?\s*:\s*(.+)$", block, re.IGNORECASE | re.MULTILINE)
    if raw_brochures:
        parts = re.split(r"[,;|/](?!\s*LAS)", raw_brochures)
        d.brochures = [p.strip() for p in parts if p.strip()]
    else:
        d.errors.append("Champ brochure manquant ou illisible")

    return d
