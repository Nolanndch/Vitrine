import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendService } from '../js/guide-model.js';

test('existing Shopify stores are distinguished from new stores and other platforms', () => {
  assert.equal(recommendService(['sell', 'shopify', 'ready']), 'refonte');
  assert.equal(recommendService(['sell', 'new', 'ready']), 'shopify');
  assert.equal(recommendService(['sell', 'other', 'partial']), 'shopify');
});
test('presentation and application needs lead to different services', () => {
  assert.equal(recommendService(['present', 'launch', 'start']), 'site');
  assert.equal(recommendService(['app', 'subscription', 'partial']), 'saas');
  assert.equal(recommendService(['app', 'internal', 'ready']), 'saas');
});
test('an unsure visitor is guided by the visitor action, with no forced recommendation', () => {
  assert.equal(recommendService(['unsure', 'purchase', 'start']), 'shopify');
  assert.equal(recommendService(['unsure', 'discover', 'partial']), 'site');
  assert.equal(recommendService(['unsure', 'account', 'ready']), 'saas');
  assert.equal(recommendService(['unsure', 'unsure', 'start']), null);
  assert.equal(recommendService([]), null);
});
