#!/usr/bin/env python3
"""Build the blind listening test from the generated clips.

Shuffles the Google and CosyVoice clips together with each speaker's real
recording of the sentences, renames them to plain numbers, and writes:

    listening-test/clips/NNN.wav   what listeners hear
    listening-test/sheet.csv       one row per clip, for listeners to score
    listening-test/key.csv         which provider made each clip (keep it from listeners)

Usage: python3 make_listening_test.py [--seed 7]
"""

import argparse
import csv
import random
import shutil
import subprocess

from spike_config import OUTPUTS, ROOT, find_audio, speakers

PROVIDERS = ("google", "cosyvoice")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()

    entries = []
    for provider in PROVIDERS:
        for clip in sorted((OUTPUTS / provider).glob("*.wav")):
            speaker, sentence = clip.stem.rsplit("_", 1)
            entries.append({"source": clip, "speaker": speaker, "sentence": sentence, "provider": provider})
    if not entries:
        raise SystemExit(f"No clips in {OUTPUTS}/google or {OUTPUTS}/cosyvoice. Run the generators first.")
    for folder in speakers():
        entries.append({"source": find_audio(folder, "real"), "speaker": folder.name, "sentence": "1", "provider": "real"})

    random.Random(args.seed).shuffle(entries)
    out = ROOT / "listening-test"
    if out.exists():
        shutil.rmtree(out)
    (out / "clips").mkdir(parents=True)

    with open(out / "sheet.csv", "w", newline="") as sheet, open(out / "key.csv", "w", newline="") as key:
        sheet_writer = csv.writer(sheet)
        key_writer = csv.writer(key)
        sheet_writer.writerow(["clip", "speaker", "sounds_like_them_1_to_5", "natural_1_to_5", "real_or_clone"])
        key_writer.writerow(["clip", "speaker", "sentence", "provider"])
        for number, entry in enumerate(entries, start=1):
            clip_id = f"{number:03d}"
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-i", str(entry["source"]), "-ac", "1", "-ar", "24000", str(out / "clips" / f"{clip_id}.wav")],
                check=True,
            )
            sheet_writer.writerow([clip_id, entry["speaker"], "", "", ""])
            key_writer.writerow([clip_id, entry["speaker"], entry["sentence"], entry["provider"]])

    print(f"{len(entries)} clips in {out / 'clips'}. Share the clips and sheet.csv; keep key.csv private.")


if __name__ == "__main__":
    main()
