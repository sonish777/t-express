import { SwaggerMetadataKeys } from 'core/utils';

export function ApiBearerAuth(): MethodDecorator {
    return (target, propKey) => {
        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_KEY_AUTH,
            true,
            target.constructor,
            propKey
        );
    };
}
