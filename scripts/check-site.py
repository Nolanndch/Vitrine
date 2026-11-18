"""Check page structure, local destinations and assets before publishing GitHub Pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]
errors = []

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.links, self.labels = path, set(), [], []
        self.headings = 0
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if len(values) != len(attrs):
            errors.append(f'{self.path.relative_to(ROOT)}: duplicate attribute on {tag}')
        ident = values.get('id')
        if ident:
            if ident in self.ids:
                errors.append(f'{self.path.relative_to(ROOT)}: duplicate id {ident}')
            self.ids.add(ident)
        if tag == 'h1':
            self.headings += 1
        if tag == 'label' and 'for' in values:
            self.labels.append(values['for'])
        for key in ('href', 'src'):
            if values.get(key):
                self.links.append(values[key])
        if values.get('srcset'):
            self.links.extend(item.strip().split()[0] for item in values['srcset'].split(','))

pages = {p.resolve(): Page(p) for p in [*ROOT.glob('*.html'), *ROOT.glob('en/*.html')]}
for path, page in pages.items():
    if page.headings != 1:
        errors.append(f'{path.relative_to(ROOT)}: expected one h1, found {page.headings}')
    for label in page.labels:
        if label not in page.ids:
            errors.append(f'{path.relative_to(ROOT)}: label refers to missing #{label}')
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc:
            continue
        raw = unquote(parsed.path)
        if raw.startswith('/Vitrine/'):
            target = ROOT / raw[len('/Vitrine/'):]
        elif raw.startswith('/'):
            target = ROOT / raw.lstrip('/')
        elif raw:
            target = path.parent / raw
        else:
            target = path
        if target.is_dir():
            target /= 'index.html'
        target = target.resolve()
        if not target.exists():
            errors.append(f'{path.relative_to(ROOT)}: missing destination {link}')
        elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
            errors.append(f'{path.relative_to(ROOT)}: missing fragment {link}')

for script in ROOT.glob('js/*.js'):
    for relative in re.findall(r"\bfrom\s+['\"]([^'\"]+)['\"]", script.read_text()):
        if relative.startswith('.') and not (script.parent / relative).exists():
            errors.append(f'{script.name}: missing import {relative}')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'{len(pages)} pages checked: headings, IDs, labels, links, assets and module imports OK.')
