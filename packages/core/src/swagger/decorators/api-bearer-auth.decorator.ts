import { SwaggerMetadataKeys } from 'core/utils';

export function ApiBearerAuth(): MethodDecorator {
    return (target, propKey) => {
        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_BEARER_AUTH,
            true,
            target.constructor,
            propKey
        );
    };
}
