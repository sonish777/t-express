import { SwaggerMetadataKeys } from 'core/utils';
import { ApiResponseProps, ResponseSpec, SwaggerSpec } from '../interfaces';
import { passSchemaRefsToController } from '../utils';

export function ApiResponse(props: ApiResponseProps): MethodDecorator {
    return (target, propKey) => {
        propKey = String(propKey);
        const swaggerSpec: SwaggerSpec =
            Reflect.getMetadata(
                SwaggerMetadataKeys.API_METADATA,
                target.constructor
            ) || {};

        const {
            contentType = 'application/json',
            schema = {
                type: contentType,
            },
            code,
            description,
        } = props;
        const responseSpec: ResponseSpec = {
            [code || '200']: {
                description: description || '',
                content: {
                    [contentType]: {
                        schema: {
                            ...('type' in schema
                                ? schema
                                : {
                                      $ref: `#/definitions/${schema.name}`,
                                  }),
                        },
                    },
                },
            },
        };

        if (!swaggerSpec[propKey]) {
            swaggerSpec[propKey] = {
                responses: responseSpec,
            };
        } else {
            swaggerSpec[propKey] = {
                ...swaggerSpec[propKey],
                responses: {
                    ...(swaggerSpec[propKey].responses || {}),
                    ...responseSpec,
                },
            };
        }
        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_METADATA,
            swaggerSpec,
            target.constructor
        );

        if (props.schema && !('type' in props.schema)) {
            passSchemaRefsToController(target, props.schema);
        }
    };
}
