import cookieParser from "cookie-parser";
import express, { Express } from "express";
import session from "express-session";
import flash from 'connect-flash';
import { ProviderStaticMethod } from "@core/interfaces/provider-class.interface";

export class CommonProvider implements ProviderStaticMethod<typeof CommonProvider> {
    public static register(app: Express) {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(
            session({
                secret: "keyboard cat",
                resave: false,
                saveUninitialized: true
            })
        );
        app.use(cookieParser());
        app.use(flash());
    }
}
