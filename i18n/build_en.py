"""Génère la version anglaise (en/*.html) à partir des pages françaises.
Usage : python3 i18n/build_en.py  (depuis la racine du projet)
Les traductions sont dans i18n/en.py ; tout texte français absent du dictionnaire est signalé."""
import glob, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from en import T, JS, KEEP

REDIRECT = re.compile(r'\n  <script id="lang-redirect">.*?</script>', re.S)
ATTR = re.compile(r'(\s(?:alt|title|placeholder|aria-label|content)=")([^"]*)(")')
TEXT = re.compile(r'>([^<]+)<')

def tr(t):
    k = ' '.join(t.split())
    if k in T:
        lead = t[:len(t) - len(t.lstrip())]
        trail = t[len(t.rstrip()):]
        return lead + T[k] + trail
    return t

def translate_markup(chunk):
    chunk = TEXT.sub(lambda m: '>' + tr(m.group(1)) + '<', chunk)
    chunk = ATTR.sub(lambda m: m.group(1) + tr(m.group(2)) + m.group(3), chunk)
    # 300 € -> €300
    chunk = re.sub(r'(\d+) €', r'€\1', chunk)
    return chunk

os.makedirs('en', exist_ok=True)
missing = set()
for f in sorted(glob.glob('*.html')):
    if f == '404.html':
        continue
    s = REDIRECT.sub('', open(f).read())
    src = re.sub(r'<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->', '', s, flags=re.S)
    for m in list(TEXT.finditer(src)) + list(ATTR.finditer(src)):
        t = ' '.join((m.group(2) if m.re is ATTR else m.group(1)).split())  # ATTR matches used group 3 (the closing quote), so untranslated alt/content/aria-label values were never reported
        if re.search(r'[A-Za-zÀ-ÿ]{2}', t) and t not in T and t not in KEEP and not re.match(r'(https?://|[\w.-]+@)', t):
            missing.add(t)
    parts = re.split(r'(<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->)', s, flags=re.S)
    s = ''.join(p if i % 2 else translate_markup(p) for i, p in enumerate(parts))
    for a, b in JS:
        s = s.replace(a, b)
    s = s.replace('<html lang="fr"', '<html lang="en"')
    BASE = 'https://nolanndch.github.io/Vitrine/'
    s = s.replace('<link rel="canonical" href="' + BASE, '<link rel="canonical" href="' + BASE + 'en/')
    s = s.replace('<meta property="og:url" content="' + BASE, '<meta property="og:url" content="' + BASE + 'en/')
    s = s.replace('<meta property="og:locale" content="fr_FR">', '<meta property="og:locale" content="en_GB">')
    s = s.replace('<meta property="og:locale:alternate" content="en_GB">', '<meta property="og:locale:alternate" content="fr_FR">')
    s = s.replace('href="css/', 'href="../css/').replace('src="images/', 'src="../images/')
    s = re.sub(r'href="en/([\w.-]+)" hreflang', r'href="../\1" hreflang', s)
    open(os.path.join('en', f), 'w').write(s)
print('Pages EN générées.' + (' Textes sans traduction (ajouter à T ou KEEP dans i18n/en.py) :\n- ' + '\n- '.join(sorted(missing)) if missing else ''))
