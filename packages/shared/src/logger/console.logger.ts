import { Service } from 'typedi';
import winston from 'winston';

@Service()
export class ConsoleLogger {
    logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.simple(),
            transports: new winston.transports.Console(),
        });
    }

    log(message: string, ...args: any[]) {
        this.logger.info(message, ...args);
    }

    error(message: string, ...args: any[]) {
        this.logger.error(message, ...args);
    }
}
