import { LogDecoratorFactory, Logger, LoggerConfig } from 'shared/logger';

const loggerConfigs: LoggerConfig[] = [
    { level: 'error', fileName: 'error.log' },
    { fileName: 'combined.log' },
];

export const ApiLogger = Logger.configure(loggerConfigs, {
    dirname: __dirname + '/../../logs',
});

export const Log = (title = '', message = '') =>
    LogDecoratorFactory(ApiLogger, title, message);
