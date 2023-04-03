import { Class } from 'core/interfaces';
import { SwaggerMetadataKeys } from 'core/utils';
import { SchemaDefinitionSpec } from '../interfaces';

export function passSchemaRefsToController(target: Object, schema: Class) {
    const schemaDefinition: SchemaDefinitionSpec =
        Reflect.getMetadata(SwaggerMetadataKeys.SCHEMA_DEFINITION, schema) ||
        {};
    const schemaDefinitionsInController: SchemaDefinitionSpec =
        Reflect.getMetadata(
            SwaggerMetadataKeys.SCHEMA_DEFINITION,
            target.constructor
        ) || {};
    if (schemaDefinition && !schemaDefinitionsInController[schema.name]) {
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
