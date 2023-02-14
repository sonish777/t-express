import { DataSource } from 'typeorm';
import { OrmConfig } from '../configs/orm.config';

export const seederDataSource = new DataSource({
    ...OrmConfig,
    migrationsTableName: 'seeders',
    migrations: [
        __dirname +
            '/../../../../apps/texpress-cms/src/database/seeders/*{.ts,.js}',
    ],
    migrationsTransactionMode: 'each',
});
