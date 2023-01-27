import { Express } from "express";

export abstract class Provider {
    public abstract apply(app: Express, ...rest: any[]): void;
}