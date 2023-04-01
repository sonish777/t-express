import { SwaggerMetadataKeys } from 'core/utils';
import {
    ApiParametersProps,
    ParameterSpec,
    SchemaSpec,
    SwaggerSpec,
} from '../interfaces';

export function ApiParameter(props: ApiParametersProps): MethodDecorator {
    return (target, propertyKey) => {
        propertyKey = String(propertyKey);
        const swaggerSpec: SwaggerSpec =
            Reflect.getMetadata(
                SwaggerMetadataKeys.API_METADATA,
                target.constructor
            ) || {};
        let parameterSpecs: ParameterSpec[] = [];
        if (Array.isArray(props.schema)) {
            parameterSpecs = (props.schema || []).map((spec) => ({
                in: props.in,
                ...spec,
                schema: {
                    type: spec.type,
                },
            }));
        } else if (props.schema) {
            const schemaProps: SchemaSpec =
                Reflect.getMetadata(
                    SwaggerMetadataKeys.SCHEMA_PROPERTIES,
                    props.schema
                ) || {};
            if (schemaProps) {
                parameterSpecs = Object.getOwnPropertyNames(
                    new props.schema()
                )?.map((prop) => ({
                    in: props.in,
                    name: prop,
                    required: schemaProps.required.indexOf(prop) >= 0,
                    schema: {
                        type: schemaProps.properties[prop]?.type || 'string',
                        example: schemaProps.properties[prop]?.example,
                        format: schemaProps.properties[prop]?.format,
                    },
                }));
            }
        }

        if (!swaggerSpec[propertyKey]) {
            swaggerSpec[propertyKey] = {
                parameters: parameterSpecs,
            };
        } else {
            swaggerSpec[propertyKey] = {
                ...swaggerSpec[propertyKey],
                parameters: [
                    ...(swaggerSpec[propertyKey].parameters || []),
                    ...parameterSpecs,
                ],
            };
        }

        Reflect.defineMetadata(
            SwaggerMetadataKeys.API_METADATA,
            swaggerSpec,
            target.constructor
        );
    };
}
