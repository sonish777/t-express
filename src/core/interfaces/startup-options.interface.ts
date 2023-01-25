import { Middleware } from "../classes/middlewares/middleware.abstract";
import { MiddlewareProvider } from "./middleware-provider.interface";

export interface StartupOptions {
    middlewares?: any[],
    middlewareProviders?: (Middleware | MiddlewareProvider<any>)[]
}