const MapCache = new Map(); 

export const getCache = (key, ttlMs = 5 * 60 * 1000) => {
  const e = MapCache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > ttlMs) { MapCache.delete(key); return null; }
  return e.value;
};

export const setCache = (key, value) => MapCache.set(key, { value, ts: Date.now() });
