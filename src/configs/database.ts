import config from "config";

export const DatabaseConfig = {
    HOST: process.env.DATABASE_HOST || config.get<string>("database.host"),
    PORT: Number(process.env.DATABASE_PORT || config.get<number>("database.port")),
    USERNAME: process.env.DATABASE_USERNAME || config.get<string>("database.username"),
    PASSWORD: process.env.DATABASE_PASSWORD || config.get<string>("database.password"),
    DATABASE_NAME: process.env.DATABASE_NAME || config.get<string>("database.database_name")
};
