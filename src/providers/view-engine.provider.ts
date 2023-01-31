import { Express } from 'express';
import path from 'path';
import { ProviderStaticMethod } from '@core/providers';

export interface ViewEngineOptions {
  engine: string;
  path?: string;
  options?: Object;
}

export class ViewEngineProvider
  implements ProviderStaticMethod<typeof ViewEngineProvider>
{
  public static register(app: Express, viewOptions: ViewEngineOptions) {
    app.set('view engine', viewOptions.engine);
    app.set('views', viewOptions.path || path.join(__dirname, '../views'));
    if (viewOptions.options) {
      app.set('view options', { ...viewOptions.options });
    }
  }
}
