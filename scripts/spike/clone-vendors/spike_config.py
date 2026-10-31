"""Shared settings for the clone vendor spike (.plans/06-clone-vendor-decision.md)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent
RECORDINGS = ROOT / "recordings"
OUTPUTS = ROOT / "outputs"

# The fixed clone-test sentence plus two neutral sentences, so no provider is
# judged on one line only. None of these appear in src/content/phrases.ts,
# which the speakers read for their prompt recording.
SENTENCES = [
    "Every voice has a timbre, a colour that makes it yours and no one else's.",
    "The weather should clear up in time for the weekend.",
    "I finished the book you lent me, and I liked the ending.",
]

# Google's default en-US consent statement for Instant Custom Voice. Google
# doesn't accept a custom script; check the docs if the wording has changed.
GOOGLE_CONSENT_SCRIPT = (
    "I am the owner of this voice and I consent to Google using this voice "
    "to create a synthetic voice model."
)

AUDIO_EXTENSIONS = (".wav", ".m4a", ".mp3", ".webm", ".ogg", ".aac", ".flac")


def find_audio(folder: Path, stem: str) -> Path:
    """Return the one recording named `stem` with any supported extension."""
    matches = [p for p in folder.iterdir() if p.stem == stem and p.suffix.lower() in AUDIO_EXTENSIONS]
    if len(matches) != 1:
        raise SystemExit(f"{folder}: expected exactly one '{stem}' recording ({', '.join(AUDIO_EXTENSIONS)}), found {len(matches)}")
    return matches[0]


def speakers() -> list[Path]:
    if not RECORDINGS.is_dir():
        raise SystemExit(f"Missing {RECORDINGS}. See README.md for the folder layout.")
    folders = sorted(p for p in RECORDINGS.iterdir() if p.is_dir())
    if not folders:
        raise SystemExit(f"No speaker folders in {RECORDINGS}.")
    return folders
