export const getRecentlyViewedStorageKey = (userInfo) => {
  if (!userInfo) return 'recentlyViewed:guest';

  const userId = userInfo._id || userInfo.id || userInfo.email;
  const role = userInfo.role === 'admin' ? 'admin' : 'user';

  if (userId) {
    return `recentlyViewed:${role}:${userId}`;
  }

  return `recentlyViewed:${role}`;
};

export const getRecentlyViewedItems = (userInfo) => {
  try {
    const storageKey = getRecentlyViewedStorageKey(userInfo);
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveRecentlyViewedItems = (userInfo, items) => {
  try {
    const storageKey = getRecentlyViewedStorageKey(userInfo);
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore storage failures silently
  }
};
