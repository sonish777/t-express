import { ControllerMetadataKeys } from '@core/utils';
import { RouteOptions, Router } from '../interfaces';

export function Route(options: RouteOptions): MethodDecorator {
  return (target, propertyKey) => {
    const controllerClass = target.constructor;
    const routers: Router[] =
      Reflect.getMetadata(ControllerMetadataKeys.ROUTERS, controllerClass) ||
      [];
    routers.push({
      ...options,
      handlerName: propertyKey.toString(),
    });
    Reflect.defineMetadata(
      ControllerMetadataKeys.ROUTERS,
      routers,
      controllerClass
    );
  };
}
