import test from 'node:test';
import assert from 'node:assert/strict';
import { getRecentlyViewedStorageKey } from './recentlyViewed.js';

test('scopes recently viewed items per user account', () => {
  const adminKey = getRecentlyViewedStorageKey({ _id: 'admin-1', role: 'admin' });
  const userKey = getRecentlyViewedStorageKey({ _id: 'user-1', role: 'user' });
  const guestKey = getRecentlyViewedStorageKey(null);

  assert.equal(adminKey, 'recentlyViewed:admin:admin-1');
  assert.equal(userKey, 'recentlyViewed:user:user-1');
  assert.equal(guestKey, 'recentlyViewed:guest');
});
