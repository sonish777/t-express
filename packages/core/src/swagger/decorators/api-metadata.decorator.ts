import { SwaggerMetadataKeys } from 'core/utils';
import { ApiMetadataProps, SwaggerSpec } from '../interfaces';

export function ApiMetadata(props: ApiMetadataProps): MethodDecorator {
    return (target: any, propertyKey) => {
        propertyKey = String(propertyKey);
        const swaggerSpec: SwaggerSpec =
            Reflect.getMetadata(
                SwaggerMetadataKeys.API_METADATA,
                target.constructor
            ) || {};
        if (!swaggerSpec[propertyKey]) {
            swaggerSpec[propertyKey] = {
                description: props.description,
                consumes: props.consumes ?? [],
                summary: props.summary,
            };
        } else {
            swaggerSpec[propertyKey] = {
                ...swaggerSpec[propertyKey],
                description: props.description,
                consumes: props.consumes ?? [],
                summary: props.summary,
            };
        }
        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_METADATA,
            swaggerSpec,
            target.constructor
        );
    };
}
