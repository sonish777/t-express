import config from "config";

export const ServerConfig = {
    PORT: config.get("server.port") || process.env.PORT
};
