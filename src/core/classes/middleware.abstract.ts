import { Express } from "express";

export abstract class Middleware {
    public abstract apply(app: Express, ...rest: any[]): void;
}