import 'reflect-metadata';
import express, { Express, Handler, RequestHandler } from 'express';
import { Container } from 'typedi';
import { ValidationChain } from 'express-validator';
import { ControllerMetadataKeys, MultipartMetadataKeys } from './utils';
import { Class, StartupOptions } from './interfaces';
import { Provider, ProviderWithOptions } from './providers';
import { RoutePrefixes, Router } from './controllers';
import { ExceptionHandler } from './exceptions/handlers';
import { validate, canAccess } from 'shared/middlewares';
import { CommonProvider } from 'shared/providers';
import dotenv from 'dotenv';
import { MultipartConfigs, MultipartFields, uploader } from 'shared/configs';
import multer from 'multer';
import { UnprocessableEntityException } from 'shared/exceptions';
import { ConsoleLogger } from 'shared/logger';

dotenv.config({ path: __dirname + '../../../.env' });

export class Server {
    private readonly _app: Express;
    private readonly logger: ConsoleLogger;

    constructor(private readonly controllers?: { [key: string]: Class }) {
        this.logger = Container.get(ConsoleLogger);
        this._app = express();
    }

    get app(): Express {
        return this._app;
    }

    protected applyMiddlewares(
        middlewares: any[] = [],
        providers: (Provider | ProviderWithOptions<Object>)[] = []
    ) {
        CommonProvider.register(this._app);
        if (middlewares.length > 0) {
            this._app.use(...middlewares);
        }
        if (providers.length > 0) {
            providers.forEach((provider) => {
                if ('class' in provider) {
                    provider.class.register(this._app, { ...provider.options });
                } else if ('register' in provider) {
                    provider.register(this._app);
                }
            });
        }
        return this;
    }

    protected registerRoutes(routePrefixes: RoutePrefixes = {}) {
        if (!this.controllers) {
            return;
        }
        Object.values(this.controllers).forEach((controllerClass) => {
            const controllerInstance: { [handlerName: string]: Handler } =
                Container.get<any>(controllerClass);
            const expressRouter = express.Router();
            const basePath = Reflect.getMetadata(
                ControllerMetadataKeys.BASE_PATH,
                controllerClass
            );
            const isApi = Reflect.getMetadata(
                ControllerMetadataKeys.IS_API,
                controllerClass
            );
            const isFallback = Reflect.getMetadata(
                ControllerMetadataKeys.IS_FALLBACK,
                controllerClass
            );
            const routers: Router[] =
                Reflect.getMetadata(
                    ControllerMetadataKeys.ROUTERS,
                    controllerClass
                ) || [];
            const permissionGuard: Handler[] = [];
            const checkPermissions = Reflect.getMetadata(
                ControllerMetadataKeys.CHECK_PERMISSIONS,
                controllerClass
            );
            if (checkPermissions) {
                permissionGuard.push(canAccess());
            }
            const multipartMap: MultipartFields =
                Reflect.getMetadata(
                    MultipartMetadataKeys.MULTIPART_FIELDS,
                    controllerClass
                ) || {};
            const multipartConfigMap: MultipartConfigs =
                Reflect.getMetadata(
                    MultipartMetadataKeys.MULTIPART_CONFIGS,
                    controllerClass
                ) || {};
            routers.forEach((router) => {
                const validationChains: ValidationChain[] = [];
                let uploadsHandler: RequestHandler | undefined;
                if (router.validators && router.validators.length > 0) {
                    router.validators.forEach((v) => {
                        validationChains.push(
                            ...Object.values(v.rules).flat(1)
                        );
                    });
                }
                if (multipartMap[router.handlerName]) {
                    const fields = multipartMap[router.handlerName];
                    const config = multipartConfigMap[router.handlerName];
                    const multerUploadsHandler =
                        uploader(config).fields(fields);
                    if (multerUploadsHandler) {
                        uploadsHandler = (req, res, next) => {
                            multerUploadsHandler(req, res, function (err) {
                                if (err instanceof multer.MulterError) {
                                    const field = String(err.field);
                                    next(
                                        new UnprocessableEntityException({
                                            [field]: {
                                                location: 'files',
                                                param: field,
                                                msg: 'File size too large',
                                            },
                                        })
                                    );
                                }
                                next();
                            });
                        };
                    }
                }
                expressRouter[router.method](
                    router.path,
                    ...permissionGuard,
                    [...(router.middlewares || [])],
                    uploadsHandler ?? [],
                    validationChains.length > 0
                        ? [
                              ...validationChains,
                              ...(uploadsHandler ? [] : [validate]),
                          ]
                        : [],
                    controllerInstance[router.handlerName].bind(
                        controllerInstance
                    )
                );
            });
            if (isApi) {
                this._app.use(
                    (routePrefixes.apiPrefix || '/api/v1') + basePath,
                    expressRouter
                );
            } else if (isFallback) {
                this._app.use(basePath, expressRouter);
            } else {
                this._app.use(
                    (routePrefixes.cmsPrefix || '') + basePath,
                    expressRouter
                );
            }
        });
    }

    private configureLocals(locals: Record<string, Handler>[] = []) {
        this._app.use((...handlerArgs) => {
            locals.forEach((local) => {
                handlerArgs[1].locals[Object.keys(local)[0]] = Object.values(
                    local
                )[0](...handlerArgs);
            });
            handlerArgs[2]();
        });
    }

    private registerErrorHandlers(exceptionHandlers: ExceptionHandler[] = []) {
        exceptionHandlers.forEach((handler) => {
            this._app.use(handler.handle);
        });
    }

    /**
     * Boots up the express application
     *
     * @param {StartupOptions} [options={}]
     */
    startup(port: number, options: StartupOptions = {}) {
        this.applyMiddlewares(options.middlewares, options.middlewareProviders);
        this.configureLocals(options.locals);
        this.registerRoutes(options.routePrefixes);
        this.registerErrorHandlers(options.exceptionHandlers);
        return this._app.listen(port, () => {
            this.logger.log(
                `${options.name || 'Server'} listening on port ${port}`
            );
        });
    }
}
