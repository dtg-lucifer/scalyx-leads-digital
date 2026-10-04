import Redis from 'ioredis';

let redisClient: Redis | null = null;
const memoryCache = new Map<string, { value: string; expiresAt?: number }>();

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy: () => null, // Don't hang if offline
    });

    client.on('error', (err) => {
      // Graceful offline fallback
      console.warn('[Redis] Not connected, fallback to memory cache:', err.message);
    });

    redisClient = client;
    return redisClient;
  } catch {
    return null;
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedisClient();
  if (client && client.status === 'ready') {
    try {
      return await client.get(key);
    } catch {
      // Fallback
    }
  }

  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt && Date.now() > cached.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return cached.value;
}

export async function cacheSet(key: string, value: string, ttlSeconds = 300): Promise<void> {
  const client = getRedisClient();
  if (client && client.status === 'ready') {
    try {
      await client.setex(key, ttlSeconds, value);
      return;
    } catch {
      // Fallback
    }
  }

  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function cacheDelete(key: string): Promise<void> {
  const client = getRedisClient();
  if (client && client.status === 'ready') {
    try {
      await client.del(key);
      return;
    } catch {
      // Fallback
    }
  }
  memoryCache.delete(key);
}
