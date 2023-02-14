import { ControllerMetadataKeys } from 'core/utils';
import { Service } from 'typedi';

export function Controller(
    basePath = '',
    options?: { fallback: boolean }
): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(
            ControllerMetadataKeys.BASE_PATH,
            basePath,
            target
        );
        Reflect.defineMetadata(
            ControllerMetadataKeys.IS_FALLBACK,
            options?.fallback || false,
            target
        );
        Service()(target);
    };
}
