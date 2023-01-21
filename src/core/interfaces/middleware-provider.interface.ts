import { Middleware } from "../classes/middleware.abstract";

export interface MiddlewareProvider<MiddlewareOption> {
    class: Middleware;
    options: MiddlewareOption;
}
