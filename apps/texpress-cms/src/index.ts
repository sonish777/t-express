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
import config, { IConfig } from 'config';
import { InjectPublisher, Publisher } from 'rabbitmq';

const exchangesConfig = config.get<IConfig>('queue:exchanges');

async function bootstrap(publisher: Publisher) {
    const server = new Server(controllers);
    publisher.registerQueues(exchangesConfig.get('cms'), [
        'activity_log',
        'generate_thumbnail',
    ]);
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
                              'role',
                              'avatar',
                              'thumbnail',
                          ])
                        : null,
            },
            { cmsModulesConfig: () => CMSModulesConfig },
            { inputData: (req) => req.flash('inputData') },
            { mappedErrors: (req) => req.flash('mappedErrors') },
            { errorToast: (req) => req.flash('error:toast') },
            { errors: (req) => req.flash('errors') },
            { error: (req) => req.flash('error') },
            { message: (req) => req.flash('message') },
            { messageToast: (req) => req.flash('message:toast') },
            { url: (req) => req.url },
            { query: (req) => req.query },
        ],
        exceptionHandlers: [
            new UnauthorizedExceptionHandler(),
            new UnprocessableEntityExceptionHandler(),
            new ForbiddenExceptionHandler(),
            new GlobalExceptionHandler(), // GlobalExceptionHandler should be kept at the end of the list;
        ],
    });
}

InjectPublisher(bootstrap)();
