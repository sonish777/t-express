import { DataSource } from 'typeorm';
import { Database } from 'core/database';
import { ConnectionOptions } from 'typeorm-seeding';
import { DatabaseConfig } from '../configs';

class PostgresConnection extends Database {
    public connection: DataSource = new DataSource({
        type: 'postgres',
        host: DatabaseConfig.HOST,
        port: DatabaseConfig.PORT,
        username: DatabaseConfig.USERNAME,
        password: DatabaseConfig.PASSWORD,
        database: DatabaseConfig.DATABASE_NAME,
        entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: [
            __dirname +
                '/../../../apps/texpress-cms/src/database/migrations/*{.ts,.js}',
            __dirname +
                '/../../../apps/texpress-api/src/database/migrations/*{.ts,.js}',
        ],
        migrationsTransactionMode: 'each',
    });

    constructor() {
        super();
        this.init();
    }
}
export const postgresDataSource = new PostgresConnection().connection;

/* FOR TYPEORM SEEDING */
export default {
    ...postgresDataSource.options,
    seeds: [
        __dirname +
            '/../../../apps/texpress-cms/src/database/seeders/**/*{.ts,.js}',
        __dirname +
            '/../../../apps/texpress-api/src/database/seeders/**/*{.ts,.js}',
    ],
    factories: ['src/database/factories/**/*{.ts,.js}'],
} as ConnectionOptions;
