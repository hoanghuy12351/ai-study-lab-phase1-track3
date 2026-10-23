"""Index the provided Track 3 corpus without changing its source files."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / 'docs'
OUT.mkdir(exist_ok=True)
sources = []
sections = []
for folder in sorted((ROOT / 'track3').iterdir()):
    if not folder.is_dir() or not (folder / 'metadata.json').exists():
        continue
    meta = json.loads((folder / 'metadata.json').read_text(encoding='utf-8'))
    text = (folder / 'all_text.md').read_text(encoding='utf-8')
    pages = []
    for match in re.finditer(r'^# Page (\d+)\s*\n(.*?)(?=^# Page \d+|\Z)', text, re.M | re.S):
        lines = [x.strip() for x in match[2].splitlines() if x.strip()]
        head = ' / '.join(lines[:3])
        pages.append({'page': int(match[1]), 'heading': head, 'characters': len(match[2].strip())})
    source_id = f't3-{meta["day"].lower()}-{meta["material_id"]}'
    pdf = folder / 'deck.pdf'
    digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
    source = {'id':source_id,'day':meta['day'],'title':meta['title'],
              'path':(folder/'all_text.md').relative_to(ROOT).as_posix(),
              'pdf':pdf.relative_to(ROOT).as_posix(),'pdf_sha256':digest,
              'text_sha256':hashlib.sha256(text.encode()).hexdigest(),
              'pages':len(pages),'characters':len(text),'low_text_pages':[p['page'] for p in pages if p['characters']<50],
              'headings':pages,'aliases':[]}
    sources.append(source)
    sections.extend([f'\n## {source_id} · {meta["title"]} ({len(pages)} pages)\n',
                     *[f'{p["page"]:03} {p["heading"]}' for p in pages]])
for pdf in sorted((ROOT/'slides/k04-l34-p2-t3').glob('*.pdf')):
    digest=hashlib.sha256(pdf.read_bytes()).hexdigest()
    match=next((s for s in sources if s['pdf_sha256']==digest),None)
    if match:
        match['aliases'].append(pdf.relative_to(ROOT).as_posix())
    else:
        raise ValueError(f'Unindexed standalone PDF: {pdf}')
(OUT/'track3-sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'track3-sections.md').write_text('\n'.join(sections)+'\n',encoding='utf-8')
runtime=[{k:v for k,v in s.items() if k in ['id','day','title','path','pdf','pages']} for s in sources]
(OUT.parent/'dist/track3-sources.js').write_text('window.TRACK3_SOURCES = '+json.dumps(runtime,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print(f'{len(sources)} source decks; {sum(s["pages"] for s in sources)} pages; {sum(len(s["aliases"]) for s in sources)} duplicate file aliases')
print('Course days: '+', '.join(sorted(set(s['day'] for s in sources))))
