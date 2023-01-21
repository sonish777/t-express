import { Express } from "express";
import cors from "cors";

export class CORSMiddleware {
    public static apply(app: Express, whitelist: string[] = []) {
        if (process.env.NODE_ENV === "development") {
            app.use(cors());
        } else {
            app.use(
                cors({
                    origin: function (requestOrigin, callback) {
                        if (!requestOrigin || whitelist.indexOf(requestOrigin) !== -1) {
                            callback(null, true);
                        } else {
                            callback(new Error("Not allowed by CORS"));
                        }
                    }
                })
            );
        }
    }
}
