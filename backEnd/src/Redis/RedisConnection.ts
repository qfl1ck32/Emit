import redis from 'redis'

export class RedisConnection {
    private client: redis.RedisClient;

    public static instance: RedisConnection;

    public static getInstance(): RedisConnection {
        if (RedisConnection.instance == null)
            RedisConnection.instance = new RedisConnection()

        return RedisConnection.instance;
    }

    private constructor() {
        this.client = redis.createClient(6379)
    }

    public getClient(): redis.RedisClient {
        return this.client;
    }
}
