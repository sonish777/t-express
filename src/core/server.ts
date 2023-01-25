import "reflect-metadata";
import express, { Express, Handler } from "express";
import * as dotenv from "dotenv";
import path from "path";
import { ServerConfig } from "../configs";
import { CommonMiddleware } from "../middlewares/common.middleware";
import { CORSMiddleware } from "../middlewares/cors.middleware";
import { StartupOptions } from "./interfaces/startup-options.interface";
import { Middleware } from "./classes/middlewares/middleware.abstract";
import { MiddlewareProvider } from "./interfaces/middleware-provider.interface";
import * as controllers from "../controllers";
import { ControllerMetadataKeys } from "./utils";
import { Router } from "./interfaces/router.interface";
import { Container } from "typedi";

dotenv.config({
    path: path.join(__dirname, "../../", ".env")
});

export class Server {
    private readonly _app: Express;

    constructor() {
        this._app = express();
    }

    get app(): Express {
        return this._app;
    }

    private applyMiddlewares(middlewares: any[] = [], middlewareProviders: (Middleware | MiddlewareProvider<any>)[] = []) {
        CommonMiddleware.apply(this._app);
        CORSMiddleware.apply(this._app);
        if (middlewares.length > 0) {
            this._app.use(...middlewares);
        }
        if (middlewareProviders.length > 0) {
            middlewareProviders.forEach((middlewareClass) => {
                if ("class" in middlewareClass) {
                    middlewareClass.class.apply(this._app, { ...middlewareClass.options });
                } else if ("apply" in middlewareClass) {
                    middlewareClass.apply(this._app);
                }
            });
        }
        return this;
    }

    private registerRoutes() {
        Object.values(controllers).forEach((controllerClass) => {
            const controllerInstance: { [handlerName: string]: Handler } = Container.get<any>(controllerClass) as any;
            const expressRouter = express.Router();
            const basePath = Reflect.getMetadata(ControllerMetadataKeys.BASE_PATH, controllerClass);
            const routers: Router[] = Reflect.getMetadata(ControllerMetadataKeys.ROUTERS, controllerClass) || [];
            routers.forEach((router) => {
                expressRouter[router.method](
                    router.path,
                    [...(router.middlewares || [])],
                    controllerInstance[router.handlerName].bind(controllerInstance)
                );
            });
            this._app.use(basePath, expressRouter);
        });
    }

    /**
     * Boots up the express application
     *
     * @param {StartupOptions} [options={}]
     */
    startup(options: StartupOptions = {}) {
        this.applyMiddlewares(options.middlewares, options.middlewareProviders);
        this.registerRoutes();
        this._app.listen(ServerConfig.PORT, () => {
            console.log("Server listening on port " + ServerConfig.PORT);
        });
    }
}
