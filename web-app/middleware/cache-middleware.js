const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Override res.json method
    const originalJson = res.json;
    res.json = function(body) {
      cache.set(key, body, duration);
      return originalJson.call(this, body);
    };

    next();
  };
};

module.exports = cacheMiddleware; 