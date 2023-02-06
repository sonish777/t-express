import { DataSource } from 'typeorm';
import { Database } from '@core/database/database.abstract';
import { DatabaseConfig } from '@configs';
import { ConnectionOptions } from 'typeorm-seeding';

class PostgresConnection extends Database {
  public connection: DataSource = new DataSource({
    type: 'postgres',
    host: DatabaseConfig.HOST,
    port: DatabaseConfig.PORT,
    username: DatabaseConfig.USERNAME,
    password: DatabaseConfig.PASSWORD,
    database: DatabaseConfig.DATABASE_NAME,
    entities: [__dirname + '/../../entities/**/*{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
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
  seeds: ['src/database/seeders/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
} as ConnectionOptions;
