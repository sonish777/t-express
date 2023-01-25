import { DataSource } from "typeorm";
import { DatabaseType } from "typeorm/driver/types/DatabaseType";
import { DatabaseConfig } from "../../configs";

export const dataSource = (dialect: DatabaseType) =>
    new DataSource({
        type: dialect as any,
        host: DatabaseConfig.HOST,
        port: DatabaseConfig.PORT,
        username: DatabaseConfig.USERNAME,
        password: DatabaseConfig.PASSWORD,
        database: DatabaseConfig.DATABASE_NAME,
        entities: [__dirname + "/../../entities/**/*{.ts,.js}"],
        synchronize: false,
        migrations: [__dirname + "/../../database/migrations/**/*{.ts,.js}"],
        migrationsTransactionMode: "each"
    });

/**
 * For Running Migrations
 */
let dialect: DatabaseType = "postgres";
process.argv.forEach(function (val, index, array) {
    if (val === "-t" && array[index + 1]) {
        dialect = array[index + 1] as any;
    }
});
export default dataSource(dialect);
