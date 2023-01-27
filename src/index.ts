import { Server } from "@core/server";
import { provideMiddleware } from "@core/utils";
import morgan from "morgan";
import "@database/connections";
import { Handler } from "express";
import { CORSProvider } from "@providers/cors.provider";
import { ViewEngineOptions, ViewEngineProvider } from "@providers/view-engine.provider";
import { PassportProvider } from "@providers/passport.provider";
import { StaticServeProvider, StaticServeProviderOptions } from "@providers/static-serve.provider";
import path from "path";

function bootstrap() {
    const server = new Server();
    const middlewares: Handler[] = [morgan("dev")];
    server.startup({
        middlewares: [...middlewares],
        middlewareProviders: [
            CORSProvider,
            provideMiddleware<ViewEngineOptions>(ViewEngineProvider, {
                engine: "ejs"
            }),
            provideMiddleware<StaticServeProviderOptions>(StaticServeProvider, {
                pathToStaticContents: path.join(__dirname, "../public"),
                prefix: "static"
            }),
            PassportProvider
        ]
    });
}

bootstrap();
