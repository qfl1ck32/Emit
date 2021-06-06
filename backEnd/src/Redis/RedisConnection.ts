import redis from 'redis'
import { execFile } from 'child_process'

//FIXME there is no @types for redis-server

export class RedisConnection {
    private client: redis.RedisClient;

    public static instance: RedisConnection;

    public static getInstance(): RedisConnection {
        if (RedisConnection.instance == null)
            RedisConnection.instance = new RedisConnection()

        return RedisConnection.instance;
    }

    private constructor() {
        execFile('./Redis/redis-server.exe')

        this.client = redis.createClient(6379)
    }

    public getClient(): redis.RedisClient {
        return this.client;
    }
}
