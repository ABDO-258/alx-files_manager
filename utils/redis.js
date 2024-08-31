import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.connected = true;

    this.client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err.message}`);
      this.connected = false;
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    this.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    this.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;

// module.exports = redisClient;
