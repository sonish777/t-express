import { Handler } from 'express';
import path from 'path';
import methodOverride from 'method-override';
import { Server } from 'core/server';
import { provideMiddleware } from 'core/utils';
import 'shared/connections';
import * as controllers from '@api/controllers';
import { ServerConfig } from '@api/configs';
import {
    CORSProvider,
    StaticServeProvider,
    StaticServeProviderOptions,
} from 'shared/providers';
import {
    PassportProvider,
    SwaggerDocProvider,
    SwaggerDocProviderProps,
} from '@api/providers';
import { ApiExceptionHandler } from '@api/exceptions';

export function bootstrap() {
    const server = new Server(controllers);
    const middlewares: Handler[] = [methodOverride('_method')];
    return server.startup(Number(ServerConfig.PORT), {
        name: 'API Server',
        middlewares: [...middlewares],
        middlewareProviders: [
            CORSProvider,
            provideMiddleware<StaticServeProviderOptions>(StaticServeProvider, {
                pathToStaticContents: path.join(__dirname, '../public'),
                prefix: 'static',
            }),
            PassportProvider,
            provideMiddleware<SwaggerDocProviderProps>(SwaggerDocProvider, {
                title: 'Texpress API Documentation',
                apiPaths: [__dirname + '/controllers/**/*.ts'],
                servers: [{ url: `${ServerConfig.URL}/api/v1` }],
                controllers,
            }),
        ],
        exceptionHandlers: [new ApiExceptionHandler()],
    });
}

if (process.env.NODE_ENV !== 'test') {
    bootstrap();
}
