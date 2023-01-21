import cookieParser from "cookie-parser";
import express, { Express } from "express";
import session from "express-session";

export class CommonMiddleware {
    public static apply(app: Express) {
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
    }
}
