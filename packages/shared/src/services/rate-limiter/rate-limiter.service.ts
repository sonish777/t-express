import { HttpException } from 'core/exceptions';
import { HttpStatus } from 'core/utils';
import {
    RateLimiterAbstract,
    RateLimiterRedis,
    RateLimiterRes,
} from 'rate-limiter-flexible';
import { CommonSharedConfigs } from 'shared/configs';
import { redisConnection } from 'shared/connections';
import Container from 'typedi';

export class RateLimiterService {
    private readonly _rateLimiter: RateLimiterAbstract;

    private constructor(
        private readonly attempts: number = CommonSharedConfigs.Throttle
            .Attempts,
        private readonly windowDuration: number = CommonSharedConfigs.Throttle
            .WindowDuration,
        private readonly blockDuration: number = CommonSharedConfigs.Throttle
            .BlockDuration
    ) {
        this._rateLimiter = new RateLimiterRedis({
            storeClient: redisConnection.client,
            points: this.attempts,
            duration: this.windowDuration,
            blockDuration: this.blockDuration,
        });
    }

    public static getInstance(
        attempts: number = CommonSharedConfigs.Throttle.Attempts,
        windowDuration: number = CommonSharedConfigs.Throttle.WindowDuration,
        blockDuration: number = CommonSharedConfigs.Throttle.BlockDuration
    ) {
        const RATE_LIMITER_TOKEN = `${RateLimiterService.name}_atp:${attempts}_win:${windowDuration}_blc:${blockDuration}`;
        try {
            const instance =
                Container.get<RateLimiterService>(RATE_LIMITER_TOKEN);
            return instance;
        } catch (error) {
            const instance = new this(attempts, windowDuration, blockDuration);
            Container.set(RATE_LIMITER_TOKEN, instance);
            return instance;
        }
    }

    consume(key: string): Promise<RateLimiterRes> {
        return new Promise((resolve, reject) => {
            this._rateLimiter
                .consume(key)
                .then((result) => {
                    resolve(result);
                })
                .catch((error: RateLimiterRes) => {
                    if (error.msBeforeNext) {
                        const waitTimeInMinutes = Math.trunc(
                            error.msBeforeNext / 1000
                        );
                        return reject(
                            new HttpException(
                                HttpStatus.TOO_MANY_REQUESTS,
                                `Too many tries, try again after ${waitTimeInMinutes} seconds`,
                                'TooManyAttempts',
                                true
                            )
                        );
                    }
                    reject(error);
                });
        });
    }
}
