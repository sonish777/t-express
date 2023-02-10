import { ControllerMetadataKeys } from 'core/utils';
import { RouteOptions, Router } from '../interfaces';

export function Route(options: RouteOptions): MethodDecorator {
  return (target, propertyKey) => {
    const controllerClass = target.constructor;
    const routers: Router[] =
      Reflect.getMetadata(ControllerMetadataKeys.ROUTERS, controllerClass) ||
      [];

    const existingRouterIndex = routers.findIndex(
      (router) => router.handlerName === propertyKey.toString()
    );
    if (existingRouterIndex !== -1) {
      routers[existingRouterIndex] = {
        ...options,
        handlerName: propertyKey.toString(),
      };
      return;
    }
    if (options.path.indexOf(':') !== -1) {
      routers.push({
        ...options,
        handlerName: propertyKey.toString(),
      });
    } else {
      routers.unshift({
        ...options,
        handlerName: propertyKey.toString(),
      });
    }
    Reflect.defineMetadata(
      ControllerMetadataKeys.ROUTERS,
      routers,
      controllerClass
    );
  };
}
