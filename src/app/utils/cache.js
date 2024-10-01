const cache = new Map(); // Simple cache using a Map

async function cacheData(key, fetchFunction, expirationTime) {
  const cachedData = cache.get(key);
  const now = Date.now();

  if (cachedData && (now - cachedData.timestamp < expirationTime)) {
    return cachedData.data; // Return cached data if not expired
  }

  try {
    const data = await fetchFunction();
    cache.set(key, { data, timestamp: now }); // Cache the new data
    return data;
  } catch (error) {
    if (cachedData) {
      return cachedData.data; // Return cached data if fetch fails
    }
    throw error; // Rethrow if there's no cached data
  }
}

function clearCache() {
  cache.clear();
}

module.exports = { cacheData, clearCache };
