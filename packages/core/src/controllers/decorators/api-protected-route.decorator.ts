import { jwtAuth } from 'shared/middlewares';
import { RouteOptions } from '../interfaces';
import { Route } from './route.decorator';

export function APIProtectedRoute({
    method,
    path,
    middlewares = [],
    validators = [],
}: RouteOptions): MethodDecorator {
    return Route({
        method,
        path,
        middlewares: [jwtAuth, ...middlewares],
        validators,
    });
}
