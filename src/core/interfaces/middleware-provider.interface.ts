import { Middleware } from "../classes/middlewares/middleware.abstract";

export interface MiddlewareProvider<MiddlewareOption> {
    class: Middleware;
    options: MiddlewareOption;
}
