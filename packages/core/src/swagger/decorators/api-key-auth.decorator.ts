import { SwaggerMetadataKeys } from 'core/utils';

export function ApiKeyAuth(root = false): any {
    if (root === true) {
        return function (target: Function): void {
            Reflect.defineMetadata(
                SwaggerMetadataKeys.API_KEY_AUTH,
                true,
                target
            );
        } as ClassDecorator;
    }
    return function (target, propKey) {
        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_KEY_AUTH,
            true,
            target.constructor,
            propKey
        );
    } as MethodDecorator;
}
