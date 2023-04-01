import { SwaggerMetadataKeys } from 'core/utils';

export function ApiTag(tag: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(SwaggerMetadataKeys.API_TAG, tag, target);
    };
}
