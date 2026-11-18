/* A first orientation, not a commitment: uncertainty always leaves a direct-contact route. */
export function recommendService(answers) {
  const [goal, detail] = answers;
  if (goal === 'sell') return detail === 'shopify' ? 'refonte' : 'shopify';
  if (goal === 'present') return 'site';
  if (goal === 'app') return 'saas';
  if (goal === 'unsure') return ({ purchase: 'shopify', discover: 'site', account: 'saas' })[detail] || null;
  return null;
}
export const serviceAnchors = { refonte: 'refonte', shopify: 'boutique', site: 'site', saas: 'developpement' };
