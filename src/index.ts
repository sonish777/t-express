import { Handler } from 'express';
import path from 'path';
import _ from 'lodash';
import morgan from 'morgan';
import { Server } from '@core/server';
import { provideMiddleware } from '@core/utils';
import {
  CORSProvider,
  PassportProvider,
  StaticServeProvider,
  StaticServeProviderOptions,
  ViewEngineOptions,
  ViewEngineProvider,
} from '@providers';
import { AppLocalsProvider } from '@providers';
import '@database/connections';
import {
  GlobalExceptionHandler,
  UnauthorizedExceptionHandler,
} from '@exceptions/handlers';
import { CMSModulesConfig } from '@configs/cms-config';
import { UnprocessableEntityExceptionHandler } from '@exceptions/handlers/unprocessable-entity-exception.handler';

function bootstrap() {
  const server = Server.Instance;
  const middlewares: Handler[] = [];
  server.startup({
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
            ? _.pick(req.user, ['firstName', 'lastName', 'email'])
            : null,
      },
      { cmsModulesConfig: () => CMSModulesConfig },
      { inputData: (req) => req.flash('inputData') },
    ],
    exceptionHandlers: [
      new UnauthorizedExceptionHandler(),
      new UnprocessableEntityExceptionHandler(),
      new GlobalExceptionHandler(),
    ],
  });
}

bootstrap();
