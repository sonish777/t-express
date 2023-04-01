import { SwaggerMetadataKeys } from 'core/utils';
import { SchemaPropertyProps, SchemaSpec } from '../interfaces';

export function Schema(): ClassDecorator {
    return (target) => {
        const schemaProps: SchemaSpec = Reflect.getMetadata(
            SwaggerMetadataKeys.SCHEMA_PROPERTIES,
            target
        );
        Reflect.defineMetadata(
            SwaggerMetadataKeys.SCHEMA_DEFINITION,
            {
                [target.name]: {
                    ...schemaProps,
                    type: 'object',
                },
            },
            target
        );
    };
}

export function SchemaProperty(prop: SchemaPropertyProps): PropertyDecorator {
    return (target, propertyKey) => {
        const schemaProps: SchemaSpec =
            Reflect.getMetadata(
                SwaggerMetadataKeys.SCHEMA_PROPERTIES,
                target.constructor
            ) || {};
        if (!schemaProps.required) {
            schemaProps.required = [];
        }
        if (!schemaProps.properties) {
            schemaProps.properties = {};
        }
        if (prop.required) {
            schemaProps.required.push(String(propertyKey));
        }
        schemaProps.properties = {
            ...schemaProps.properties,
            [propertyKey]: prop,
        };
        Reflect.defineMetadata(
            SwaggerMetadataKeys.SCHEMA_PROPERTIES,
            schemaProps,
            target.constructor
        );
    };
}
