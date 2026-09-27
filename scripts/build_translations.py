"""Add Traditional CUV and KJV verse text aligned to data/meta.json.

Run after build_data.py:
  python3 scripts/build_translations.py /path/to/chi-cuv.usfx.xml /path/to/eng-kjv.osis.xml

Both files: https://github.com/seven1m/open-bibles (public domain)
Writes data/verses.tw.json, data/verses.en.json and adds `tw` book names to meta.json.
Verses missing from a translation's versification are left empty.
"""

import html
import json
import re
import sys

from build_data import OUT, USFX, read_cuv


def read_kjv(path):
    """OSIS milestone verses: text between <verse sID> and <verse eID>, notes and titles dropped."""
    verses = {}
    current = None
    skip = 0
    with open(path, encoding="utf-8") as file:
        source = file.read()
    for token in re.split(r"(<[^>]+>)", source):
        if token.startswith("<"):
            if token.startswith("<verse") and "sID=" in token:
                book, chapter, verse = re.search(r'osisID="([^"]+)"', token).group(1).split(".")
                current = (book, int(chapter), int(verse))
                verses[current] = ""
            elif token.startswith("<verse") and "eID=" in token:
                current = None
            elif re.match(r"<(note|title)[\s>]", token) and not token.endswith("/>"):
                skip += 1
            elif re.match(r"</(note|title)>", token):
                skip = max(0, skip - 1)
        elif current and not skip:
            verses[current] += html.unescape(token)
    return verses


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    meta = json.loads((OUT / "meta.json").read_text(encoding="utf-8"))
    cuv = read_cuv(sys.argv[1])
    kjv = read_kjv(sys.argv[2])
    tw, en = [], []
    for book, xml_id in zip(meta["books"], USFX):
        book["tw"], chapters = cuv[xml_id]
        for chapter, count in enumerate(book["chapters"], 1):
            for verse in range(1, count + 1):
                tw.append(chapters.get(chapter, {}).get(verse, ""))
                en.append(kjv.get((book["abbr"], chapter, verse), ""))
    clean = lambda items: [re.sub(r"\s+", " ", item).strip() for item in items]
    for lang, items in (("tw", tw), ("en", en)):
        items = clean(items)
        (OUT / f"verses.{lang}.json").write_text(json.dumps(items, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print(lang, len(items), "verses,", sum(not item for item in items), "empty")
    note = "; CUV (Traditional) and KJV from seven1m/open-bibles"
    if note not in meta["generatedFrom"]:
        meta["generatedFrom"] += note
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
