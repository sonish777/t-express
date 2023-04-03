import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc, { OAS3Definition, Server } from 'swagger-jsdoc';
import { ProviderStaticMethod } from 'core/providers';
import { Class } from 'core/interfaces';
import { ControllerMetadataKeys, SwaggerMetadataKeys } from 'core/utils';
import { Router } from 'core/controllers';
import {
    SchemaDefinitionSpec,
    SecuritySchemes,
    SecuritySchemeTypes,
    SwaggerPathSpec,
    SwaggerSpec,
    ResponseSpec,
} from 'core/swagger';

export interface SwaggerDocProviderProps {
    title: string;
    version?: string;
    apiPaths: string[];
    servers: Server[];
    authSchemes?: SecuritySchemeTypes[];
    apiKeyConfig?: {
        in?: 'header' | 'query';
        name?: string;
    };
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

            const apiKeyAuthRoot: boolean = Reflect.getMetadata(
                SwaggerMetadataKeys.API_KEY_AUTH,
                controllerClass
            );
            swaggerSchemaDefinitions = {
                ...swaggerSchemaDefinitions,
                ...schemaDefinitions,
            };
            routers.forEach((router) => {
                const apiBearerAuth: boolean = Reflect.getMetadata(
                    SwaggerMetadataKeys.API_BEARER_AUTH,
                    controllerClass,
                    router.handlerName
                );
                const apiKeyAuth: boolean = Reflect.getMetadata(
                    SwaggerMetadataKeys.API_KEY_AUTH,
                    controllerClass,
                    router.handlerName
                );
                const responseSpec: ResponseSpec = {
                    '200': {
                        description: 'Success',
                        content: { 'application/json': {} },
                    },
                };
                const securitySchemesForRoute: Record<string, []>[] = [];
                if (apiBearerAuth) {
                    securitySchemesForRoute.push({ BearerAuth: [] });
                }
                if (apiKeyAuth || apiKeyAuthRoot) {
                    securitySchemesForRoute.push({ ApiKeyAuth: [] });
                }
                const swaggerPath = router.path
                    .split('/')
                    .map((token) => {
                        if (!token.startsWith(':')) return token;
                        return `{${token.slice(1)}}`;
                    })
                    .join('/'); // convert all ':param' to '{param}' for swagger

                swaggerPaths[`${basePath}${swaggerPath}`] = {
                    ...(swaggerPaths[`${basePath}${swaggerPath}`] || {}),
                    [router.method.toLowerCase()]: {
                        ...(swaggerSpec[router.handlerName] ?? {}),
                        ...(swaggerSpec[router.handlerName]?.responses
                            ? {}
                            : {
                                  responses: responseSpec,
                              }),
                        ...(apiTag
                            ? {
                                  tags: [apiTag],
                              }
                            : {}),
                        security: securitySchemesForRoute,
                    },
                };
            });
        });

        swaggerSpec.paths = swaggerPaths;
        swaggerSpec.definitions = swaggerSchemaDefinitions;
        swaggerSpec.components = {};
        swaggerSpec.components['schemas'] = swaggerSchemaDefinitions;
        const securitySchemes: Record<string, any> = {};
        if (apiMetadata.authSchemes && apiMetadata.authSchemes.length > 0) {
            apiMetadata.authSchemes.forEach((scheme) => {
                switch (scheme) {
                    case 'BearerAuth':
                    case 'BasicAuth':
                        securitySchemes[scheme] = SecuritySchemes(scheme);
                        break;
                    case 'ApiKeyAuth':
                        securitySchemes[scheme] = SecuritySchemes(scheme, {
                            in: apiMetadata.apiKeyConfig?.in || 'header',
                            name: apiMetadata.apiKeyConfig?.name || 'X-API-KEY',
                        });
                        break;
                }
            });
        }
        swaggerSpec.components['securitySchemes'] = securitySchemes;
        swaggerSpec.servers = apiMetadata.servers;
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    }
}
