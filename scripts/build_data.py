"""Build static Scripture Atlas assets from OpenBible and public-domain CUV.

Usage:
  python3 scripts/build_data.py /path/to/cross-references.zip /path/to/chi-cuv-simp.usfx.xml

OpenBible: https://www.openbible.info/labs/cross-references/ (CC BY)
Chinese Union Version: https://github.com/seven1m/open-bibles (public domain)
"""

import html
import json
import re
import struct
import sys
import xml.etree.ElementTree as ET
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data"

# Canonical Protestant order. OpenBible abbreviations and USFX IDs share this order.
ABBR = "Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev".split()
EN = "Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split("|")
USFX = "GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split()


def read_cuv(path):
    root = ET.parse(path).getroot()
    by_id = {}
    for book in root.findall("book"):
        book_id = book.attrib["id"]
        title = (book.findtext("h") or book_id).strip()
        chapters = defaultdict(dict)
        chapter = None
        verse = None
        skip = 0
        # The USFX file stores verse text in element tails, including inline tags.
        for token in re.split(r"(<[^>]+>)", ET.tostring(book, encoding="unicode")):
            if not token:
                continue
            if token.startswith("<"):
                if re.match(r"<c\s", token):
                    match = re.search(r'id="(\d+)"', token)
                    chapter = int(match.group(1)) if match else None
                    verse = None
                elif re.match(r"<v\s", token):
                    match = re.search(r'id="(\d+)"', token)
                    verse = int(match.group(1)) if match else None
                    if chapter and verse:
                        chapters[chapter][verse] = ""
                elif token.startswith("<ve"):
                    verse = None
                elif re.match(r"<(f|x|note)(\s|>)", token):
                    skip += 1
                elif re.match(r"</(f|x|note)>", token):
                    skip = max(0, skip - 1)
            elif chapter and verse and not skip:
                chapters[chapter][verse] += html.unescape(token)
        by_id[book_id] = (title, chapters)
    return by_id


def parse_ref(raw, lookup):
    def one(part):
        match = re.fullmatch(r"([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)", part)
        if not match:
            raise ValueError(f"Unknown reference: {part}")
        return lookup.get((match.group(1), int(match.group(2)), int(match.group(3))))
    parts = raw.split("-")
    start = one(parts[0])
    end = one(parts[-1]) if len(parts) > 1 else start
    if start is None or end is None:
        return []
    return range(min(start, end), max(start, end) + 1)


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    cuv = read_cuv(sys.argv[2])
    books = []
    verses = []
    lookup = {}
    for abbr, en, xml_id in zip(ABBR, EN, USFX):
        zh, chapter_map = cuv[xml_id]
        start = len(verses)
        counts = []
        for chapter in sorted(chapter_map):
            chapter_verses = chapter_map[chapter]
            counts.append(max(chapter_verses))
            for verse in range(1, max(chapter_verses) + 1):
                index = len(verses)
                lookup[(abbr, chapter, verse)] = index
                verses.append(re.sub(r"\s+", " ", chapter_verses.get(verse, "")).strip())
        books.append({"abbr": abbr, "en": en, "zh": zh, "start": start, "count": len(verses) - start, "chapters": counts})

    pairs = {}
    skipped = 0
    with zipfile.ZipFile(sys.argv[1]) as archive:
        lines = archive.read("cross_references.txt").decode("utf-8-sig").splitlines()
    for line in lines[1:]:
        source, target, raw_votes = line.split("\t")[:3]
        srcs = parse_ref(source, lookup)
        dsts = parse_ref(target, lookup)
        if not srcs or not dsts:
            skipped += 1
            continue
        votes = int(raw_votes)
        for a in srcs:
            for b in dsts:
                if a == b:
                    continue
                key = (min(a, b), max(a, b))
                pairs[key] = max(pairs.get(key, -2**31), votes)

    nonpositive = sum(votes <= 0 for votes in pairs.values())
    pairs = {pair: votes for pair, votes in pairs.items() if votes > 0}

    OUT.mkdir(exist_ok=True)
    with (OUT / "references.bin").open("wb") as file:
        for (a, b), votes in sorted(pairs.items()):
            file.write(struct.pack("<IIi", a, b, votes))
    (OUT / "verses.json").write_text(json.dumps(verses, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    meta = {
        "books": books,
        "verseCount": len(verses),
        "sourceRows": len(lines) - 1,
        "edgeCount": len(pairs),
        "skippedRows": skipped,
        "nonpositivePairs": nonpositive,
        "generatedFrom": "OpenBible.info cross_references.txt 2026-09-21; Chinese Union Version (Simplified) from seven1m/open-bibles",
    }
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print({k: meta[k] for k in ("verseCount", "sourceRows", "edgeCount", "skippedRows", "nonpositivePairs")})


if __name__ == "__main__":
    main()
