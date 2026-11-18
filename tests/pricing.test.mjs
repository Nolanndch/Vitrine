import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuote, quoteDelay, contactURL, formatMoney } from '../js/pricing.js';

test('a redesign keeps the short delay until all three existing extras are selected', () => {
  assert.equal(getQuote('refonte').total, 150);
  assert.equal(quoteDelay(getQuote('refonte', ['countdown', 'bilingual']), false), '3 jours à 1 semaine');
  const full = getQuote('refonte', ['countdown', 'bilingual', 'seo']);
  assert.equal(full.total, 390);
  assert.equal(quoteDelay(full, false), '1 à 2 semaines');
});
test('extras cannot leak into another service or be counted twice', () => {
  assert.equal(getQuote('refonte', ['seo', 'seo', 'domain', 'unknown']).total, 250);
  assert.equal(getQuote('shopify', ['countdown', 'seo', 'bilingual']).total, 400);
  assert.equal(getQuote('site', ['seo', 'domain', 'countdown']).total, 590);
});
test('an application needs a custom quote and never gets a numeric estimate', () => {
  const quote = getQuote('saas', ['seo']);
  assert.equal(quote.total, null);
  assert.equal(formatMoney(quote.total, true), 'Custom quote');
  assert.equal(quoteDelay(quote, false), 'Selon le projet');
});
test('contact URLs retain the same valid estimate across languages', () => {
  const quote = getQuote('site', ['seo', 'domain', 'unknown']);
  const url = new URL(contactURL(quote), 'https://example.com/en/');
  const restored = getQuote(url.searchParams.get('besoin'), url.searchParams.get('options').split(','));
  assert.equal(url.pathname, '/en/contact.html');
  assert.equal(restored.total, 590);
  assert.equal(url.searchParams.get('estimation'), '1');
  assert.deepEqual(restored.options.map(option => option.id), ['seo', 'domain']);
});
test('unknown project types fall back to the complete store', () => {
  assert.equal(getQuote('__proto__', ['seo']).total, 400);
  assert.equal(getQuote(undefined).type, 'shopify');
});
