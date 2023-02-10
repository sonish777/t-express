import { Express } from 'express';

export interface Provider {
    new (...args: any[]): any;
    register(app: Express, ...rest: any[]): void;
}

export type ProviderStaticMethod<I extends Provider> = InstanceType<I>;
