const Redis = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const getFromCache = async (key) => {
  try {
    const value = await redis.get(key);
    return value;
  } catch (error) {
    console.error('Error getting data from cache', error);
    return null;
  }
};

const setToCache = async (key, value, ttl) => {
  try {
    await redis.set(key, value, { EX: ttl });
  } catch (error) {
    console.error('Error setting data to cache', error);
  }
};

module.exports = { getFromCache, setToCache };
