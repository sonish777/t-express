import { Service } from 'typedi';
import { redisConnection as redis } from 'shared/connections';
import { isJSON } from 'shared/utils';

@Service()
export class CacheService {
    set(key: string, value: Record<string, any>, ttl?: number): Promise<any>;
    set(key: string, value: string, ttl?: number): Promise<any>;
    set(key: string, value: number, ttl?: number): Promise<any>;
    set(key: string, value: any, ttl = redis.ttl): Promise<any> {
        if (typeof value === 'string') {
            return redis.client.set(key, value, {
                EX: ttl,
            });
        } else if (typeof value === 'object') {
            return redis.client.set(key, JSON.stringify(value), {
                EX: ttl,
            });
        }
        return redis.client.set(String(key), JSON.stringify(value), {
            EX: ttl,
        });
    }

    async get<K>(key: string): Promise<K | null> {
        const data = await redis.client.get(key);
        if (!data) {
            return null;
        }
        if (isJSON(data)) {
            return JSON.parse(data) as K;
        }
        return data as K;
    }

    delete(key: string) {
        return redis.client.del(key);
    }
}
