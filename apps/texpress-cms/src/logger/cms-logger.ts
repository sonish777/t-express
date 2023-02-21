import { LogDecoratorFactory, Logger } from 'shared/logger';

export const CmsLogger = Logger.configure([
    { fileName: 'combined.log' },
    {
        fileName: 'error.log',
        level: 'error',
    },
]);

export const Log = (title = '', message = '') =>
    LogDecoratorFactory(CmsLogger, title, message);
