import { Handler } from 'express';
import path from 'path';
import _ from 'lodash';
import methodOverride from 'method-override';
import { Server } from 'core/server';
import { provideMiddleware } from 'core/utils';
import {
    PassportProvider,
    ViewEngineOptions,
    ViewEngineProvider,
} from '@cms/providers';
import { AppLocalsProvider } from '@cms/providers';
import 'shared/connections';
import {
    ForbiddenExceptionHandler,
    GlobalExceptionHandler,
    UnauthorizedExceptionHandler,
} from '@cms/exceptions/handlers';
import { CMSModulesConfig } from '@cms/configs/cms.config';
import { UnprocessableEntityExceptionHandler } from '@cms/exceptions/handlers';
import * as controllers from '@cms/controllers';
import { ServerConfig } from '@cms/configs';
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
            provideMiddleware<ViewEngineOptions>(ViewEngineProvider, {
                engine: 'ejs',
            }),
            provideMiddleware<StaticServeProviderOptions>(StaticServeProvider, {
                pathToStaticContents: path.join(__dirname, '../public'),
                prefix: 'static',
            }),
            PassportProvider,
            AppLocalsProvider,
        ],
        locals: [
            { loginError: (req) => req.flash('loginError') },
            {
                user: (req) =>
                    req.user
                        ? _.pick(req.user, [
                              'firstName',
                              'lastName',
                              'email',
                              'userRole',
                          ])
                        : null,
            },
            { cmsModulesConfig: () => CMSModulesConfig },
            { inputData: (req) => req.flash('inputData') },
            { mappedErrors: (req) => req.flash('mappedErrors') },
            { errorToast: (req) => req.flash('error:toast') },
        ],
        exceptionHandlers: [
            new UnauthorizedExceptionHandler(),
            new UnprocessableEntityExceptionHandler(),
            new ForbiddenExceptionHandler(),
            new GlobalExceptionHandler(), // GlobalExceptionHandler should be kept at the end of the list;
        ],
    });
}

bootstrap();
