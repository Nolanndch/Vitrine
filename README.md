# Takuzo — Nolann Duchaussoy

Site vitrine du studio Takuzo : boutiques Shopify et sites web sur mesure.

Site statique (HTML + Tailwind CSS compilé), hébergé sur GitHub Pages.

## Développement

```bash
npm install
npm run watch   # recompile css/style.css à chaque modification
npm start       # serveur local
```

Avant de pousser : `npm run build`. Il régénère la version anglaise `en/*.html` à partir des pages FR et de `i18n/en.py` (ne jamais éditer `en/` à la main ; tout texte FR sans traduction est signalé), puis recompile `css/style.css`. Les deux sont versionnés : GitHub Pages les sert tels quels.
