import { APIBaseController } from 'core/controllers';
import { NextFunction, Request, Response } from 'express';

type FilterFirstType<T> = T extends [unknown, ...infer Rest] ? Rest : [];

const ApiResponderFactory = <K extends keyof APIBaseController>(
    responderMethodName: K,
    fnArgs?: FilterFirstType<Parameters<APIBaseController[K]>> | null,
    forwardReturnedValue = false
): MethodDecorator => {
    return (target, _prop, descriptor: PropertyDescriptor) => {
        const routeHandler = descriptor.value;
        descriptor.value = function (
            req: Request,
            res: Response,
            next: NextFunction
        ) {
            const responder = <Function>(<any>target)[responderMethodName];
            if (routeHandler) {
                const result = routeHandler.bind(this)(req, res, next);
                if (!(result instanceof Promise)) {
                    return responder.call(
                        this,
                        res,
                        ...(fnArgs ?? []),
                        ...(forwardReturnedValue ? [result] : [])
                    );
                }
                result
                    .then((resolvedResult) => {
                        responder.call(
                            this,
                            res,
                            ...(fnArgs ?? []),
                            ...(forwardReturnedValue ? [resolvedResult] : [])
                        );
                    })
                    .catch(next);
            }
            return descriptor;
        };
    };
};

export const RespondOK = (message = '') => ApiResponderFactory('ok', [message]);
export const RespondCreated = (sendCreatedResource = false) =>
    ApiResponderFactory('created', null, sendCreatedResource);
export const RespondItem = () => ApiResponderFactory('send', null, true);
export const RespondDeleted = () => ApiResponderFactory('deleted');
export const RespondPaginated = () =>
    ApiResponderFactory('paginate', null, true);
