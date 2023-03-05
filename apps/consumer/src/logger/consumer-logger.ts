import { LogDecoratorFactory, Logger } from 'shared/logger';

export const logger = Logger.configure();

export const Log = (title?: string, message?: string) =>
    LogDecoratorFactory(logger, title, message, {
        rethrowError: false,
    });
