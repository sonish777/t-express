import { Middleware } from "../classes/middleware.abstract";
import { MiddlewareProvider } from "../interfaces/middleware-provider.interface";

/**
 * Returns a middleware provider
 *
 * @export
 * @template K
 * @param {Middleware} providerClass
 * @param {K} options
 * @returns {MiddlewareProvider<K>}
 */
export function provideMiddleware<K>(providerClass: Middleware, options: K): MiddlewareProvider<K>  {
    return {
        class: providerClass,
        options
    }
}