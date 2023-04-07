import { DataSource } from 'typeorm';
import { Database } from 'core/database';
import { OrmConfig } from '../configs/orm.config';

class PostgresConnection extends Database {
    public connection: DataSource = new DataSource({
        ...OrmConfig,
    });

    constructor() {
        super();
        this.init();
    }
}
export const postgresDataSource = new PostgresConnection().connection;
