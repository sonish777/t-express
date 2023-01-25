import { DataSource } from "typeorm";
import { DatabaseType } from "typeorm/driver/types/DatabaseType";
import { dataSource } from "./data-source";

export abstract class Database {
    public abstract dialect: DatabaseType;
    private _connection: DataSource;

    get connection() {
        return this._connection;
    }

    async init() {
        try {
            this._connection = dataSource(this.dialect);
            await this._connection.initialize();
            console.log("Database connection established successfully!");
        } catch (error) {
            console.error("Database connection failed", error);
        }
    }
}
