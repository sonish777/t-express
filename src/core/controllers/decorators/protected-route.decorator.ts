import { auth } from "@middlewares/auth.middleware";
import { RouteOptions } from "../interfaces";
import { Route } from "./route.decorator";

export function ProtectedRoute({ method, path, middlewares = [], validators = []}: RouteOptions): MethodDecorator {
    return Route({
        method,
        path,
        middlewares: [auth, ...middlewares],
        validators: [...validators]
    });
}
