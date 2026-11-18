import { recommendService, serviceAnchors } from './guide-model.js';
import { rates, localised, translate as t } from './pricing.js';

const guide = document.querySelector('[data-guide]');
const content = guide.querySelector('[data-guide-content]');
const next = guide.querySelector('[data-guide-next]');
const back = guide.querySelector('[data-guide-back]');
const reset = guide.querySelector('[data-guide-reset]');
const count = guide.querySelector('[data-guide-count]');
let step = 0;
let answers = [];
const answer = (id, fr, en, detailFR, detailEN) => ({ id, title: t(fr, en), detail: t(detailFR, detailEN) });

function question() {
  if (step === 0) return {
    title: t('Que doit permettre votre site ?', 'What should your website help people do?'),
    choices: [
      answer('sell', 'Acheter mes produits', 'Buy my products', 'Une boutique, un catalogue et des paiements en ligne.', 'An online store, product catalogue and checkout.'),
      answer('present', 'Découvrir ma marque', 'Discover my brand', 'Présenter mon activité, un produit ou un lancement.', 'Present my business, a product or a launch.'),
      answer('app', 'Utiliser un service en ligne', 'Use an online service', 'Des comptes, un abonnement, une IA ou un outil métier.', 'Accounts, a subscription, AI or a business tool.'),
      answer('unsure', 'Je cherche encore la bonne solution', 'I’m still exploring', 'Partir de ce que mes visiteurs ont besoin de faire.', 'Start with what my visitors need to do.')
    ]
  };
  if (step === 2) return {
    title: t('Qu’avez-vous déjà pour démarrer ?', 'What do you already have to get started?'),
    choices: [
      answer('ready', 'Mes contenus sont prêts', 'My content is ready', 'Logo, textes, visuels ou catalogue déjà disponibles.', 'Logo, copy, images or catalogue already available.'),
      answer('partial', 'J’ai quelques éléments', 'I have a few things', 'Mon projet avance, mais tout n’est pas encore rassemblé.', 'My project is taking shape, but not everything is ready.'),
      answer('start', 'J’en suis au début', 'I’m just starting', 'J’ai une idée ou un objectif à préciser ensemble.', 'I have an idea or goal we need to clarify.')
    ]
  };
  if (answers[0] === 'sell') return {
    title: t('Où en est votre boutique ?', 'Where are you with your store?'),
    choices: [
      answer('shopify', 'J’ai déjà une boutique Shopify', 'I already have a Shopify store', 'Je souhaite améliorer le design, le mobile ou les sections.', 'I want to improve the design, mobile experience or sections.'),
      answer('new', 'Je n’ai pas encore de boutique', 'I don’t have a store yet', 'Je veux lancer ma première boutique et vendre mes produits.', 'I want to launch my first store and sell my products.'),
      answer('other', 'J’utilise une autre plateforme', 'I use another platform', 'Je veux revoir ma boutique ou étudier un changement.', 'I want to redesign my store or explore a platform change.'),
      answer('unsure', 'Je ne sais pas encore', 'I’m not sure yet', 'Je veux être accompagné dans le choix de la solution.', 'I need help choosing the right solution.')
    ]
  };
  if (answers[0] === 'present') return {
    title: t('Que voulez-vous mettre en avant ?', 'What would you like to showcase?'),
    choices: [
      answer('business', 'Mon activité ou mon studio', 'My business or studio', 'Expliquer mon offre et permettre de me contacter.', 'Explain my offering and help people contact me.'),
      answer('launch', 'Un produit ou une collection', 'A product or collection', 'Préparer un lancement, une annonce ou un drop.', 'Prepare a launch, announcement or drop.'),
      answer('portfolio', 'Mes réalisations', 'My work', 'Présenter des projets et mon savoir-faire.', 'Present projects and my expertise.'),
      answer('unsure', 'Le format reste à définir', 'The format is still open', 'Construire une structure adaptée à mon objectif.', 'Build a structure that matches my goal.')
    ]
  };
  if (answers[0] === 'app') return {
    title: t('Quel fonctionnement imaginez-vous ?', 'How do you imagine it working?'),
    choices: [
      answer('subscription', 'Un service avec abonnement', 'A subscription service', 'Des utilisateurs, des comptes et un paiement récurrent.', 'Users, accounts and recurring payments.'),
      answer('ai', 'Un outil connecté à une IA ou une API', 'An AI or API-powered tool', 'Connecter des données et des services à une interface.', 'Connect data and services to an interface.'),
      answer('internal', 'Un outil pour mon activité', 'A tool for my business', 'Répondre à un besoin métier ou simplifier un processus.', 'Meet a business need or simplify a process.'),
      answer('unsure', 'J’ai une idée à cadrer', 'I have an idea to scope', 'Définir les fonctionnalités utiles d’une première version.', 'Define the useful features of a first version.')
    ]
  };
  return {
    title: t('Que feront vos visiteurs en priorité ?', 'What will visitors mainly need to do?'),
    choices: [
      answer('purchase', 'Choisir et acheter un produit', 'Choose and buy a product', 'Parcourir des produits et payer en ligne.', 'Browse products and pay online.'),
      answer('discover', 'Comprendre mon offre et me contacter', 'Understand my offering and contact me', 'Découvrir mon travail, mes services ou mon produit.', 'Discover my work, services or product.'),
      answer('account', 'Se connecter et utiliser un outil', 'Sign in and use a tool', 'Accéder à un espace personnel et des fonctionnalités.', 'Access a personal account and features.'),
      answer('unsure', 'J’ai besoin d’en discuter', 'I need to discuss it', 'Mon besoin ne rentre pas encore dans ces catégories.', 'My needs don’t fit these categories yet.')
    ]
  };
}

