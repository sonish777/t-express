import { RouteOptions } from "../interfaces/route-options.interface";
import { Router } from "../interfaces/router.interface";
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
