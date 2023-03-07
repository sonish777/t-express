import { NextFunction, Request, Response } from 'express';

export const CatchAsync: MethodDecorator = function (
    _target: Object,
    _propertyKey,
    descriptor: PropertyDescriptor
) {
    const routeHandler = descriptor.value;
    descriptor.value = function (
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (routeHandler) {
            const response = routeHandler.bind(this)(req, res, next);
            if (response instanceof Promise) {
                response.catch(next);
            }
        }
    };
    return descriptor;
};
