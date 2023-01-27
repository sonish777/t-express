import { Express } from "express";

export interface Provider {
    apply(app: Express, ...rest: any[]): void;
}