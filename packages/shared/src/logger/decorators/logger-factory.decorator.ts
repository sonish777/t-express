import { HTTPMethods } from 'core/utils';
import { Request } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { Logger } from 'winston';

export function LogDecoratorFactory(
    logger: Logger,
    title = '',
    message = '',
    options: {
        rethrowError: boolean;
    } = {
        rethrowError: true,
    }
): MethodDecorator {
    return (target, prop, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const metaData: Record<string, string | undefined | string[]> = {};
            if (
                args.length === 3 &&
                args[0] instanceof IncomingMessage &&
                args[1] instanceof ServerResponse &&
                args[2] instanceof Function
            ) {
                const [req] = args;
                metaData.url = req.url;
                metaData.method = req.method;
                if (req.method !== HTTPMethods.Get) {
                    metaData.body = (<Request>req).body;
                }
            } else {
                metaData.args = args;
            }
            title = title || target.constructor.name;
            message = message || String(prop) + `()`;
            try {
                const result = await originalMethod.bind(this)(...args);
                logger.info(`${title}: ${message}`, {
                    ...metaData,
                });
                return result;
            } catch (error: any) {
                logger.error(`${title}: ${message}`, {
                    ...error,
                    stack: error.stack,
                    ...metaData,
                });
                if (options.rethrowError === true) {
                    throw error;
                }
            }
        };
        return descriptor;
    };
}
