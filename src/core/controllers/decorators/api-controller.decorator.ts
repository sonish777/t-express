import { ControllerMetadataKeys } from '@core/utils';
import { Service } from 'typedi';

export function ApiController(basePath = ''): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(ControllerMetadataKeys.BASE_PATH, basePath, target);
    Reflect.defineMetadata(ControllerMetadataKeys.IS_API, true, target);
    Service()(target);
  };
}
