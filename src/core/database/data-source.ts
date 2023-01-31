import { DatabaseConfig } from '@configs';
import { DataSource } from 'typeorm';
import { DatabaseType } from 'typeorm/driver/types/DatabaseType';

export const dataSource = (dialect: DatabaseType) =>
  new DataSource({
    type: <any>dialect,
    host: DatabaseConfig.HOST,
    port: DatabaseConfig.PORT,
    username: DatabaseConfig.USERNAME,
    password: DatabaseConfig.PASSWORD,
    database: DatabaseConfig.DATABASE_NAME,
    entities: [__dirname + '/../../entities/**/*{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/../../database/migrations/**/*{.ts,.js}'],
    migrationsTransactionMode: 'each',
  });

/**
 * For Running Migrations
 */
let dialect: DatabaseType = 'postgres';
process.argv.forEach(function (val, index, array) {
  if (val === '-t' && array[index + 1]) {
    dialect = array[index + 1] as DatabaseType;
  }
});
export default dataSource(dialect);
