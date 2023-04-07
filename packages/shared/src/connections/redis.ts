/* eslint-disable no-console */
import { createClient, RedisClientType } from 'redis';
import { RedisConfig } from 'shared/configs';
import { ConsoleLogger } from 'shared/logger';
import Container from 'typedi';

class RedisConnection {
    public readonly client: RedisClientType;
    private static _instance: RedisConnection;
    private readonly logger: ConsoleLogger = Container.get(ConsoleLogger);

    private constructor(public readonly ttl: number) {
        this.client = createClient({
            url: `redis://${RedisConfig.Host}:${RedisConfig.Port}`,
            username: RedisConfig.Username,
            password: RedisConfig.Password,
            legacyMode: process.env.NODE_ENV !== 'test',
        });
        this.client
            .connect()
            .then(() =>
                this.logger.log('Redis connection established successfully')
            )
            .catch((error) =>
                this.logger.error('Error connecting to Redis', error)
            );
    }

    public static get instance() {
        if (!RedisConnection._instance) {
            RedisConnection._instance = new this(RedisConfig.TTL);
        }
        return RedisConnection._instance;
    }
}

export const redisConnection = RedisConnection.instance;