function explanation(type) {
  if (type === 'refonte') return t('Votre boutique Shopify est déjà en place : une intervention sur le thème existant permet de retravailler le design, les sections et l’expérience mobile sans repartir automatiquement de zéro.', 'Your Shopify store is already in place: work on the existing theme can improve the design, sections and mobile experience without automatically starting over.');
  if (type === 'shopify' && answers[1] === 'other') return t('Votre besoin est de vendre en ligne. Une boutique Shopify est une piste à étudier ; la reprise de votre boutique et de son catalogue doit être examinée avant de confirmer la solution et le devis.', 'You need to sell online. A Shopify store is one option to explore; your existing store and catalogue need to be reviewed before confirming the solution and quote.');
  if (type === 'shopify') return t('Votre priorité est la vente de produits. Une boutique complète réunit le catalogue, les fiches produits, le paiement et la livraison, avec un espace pour gérer vos commandes.', 'Your priority is selling products. A complete store brings together a catalogue, product pages, checkout and shipping, with an admin to manage orders.');
  if (type === 'site') return t('Votre priorité est de présenter votre activité ou votre produit et de guider le visiteur vers une prise de contact. Un site vitrine ou une landing page sur mesure répond à ce besoin.', 'Your priority is presenting your business or product and guiding visitors towards contacting you. A custom business website or landing page fits this need.');
  if (type === 'saas') return t('Des comptes utilisateurs, un abonnement ou des fonctionnalités métier demandent une application. La première étape est de préciser les usages, les intégrations et le périmètre d’une première version.', 'User accounts, subscriptions or business features call for an application. The first step is defining the use cases, integrations and scope of a first version.');
  return t('Votre besoin mérite d’être précisé avant de choisir une technologie ou une prestation. Décrivez ce que vous souhaitez permettre à vos visiteurs : nous pourrons cadrer une solution adaptée.', 'Your needs should be clarified before choosing a technology or service. Describe what you want visitors to do so we can scope an appropriate solution.');
}

