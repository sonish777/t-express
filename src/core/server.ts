import "reflect-metadata";
import express, { Express, Handler, Request } from "express";
import { Container } from "typedi";
import * as controllers from "@controllers";
import { CommonProvider } from "@providers";
import { ServerConfig } from "@configs";
import { ValidationChain } from "express-validator";
import { ControllerMetadataKeys } from "./utils";
import { StartupOptions } from "./interfaces";
import { Provider, ProviderWithOptions } from "./providers";
import { RoutePrefixes, Router } from "./controllers";
import { ExceptionHandler } from "./exceptions/handlers";

export class Server {
    private static _instance: Server;
    private readonly _app: Express;

    private _locals: Record<string, Handler>[] = [
        { errors: (req: Request) => req.flash("errors") },
        { error: (req: Request) => req.flash("error") },
        { message: (req: Request) => req.flash("message") }
    ];

    public static get Instance(): Server {
        if (!this._instance) {
            return (this._instance = new this());
        }
        return this._instance;
    }

    constructor() {
        this._app = express();
    }

    get app(): Express {
        return this._app;
    }

    private applyMiddlewares(middlewares: any[] = [], providers: (Provider | ProviderWithOptions<any>)[] = []) {
        CommonProvider.register(this._app);
        if (middlewares.length > 0) {
            this._app.use(...middlewares);
        }
        if (providers.length > 0) {
            providers.forEach((provider) => {
                if ("class" in provider) {
                    provider.class.register(this._app, { ...provider.options });
                } else if ("register" in provider) {
                    provider.register(this._app);
                }
            });
        }
        return this;
    }

    private registerRoutes(routePrefixes: RoutePrefixes = {}) {
        Object.values(controllers).forEach((controllerClass) => {
            const controllerInstance: { [handlerName: string]: Handler } = Container.get<any>(controllerClass) as any;
            const expressRouter = express.Router();
            const basePath = Reflect.getMetadata(ControllerMetadataKeys.BASE_PATH, controllerClass);
            const isApi = Reflect.getMetadata(ControllerMetadataKeys.IS_API, controllerClass);
            const isFallback = Reflect.getMetadata(ControllerMetadataKeys.IS_FALLBACK, controllerClass);
            const routers: Router[] = Reflect.getMetadata(ControllerMetadataKeys.ROUTERS, controllerClass) || [];
            routers.forEach((router) => {
                const validationChains: ValidationChain[] = [];
                if (router.validators && router.validators.length > 0) {
                    router.validators.forEach((v) => {
                        validationChains.push(...Object.values(v.rules).flat(1));
                    });
                }
                expressRouter[router.method](
                    router.path,
                    [...(router.middlewares || [])],
                    [...validationChains],
                    controllerInstance[router.handlerName].bind(controllerInstance)
                );
            });
            if (isApi) {
                this._app.use((routePrefixes.apiPrefix || "/api/v1") + basePath, expressRouter);
            } else if (isFallback) {
                this._app.use(basePath, expressRouter);
            } else {
                this._app.use((routePrefixes.cmsPrefix || "") + basePath, expressRouter);
            }
        });
    }

    private configureLocals(locals: Record<string, Handler>[] = []) {
        this._app.use((...handlerArgs) => {
            this._locals.concat(locals ?? []).forEach((local) => {
                handlerArgs[1].locals[Object.keys(local)[0]] = Object.values(local)[0](...handlerArgs);
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
    startup(options: StartupOptions = {}) {
        this.applyMiddlewares(options.middlewares, options.middlewareProviders);
        this.configureLocals(options.locals);
        this.registerRoutes(options.routePrefixes);
        this.registerErrorHandlers(options.exceptionHandlers);
        this._app.listen(ServerConfig.PORT, () => {
            console.log("Server listening on port " + ServerConfig.PORT);
        });
    }
}
