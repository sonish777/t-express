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
import { PassportProvider } from '@api/providers';
import { ApiExceptionHandler } from '@api/exceptions/handlers';

function bootstrap() {
    const server = new Server(controllers);
    const middlewares: Handler[] = [methodOverride('_method')];
    server.startup(Number(ServerConfig.PORT), {
        middlewares: [...middlewares],
        middlewareProviders: [
            CORSProvider,
            provideMiddleware<StaticServeProviderOptions>(StaticServeProvider, {
                pathToStaticContents: path.join(__dirname, '../public'),
                prefix: 'static',
            }),
            PassportProvider,
        ],
        exceptionHandlers: [new ApiExceptionHandler()],
    });
}

bootstrap();
