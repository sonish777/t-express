import "reflect-metadata";
import express, { Express, Handler, Request } from "express";
import * as dotenv from "dotenv";
import path from "path";
import { Container } from "typedi";
import * as controllers from "@controllers";
import { CommonProvider } from "@providers";
import { ServerConfig } from "@configs";
import { ControllerMetadataKeys } from "./utils";
import { StartupOptions } from "./interfaces";
import { Provider, ProviderWithOptions } from "./providers";
import { RoutePrefixes, Router } from "./controllers";

dotenv.config({
    path: path.join(__dirname, "../../", ".env")
});

export class Server {
    private readonly _app: Express;
    private _locals: Record<string, Handler>[] = [
        { errors: (req: Request) => req.flash("errors") },
        { error: (req: Request) => req.flash("error") },
        { message: (req: Request) => req.flash("message") }
    ];

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
            const routers: Router[] = Reflect.getMetadata(ControllerMetadataKeys.ROUTERS, controllerClass) || [];
            routers.forEach((router) => {
                expressRouter[router.method](
                    router.path,
                    [...(router.middlewares || [])],
                    controllerInstance[router.handlerName].bind(controllerInstance)
                );
            });
            if (isApi) {
                this._app.use((routePrefixes.apiPrefix || "/api/v1") + basePath, expressRouter);
            } else {
                this._app.use((routePrefixes.cmsPrefix || "") + basePath, expressRouter);
            }
        });
    }

    configureLocals(locals: Record<string, Handler>[] = []) {
        this._app.use((...handlerArgs) => {
            this._locals = this._locals.concat(locals ?? []);
            this._locals.forEach((local) => {
                handlerArgs[1].locals[Object.keys(local)[0]] = Object.values(local)[0](...handlerArgs);
            });
            handlerArgs[2]();
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
        this._app.listen(ServerConfig.PORT, () => {
            console.log("Server listening on port " + ServerConfig.PORT);
        });
    }
}
