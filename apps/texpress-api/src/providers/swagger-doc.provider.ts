import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc, { OAS3Definition, Server } from 'swagger-jsdoc';
import { ProviderStaticMethod } from 'core/providers';
import { Class } from 'core/interfaces';
import { ControllerMetadataKeys, SwaggerMetadataKeys } from 'core/utils';
import { Router } from 'core/controllers';
import {
    SchemaDefinitionSpec,
    SwaggerPathSpec,
    SwaggerSpec,
} from 'core/swagger';

export interface SwaggerDocProviderProps {
    title: string;
    version?: string;
    apiPaths: string[];
    servers: Server[];
    controllers?: { [key: string]: Class };
}

export class SwaggerDocProvider
    implements ProviderStaticMethod<typeof SwaggerDocProvider>
{
    public static register(
        app: Express,
        swaggerDocProps: SwaggerDocProviderProps
    ) {
        const { controllers, ...apiMetadata } = swaggerDocProps;
        if (process.env.NODE_ENV === 'production') {
            return;
        }
        const swaggerPaths: SwaggerPathSpec = {};
        let swaggerSchemaDefinitions: SchemaDefinitionSpec = {};
        const swaggerSpec: Partial<OAS3Definition> = swaggerJsDoc({
            definition: {
                info: {
                    title: apiMetadata.title,
                    version: apiMetadata.version || '1.0.0',
                },
                openapi: '3.0.0',
            },
            apis: apiMetadata.apiPaths,
        });

        Object.values(controllers || {}).forEach((controllerClass) => {
            const basePath = Reflect.getMetadata(
                ControllerMetadataKeys.BASE_PATH,
                controllerClass
            );
            const isApi = Reflect.getMetadata(
                ControllerMetadataKeys.IS_API,
                controllerClass
            );
            if (!isApi) {
                return;
            }
            const routers: Router[] =
                Reflect.getMetadata(
                    ControllerMetadataKeys.ROUTERS,
                    controllerClass
                ) || [];

            const swaggerSpec: SwaggerSpec =
                Reflect.getMetadata(
                    SwaggerMetadataKeys.API_METADATA,
                    controllerClass
                ) || {};

            const schemaDefinitions: SchemaDefinitionSpec =
                Reflect.getMetadata(
                    SwaggerMetadataKeys.SCHEMA_DEFINITION,
                    controllerClass
                ) || {};

            const apiTag: string =
                Reflect.getMetadata(
                    SwaggerMetadataKeys.API_TAG,
                    controllerClass
                ) || {};

            swaggerSchemaDefinitions = {
                ...swaggerSchemaDefinitions,
                ...schemaDefinitions,
            };
            routers.forEach((router) => {
                const swaggerPath = router.path
                    .split('/')
                    .map((token) => {
                        if (!token.startsWith(':')) return token;
                        return `{${token.slice(1)}}`;
                    })
                    .join('/'); // convert all ':param' to '{param}' for swagger

                swaggerPaths[`${basePath}${swaggerPath}`] = {
                    [router.method.toLowerCase()]: {
                        ...(swaggerSpec[router.handlerName] ?? {}),
                        responses: {
                            '200': {
                                description: 'Success',
                                content: { 'application/json': {} },
                            },
                        },
                        ...(apiTag
                            ? {
                                  tags: [apiTag],
                              }
                            : {}),
                    },
                };
            });
        });

        swaggerSpec.paths = swaggerPaths;
        swaggerSpec.definitions = swaggerSchemaDefinitions;
        swaggerSpec.components = {};
        swaggerSpec.components['schemas'] = swaggerSchemaDefinitions;
        swaggerSpec.servers = apiMetadata.servers;
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    }
}
