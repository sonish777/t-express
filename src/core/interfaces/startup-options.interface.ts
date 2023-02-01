import { Handler } from 'express';
import { ExceptionHandler } from '@core/exceptions/handlers';
import { Provider, ProviderWithOptions } from '@core/providers';

export type StartupOptions = {
  middlewares?: Handler[];
  middlewareProviders?: (Provider | ProviderWithOptions<Object>)[];
  locals?: Record<string, Handler>[];
  routePrefixes?: {
    cmsPrefix?: string;
    apiPrefix?: string;
  };
  exceptionHandlers?: ExceptionHandler[];
};
