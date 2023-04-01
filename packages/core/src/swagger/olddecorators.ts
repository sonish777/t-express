// import { Class } from 'core/interfaces';

// export function Schema(): ClassDecorator {
//     return (target) => {
//         const schemaProps = Reflect.getMetadata('SCHEMA_PROPERTIES', target);
//         Reflect.defineMetadata(
//             'SCHEMA_DEFINITION',
//             {
//                 [target.name]: {
//                     type: 'object',
//                     ...schemaProps,
//                 },
//             },
//             target
//         );
//     };
// }

// export interface SchemaPropertyProps {
//     type: string;
//     required?: boolean;
//     format?: string;
//     example?: string;
//     items?: { $ref?: any };
// }

// export function SchemaProperty(prop: SchemaPropertyProps): PropertyDecorator {
//     return (target, propertyKey) => {
//         const schemaProps =
//             Reflect.getMetadata('SCHEMA_PROPERTIES', target.constructor) || {};
//         if (!schemaProps.required) {
//             schemaProps.required = [];
//         }
//         if (!schemaProps.properties) {
//             schemaProps.properties = {};
//         }
//         if (prop.required) {
//             schemaProps.required.push(propertyKey);
//         }
//         schemaProps.properties = {
//             ...schemaProps.properties,
//             [propertyKey]: prop,
//         };
//         Reflect.defineMetadata(
//             'SCHEMA_PROPERTIES',
//             schemaProps,
//             target.constructor
//         );
//     };
// }

// export interface ApiBodyProps {
//     contentType: 'application/json' | 'multipart/form-data';
//     schema?: Class;
//     required?: boolean;
// }

// export function ApiBody(props: ApiBodyProps): MethodDecorator {
//     return (target, propertyKey) => {
//         const swaggerSpec =
//             Reflect.getMetadata('API_METADATA', target.constructor) || {};

//         const { contentType, schema, ...rest } = props;
//         const requestBodySpec = {
//             ...rest,
//             content: {
//                 [contentType]: {
//                     schema: {
//                         $ref: `#/definitions/${schema?.name}`,
//                     },
//                 },
//             },
//         };
//         if (!swaggerSpec[propertyKey]) {
//             swaggerSpec[propertyKey] = {
//                 requestBody: requestBodySpec,
//             };
//         } else {
//             swaggerSpec[propertyKey] = {
//                 ...swaggerSpec[propertyKey],
//                 requestBody: requestBodySpec,
//             };
//         }
//         Reflect.defineMetadata('API_METADATA', swaggerSpec, target.constructor);

//         if (schema) {
//             const schemaDefinition =
//                 Reflect.getMetadata('SCHEMA_DEFINITION', schema) || {};
//             const schemaDefinitionsInController =
//                 Reflect.getMetadata('SCHEMA_DEFINITION', target.constructor) ||
//                 {};
//             if (
//                 schemaDefinition &&
//                 !schemaDefinitionsInController[schema.name]
//             ) {
//                 schemaDefinitionsInController[schema.name] = {
//                     ...schemaDefinition[schema.name],
//                 };
//             }
//             Reflect.defineMetadata(
//                 'SCHEMA_DEFINITION',
//                 schemaDefinitionsInController,
//                 target.constructor
//             );
//         }
//     };
// }

// export interface ApiMetadataProps {
//     description?: string;
//     summary?: string;
//     consumes?: string[];
// }

// export function ApiMetadata(props: ApiMetadataProps): MethodDecorator {
//     return (target: any, propertyKey) => {
//         const swaggerSpec =
//             Reflect.getMetadata('API_METADATA', target.constructor) || {};
//         if (!swaggerSpec[propertyKey]) {
//             swaggerSpec[propertyKey] = {
//                 description: props.description,
//                 consumes: props.consumes ?? [],
//                 summary: props.summary,
//             };
//         } else {
//             swaggerSpec[propertyKey] = {
//                 ...swaggerSpec[propertyKey],
//                 description: props.description,
//                 consumes: props.consumes ?? [],
//                 summary: props.summary,
//             };
//         }
//         Reflect.defineMetadata('API_METADATA', swaggerSpec, target.constructor);
//     };
// }

// export function ApiTag(tag: string): ClassDecorator {
//     return (target) => {
//         Reflect.defineMetadata('API_TAG', tag, target);
//     };
// }

// export interface ApiParametersProps {
//     in: 'path' | 'query';
//     schema?:
//         | {
//               name: string;
//               type: string;
//               required?: boolean;
//           }[]
//         | Class;
//     description?: string;
// }

// export function ApiParameter(props: ApiParametersProps): MethodDecorator {
//     return (target, propertyKey) => {
//         const swaggerSpec =
//             Reflect.getMetadata('API_METADATA', target.constructor) || {};
//         let parameterSpecs: any[] = [];
//         if (Array.isArray(props.schema)) {
//             parameterSpecs = (props.schema || []).map((spec) => ({
//                 in: props.in,
//                 ...spec,
//                 schema: {
//                     type: spec.type
//                 }
//             }));
//         } else if (props.schema) {
//             const schemaProps =
//                 Reflect.getMetadata('SCHEMA_PROPERTIES', props.schema) || {};
//             if (schemaProps) {
//                 parameterSpecs = Object.getOwnPropertyNames(
//                     new props.schema()
//                 ).map((prop) => ({
//                     in: props.in,
//                     name: prop,
//                     required: schemaProps.required.indexOf(prop) >= 0,
//                     schema: {
//                         type: schemaProps.properties[prop]?.type || 'string',
//                     }
//                 }));
//             }
//         }

//         if (!swaggerSpec[propertyKey]) {
//             swaggerSpec[propertyKey] = {
//                 parameters: parameterSpecs,
//             };
//         } else {
//             swaggerSpec[propertyKey] = {
//                 ...swaggerSpec[propertyKey],
//                 parameters: [
//                     ...(swaggerSpec[propertyKey].parameters || []),
//                     ...parameterSpecs,
//                 ],
//             };
//         }

//         Reflect.defineMetadata('API_METADATA', swaggerSpec, target.constructor);
//     };
// }
