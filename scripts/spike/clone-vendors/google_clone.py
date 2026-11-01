#!/usr/bin/env python3
"""Generate Google Instant Custom Voice clips for the clone vendor spike.

Uses key-only voice cloning: Google returns a voice cloning key and keeps no
voice profile. The key is held in memory only and is never written to disk.

Usage:
    gcloud auth login
    python3 google_clone.py --project YOUR_PROJECT_ID [--dry-run]

Needs gcloud and ffmpeg on PATH. Standard library only.
Request shapes follow Google's Chirp 3 Instant Custom Voice docs
(https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice).
If a call fails with a field error, compare the body here with the current docs.
"""

import argparse
import base64
import json
import subprocess
import time
import urllib.error
import urllib.request

from spike_config import GOOGLE_CONSENT_SCRIPT, OUTPUTS, SENTENCES, find_audio, speakers

API = "https://texttospeech.googleapis.com/v1beta1"
SAMPLE_RATE = 24000


def to_wav(path) -> bytes:
    """Convert any recording to 24 kHz mono 16-bit WAV, as LINEAR16 expects."""
    return subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SAMPLE_RATE), "-acodec", "pcm_s16le", "-f", "wav", "pipe:1"],
        check=True,
        capture_output=True,
    ).stdout


def access_token() -> str:
    return subprocess.run(["gcloud", "auth", "print-access-token"], check=True, capture_output=True, text=True).stdout.strip()


def post(path: str, body: dict, project: str, token: str) -> dict:
    request = urllib.request.Request(
        f"{API}/{path}",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "x-goog-user-project": project,
            "Content-Type": "application/json; charset=utf-8",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")
        hint = ""
        if error.code == 403:
            hint = "\nA 403 often means Instant Custom Voice isn't enabled for this project (it may need allow-listing), or the API isn't enabled."
        raise SystemExit(f"POST {path} failed with HTTP {error.code}:\n{detail}{hint}") from None


def audio(wav: bytes) -> dict:
    return {"audio_config": {"audio_encoding": "LINEAR16"}, "content": base64.b64encode(wav).decode()}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--project", required=True, help="Google Cloud project ID (on the free trial)")
    parser.add_argument("--language", default="en-US")
    parser.add_argument("--dry-run", action="store_true", help="check recordings and conversions without calling Google")
    args = parser.parse_args()

    out_dir = OUTPUTS / "google"
    out_dir.mkdir(parents=True, exist_ok=True)
    token = None if args.dry_run else access_token()
    timings = []

    for folder in speakers():
        speaker = folder.name
        prompt = to_wav(find_audio(folder, "prompt"))
        consent = to_wav(find_audio(folder, "consent"))
        print(f"{speaker}: prompt {len(prompt) // 1024} KB, consent {len(consent) // 1024} KB")
        if args.dry_run:
            continue

        started = time.monotonic()
        key = post(
            "voices:generateVoiceCloningKey",
            {
                "reference_audio": audio(prompt),
                "voice_talent_consent": audio(consent),
                "consent_script": GOOGLE_CONSENT_SCRIPT,
                "language_code": args.language,
            },
            args.project,
            token,
        )["voiceCloningKey"]
        key_seconds = time.monotonic() - started

        for index, text in enumerate(SENTENCES, start=1):
            started = time.monotonic()
            result = post(
                "text:synthesize",
                {
                    "input": {"text": text},
                    "voice": {"language_code": args.language, "voice_clone": {"voice_cloning_key": key}},
                    "audioConfig": {"audioEncoding": "LINEAR16", "sample_rate_hertz": SAMPLE_RATE},
                },
                args.project,
                token,
            )
            target = out_dir / f"{speaker}_{index}.wav"
            target.write_bytes(base64.b64decode(result["audioContent"]))
            timings.append(
                {"speaker": speaker, "sentence": index, "key_seconds": round(key_seconds, 2), "synthesis_seconds": round(time.monotonic() - started, 2), "characters": len(text)}
            )
            print(f"  wrote {target.name}")
        del key

    if not args.dry_run:
        (out_dir / "timings.json").write_text(json.dumps(timings, indent=2))
        characters = sum(t["characters"] for t in timings)
        print(f"Done: {len(timings)} clips, {characters} characters synthesised. Timings in {out_dir / 'timings.json'}.")


if __name__ == "__main__":
    main()
