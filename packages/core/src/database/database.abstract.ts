import { DataSource } from 'typeorm';
import { ConsoleLogger } from 'shared/logger';
import Container from 'typedi';

export abstract class Database {
    protected abstract connection: DataSource;
    protected readonly logger: ConsoleLogger;
    constructor() {
        this.logger = Container.get(ConsoleLogger);
    }
    async init() {
        try {
            await this.connection.initialize();
            this.logger.log('Database connection established successfully!');
        } catch (error) {
            this.logger.error('Database connection failed', error);
        }
    }
}
