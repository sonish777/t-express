import { Handler } from "express";
import { ProviderClass } from "./provider-class.interface";
import { ProviderWithOptions } from "./middleware-provider.interface";

export interface StartupOptions {
    middlewares?: Handler[],
    middlewareProviders?: (ProviderClass | ProviderWithOptions<any>)[],
    locals?: Record<"string", Handler>[],
    routePrefixes?: {
        cmsPrefix?: string;
        apiPrefix?: string;
    }
}