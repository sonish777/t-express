import { Handler } from "express";
import path from "path";
import _ from "lodash";
import morgan from "morgan";
import { Server } from "@core/server";
import { provideMiddleware } from "@core/utils";
import { CORSProvider, PassportProvider, StaticServeProvider, StaticServeProviderOptions, ViewEngineOptions, ViewEngineProvider } from "@providers";
import { AppLocalsProvider } from "@providers";
import "@database/connections";

function bootstrap() {
    const server = Server.Instance;
    const middlewares: Handler[] = [];
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
            PassportProvider,
            AppLocalsProvider
        ],
        locals: [
            {
                loginError: (req, res) => req.flash("loginError")
            },
            {
                user: (req, res) => (req.user ? _.pick(req.user, ["firstName", "lastName", "email"]) : null)
            }
        ]
    });
}

bootstrap();
