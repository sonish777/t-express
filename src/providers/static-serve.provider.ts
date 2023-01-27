import { ProviderStaticMethod } from "@core/interfaces/provider-class.interface";
import express, { Express } from "express";

export interface StaticServeProviderOptions {
    pathToStaticContents: string;
    prefix?: string;
}

export class StaticServeProvider implements ProviderStaticMethod<typeof StaticServeProvider> {
    static register(app: Express, staticServeOptions: StaticServeProviderOptions) {
        const { prefix, pathToStaticContents } = staticServeOptions;
        if (!prefix) {
            app.use(express.static(pathToStaticContents));
            return;
        }
        app.use(prefix.startsWith("/") ? prefix : `/${prefix}`, express.static(pathToStaticContents));
    }
}