function preparation() {
  if (answers[2] === 'ready') return t('Rassemblez vos contenus et quelques références, puis indiquez votre date de lancement souhaitée. Nous pourrons vérifier le périmètre et le calendrier avant le devis.', 'Gather your content and a few references, then share your preferred launch date. We can review the scope and schedule before quoting.');
  if (answers[2] === 'partial') return t('Listez les éléments déjà disponibles et ceux qui manquent : textes, visuels, produits ou fonctionnalités. Nous identifierons ce qu’il faut préparer avant la maquette.', 'List what you already have and what is missing: copy, images, products or features. We’ll identify what needs preparing before the mockup.');
  return t('Préparez une courte description de votre activité, de vos visiteurs et du résultat attendu. Quelques sites de référence suffisent pour commencer la discussion.', 'Prepare a short description of your business, visitors and desired outcome. A few reference websites are enough to start the conversation.');
}

function render(focus = true) {
  const result = step === 3;
  count.textContent = result ? t('Votre orientation', 'Your next step') : `${step + 1} / 3`;
  next.hidden = result; back.hidden = step === 0; reset.hidden = !result;
  if (result) {
    const type = recommendService(answers);
    const title = type ? localised(rates[type].name) : t('Commençons par cadrer votre projet.', 'Let’s start by scoping your project.');
    content.innerHTML = `<div class="guide-result"><h3 id="guide-result-title" tabindex="-1">${title}</h3><p>${explanation(type)}</p><p class="result-preparation"><strong>${t('Votre prochaine étape', 'Your next step')}</strong><br>${preparation()}</p><div class="g-service-actions">${type ? `<a href="#${serviceAnchors[type]}" class="g-pill g-glass g-pill-dark">${t('Voir cette prestation en détail', 'Explore this service')} <span aria-hidden="true">↓</span></a><a href="${type === 'saas' ? 'contact.html?besoin=saas' : 'tarifs.html?type=' + type + '#simulateur'}" class="text-link">${t(type === 'saas' ? 'Discuter du périmètre' : 'Estimer mon projet', type === 'saas' ? 'Discuss the scope' : 'Estimate my project')} <span aria-hidden="true">↗</span></a>` : `<a href="contact.html?besoin=autre" class="g-pill g-glass g-pill-dark">${t('Parlons de votre besoin', 'Let’s discuss your needs')} <span aria-hidden="true">↗</span></a>`}</div><p class="g-cost-note">${t('Cette première orientation sera confirmée lors d’un échange sur votre projet.', 'This initial recommendation will be confirmed when we discuss your project.')}</p></div>`;
    if (focus) document.getElementById('guide-result-title').focus({ preventScroll: true });
  } else {
    const q = question();
    content.innerHTML = `<fieldset><legend id="guide-question" tabindex="-1">${q.title}</legend><div class="guide-answers">${q.choices.map(choice => `<label class="guide-answer"><input type="radio" name="guide-answer" value="${choice.id}" ${answers[step] === choice.id ? 'checked' : ''}><span><strong>${choice.title}</strong><small>${choice.detail}</small></span></label>`).join('')}</div></fieldset>`;
    next.textContent = step === 2 ? t('Voir mon orientation →', 'See my recommendation →') : t('Continuer →', 'Continue →');
    next.disabled = !answers[step];
    if (focus) document.getElementById('guide-question').focus({ preventScroll: true });
  }
  window.TakuzoGlass?.enhance(content);
}
content.addEventListener('change', event => {
  if (!event.target.matches('input[name="guide-answer"]')) return;
  if (answers[step] !== event.target.value) answers = answers.slice(0, step + 1);
  answers[step] = event.target.value;
  next.disabled = false;
});
next.addEventListener('click', () => { if (answers[step]) { step += 1; render(); } });
back.addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
reset.addEventListener('click', () => { answers = []; step = 0; render(); });
guide.hidden = false;
render(false);
