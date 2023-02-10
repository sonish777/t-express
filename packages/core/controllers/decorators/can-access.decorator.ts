import { ControllerMetadataKeys } from 'core/utils';

export const CanAccess: ClassDecorator = (target) => {
  Reflect.defineMetadata(
    ControllerMetadataKeys.CHECK_PERMISSIONS,
    true,
    target
  );
};
