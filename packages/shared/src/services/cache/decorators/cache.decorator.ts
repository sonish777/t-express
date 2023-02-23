import Container from 'typedi';
import { CacheService } from '../cache.service';

export function Cache(key: string, ttl?: number): MethodDecorator;
export function Cache<
    ClassName = never,
    MethodName extends keyof ClassName = never
>(
    key: (
        ...args: Parameters<
            ClassName[MethodName] extends (...args: any) => any
                ? ClassName[MethodName]
                : never
        >
    ) => string,
    ttl?: number
): MethodDecorator;
export function Cache(key: any, ttl?: number): MethodDecorator {
    return (_target, _prop, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const cache = Container.get<CacheService>(CacheService);
        descriptor.value = async function (...args: any[]) {
            let cacheKey: string;
            if (typeof key === 'function') {
                cacheKey = key(...args);
            } else {
                cacheKey = key;
            }
            const cached = await cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const data = await originalMethod.bind(this)(...args);
            await cache.set(cacheKey, data, ttl);
            return data;
        };
    };
}
