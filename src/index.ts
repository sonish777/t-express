import { Handler } from "express";
import path from "path";
import morgan from "morgan";
import { Server } from "@core/server";
import { provideMiddleware } from "@core/utils";
import { CORSProvider, PassportProvider, StaticServeProvider, StaticServeProviderOptions, ViewEngineOptions, ViewEngineProvider } from "@providers";
import "@database/connections";

function bootstrap() {
    const server = Server.Instance;
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
