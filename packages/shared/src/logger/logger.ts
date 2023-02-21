import winston, { format } from 'winston';

export interface LoggerConfig {
    level?: string;
    fileName: string;
}

const winstonLoggerFormats = [
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.ms(),
    format.metadata(),
];

export class Logger {
    static configure(configs: LoggerConfig[] = []) {
        const transports: winston.transport[] = [];
        if (process.env.NODE_ENV !== 'production') {
            transports.push(
                new winston.transports.Console({
                    handleExceptions: true,
                    handleRejections: true,
                    format: format.combine(
                        ...winstonLoggerFormats,
                        format.prettyPrint({
                            colorize: true,
                        })
                    ),
                })
            );
        }
        transports.push(
            ...configs.map(
                (conf) =>
                    new winston.transports.File({
                        dirname: 'src/logs',
                        filename: conf.fileName ?? `${conf.level}.log`,
                        format: format.combine(
                            ...winstonLoggerFormats,
                            format.prettyPrint()
                        ),
                        ...(conf.level ? { level: conf.level } : {}),
                    })
            )
        );
        const logger = winston.createLogger({
            transports: transports,
        });
        return logger;
    }
}
