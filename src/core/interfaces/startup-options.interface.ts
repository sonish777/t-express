import { Provider, ProviderWithOptions } from "@core/providers";
import { Handler } from "express";

export interface StartupOptions {
    middlewares?: Handler[],
    middlewareProviders?: (Provider | ProviderWithOptions<any>)[],
    locals?: Record<string, Handler>[],
    routePrefixes?: {
        cmsPrefix?: string;
        apiPrefix?: string;
    }
}