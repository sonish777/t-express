import { Express } from 'express';

export abstract class AbstractProvider {
  public abstract apply(app: Express, ...rest: any[]): void;
}
