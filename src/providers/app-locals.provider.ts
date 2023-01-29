import { ProviderStaticMethod } from "@core/providers";
import { Express } from "express";
import moment from "moment";

export class AppLocalsProvider implements ProviderStaticMethod<typeof AppLocalsProvider> {
    static register(app: Express) {

        app.locals.log = (...args: any[]) => {
            console.log(...args);
        }

        app.locals.exists = (value: any): boolean => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return typeof value !== "undefined" && value !== null;
        };

        app.locals.get = (value: any, defaultValue = "") => {
            return app.locals.exists(value) ? value: defaultValue;
        }

        app.locals.formatDate = (value: string, format = "YYYY/MM/DD") => {
            return moment(value).format(format);
        }
    }
}
