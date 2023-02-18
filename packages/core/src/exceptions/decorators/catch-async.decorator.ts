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
            routeHandler.bind(this)(req, res, next).catch(next);
        }
    };
    return descriptor;
};
