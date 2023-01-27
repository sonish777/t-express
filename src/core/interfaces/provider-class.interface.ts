import { Express } from "express";

export interface ProviderClass {
    new(...args: any[]): any;
    register(app: Express, ...rest: any[]): void;
}

export type ProviderStaticMethod<I extends ProviderClass> = InstanceType<I>;