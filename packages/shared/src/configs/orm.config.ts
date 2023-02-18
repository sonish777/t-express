import { DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from './database';

export const OrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: DatabaseConfig.HOST,
    port: DatabaseConfig.PORT,
    username: DatabaseConfig.USERNAME,
    password: DatabaseConfig.PASSWORD,
    database: DatabaseConfig.DATABASE_NAME,
    entities: [
        __dirname + '/../entities/*.entity{.ts,.js}',
        __dirname +
            '/../../../../apps/texpress-api/dist/entities/*.entity{.ts,.js}',
    ],
    synchronize: false,
};
