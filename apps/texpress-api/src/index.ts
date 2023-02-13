import { Handler } from 'express';
import path from 'path';
import methodOverride from 'method-override';
import { Server } from 'core/server';
import { provideMiddleware } from 'core/utils';
import { PassportProvider } from '@providers';
import 'shared/connections';
import { ApiExceptionHandler } from '@exceptions/handlers';
import * as controllers from '@controllers';
import { ServerConfig } from '@configs';
import {
    CORSProvider,
    StaticServeProvider,
    StaticServeProviderOptions,
} from 'shared/providers';

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
