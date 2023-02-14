import { DataSource } from 'typeorm';
import { OrmConfig } from '../configs/orm.config';

export default new DataSource({
    ...OrmConfig,
    migrationsTableName: 'migrations',
    migrations: [
        __dirname +
            '/../../../../apps/texpress-cms/src/database/migrations/*{.ts,.js}',
    ],
    migrationsTransactionMode: 'each',
});
