import { Handler } from 'express';
import { ExceptionHandler } from 'core/exceptions';
import { Provider, ProviderWithOptions } from 'core/providers';

export interface StartupOptions {
    name?: string;
    middlewares?: Handler[];
    middlewareProviders?: (Provider | ProviderWithOptions<Object>)[];
    locals?: Record<string, Handler>[];
    routePrefixes?: {
        cmsPrefix?: string;
        apiPrefix?: string;
    };
    exceptionHandlers?: ExceptionHandler[];
}
