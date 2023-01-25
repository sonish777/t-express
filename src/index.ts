import { Server } from "./core/server";
import { provideMiddleware } from "./core/utils";
import { ViewEngineMiddleware, ViewEngineOptions } from "./middlewares/view-engine.middleware";
import morgan from "morgan";
import "./database/connections";

function bootstrap() {
    const server = new Server();
    const middlewares = [morgan("dev")];
    server.startup({
        middlewares: [...middlewares],
        middlewareProviders: [
            provideMiddleware<ViewEngineOptions>(ViewEngineMiddleware, {
                engine: "ejs"
            })
        ]
    });
}

bootstrap();
