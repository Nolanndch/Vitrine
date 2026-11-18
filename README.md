# Takuzo — Nolann Duchaussoy

Site vitrine du studio Takuzo : boutiques Shopify et sites web sur mesure.

Site statique (HTML + Tailwind CSS compilé), hébergé sur GitHub Pages.

## Développement

```bash
npm install
npm run watch   # recompile css/style.css à chaque modification
npm start       # serveur local
```

Avant de pousser : `npm run build`, puis `npm test`. Le build régénère la version anglaise `en/*.html` à partir des pages FR, de `i18n/en.py` et de `i18n/glass_en.py` (ne jamais éditer `en/` à la main ; tout texte FR sans traduction est signalé), puis recompile `css/style.css`. Les deux sont versionnés : GitHub Pages les sert tels quels.

L’accueil reste court et les rubriques disposent de leurs propres URL. Les projets sont consultables sans JavaScript ; celui-ci ajoute la galerie, le zoom et les contrôles au clavier et au toucher. Le questionnaire de `services.html` oriente vers les quatre prestations ; ses réponses restent en mémoire dans la page. Les prix sont centralisés dans `js/pricing.js`, utilisé par l’estimation et son récapitulatif de contact. Le formulaire prépare un email dans la messagerie du visiteur ou dans Gmail, sans envoi automatique ni stockage sur le site.
