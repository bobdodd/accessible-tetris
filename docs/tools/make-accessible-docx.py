#!/usr/bin/env python3
"""Post-process the pandoc-generated case-study docx for accessibility.

Pandoc writes the markdown's literal heading numbers ("11.1 ...") as plain
text inside the heading, which a screen reader announces as content and Word's
outline tools can't renumber. This script converts them to REAL multilevel
list numbering attached to the heading paragraphs:

  1. adds a two-level numbering definition to word/numbering.xml
     (level 0 -> "%1.", level 1 -> "%1.%2", space suffix, no indent);
  2. for every Heading-2 paragraph starting with a literal "N. " and every
     Heading-3 starting with "N.N " it strips the literal text and attaches
     numPr referencing the definition. Unnumbered headings (the title, "A
     note on sources") are left untouched, so they stay outside the scheme.

Alt text is handled upstream (pandoc {alt="..."} attributes -> wp:docPr descr);
this script verifies every image carries one and fails loudly if not.

Usage:  python3 make-accessible-docx.py "Accessible Tetris - Case Study.docx"
(Rebuild pipeline: pandoc case-study.md --resource-path=. --toc --toc-depth=2
 -o <docx>  &&  python3 tools/make-accessible-docx.py <docx>)
"""
import re
import shutil
import sys
import zipfile

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

NUMBERING_FRAGMENT = """<w:abstractNum w:abstractNumId="{aid}" xmlns:w="{W}">
<w:multiLevelType w:val="multilevel"/>
<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:suff w:val="space"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="0" w:firstLine="0"/></w:pPr></w:lvl>
<w:lvl w:ilvl="1"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:suff w:val="space"/><w:lvlText w:val="%1.%2"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="0" w:firstLine="0"/></w:pPr></w:lvl>
</w:abstractNum>"""

NUM_FRAGMENT = '<w:num w:numId="{nid}" xmlns:w="{W}"><w:abstractNumId w:val="{aid}"/></w:num>'


def next_id(xml: str, attr: str) -> int:
    ids = [int(m) for m in re.findall(attr + r'="(\d+)"', xml)]
    return (max(ids) + 1) if ids else 1


def add_numbering(numbering: str) -> tuple[str, int]:
    aid = next_id(numbering, "w:abstractNumId")
    nid = next_id(numbering, r'w:num w:numId')
    abstract = NUMBERING_FRAGMENT.format(aid=aid, W=W)
    num = NUM_FRAGMENT.format(nid=nid, aid=aid, W=W)
    # abstractNum elements must precede num elements in the schema.
    if "<w:num " in numbering:
        numbering = numbering.replace("<w:num ", abstract + "<w:num ", 1)
    else:
        numbering = numbering.replace("</w:numbering>", abstract + "</w:numbering>")
    numbering = numbering.replace("</w:numbering>", num + "</w:numbering>")
    return numbering, nid


def strip_leading_number(paragraph: str, pattern: str) -> tuple[str, bool]:
    """Remove a literal leading section number from the paragraph's runs."""
    texts = list(re.finditer(r"(<w:t(?: [^>]*)?>)(.*?)(</w:t>)", paragraph, re.S))
    if not texts:
        return paragraph, False
    joined = "".join(m.group(2) for m in texts)
    m = re.match(pattern, joined)
    if not m:
        return paragraph, False
    remove = len(m.group(0))
    out, consumed = paragraph, 0
    for t in texts:
        if consumed >= remove:
            break
        body = t.group(2)
        take = min(len(body), remove - consumed)
        newbody = body[take:]
        old = t.group(0)
        # keep xml:space so a now-leading space in the next run survives
        new = t.group(1) + newbody + t.group(3)
        out = out.replace(old, new, 1)
        consumed += take
    return out, True


def attach_numpr(paragraph: str, style: str, ilvl: int, nid: int) -> str:
    numpr = (f'<w:numPr><w:ilvl w:val="{ilvl}"/><w:numId w:val="{nid}"/></w:numPr>')
    pstyle = f'<w:pStyle w:val="{style}"/>'
    return paragraph.replace(pstyle, pstyle + numpr, 1)


def process(path: str) -> None:
    backup = path + ".bak"
    shutil.copyfile(path, backup)
    zin = zipfile.ZipFile(backup)
    doc = zin.read("word/document.xml").decode("utf8")
    numbering = zin.read("word/numbering.xml").decode("utf8")

    numbering, nid = add_numbering(numbering)

    plan = [("Heading2", 0, r"\d+\.\s+"), ("Heading3", 1, r"\d+\.\d+\s+")]
    converted = 0
    paragraphs = re.split(r"(<w:p\b.*?</w:p>)", doc, flags=re.S)
    for i, chunk in enumerate(paragraphs):
        if not chunk.startswith("<w:p"):
            continue
        for style, ilvl, pattern in plan:
            if f'w:val="{style}"' not in chunk:
                continue
            # skip TOC hyperlink paragraphs (styled TOC1/TOC2, not headings)
            stripped, did = strip_leading_number(chunk, pattern)
            if did:
                paragraphs[i] = attach_numpr(stripped, style, ilvl, nid)
                converted += 1
            break
    doc = "".join(paragraphs)

    # verification: every image must carry alt text (docPr descr)
    descrs = re.findall(r'<wp:docPr [^>]*descr="([^"]*)"', doc)
    images = doc.count("<pic:pic ")
    bad = [d for d in descrs if not d.strip() or d.strip().endswith(".png")]
    if images and (len(descrs) < images or bad):
        sys.exit(f"ALT TEXT CHECK FAILED: {images} images, {len(descrs)} descr, suspect: {bad}")

    zout = zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/document.xml":
            data = doc.encode("utf8")
        elif item.filename == "word/numbering.xml":
            data = numbering.encode("utf8")
        zout.writestr(item, data)
    zout.close()
    zin.close()
    print(f"OK: {converted} headings converted to real numbering (numId {nid}); "
          f"{images} images, {len(descrs)} with alt text")


if __name__ == "__main__":
    process(sys.argv[1])
