import { ProviderWithOptions } from "@core/interfaces/middleware-provider.interface";
import { ProviderClass } from "@core/interfaces/provider-class.interface";

/**
 * Returns a middleware provider
 *
 * @export
 * @template K
 * @param {Middleware} providerClass
 * @param {K} options
 * @returns {MiddlewareProvider<K>}
 */
export function provideMiddleware<K>(providerClass: ProviderClass, options: K): ProviderWithOptions<K>  {
    return {
        class: providerClass,
        options
    }
}