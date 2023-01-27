import { Express } from "express";
import cors from "cors";
import { ProviderStaticMethod } from "@core/interfaces/provider-class.interface";

export class CORSProvider implements ProviderStaticMethod<typeof CORSProvider> {
    public static register(app: Express, whitelist: string[] = []) {
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
