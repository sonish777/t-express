import { SwaggerMetadataKeys } from 'core/utils';
import { ApiBodyProps, RequestBodySpec, SwaggerSpec } from '../interfaces';
import { passSchemaRefsToController } from '../utils';

export function ApiBody(props: ApiBodyProps): MethodDecorator {
    return (target, propertyKey) => {
        propertyKey = String(propertyKey);
        const swaggerSpec: SwaggerSpec =
            Reflect.getMetadata(
                SwaggerMetadataKeys.API_METADATA,
                target.constructor
            ) || {};

        const { contentType = 'application/json', schema, ...rest } = props;
        const requestBodySpec: RequestBodySpec = {
            ...rest,
            content: {
                [contentType]: {
                    schema: {
                        $ref: `#/definitions/${schema?.name}`,
                    },
                },
            },
        };
        if (!swaggerSpec[propertyKey]) {
            swaggerSpec[propertyKey] = {
                requestBody: requestBodySpec,
            };
        } else {
            swaggerSpec[propertyKey] = {
                ...swaggerSpec[propertyKey],
                requestBody: requestBodySpec,
            };
        }
        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_METADATA,
            swaggerSpec,
            target.constructor
        );

        if (schema) {
            passSchemaRefsToController(target, schema);
        }
    };
}
