import { LogDecoratorFactory, Logger } from 'shared/logger';

export const CmsLogger = Logger.configure(
    [
        { fileName: 'combined.log' },
        {
            fileName: 'error.log',
            level: 'error',
        },
    ],
    {
        dirname: __dirname + '/../../logs',
    }
);

export const Log = (title = '', message = '') =>
    LogDecoratorFactory(CmsLogger, title, message);
