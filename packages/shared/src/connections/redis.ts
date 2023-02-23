import { createClient, RedisClientType } from 'redis';
import { RedisConfig } from 'shared/configs';

class RedisConnection {
    public readonly client: RedisClientType;
    private static _instance: RedisConnection;

    private constructor(public readonly ttl: number) {
        this.client = createClient({
            url: `redis://${RedisConfig.Host}:${RedisConfig.Port}`,
            username: RedisConfig.Username,
            password: RedisConfig.Password,
        });
        this.client
            .connect()
            .then(() =>
                console.log('Redis connection established successfully')
            )
            .catch((error) => console.log('Error connecting to Redis', error));
    }

    public static get instance() {
        if (!RedisConnection._instance) {
            RedisConnection._instance = new this(RedisConfig.TTL);
        }
        return RedisConnection._instance;
    }
}

export const redisConnection = RedisConnection.instance;
