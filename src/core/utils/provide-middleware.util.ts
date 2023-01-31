import { Provider, ProviderWithOptions } from '@core/providers';

/**
 * Returns a middleware provider
 *
 * @export
 * @template K
 * @param {Middleware} providerClass
 * @param {K} options
 * @returns {MiddlewareProvider<K>}
 */
export function provideMiddleware<K>(
  providerClass: Provider,
  options: K
): ProviderWithOptions<K> {
  return {
    class: providerClass,
    options,
  };
}
