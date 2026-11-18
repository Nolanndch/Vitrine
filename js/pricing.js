/* One price source for the estimator and its contact summary, in both languages. */
export const isEnglish = () => document.documentElement.lang === 'en';
export const translate = (fr, en, english = isEnglish()) => english ? en : fr;
const pair = (fr, en) => ({ fr, en });
export const rates = {
  refonte: {
    base: 150,
    name: pair('Retouches & refonte Shopify', 'Shopify fixes & redesign'),
    included: pair('Corrections visuelles, ajustements mobile et nettoyage du thème. Hero, bandeau d’annonce, guide des tailles, filtres, lookbook et FAQ inclus.', 'Visual fixes, mobile adjustments and theme cleanup. Hero, announcement banner, size guide, filters, lookbook and FAQ included.'),
    external: pair('L’abonnement Shopify et les éventuelles applications payantes restent à votre charge.', 'Your Shopify subscription and any paid apps are charged separately.'),
    options: [
      { id: 'countdown', price: 60, name: pair('Compte à rebours de drop', 'Drop countdown') },
      { id: 'bilingual', price: 80, name: pair('Boutique bilingue FR / EN', 'Bilingual store (FR / EN)') },
      { id: 'seo', price: 100, name: pair('Optimisation vitesse & SEO', 'Speed & SEO optimisation') }
    ]
  },
  shopify: {
    base: 400,
    name: pair('Boutique Shopify complète', 'Complete Shopify store'),
    included: pair('Thème personnalisé, collections, fiches produits, paiements, livraisons et mise en ligne. Toutes les sections et options sont incluses : compte à rebours, boutique bilingue, vitesse et SEO.', 'Custom theme, collections, product pages, payments, shipping and launch. All sections and options included: countdown, bilingual store, speed and SEO.'),
    external: pair('L’abonnement Shopify, l’achat du domaine et les éventuelles applications payantes restent à votre charge.', 'Your Shopify subscription, domain purchase and any paid apps are charged separately.'),
    options: []
  },
  site: {
    base: 450,
    name: pair('Site web sur mesure', 'Custom website'),
    included: pair('Design sur mesure adapté à tous les écrans, page d’accueil complète et mise en ligne sur Vercel.', 'Custom responsive design, a complete homepage and deployment on Vercel.'),
    external: pair('L’achat du domaine, l’éventuel hébergement payant et les services tiers (boîtes mail) restent à votre charge.', 'Your domain purchase, any paid hosting and third-party services (mailboxes) are charged separately.'),
    options: [
      { id: 'seo', price: 80, name: pair('Référencement naturel avancé (SEO)', 'Advanced search engine optimisation (SEO)') },
      { id: 'domain', price: 60, name: pair('Configuration domaine & emails pro', 'Domain & business email setup') }
    ]
  },
  saas: {
    base: null,
    name: pair('SaaS & développement sur mesure', 'SaaS & custom development'),
    included: pair('Fonctionnalités, comptes utilisateurs, abonnements et intégrations sont définis ensemble avant un devis personnalisé.', 'Features, user accounts, subscriptions and integrations are scoped together before a tailored quote.'),
    external: pair('Les coûts d’hébergement et de services tiers dépendent du fonctionnement de votre application.', 'Hosting and third-party costs depend on how your application works.'),
    options: []
  }
};
export function localised(value, english = isEnglish()) { return value[english ? 'en' : 'fr']; }
export function formatMoney(amount, english = isEnglish()) {
  return amount === null ? translate('Sur devis', 'Custom quote', english) : new Intl.NumberFormat(english ? 'en-IE' : 'fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}
export function getQuote(type, optionIds = []) {
  const safeType = Object.hasOwn(rates, type) ? type : 'shopify';
  const rate = rates[safeType];
  const options = rate.options.filter(option => optionIds.includes(option.id));
  return {
    type: safeType, rate, options,
    total: rate.base === null ? null : rate.base + options.reduce((sum, option) => sum + option.price, 0),
    delayKey: safeType === 'saas' ? 'custom' : safeType === 'refonte' && options.length < 3 ? 'short' : 'standard'
  };
}
export function quoteDelay(quote, english = isEnglish()) {
  if (quote.delayKey === 'custom') return translate('Selon le projet', 'Depends on scope', english);
  return quote.delayKey === 'short' ? translate('3 jours à 1 semaine', '3 days to 1 week', english) : translate('1 à 2 semaines', '1 to 2 weeks', english);
}
export function contactURL(quote) {
  const params = new URLSearchParams({ besoin: quote.type, estimation: '1' });
  if (quote.options.length) params.set('options', quote.options.map(option => option.id).join(','));
  return 'contact.html?' + params;
}
