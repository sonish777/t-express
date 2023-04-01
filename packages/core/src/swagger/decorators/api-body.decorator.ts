import { SwaggerMetadataKeys } from 'core/utils';
import {
    ApiBodyProps,
    RequestBodySpec,
    SchemaDefinitionSpec,
    SwaggerSpec,
} from '../interfaces';

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
            const schemaDefinition: SchemaDefinitionSpec =
                Reflect.getMetadata(
                    SwaggerMetadataKeys.SCHEMA_DEFINITION,
                    schema
                ) || {};
            const schemaDefinitionsInController: SchemaDefinitionSpec =
                Reflect.getMetadata(
                    SwaggerMetadataKeys.SCHEMA_DEFINITION,
                    target.constructor
                ) || {};
            if (
                schemaDefinition &&
                !schemaDefinitionsInController[schema.name]
            ) {
                schemaDefinitionsInController[schema.name] = {
                    ...schemaDefinition[schema.name],
                };
            }
            Reflect.defineMetadata(
                SwaggerMetadataKeys.SCHEMA_DEFINITION,
                schemaDefinitionsInController,
                target.constructor
            );
        }
    };
}
