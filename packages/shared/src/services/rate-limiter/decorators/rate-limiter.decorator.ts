import { RateLimiterOptions } from '../interfaces';
import { RateLimiterService } from '../rate-limiter.service';

export function Throttle(
    key: string,
    options?: RateLimiterOptions
): MethodDecorator;
export function Throttle<ClassName, MethodName extends keyof ClassName>(
    key: (
        ...args: Parameters<
            ClassName[MethodName] extends (...args: any) => any
                ? ClassName[MethodName]
                : never
        >
    ) => any,
    options?: RateLimiterOptions
): MethodDecorator;
export function Throttle(
    key: any,
    options: RateLimiterOptions = {}
): MethodDecorator {
    return (_target, _prop, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const rateLimiter = RateLimiterService.getInstance(
            options.attempts,
            options.windowDuration,
            options.blockDuration
        );
        descriptor.value = async function (...args: any[]) {
            let cacheKey: string;
            if (typeof key === 'function') {
                cacheKey = key(...args);
            } else {
                cacheKey = key;
            }
            await rateLimiter.consume(cacheKey);
            return originalMethod.bind(this)(...args);
        };
    };
}
