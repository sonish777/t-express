import { DatabaseType } from "typeorm/driver/types/DatabaseType";
import { Database } from "../../core/database/database.abstract";

class PostgresConnection extends Database {
    dialect: DatabaseType = "postgres";
    constructor() {
        super();
        this.init();
    }
}

export const postgresDataSource = new PostgresConnection().connection;
