import morgan from "morgan";
import { Server } from "./core/server";
import { provideMiddleware } from "./core/utils";
import { ViewEngineMiddleware, ViewEngineOptions } from "./middlewares/view-engine.middleware";

function bootstrap() {
    const server = new Server();
    const middlewares = [morgan("dev")];

    server.startup({
        middlewares: [...middlewares],
        middlewareProviders: [
            provideMiddleware<ViewEngineOptions>(ViewEngineMiddleware, {
                engine: "pug"
            })
        ]
    });
}

bootstrap();
