import { RouteOptions } from "@core/interfaces/route-options.interface";
import { Router } from "@core/interfaces/router.interface";
import { auth } from "@middlewares/auth.middleware";
import { ControllerMetadataKeys } from "../utils";

export function Route(options: RouteOptions): MethodDecorator {
    return (target, propertyKey) => {
        const controllerClass = target.constructor;
        const routers: Router[] = Reflect.getMetadata(ControllerMetadataKeys.ROUTERS, controllerClass) || [];
        routers.push({
            ...options,
            handlerName: propertyKey.toString()
        });
        Reflect.defineMetadata(ControllerMetadataKeys.ROUTERS, routers, controllerClass);
    };
}

export function ProtectedRoute({ method, path, middlewares = [] }: RouteOptions): MethodDecorator {
    return Route({
        method,
        path,
        middlewares: [...middlewares, auth]
    });
}
