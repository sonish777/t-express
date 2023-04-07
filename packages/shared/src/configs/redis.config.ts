import config from 'config';

export const RedisConfig = {
    Protocol: 'http',
    Host: config.get<string>('redis.host'),
    Port: config.get<number>('redis.port'),
    Username: config.get<string>('redis.username'),
    Password: config.get<string>('redis.password'),
    TTL: config.get<number>('redis.ttl') || 1800, // 30 minutes
};
