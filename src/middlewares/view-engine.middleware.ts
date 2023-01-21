import { Express } from "express";
import path from "path";

export interface ViewEngineOptions {
    engine: string;
    path?: string;
    options?: Object;
}

export class ViewEngineMiddleware {
    public static apply(app: Express, viewOptions: ViewEngineOptions) {
        app.set("view engine", viewOptions.engine);
        app.set("views", viewOptions.path || path.join(__dirname, "../views"));
        if (viewOptions.options) {
            app.set("view options", { ...viewOptions.options });
        }
    }
}
